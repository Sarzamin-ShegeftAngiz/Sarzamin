document.addEventListener("DOMContentLoaded", () => {

    const scene = document.querySelector("#arScene");
    const video = document.querySelector("#arVideo");

    let activeTarget = null;
    let activeIndex = -1;

    let audioUnlocked = false;

    // شماره‌ای که الان واقعاً در حال پخش است
    let playingIndex = -1;

    // شماره‌ای که در حال لود شدن است
    let loadingIndex = -1;


    // =====================================================
    // ساخت عکس برای هر Target
    // =====================================================

    const targets =
        document.querySelectorAll(
            "a-entity[mindar-image-target]"
        );


    targets.forEach((target, index) => {

        let extension = "jpg";

        // فایل‌های PNG
        if (
            index === 18 ||
            index === 23 ||
            index === 25
        ) {
            extension = "png";
        }


        const image =
            document.createElement("a-image");


        image.classList.add(
            "arImagePlaceholder"
        );


        image.setAttribute(
            "src",
            `./Group1/${String(index + 1).padStart(2, "0")}.${extension}`
        );


        image.setAttribute(
            "width",
            "1"
        );


        image.setAttribute(
            "height",
            "1.42"
        );


        image.setAttribute(
            "position",
            "0 0 0.001"
        );


        image.setAttribute(
            "visible",
            "false"
        );


        target.insertBefore(
            image,
            target.firstChild
        );

    });


    // =====================================================
    // گرفتن همه عکس‌ها و پلین‌های ویدیو
    // =====================================================

    const imagePlaceholders =
        document.querySelectorAll(
            ".arImagePlaceholder"
        );


    const videoPlanes =
        document.querySelectorAll(
            ".arVideoPlane"
        );


    // =====================================================
    // باز کردن صدا با لمس کاربر
    // =====================================================

    function unlockAudio() {

        audioUnlocked = true;

        if (video) {
            video.muted = false;
        }

    }


    document.addEventListener(
        "touchstart",
        unlockAudio,
        {
            passive: true
        }
    );


    document.addEventListener(
        "click",
        unlockAudio
    );


    // =====================================================
    // مخفی کردن تمام ویدیوها
    // =====================================================

    function hideAllVideos() {

        videoPlanes.forEach((plane) => {

            plane.setAttribute(
                "visible",
                "false"
            );

        });

    }


    // =====================================================
    // مخفی کردن تمام عکس‌ها
    // =====================================================

    function hideAllImages() {

        imagePlaceholders.forEach((image) => {

            image.setAttribute(
                "visible",
                "false"
            );

        });

    }


    // =====================================================
    // توقف کامل ویدیو
    // =====================================================

    function stopVideoCompletely() {

        try {

            video.pause();

        } catch (e) {}


        try {

            video.currentTime = 0;

        } catch (e) {}


        // پاک کردن فریم قبلی
        video.removeAttribute("src");

        video.load();

    }


    // =====================================================
    // AR READY
    // =====================================================

    scene.addEventListener(
        "arReady",
        () => {

            console.log(
                "✅ AR READY"
            );

        }
    );


    // =====================================================
    // TARGET FOUND
    // =====================================================

    scene.addEventListener(
        "targetFound",
        async (event) => {

            const target =
                event.target;


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


            // =================================================
            // خیلی مهم:
            // اول همه چیز قبلی را فوراً مخفی کن
            // =================================================

            hideAllVideos();
            hideAllImages();


            // ویدیوی قبلی فوراً متوقف شود
            stopVideoCompletely();


            // وضعیت جدید
            activeTarget = target;
            activeIndex = index;

            playingIndex = -1;
            loadingIndex = index;


            // =================================================
            // عکس همین Target را فوراً نشان بده
            // =================================================

            const image =
                target.querySelector(
                    ".arImagePlaceholder"
                );


            if (image) {

                image.setAttribute(
                    "visible",
                    "true"
                );

            }


            // =================================================
            // پلین همین Target
            // =================================================

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


            // =================================================
            // آدرس ویدیوی جدید
            // =================================================

            const videoNumber =
                index + 1;


            const filename =
                String(videoNumber)
                    .padStart(2, "0");


            const videoURL =
                `./Group1/${filename}.mp4`;


            console.log(
                "🎬 LOADING:",
                videoURL
            );


            // =================================================
            // رویداد آماده شدن ویدیو
            // =================================================

            const onCanPlay = async () => {

                // اگر کاربر در این فاصله
                // رفته Target دیگری را گرفته،
                // این ویدیو نباید نمایش داده شود

                if (
                    activeTarget !== target ||
                    activeIndex !== index
                ) {

                    console.log(
                        "⚠️ OLD VIDEO READY - IGNORE"
                    );

                    return;

                }


                console.log(
                    "✅ VIDEO READY:",
                    videoNumber
                );


                loadingIndex = -1;


                // عکس را بردار
                if (image) {

                    image.setAttribute(
                        "visible",
                        "false"
                    );

                }


                // ویدیوی همین Target را نمایش بده
                plane.setAttribute(
                    "visible",
                    "true"
                );


                playingIndex = index;


                try {

                    if (audioUnlocked) {
                        video.muted = false;
                    }

                    await video.play();


                    console.log(
                        "▶️ VIDEO PLAYING:",
                        videoNumber
                    );

                }

                catch (error) {

                    console.log(
                        "❌ PLAY ERROR:",
                        error
                    );

                }

            };


            // فقط یک بار
            video.addEventListener(
                "canplay",
                onCanPlay,
                {
                    once: true
                }
            );


            // =================================================
            // تنظیم ویدیوی جدید
            // =================================================

            video.pause();

            video.currentTime = 0;

            video.loop = true;

            video.playsInline = true;


            if (audioUnlocked) {

                video.muted = false;

            } else {

                video.muted = true;

            }


            video.src =
                videoURL;


            video.load();

        }
    );


    // =====================================================
    // TARGET LOST
    // =====================================================

    scene.addEventListener(
        "targetLost",
        (event) => {

            const target =
                event.target;


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


            // فقط اگر همین Target فعال است
            if (
                activeTarget !== target
            ) {

                return;

            }


            // =================================================
            // درجا ویدیو را از صفحه بردار
            // =================================================

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


            // عکس هم مخفی
            const image =
                target.querySelector(
                    ".arImagePlaceholder"
                );


            if (image) {

                image.setAttribute(
                    "visible",
                    "false"
                );

            }


            // ویدیو کامل متوقف و ریست شود
            stopVideoCompletely();


            playingIndex = -1;
            loadingIndex = -1;

            activeTarget = null;
            activeIndex = -1;


            console.log(
                "⛔ TARGET CLEARED"
            );

        }
    );

});
