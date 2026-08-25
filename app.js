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
    ========================================
    لینک اینستاگرام
    ========================================
    */

    const instagramURL =
        "https://www.instagram.com/SarzaminAr/";


    /*
    ========================================
    دکمه‌های اینستاگرام
    ========================================
    */

    const instagramButtons =
        document.querySelectorAll(
            "[instagram-link]"
        );


    instagramButtons.forEach((button) => {

        button.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                console.log(
                    "INSTAGRAM CLICKED"
                );

                window.open(
                    instagramURL,
                    "_blank"
                );

            }
        );

    });


    /*
    ========================================
    AR READY
    ========================================
    */

    scene.addEventListener(
        "arReady",
        () => {

            console.log("AR READY");

        }
    );


    /*
    ========================================
    TARGET FOUND
    ========================================
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


            const currentVideo =
                videos[index];


            if (!currentVideo) {

                return;

            }


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
            شروع ویدئوی فعلی
            */

            currentVideo.currentTime = 0;

            currentVideo.muted = false;


            try {

                await currentVideo.play();


                console.log(
                    "VIDEO PLAYING:",
                    index
                );


            } catch (error) {

                console.log(
                    "VIDEO ERROR:",
                    index,
                    error
                );

            }

        }
    );


    /*
    ========================================
    TARGET LOST
    ========================================
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


            console.log(
                "TARGET LOST:",
                index
            );


            const video =
                videos[index];


            if (video) {

                video.pause();

            }

        }
    );

});
