document.addEventListener("DOMContentLoaded", () => {

    const scene = document.querySelector("#arScene");
    const video = document.querySelector("#arVideo");

    let activeTarget = null;
    let activeIndex = -1;
    let currentVideo = -1;


    // =========================
    // AR READY
    // =========================

    scene.addEventListener("arReady", () => {

        console.log("✅ AR READY");

    });


    // =========================
    // TARGET FOUND
    // =========================

    scene.addEventListener("targetFound", async (event) => {

        const target = event.target;

        const data =
            target.getAttribute("mindar-image-target");

        const index =
            Number(data.targetIndex);

        console.log("🎯 TARGET FOUND:", index);


        activeTarget = target;
        activeIndex = index;


        // همه ویدیوپلین‌ها مخفی
        document
            .querySelectorAll(".arVideoPlane")
            .forEach((plane) => {

                plane.setAttribute(
                    "visible",
                    "false"
                );

            });


        const plane =
            target.querySelector(".arVideoPlane");


        if (!plane) {

            console.log(
                "❌ VIDEO PLANE NOT FOUND"
            );

            return;

        }


        // =========================
        // ویدیوی مربوط به تارگت
        // =========================

        const videoNumber =
            index + 1;

        const filename =
            String(videoNumber)
                .padStart(2, "0");


        const videoURL =
            `./Group1/${filename}.mp4`;


        console.log(
            "🎬 VIDEO:",
            videoURL
        );


        // اگر همان ویدیوست دوباره لود نکن
        if (currentVideo !== index) {

            video.pause();

            video.removeAttribute("src");

            video.load();


            video.src =
                videoURL;

            video.loop = true;

            video.muted = true;

            video.playsInline = true;

            video.setAttribute(
                "playsinline",
                ""
            );

            video.setAttribute(
                "webkit-playsinline",
                ""
            );


            currentVideo = index;

        }


        // پلین را نشان بده
        plane.setAttribute(
            "visible",
            "true"
        );


        try {

            await video.play();

            console.log(
                "▶️ VIDEO PLAYING:",
                videoNumber
            );

        }

        catch (error) {

            console.log(
                "❌ VIDEO PLAY ERROR:",
                error
            );

        }

    });


    // =========================
    // TARGET LOST
    // =========================

    scene.addEventListener("targetLost", (event) => {

        const target = event.target;

        const data =
            target.getAttribute(
                "mindar-image-target"
            );

        const index =
            Number(data.targetIndex);


        console.log(
            "👋 TARGET LOST:",
            index
        );


        if (activeTarget === target) {

            // فعلاً ویدیو را متوقف نمی‌کنیم
            // تا لرزش و قطع و وصل کمتر شود

            activeTarget = null;

        }

    });


});
