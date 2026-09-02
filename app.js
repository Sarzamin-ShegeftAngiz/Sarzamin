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
            توقف بقیه ویدئوها
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
    TOUCH
    =================================
    */

    document.addEventListener(
        "touchend",
        async (event) => {

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


            const raycaster =
                new THREE.Raycaster();


            raycaster.setFromCamera(
                mouse,
                scene.camera
            );


            /*
            =================================
            Instagram
            =================================
            */

            const instagramZone =
                activeTarget.querySelector(
                    ".instagram-zone"
                );


            if (instagramZone) {

                const instagramMesh =
                    instagramZone.getObject3D(
                        "mesh"
                    );


                if (instagramMesh) {

                    const hits =
                        raycaster.intersectObject(
                            instagramMesh,
                            true
                        );


                    if (
                        hits.length > 0
                    ) {

                        console.log(
                            "INSTAGRAM PRESSED"
                        );


                        const intentURL =
                            "intent://www.instagram.com/_u/SarzaminAr/#Intent;" +
                            "package=com.instagram.android;" +
                            "scheme=https;" +
                            "end";


                        window.location.href =
                            intentURL;


                        return;

                    }

                }

            }


            /*
            =================================
            Share
            =================================
            */

            const shareZone =
                activeTarget.querySelector(
                    ".share-zone"
                );


            if (shareZone) {

                const shareMesh =
                    shareZone.getObject3D(
                        "mesh"
                    );


                if (shareMesh) {

                    const hits =
                        raycaster.intersectObject(
                            shareMesh,
                            true
                        );


                    if (
                        hits.length > 0
                    ) {

                        console.log(
                            "SHARE PRESSED"
                        );


                        const shareText =
                            "یه دفتر دیدم که زنده میشه! 😍 " +
                            "کنجکاوی ببینی چه اتفاقی میفته؟ " +
                            "این لینک رو برای دوستت بفرست 👇";


                        if (
                            navigator.share
                        ) {

                            try {

                                await navigator.share({

                                    title:
                                        "سرزمین شگفت‌انگیز",

                                    text:
                                        shareText,

                                    url:
                                        window.location.href

                                });

                            }

                            catch (err) {

                                console.log(
                                    "SHARE CANCELLED",
                                    err
                                );

                            }

                        }

                        else {

                            alert(
                                "اشتراک‌گذاری در این مرورگر پشتیبانی نمی‌شود."
                            );

                        }


                        return;

                    }

                }

            }

        },

        {
            passive: true
        }

    );

});
