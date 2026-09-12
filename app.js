document.addEventListener("DOMContentLoaded", () => {

    const scene = document.querySelector("#arScene");
    const video = document.querySelector("#arVideo");

    let activeTarget = null;
    let activeIndex = -1;

    let audioUnlocked = false;

    // برای جلوگیری از اینکه ویدیوی قدیمی
    // بعداً دوباره روی Target جدید ظاهر شود
    let loadToken = 0;


    // =====================================================
    // باز کردن صدا
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

    function hideAllPlanes() {

        document
            .querySelectorAll(".arVideoPlane")
            .forEach((plane) => {

                plane.setAttribute(
                    "visible",
                    "false"
                );

            });

    }


    // =====================================================
    // AR READY
    // =====================================================

    scene.addEventListener(
        "arReady",
        () => {

            console.log("✅ AR READY");

        }
    );


    // =====================================================
    // TARGET FOUND
    // =====================================================

    scene.addEventListener(
        "targetFound",
        (event) => {

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


            // توکن جدید
            loadToken++;

            const myToken =
                loadToken;


            activeTarget = target;
            activeIndex = index;


            // =================================================
            // خیلی مهم:
            // ویدیوی قبلی همین الان مخفی شود
            // =================================================

            hideAllPlanes();


            // ویدیوی قبلی متوقف شود
            video.pause();


            // =================================================
            // شماره فایل
            // =================================================

            const videoNumber =
                index + 1;


            const filename =
                String(videoNumber)
                    .padStart(2, "0");


            const videoURL =
                `./Group1/${filename}.mp4`;


            console.log(
                "⏳ LOADING:",
                videoURL
            );


            // =================================================
            // پلین Target جدید
            // =================================================

            const plane =
                target.querySelector(
                    ".arVideoPlane"
                );


            if (!plane) {

                console.log(
                    "❌ PLANE NOT FOUND"
                );

                return;

            }


            // حتماً مخفی بماند تا ویدیو آماده شود
            plane.setAttribute(
                "visible",
                "false"
            );


            // =================================================
            // تنظیم ویدیو
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


            // =================================================
            // وقتی ویدیو کاملاً قابل پخش شد
            // =================================================

            const showVideo = () => {

                // اگر در این فاصله Target عوض شده
                // این ویدیو نباید نمایش داده شود

                if (
                    myToken !== loadToken ||
                    activeTarget !== target ||
                    activeIndex !== index
                ) {

                    console.log(
                        "⚠️ OLD VIDEO IGNORED"
                    );

                    return;

                }


                console.log(
                    "✅ VIDEO READY:",
                    videoNumber
                );


                // =================================================
                // حالا ویدیوی جدید نمایش داده شود
                // =================================================

                plane.setAttribute(
                    "visible",
                    "true"
                );


                try {

                    video.play()
                        .then(() => {

                            console.log(
                                "▶️ PLAYING:",
                                videoNumber
                            );

                        })
                        .catch((error) => {

                            console.log(
                                "❌ PLAY ERROR:",
                                error
                            );

                        });

                }

                catch (error) {

                    console.log(
                        "❌ VIDEO ERROR:",
                        error
                    );

                }

            };


            video.addEventListener(
                "canplay",
                showVideo,
                {
                    once: true
                }
            );


            // =================================================
            // فایل جدید را تنظیم کن
            // =================================================

            video.src =
                videoURL;


            // فقط load معمولی
            // بدون removeAttribute و بدون پاک کردن src قبلی
            video.load();

        }
    );


    // =====================================================
    // TARGET LOST
    // =====================================================

    scene.addEventListener(
        "targetLost",
        (event) => {

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


            // فقط Target فعال
            if (
                activeTarget !== target
            ) {

                return;

            }


            // =================================================
            // فوراً ویدیو را از روی دوربین بردار
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


            // =================================================
            // ویدیو متوقف شود
            // =================================================

            video.pause();


            try {

                video.currentTime = 0;

            }

            catch (error) {}


            // =================================================
            // توکن را عوض کن
            // تا اگر فایل قدیمی بعداً آماده شد
            // دیگر نمایش داده نشود
            // =================================================

            loadToken++;


            activeTarget = null;
            activeIndex = -1;


            console.log(
                "⛔ VIDEO HIDDEN + RESET"
            );

        }
    );

});
