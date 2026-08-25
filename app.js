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


    /* =========================
       دکمه نامرئی اینستاگرام
       ========================= */

    const instagramButton =
        document.createElement("button");

    instagramButton.setAttribute(
        "aria-label",
        "Instagram"
    );

    instagramButton.style.position = "fixed";

    /*
    محل آیدی روی صفحه
    */

    instagramButton.style.top = "8%";
    instagramButton.style.left = "8%";

    instagramButton.style.width = "145px";
    instagramButton.style.height = "45px";

    instagramButton.style.zIndex = "99999999";

    /*
    کاملاً نامرئی
    */

    instagramButton.style.background = "transparent";
    instagramButton.style.border = "none";
    instagramButton.style.outline = "none";

    /*
    لمس فعال
    */

    instagramButton.style.pointerEvents = "auto";
    instagramButton.style.touchAction = "manipulation";

    /*
    مخفی از ظاهر
    */

    instagramButton.style.color = "transparent";

    document.body.appendChild(
        instagramButton
    );


    /* =========================
       Instagram
       ========================= */

    function openInstagram(event) {

        event.preventDefault();
        event.stopPropagation();

        /*
        اول تلاش برای باز کردن اپ
        */

        window.location.href =
            "instagram://user?username=SarzaminAr";

    }


    instagramButton.addEventListener(
        "click",
        openInstagram
    );


    instagramButton.addEventListener(
        "touchend",
        openInstagram,
        {
            passive: false
        }
    );


    /* =========================
       AR READY
       ========================= */

    scene.addEventListener(
        "arReady",
        () => {

            console.log("AR READY");

        }
    );


    /* =========================
       TARGET FOUND
       ========================= */

    scene.addEventListener(
        "targetFound",
        async (e) => {

            const index =
                e.target
                .getAttribute(
                    "mindar-image-target"
                )
                .targetIndex;


            console.log(
                "TARGET FOUND:",
                index
            );


            const video =
                videos[index];


            if (!video) return;


            /*
            توقف ویدئوهای دیگر
            */

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


            /*
            اجرای ویدئو
            */

            video.currentTime = 0;

            video.muted = false;


            try {

                await video.play();

            }

            catch(error) {

                console.log(
                    "VIDEO ERROR:",
                    error
                );

            }

        }
    );


    /* =========================
       TARGET LOST
       ========================= */

    scene.addEventListener(
        "targetLost",
        (e) => {

            const index =
                e.target
                .getAttribute(
                    "mindar-image-target"
                )
                .targetIndex;


            const video =
                videos[index];


            if (video) {

                video.pause();

            }

        }
    );

});
