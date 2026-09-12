document.addEventListener("DOMContentLoaded", () => {

    const scene = document.querySelector("#arScene");
    const video = document.querySelector("#arVideo");

    let activeTarget = null;
    let activeIndex = -1;

    // برای باز کردن صدای ویدیو بعد از اولین لمس کاربر
    let audioUnlocked = false;


    // =========================================
    // باز کردن صدای ویدیو با اولین لمس کاربر
    // =========================================

    document.addEventListener("touchstart", () => {

        audioUnlocked = true;

        if (video) {
            video.muted = false;
        }

    }, {
        once: false,
        passive: true
    });


    document.addEventListener("click", () => {

        audioUnlocked = true;

        if (video) {
            video.muted = false;
        }

    });


    // =========================================
    // AR READY
    // =========================================

    scene.addEventListener("arReady", () => {

        console.log("✅ AR READY");

    });


    // =========================================
    // TARGET FOUND
    // =========================================

    scene.addEventListener("targetFound", async (event) => {

        const target = event.target;

        const data =
            target.getAttribute(
                "mindar-image-target"
            );

        const index =
            Number(data.targetIndex);


        console.log(
            "🎯 TARGET FOUND:",
            index
        );


        activeTarget = target;
        activeIndex = index;


        // =========================================
        // مخفی کردن تمام پلین‌ها
        // =========================================

        document
            .querySelectorAll(".arVideoPlane")
            .forEach((plane) => {

                plane.setAttribute(
                    "visible",
                    "false"
                );

            });


        const plane =
            target.querySelector(
                ".arVideoPlane"
            );


        if (!plane) {

            console.log(
                "❌ VIDEO PLANE NOT FOUND"
            );

            return;

        }


        // =========================================
        // شماره ویدیو
        // =========================================

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


        // =========================================
        // ویدیوی قبلی را کاملاً ریست کن
        // =========================================

        video.pause();

        video.currentTime = 0;


        // =========================================
        // ویدیوی جدید
        // =========================================

        video.src = videoURL;

        video.loop = true;

        video.playsInline = true;


        // اگر کاربر قبلاً لمس کرده، صدا فعال باشد
        if (audioUnlocked) {

            video.muted = false;

        } else {

            // اولین پخش بدون صدا
            // تا مرورگر اجازه تعامل بدهد
            video.muted = true;

        }


        video.load();


        // =========================================
        // پلین را فوراً نشان بده
        // =========================================

        plane.setAttribute(
            "visible",
            "true"
        );


        // =========================================
        // پخش
        // =========================================

        try {

            await video.play();

            console.log(
                "▶️ PLAYING:",
                videoNumber
            );

        }

        catch (error) {

            console.log(
                "❌ PLAY ERROR:",
                error
            );

        }


        // =========================================
        // اگر صدا هنوز قفل بود،
        // بعد از اولین لمس فعال می‌شود
        // =========================================

        if (audioUnlocked) {

            video.muted = false;

        }

    });


    // =========================================
    // TARGET LOST
    // =========================================

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


        // =========================================
        // فقط اگر همین Target فعال است
        // =========================================

        if (activeTarget === target) {


            // فوراً پلین را مخفی کن
            const plane =
                target.querySelector(
                    ".arVideoPlane"
                );


            if (plane) {

                plane.setAttribute(
                    "visible",
                    "false"
                );

            }


            // ویدیو را متوقف کن
            video.pause();


            // ویدیو را از اول برگردان
            video.currentTime = 0;


            // وضعیت را پاک کن
            activeTarget = null;

            activeIndex = -1;


            console.log(
                "⏹ VIDEO STOPPED + RESET"
            );

        }

    });

});
