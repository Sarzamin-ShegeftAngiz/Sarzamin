document.addEventListener("DOMContentLoaded", () => {

    const scene = document.querySelector("a-scene");

    const videos = [];

    for (let i = 0; i < 30; i++) {

        const video =
            document.querySelector("#video" + i);

        videos.push(video);

    }


    let activeTarget = null;
    let activeIndex = -1;

    // برای جلوگیری از برگشت ویدیوی قدیمی
    let targetSession = 0;


    // =====================================================
    // همه ویدیوها و پلین‌ها را مخفی کن
    // =====================================================

    function hideEverything() {

        document
            .querySelectorAll(".arVideoPlane")
            .forEach((plane) => {

                plane.setAttribute(
                    "visible",
                    "false"
                );

            });


        document
            .querySelectorAll("a-video")
            .forEach((plane) => {

                plane.setAttribute(
                    "visible",
                    "false"
                );

            });


        videos.forEach((video) => {

            if (video) {

                video.pause();

            }

        });

    }


    // =====================================================
    // AR READY
    // =====================================================

    scene.addEventListener(
        "arReady",
        () => {

            console.log(
                "AR READY - 30 TARGETS"
            );

        }
    );


    // =====================================================
    // TARGET FOUND
    // =====================================================

    scene.addEventListener(
        "targetFound",
        async (e) => {

            const target =
                e.target;


            const data =
                target.getAttribute(
                    "mindar-image-target"
                );


            const index =
                Number(data.targetIndex);


            console.log(
                "TARGET FOUND:",
                index
            );


            // -------------------------------------------------
            // جلسه جدید
            // -------------------------------------------------

            targetSession++;

            const thisSession =
                targetSession;


            activeTarget =
                target;

            activeIndex =
                index;


            // -------------------------------------------------
            // اول همه ویدیوهای قبلی را فوراً مخفی کن
            // -------------------------------------------------

            hideEverything();


            // -------------------------------------------------
            // ویدیوی مربوط به همین Target
            // -------------------------------------------------

            const video =
                videos[index];


            if (!video) {

                console.log(
                    "VIDEO NOT FOUND:",
                    index
                );

                return;

            }


            // -------------------------------------------------
            // پلین فقط همین Target
            // -------------------------------------------------

            const plane =
                target.querySelector(
                    "a-video"
                );


            if (!plane) {

                console.log(
                    "VIDEO PLANE NOT FOUND:",
                    index
                );

                return;

            }


            // حتماً تا آماده شدن ویدیو مخفی باشد
            plane.setAttribute(
                "visible",
                "false"
            );


            // -------------------------------------------------
            // ویدیوی جدید
            // -------------------------------------------------

            video.pause();

            video.currentTime = 0;


            // صدا
            video.muted = false;


            // -------------------------------------------------
            // صبر برای آماده شدن ویدیو
            // -------------------------------------------------

            const showVideo = async () => {

                // اگر در این فاصله Target عوض شده
                // اصلاً این ویدیو را نشان نده
                if (
                    thisSession !== targetSession ||
                    activeTarget !== target ||
                    activeIndex !== index
                ) {

                    console.log(
                        "OLD VIDEO IGNORED:",
                        index
                    );

                    return;

                }


                console.log(
                    "VIDEO READY:",
                    index
                );


                try {

                    await video.play();


                    // دوباره چک کن Target هنوز فعال است
                    if (
                        thisSession !== targetSession ||
                        activeTarget !== target ||
                        activeIndex !== index
                    ) {

                        video.pause();

                        return;

                    }


                    // ------------------------------------------------
                    // فقط حالا ویدیو را روی عکس نشان بده
                    // ------------------------------------------------

                    plane.setAttribute(
                        "visible",
                        "true"
                    );


                    console.log(
                        "VIDEO SHOWN:",
                        index
                    );

                }

                catch (error) {

                    console.log(
                        "VIDEO PLAY ERROR:",
                        error
                    );

                }

            };


            // -------------------------------------------------
            // اگر ویدیو همین الان آماده است
            // -------------------------------------------------

            if (
                video.readyState >= 3
            ) {

                showVideo();

            }

            else {

                video.addEventListener(
                    "canplay",
                    showVideo,
                    {
                        once: true
                    }
                );

            }


            console.log(
                "LOADING VIDEO:",
                index
            );

        }
    );


    // =====================================================
    // TARGET LOST
    // =====================================================

    scene.addEventListener(
        "targetLost",
        (e) => {

            const target =
                e.target;


            const data =
                target.getAttribute(
                    "mindar-image-target"
                );


            const index =
                Number(data.targetIndex);


            console.log(
                "TARGET LOST:",
                index
            );


            // اگر این Target دیگر فعال نیست
            // کاری نکن
            if (
                activeTarget !== target
            ) {

                return;

            }


            // -------------------------------------------------
            // اول جلسه را باطل کن
            // -------------------------------------------------

            targetSession++;


            // -------------------------------------------------
            // فوراً پلین همین Target را مخفی کن
            // -------------------------------------------------

            const plane =
                target.querySelector(
                    "a-video"
                );


            if (plane) {

                plane.setAttribute(
                    "visible",
                    "false"
                );

            }


            // -------------------------------------------------
            // ویدیوی مربوطه فوراً متوقف شود
            // -------------------------------------------------

            const video =
                videos[index];


            if (video) {

                video.pause();

                video.currentTime = 0;

            }


            // -------------------------------------------------
            // وضعیت فعال پاک شود
            // -------------------------------------------------

            activeTarget = null;

            activeIndex = -1;


            console.log(
                "VIDEO REMOVED IMMEDIATELY"
            );

        }
    );

});
