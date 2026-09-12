document.addEventListener("DOMContentLoaded", () => {

    const scene = document.querySelector("a-scene");

    const videos = [];

    for (let i = 0; i < 30; i++) {
        videos.push(document.querySelector("#video" + i));
    }

    let activeTarget = null;
    let activeIndex = -1;


    // =========================
    // آماده شدن AR
    // =========================

    scene.addEventListener("arReady", () => {
        console.log("AR READY");
    });


    // =========================
    // پیدا شدن تارگت
    // =========================

    scene.addEventListener("targetFound", async (e) => {

        const target = e.target;

        const data = target.getAttribute("mindar-image-target");

        const index = data.targetIndex;

        console.log("TARGET FOUND:", index);

        activeTarget = target;
        activeIndex = index;


        // -------------------------
        // همه ویدیوها را متوقف کن
        // -------------------------

        videos.forEach((video) => {

            if (!video) return;

            video.pause();

            try {
                video.currentTime = 0;
            } catch (err) {}

        });


        // -------------------------
        // همه پلین‌های ویدیو مخفی
        // -------------------------

        const allPlanes = document.querySelectorAll("a-video");

        allPlanes.forEach((plane) => {
            plane.setAttribute("visible", false);
        });


        // -------------------------
        // ویدیوی مربوط به تارگت
        // -------------------------

        const video = videos[index];

        if (!video) {
            console.log("VIDEO NOT FOUND:", index);
            return;
        }

        console.log("VIDEO ELEMENT:", video);

        console.log("VIDEO SRC:", video.currentSrc || video.src);


        // از اول
        try {
            video.currentTime = 0;
        } catch (err) {}


        // صدا روشن
        video.muted = false;

        video.volume = 1;


        // -------------------------
        // کمی صبر برای آماده شدن فایل
        // -------------------------

        if (video.readyState < 2) {

            console.log(
                "VIDEO NOT READY. READY STATE:",
                video.readyState
            );

            video.load();

            await new Promise((resolve) => {

                const check = () => {

                    console.log(
                        "VIDEO CAN PLAY:",
                        video.readyState
                    );

                    cleanup();

                    resolve();
                };

                const cleanup = () => {
                    video.removeEventListener("loadeddata", check);
                    video.removeEventListener("canplay", check);
                };

                video.addEventListener("loadeddata", check, { once: true });
                video.addEventListener("canplay", check, { once: true });

                // حداکثر 15 ثانیه
                setTimeout(() => {
                    cleanup();
                    resolve();
                }, 15000);

            });
        }


        // -------------------------
        // هنوز همان تارگت فعال است؟
        // -------------------------

        if (activeTarget !== target || activeIndex !== index) {

            console.log("OLD TARGET - CANCEL VIDEO");

            return;
        }


        console.log(
            "TRYING TO PLAY VIDEO:",
            index
        );


        // -------------------------
        // اول ویدیو را نمایش بده
        // -------------------------

        const plane = target.querySelector("a-video");

        if (plane) {
            plane.setAttribute("visible", true);
        }


        // -------------------------
        // پخش
        // -------------------------

        try {

            await video.play();

            console.log(
                "VIDEO PLAYING SUCCESSFULLY:",
                index
            );

        } catch (error) {

            console.error(
                "VIDEO PLAY ERROR:",
                error
            );

            // اگر مرورگر پخش صدا‌دار را نپذیرفت،
            // یک بار بدون صدا امتحان می‌کنیم

            video.muted = true;

            try {

                await video.play();

                console.log(
                    "VIDEO PLAYING MUTED:",
                    index
                );

            } catch (error2) {

                console.error(
                    "VIDEO PLAY ERROR EVEN MUTED:",
                    error2
                );

            }

        }

    });


    // =========================
    // تارگت گم شد
    // =========================

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


        // همان پلین را فوراً مخفی کن

        const plane = target.querySelector("a-video");

        if (plane) {
            plane.setAttribute("visible", false);
        }


        if (activeTarget === target) {

            activeTarget = null;
            activeIndex = -1;

        }

    });

});
