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


    /*
    ==============================
    INSTAGRAM
    ==============================
    */

    const instagramURL =
        "https://www.instagram.com/SarzaminAr/";


    /*
    ==============================
    کلیک روی آیدی اینستاگرام
    ==============================
    */

    document
        .querySelectorAll(".instagram-button")
        .forEach((button) => {


            button.addEventListener(
                "click",
                (event) => {

                    event.stopPropagation();

                    console.log(
                        "INSTAGRAM CLICK"
                    );

                    window.location.href =
                        instagramURL;

                }
            );


            button.addEventListener(
                "touchend",
                (event) => {

                    event.preventDefault();

                    event.stopPropagation();

                    console.log(
                        "INSTAGRAM TOUCH"
                    );

                    window.location.href =
                        instagramURL;

                },
                { passive:false }
            );


        });


    /*
    ==============================
    AR READY
    ==============================
    */

    scene.addEventListener(
        "arReady",
        () => {

            console.log("AR READY");

        }
    );


    /*
    ==============================
    TARGET FOUND
    ==============================
    */

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


            if (!video) {

                return;

            }


            /*
            توقف بقیه ویدئوها
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
            اجرای ویدئوی فعلی
            */

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


    /*
    ==============================
    TARGET LOST
    ==============================
    */

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
