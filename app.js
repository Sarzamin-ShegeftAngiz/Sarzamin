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


    scene.addEventListener("arReady", () => {

        console.log("AR READY");

    });


    scene.addEventListener(
        "targetFound",
        async (e) => {

            const index =
                e.target
                    .getAttribute("mindar-image-target")
                    .targetIndex;


            console.log(
                "TARGET FOUND:",
                index
            );


            const currentVideo =
                videos[index];


            if (!currentVideo) {

                console.log(
                    "VIDEO NOT FOUND:",
                    index
                );

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
            ویدیوی تارگت فعلی
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


    scene.addEventListener(
        "targetLost",
        (e) => {


            const index =
                e.target
                    .getAttribute("mindar-image-target")
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
