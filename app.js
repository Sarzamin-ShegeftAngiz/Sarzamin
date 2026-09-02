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

    const targets = [
        document.querySelector("#target0"),
        document.querySelector("#target1"),
        document.querySelector("#target2"),
        document.querySelector("#target3"),
        document.querySelector("#target4"),
        document.querySelector("#target5")
    ];


    // ----------------------------------------
    // باز کردن اجازه صدا با اولین لمس کاربر
    // بدون نمایش دکمه
    // ----------------------------------------

    let soundUnlocked = false;

    document.addEventListener("touchstart", async () => {

        if (soundUnlocked) return;

        for (const video of videos) {

            try {

                video.muted = false;
                video.volume = 1;

                video.currentTime = 0;

                await video.play();

                video.pause();

                video.currentTime = 0;

            } catch (e) {

                console.log("Audio unlock:", e);

            }

        }

        soundUnlocked = true;

    }, { once: true });


    // ----------------------------------------
    // مخفی کردن نوشته‌ها
    // ----------------------------------------

    function hideTexts(target) {

        const texts = target.querySelectorAll("a-text");

        texts.forEach(text => {

            text.setAttribute("visible", false);

        });

    }


    // ----------------------------------------
    // نمایش نوشته‌ها
    // ----------------------------------------

    function showTexts(target) {

        const texts = target.querySelectorAll("a-text");

        texts.forEach(text => {

            text.setAttribute("visible", true);

        });

    }


    // ----------------------------------------
    // وقتی AR آماده شد
    // ----------------------------------------

    scene.addEventListener("arReady", () => {

        console.log("AR READY");

    });


    // ----------------------------------------
    // هر ۶ تارگت
    // ----------------------------------------

    targets.forEach((target, index) => {

        if (!target) return;


        // دفتر پیدا شد
        target.addEventListener("targetFound", async () => {

            console.log("TARGET FOUND:", index);


            // نوشته‌ها ظاهر شوند
            showTexts(target);


            const video = videos[index];

            if (!video) return;


            // صدا
            video.muted = false;
            video.volume = 1;


            // از اول شروع شود
            video.currentTime = 0;


            try {

                await video.play();

                console.log("VIDEO PLAYING:", index);

            } catch (error) {

                console.log("VIDEO PLAY ERROR:", error);

            }

        });


        // دفتر گم شد
        target.addEventListener("targetLost", () => {

            console.log("TARGET LOST:", index);


            const video = videos[index];


            if (video) {

                video.pause();

                video.currentTime = 0;

            }


            // نوشته‌ها مخفی شوند
            hideTexts(target);

        });

    });


    // ----------------------------------------
    // Instagram
    // ----------------------------------------

    document.addEventListener("click", (event) => {

        const zone = event.target.closest(".instagram-zone");

        if (!zone) return;


        window.open(
            "https://instagram.com/",
            "_blank"
        );

    });


    // ----------------------------------------
    // Share
    // ----------------------------------------

    document.addEventListener("click", async (event) => {

        const zone = event.target.closest(".share-zone");

        if (!zone) return;


        const shareData = {

            title: "سرزمین شگفت‌انگیز",

            text: "دفترهای زنده سرزمین شگفت‌انگیز 😍",

            url: window.location.href

        };


        try {

            if (navigator.share) {

                await navigator.share(shareData);

            } else {

                await navigator.clipboard.writeText(
                    window.location.href
                );

                alert("لینک کپی شد");

            }

        } catch (error) {

            console.log("Share cancelled");

        }

    });

});
