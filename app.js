document.addEventListener("DOMContentLoaded", () => {

    const scene = document.querySelector("a-scene");

    const videos = [
        document.querySelector("#video0"),
        document.querySelector("#video1"),
        document.querySelector("#video2"),
        document.querySelector("#video3"),
        document.querySelector("#video4"),
        document.querySelector("#video5")
    ];

    const targets = [
        ...document.querySelectorAll(
            "[mindar-image-target]"
        )
    ];

    const instagramURL =
        "https://www.instagram.com/SarzaminAr/";


    /* =================================
       دکمه واقعی HTML
       ================================= */

    const instagramButton =
        document.createElement("div");

    instagramButton.innerHTML =
        "@SarzaminAr";

    instagramButton.style.position =
        "fixed";

    instagramButton.style.zIndex =
        "9999999";

    instagramButton.style.display =
        "none";

    instagramButton.style.pointerEvents =
        "auto";

    instagramButton.style.touchAction =
        "manipulation";

    instagramButton.style.cursor =
        "pointer";

    instagramButton.style.background =
        "rgba(255,255,255,0.01)";

    instagramButton.style.color =
        "transparent";

    instagramButton.style.padding =
        "10px 15px";

    instagramButton.style.borderRadius =
        "20px";

    instagramButton.style.userSelect =
        "none";

    document.body.appendChild(
        instagramButton
    );


    /* =================================
       باز کردن اینستاگرام
       ================================= */

    function openInstagram(event) {

        if (event) {

            event.preventDefault();
            event.stopPropagation();

        }

        console.log(
            "INSTAGRAM BUTTON PRESSED"
        );

        window.location.href =
            instagramURL;

    }


    instagramButton.addEventListener(
        "click",
        openInstagram
    );


    instagramButton.addEventListener(
        "touchstart",
        openInstagram,
        {
            passive: false
        }
    );


    instagramButton.addEventListener(
        "pointerdown",
        openInstagram
    );


    /* =================================
       وضعیت تارگت
       ================================= */

    let activeTarget = null;


    scene.addEventListener(
        "arReady",
        () => {

            console.log("AR READY");

        }
    );


    /* =================================
       TARGET FOUND
       ================================= */

    scene.addEventListener(
        "targetFound",
        async (event) => {

            const target =
                event.target;

            const index =
                target.getAttribute(
                    "mindar-image-target"
                ).targetIndex;


            console.log(
                "TARGET FOUND:",
                index
            );


            activeTarget = target;


            const video =
                videos[index];


            if (!video) {

                return;

            }


            /* توقف بقیه */

            videos.forEach(
                (v, i) => {

                    if (
                        v &&
                        i !== index
                    ) {

                        v.pause();

                    }

                }
            );


            video.currentTime = 0;

            video.muted = false;


            try {

                await video.play();

                console.log(
                    "VIDEO PLAYING:",
                    index
                );

            }
            catch(error) {

                console.log(
                    "VIDEO ERROR:",
                    error
                );

            }

        }
    );


    /* =================================
       TARGET LOST
       ================================= */

    scene.addEventListener(
        "targetLost",
        (event) => {

            const target =
                event.target;


            const index =
                target.getAttribute(
                    "mindar-image-target"
                ).targetIndex;


            console.log(
                "TARGET LOST:",
                index
            );


            if (
                activeTarget === target
            ) {

                activeTarget = null;

                instagramButton.style.display =
                    "none";

            }


            const video =
                videos[index];


            if (video) {

                video.pause();

            }

        }
    );


    /* =================================
       تبدیل مختصات Target
       به مختصات صفحه موبایل
       ================================= */

    function worldToScreen(
        object3D,
        x,
        y,
        z
    ) {

        if (
            !scene.camera ||
            !scene.renderer
        ) {

            return null;

        }


        const point =
            new THREE.Vector3(
                x,
                y,
                z
            );


        object3D.localToWorld(
            point
        );


        point.project(
            scene.camera
        );


        const canvas =
            scene.renderer
                .domElement;


        const rect =
            canvas.getBoundingClientRect();


        const screenX =
            rect.left +
            (point.x + 1) *
            rect.width / 2;


        const screenY =
            rect.top +
            (1 - point.y) *
            rect.height / 2;


        return {
            x: screenX,
            y: screenY
        };

    }


    /* =================================
       قرار دادن دکمه روی @SarzaminAr
       ================================= */

    function updateInstagramButton() {

        if (!activeTarget) {

            instagramButton.style.display =
                "none";

            return;

        }


        const object3D =
            activeTarget.object3D;


        if (!object3D) {

            return;

        }


        /*
        محل آیدی در بالای سمت چپ ویدئو
        */

        const topLeft =
            worldToScreen(
                object3D,
                -0.43,
                0.58,
                0.03
            );


        const bottomRight =
            worldToScreen(
                object3D,
                0.02,
                0.43,
                0.03
            );


        if (
            !topLeft ||
            !bottomRight
        ) {

            return;

        }


        const left =
            Math.min(
                topLeft.x,
                bottomRight.x
            );


        const top =
            Math.min(
                topLeft.y,
                bottomRight.y
            );


        const width =
            Math.abs(
                bottomRight.x -
                topLeft.x
            );


        const height =
            Math.abs(
                bottomRight.y -
                topLeft.y
            );


        instagramButton.style.left =
            left + "px";


        instagramButton.style.top =
            top + "px";


        instagramButton.style.width =
            Math.max(
                width,
                80
            ) + "px";


        instagramButton.style.height =
            Math.max(
                height,
                40
            ) + "px";


        instagramButton.style.display =
            "block";

    }


    /* =================================
       بروزرسانی مداوم موقعیت دکمه
       ================================= */

    scene.addEventListener(
        "tick",
        () => {

            updateInstagramButton();

        }
    );

});
