document.addEventListener("DOMContentLoaded", () => {

    const scene = document.querySelector("a-scene");


    const targets = [
        document.querySelector('[mindar-image-target="targetIndex:0"]'),
        document.querySelector('[mindar-image-target="targetIndex:1"]'),
        document.querySelector('[mindar-image-target="targetIndex:2"]'),
        document.querySelector('[mindar-image-target="targetIndex:3"]'),
        document.querySelector('[mindar-image-target="targetIndex:4"]'),
        document.querySelector('[mindar-image-target="targetIndex:5"]')
    ];


    const videos = [
        document.querySelector("#video0"),
        document.querySelector("#video1"),
        document.querySelector("#video2"),
        document.querySelector("#video3"),
        document.querySelector("#video4"),
        document.querySelector("#video5")
    ];


    let activeIndex = -1;


    /*
    ==============================
    AR READY
    ==============================
    */

    scene.addEventListener("arReady", () => {

        console.log("AR READY");

    });


    /*
    ==============================
    هر Target جداگانه
    ==============================
    */

    targets.forEach((target, index) => {

        if (!target) {

            console.log(
                "TARGET ELEMENT NOT FOUND:",
                index
            );

            return;

        }


        /*
        TARGET FOUND
        */

        target.addEventListener(
            "targetFound",
            async () => {

                console.log(
                    "TARGET FOUND:",
                    index
                );


                activeIndex = index;


                /*
                همه ویدئوهای دیگر متوقف شوند
                */

                videos.forEach(
                    (video, i) => {

                        if (
                            video &&
                            i !== index
                        ) {

                            video.pause();
                            video.currentTime = 0;

                        }

                    }
                );


                const video =
                    videos[index];


                if (!video) {

                    console.log(
                        "VIDEO NOT FOUND:",
                        index
                    );

                    return;

                }


                video.currentTime = 0;

                video.muted = false;


                try {

                    await video.play();


                    console.log(
                        "PLAYING:",
                        index
                    );

                }

                catch (error) {

                    console.log(
                        "PLAY ERROR:",
                        error
                    );

                }

            }
        );


        /*
        TARGET LOST
        */

        target.addEventListener(
            "targetLost",
            () => {

                console.log(
                    "TARGET LOST:",
                    index
                );


                const video =
                    videos[index];


                if (video) {

                    video.pause();

                    video.currentTime = 0;

                }


                if (
                    activeIndex === index
                ) {

                    activeIndex = -1;

                }

            }
        );

    });


    /*
    ==============================
    اگر صفحه از دست رفت
    همه ویدئوها قطع شوند
    ==============================
    */

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.hidden
            ) {

                videos.forEach(
                    video => {

                        if (video) {

                            video.pause();

                        }

                    }
                );

                activeIndex = -1;

            }

        }
    );


    /*
    ==============================
    هنگام خارج شدن از صفحه
    ==============================
    */

    window.addEventListener(
        "pagehide",
        () => {

            videos.forEach(
                video => {

                    if (video) {

                        video.pause();

                    }

                }
            );

        }
    );

});
