document.addEventListener("DOMContentLoaded", () => {

    const scene =
        document.querySelector("a-scene");


    const videos = [

        document.querySelector("#video0"),
        document.querySelector("#video1"),
        document.querySelector("#video2"),
        document.querySelector("#video3"),
        document.querySelector("#video4"),
        document.querySelector("#video5")

    ];


    const targets = [

        document.querySelector(
            '[mindar-image-target="targetIndex:0"]'
        ),

        document.querySelector(
            '[mindar-image-target="targetIndex:1"]'
        ),

        document.querySelector(
            '[mindar-image-target="targetIndex:2"]'
        ),

        document.querySelector(
            '[mindar-image-target="targetIndex:3"]'
        ),

        document.querySelector(
            '[mindar-image-target="targetIndex:4"]'
        ),

        document.querySelector(
            '[mindar-image-target="targetIndex:5"]'
        )

    ];


    let activeTarget = null;


    /*
    =================================
    AR READY
    =================================
    */

    scene.addEventListener(
        "arReady",
        () => {

            console.log("AR READY");

        }
    );


    /*
    =================================
    TARGET FOUND
    =================================
    */

    scene.addEventListener(
        "targetFound",
        async (e) => {

            const target =
                e.target;


            const data =
                target.getAttribute(
                    "mindar-image-target"
                );


            const index =
                data.targetIndex;


            console.log(
                "TARGET FOUND:",
                index
            );


            activeTarget =
                target;


            /*
            توقف همه ویدئوهای دیگر
            */

            videos.forEach(
                (video, i) => {

                    if (
                        video &&
                        i !== index
                    ) {

                        video.pause();

                    }

                }
            );


            /*
            ویدئوی تارگت فعلی
            */

            const video =
                videos[index];


            if (!video) {

                return;

            }


            video.currentTime = 0;

            video.muted = false;


            try {

                await video.play();


                console.log(
                    "VIDEO PLAYING:",
                    index
                );

            }

            catch (err) {

                console.log(
                    "VIDEO ERROR:",
                    index,
                    err
                );

            }

        }
    );


    /*
    =================================
    TARGET LOST
    =================================
    */

    scene.addEventListener(
        "targetLost",
        (e) => {

            const target =
                e.target;


            const data =
                target.getAttribute(
                    "mindar-image-target"
                );


            const index =
                data.targetIndex;


            console.log(
                "TARGET LOST:",
                index
            );


            const video =
                videos[index];


            if (video) {

                video.pause();

            }


            if (
                activeTarget === target
            ) {

                activeTarget = null;

            }

        }
    );


    /*
    =================================
    لمس Instagram
    =================================
    */

    document.addEventListener(
        "touchend",
        (event) => {

            if (!activeTarget) {

                return;

            }


            if (
                !scene.camera ||
                !scene.renderer
            ) {

                return;

            }


            const touch =
                event.changedTouches[0];


            if (!touch) {

                return;

            }


            const canvas =
                scene.renderer.domElement;


            const rect =
                canvas.getBoundingClientRect();


            /*
            مختصات لمس روی صفحه
            */

            const mouse =
                new THREE.Vector2();


            mouse.x =
                (
                    (touch.clientX - rect.left)
                    /
                    rect.width
                ) * 2 - 1;


            mouse.y =
                -(
                    (touch.clientY - rect.top)
                    /
                    rect.height
                ) * 2 + 1;


            /*
            Raycaster
            */

            const raycaster =
                new THREE.Raycaster();


            raycaster.setFromCamera(
                mouse,
                scene.camera
            );


            /*
            فقط Instagram Zone
            */

            const zone =
                activeTarget.querySelector(
                    ".instagram-zone"
                );


            if (!zone) {

                return;

            }


            const mesh =
                zone.getObject3D("mesh");


            if (!mesh) {

                return;

            }


            const hits =
                raycaster.intersectObject(
                    mesh,
                    true
                );


            /*
            اگر روی ناحیه Instagram لمس شده
            */

            if (
                hits.length > 0
            ) {

                console.log(
                    "INSTAGRAM PRESSED"
                );


                /*
                اول تلاش برای باز کردن
                اپ Instagram
                */

                const intentURL =
                    "intent://www.instagram.com/_u/SarzaminAr/#Intent;" +
                    "package=com.instagram.android;" +
                    "scheme=https;" +
                    "end";


                window.location.href =
                    intentURL;

            }

        },

        {
            passive: true
        }

    );

});
