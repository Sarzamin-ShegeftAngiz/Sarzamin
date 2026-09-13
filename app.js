document.addEventListener("DOMContentLoaded", () => {

    const scene = document.querySelector("a-scene");

    const videos = [];

    for (let i = 0; i < 30; i++) {
        videos.push(document.querySelector("#video" + i));
    }

    let activeTarget = null;


    scene.addEventListener("arReady", () => {
        console.log("AR READY - 30 TARGETS");
    });


    scene.addEventListener("targetFound", async (e) => {

        const target = e.target;

        const data = target.getAttribute("mindar-image-target");

        const index = data.targetIndex;

        console.log("TARGET FOUND:", index);

        activeTarget = target;


        // توقف ویدیوهای دیگر
        videos.forEach((video, i) => {

            if (!video) return;

            if (i !== index) {
                video.pause();

                try {
                    video.currentTime = 0;
                } catch (err) {}
            }

        });


        const video = videos[index];

        if (!video) {
            console.log("VIDEO NOT FOUND:", index);
            return;
        }


        console.log("VIDEO FOUND:", index);


        // شروع از اول
        try {
            video.currentTime = 0;
        } catch (err) {}


        // صدا روشن
        video.muted = false;
        video.volume = 1;


        // پخش مستقیم
        try {

            await video.play();

            console.log("VIDEO PLAYING:", index);

        } catch (err) {

            console.log("VIDEO PLAY ERROR:", err);

            // تلاش دوم بدون صدا
            video.muted = true;

            try {

                await video.play();

                console.log("VIDEO PLAYING MUTED:", index);

            } catch (err2) {

                console.log("VIDEO PLAY ERROR 2:", err2);

            }

        }

    });


    scene.addEventListener("targetLost", (e) => {

        const target = e.target;

        const data = target.getAttribute("mindar-image-target");

        const index = data.targetIndex;

        console.log("TARGET LOST:", index);


        const video = videos[index];

        if (video) {

            video.pause();

            try {
                video.currentTime = 0;
            } catch (err) {}

        }


        if (activeTarget === target) {
            activeTarget = null;
        }

    });

});
