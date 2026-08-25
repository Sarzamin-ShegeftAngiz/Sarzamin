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


    /*
    =================================
    دکمه تست اینستاگرام
    =================================
    */

    const instagramButton =
        document.createElement("button");

    instagramButton.innerText =
        "INSTAGRAM TEST";

    instagramButton.style.position =
        "fixed";

    instagramButton.style.top =
        "80px";

    instagramButton.style.left =
        "20px";

    instagramButton.style.zIndex =
        "99999999";

    instagramButton.style.width =
        "180px";

    instagramButton.style.height =
        "60px";

    instagramButton.style.background =
        "red";

    instagramButton.style.color =
        "white";

    instagramButton.style.border =
        "3px solid white";

    instagramButton.style.borderRadius =
        "15px";

    instagramButton.style.fontSize =
        "18px";

    instagramButton.style.fontWeight =
        "bold";

    instagramButton.style.pointerEvents =
        "auto";

    instagramButton.style.touchAction =
        "manipulation";


    document.body.appendChild(
        instagramButton
    );


    /*
    =================================
    لمس دکمه
    =================================
    */

    instagramButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "https://www.instagram.com/SarzaminAr/";

        }
    );


    instagramButton.addEventListener(
        "touchend",
        (e) => {

            e.preventDefault();

            window.location.href =
                "https://www.instagram.com/SarzaminAr/";

        },
        {
            passive: false
        }
    );


    /*
    =================================
    AR
    =================================
    */

    scene.addEventListener(
        "arReady",
        () => {

            console.log("AR READY");

        }
    );


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

            }

            catch(error) {

                console.log(
                    "VIDEO ERROR:",
                    error
                );

            }

        }
    );


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
