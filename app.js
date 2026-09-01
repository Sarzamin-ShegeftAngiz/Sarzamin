document.addEventListener("DOMContentLoaded", () => {

    const scene = document.querySelector("a-scene");


    // =========================
    // ویدیوها
    // =========================

    const videos = [

        document.querySelector("#video0"),
        document.querySelector("#video1"),
        document.querySelector("#video2"),
        document.querySelector("#video3"),
        document.querySelector("#video4"),
        document.querySelector("#video5")

    ];


    // =========================
    // عناصر صفحه
    // =========================

    const promoBox =
        document.querySelector("#promoBox");

    const shareButton =
        document.querySelector("#shareButton");

    const sharePanel =
        document.querySelector("#sharePanel");

    const closeShare =
        document.querySelector("#closeShare");

    const instagramInfo =
        document.querySelector("#instagramInfo");

    const instagramLink =
        document.querySelector("#instagramLink");


    // =========================
    // وضعیت
    // =========================

    let activeTarget = null;

    let currentVideo = null;

    let endWatcher = null;

    let firstCycleShown = false;


    // =========================
    // لینک اصلی AR
    // =========================

    const arURL =
        "https://sarzamin-shegeftangiz.github.io/";


    // =========================
    // متن اشتراک گذاری
    // =========================

    const shareText =
`😍 ببین چی پیدا کردم!
دفترم زنده شد! 😂🔥
فکر می‌کنی دفتر تو هم زنده میشه؟ 👀
بیا امتحانش کن👇

سرزمین شگفت‌انگیز ✨`;


    // =========================
    // آماده شدن AR
    // =========================

    scene.addEventListener("arReady", () => {

        console.log("AR READY");

    });


    // =========================
    // حذف بررسی دور ویدیو قبلی
    // =========================

    function removeVideoWatcher() {

        if (
            currentVideo &&
            endWatcher
        ) {

            currentVideo.removeEventListener(
                "timeupdate",
                endWatcher
            );

        }

        currentVideo = null;

        endWatcher = null;

    }


    // =========================
    // نمایش پیام
    // =========================

    function showPromo() {

        promoBox.style.display = "block";

        instagramInfo.style.display = "block";

    }


    // =========================
    // مخفی کردن پیام
    // =========================

    function hidePromo() {

        promoBox.style.display = "none";

        sharePanel.style.display = "none";

        instagramInfo.style.display = "none";

    }


    // =========================
    // پیدا شدن دفتر
    // =========================

    scene.addEventListener(
        "targetFound",
        async (e) => {

            const target = e.target;

            const data =
                target.getAttribute(
                    "mindar-image-target"
                );

            const index =
                data.targetIndex;


            console.log(
                "TARGET FOUND:",
                index
            );


            activeTarget = target;


            // توقف ویدیوهای دیگر

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


            const video =
                videos[index];


            if (!video) {

                return;

            }


            // بررسی قبلی را پاک کن

            removeVideoWatcher();


            currentVideo = video;

            firstCycleShown = false;


            // پیام‌ها دوباره مخفی شوند

            hidePromo();


            // از اول پخش شود

            video.currentTime = 0;


            // صدا

            video.muted = false;


            // حتماً لوپ باشد

            video.loop = true;


            // =========================
            // تشخیص پایان دور اول
            // بدون توقف ویدیو
            // =========================

            endWatcher = () => {

                if (
                    firstCycleShown
                ) {

                    return;

                }


                if (
                    video.duration &&
                    isFinite(video.duration)
                ) {

                    const remaining =
                        video.duration -
                        video.currentTime;


                    if (
                        remaining <= 0.20
                    ) {

                        firstCycleShown = true;


                        console.log(
                            "FIRST VIDEO CYCLE COMPLETE"
                        );


                        showPromo();

                    }

                }

            };


            video.addEventListener(
                "timeupdate",
                endWatcher
            );


            // =========================
            // پخش
            // =========================

            try {

                await video.play();

                console.log(
                    "VIDEO PLAYING:",
                    index
                );

            }

            catch (err) {

                console.log(
                    "VIDEO ERROR:",
                    index,
                    err
                );

            }

        }
    );


    // =========================
    // گم شدن دفتر
    // =========================

    scene.addEventListener(
        "targetLost",
        (e) => {

            const target = e.target;

            const data =
                target.getAttribute(
                    "mindar-image-target"
                );

            const index =
                data.targetIndex;


            console.log(
                "TARGET LOST:",
                index
            );


            const video =
                videos[index];


            if (video) {

                video.pause();

            }


            if (
                activeTarget === target
            ) {

                activeTarget = null;

            }


            removeVideoWatcher();

            hidePromo();

        }
    );


    // =========================
    // باز کردن پنل اشتراک
    // =========================

    shareButton.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            event.stopPropagation();


            sharePanel.style.display =
                "block";

        }
    );


    // =========================
    // بستن پنل
    // =========================

    closeShare.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            event.stopPropagation();


            sharePanel.style.display =
                "none";

        }
    );


    // =========================
    // اشتراک اصلی گوشی
    // =========================

    async function nativeShare() {

        if (
            navigator.share
        ) {

            try {

                await navigator.share({

                    title:
                        "سرزمین شگفت انگیز ✨",

                    text:
                        shareText,

                    url:
                        arURL

                });

            }

            catch (err) {

                console.log(
                    "Share cancelled"
                );

            }

            return true;

        }


        return false;

    }


    // =========================
    // تلگرام
    // =========================

    document
        .querySelector("#shareTelegram")
        .addEventListener(
            "click",
            () => {

                const url =
                    "https://t.me/share/url?url=" +
                    encodeURIComponent(arURL) +
                    "&text=" +
                    encodeURIComponent(shareText);


                window.location.href = url;

            }
        );


    // =========================
    // روبیکا
    // =========================

    document
        .querySelector("#shareRubika")
        .addEventListener(
            "click",
            async () => {

                sharePanel.style.display =
                    "none";


                const worked =
                    await nativeShare();


                if (!worked) {

                    alert(
                        "از گزینه اشتراک‌گذاری گوشی استفاده کن ❤️"
                    );

                }

            }
        );


    // =========================
    // شاد
    // =========================

    document
        .querySelector("#shareShad")
        .addEventListener(
            "click",
            async () => {

                sharePanel.style.display =
                    "none";


                const worked =
                    await nativeShare();


                if (!worked) {

                    alert(
                        "از گزینه اشتراک‌گذاری گوشی استفاده کن ❤️"
                    );

                }

            }
        );


    // =========================
    // اینستاگرام
    // =========================

    instagramLink.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            event.stopPropagation();


            console.log(
                "INSTAGRAM PRESSED"
            );


            const intentURL =
                "intent://www.instagram.com/_u/SarzaminAr/#Intent;" +
                "package=com.instagram.android;" +
                "scheme=https;" +
                "end";


            window.location.href =
                intentURL;

        }
    );


    // =========================
    // کلیک روی آیدی اینستاگرام
    // قدیمی + حفظ شده
    // =========================

    document.addEventListener(
        "touchend",
        (event) => {


            // اگر روی پنل اشتراک کلیک شده
            // کاری با AR نداشته باش

            if (
                event.target.closest(
                    "#promoBox"
                ) ||
                event.target.closest(
                    "#sharePanel"
                ) ||
                event.target.closest(
                    "#instagramInfo"
                )
            ) {

                return;

            }


            if (!activeTarget) {

                return;

            }


            if (
                !scene.camera ||
                !scene.renderer
            ) {

                return;

            }


            const touch =
                event.changedTouches[0];


            if (!touch) {

                return;

            }


            const canvas =
                scene.renderer.domElement;


            const rect =
                canvas.getBoundingClientRect();


            const mouse =
                new THREE.Vector2();


            mouse.x =
                (
                    (
                        touch.clientX -
                        rect.left
                    )
                    /
                    rect.width
                )
                *
                2
                -
                1;


            mouse.y =
                -(
                    (
                        touch.clientY -
                        rect.top
                    )
                    /
                    rect.height
                )
                *
                2
                +
                1;


            const raycaster =
                new THREE.Raycaster();


            raycaster.setFromCamera(
                mouse,
                scene.camera
            );


            const zone =
                activeTarget.querySelector(
                    ".instagram-zone"
                );


            if (!zone) {

                return;

            }


            const mesh =
                zone.getObject3D(
                    "mesh"
                );


            if (!mesh) {

                return;

            }


            const hits =
                raycaster.intersectObject(
                    mesh,
                    true
                );


            if (
                hits.length > 0
            ) {

                console.log(
                    "INSTAGRAM PRESSED"
                );


                const intentURL =
                    "intent://www.instagram.com/_u/SarzaminAr/#Intent;" +
                    "package=com.instagram.android;" +
                    "scheme=https;" +
                    "end";


                window.location.href =
                    intentURL;

            }

        },

        {
            passive: true
        }

    );

});
