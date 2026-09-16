document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       SCENE
    ===================================================== */

    const scene = document.querySelector("a-scene");

    if (!scene) {
        console.error("A-FRAME SCENE NOT FOUND");
        return;
    }


    /* =====================================================
   LOADING SCREEN
===================================================== */

const arLoading =
    document.getElementById("arLoading");

const loadingPercent =
    document.getElementById("loadingPercent");

const loadingBarFill =
    document.getElementById("loadingBarFill");

const loadingBar =
    document.getElementById("loadingBar");

const loadingText =
    document.getElementById("loadingText");

let loadingProgress = 0;
let loadingFinished = false;


/* =========================
   درصد و نوار
========================= */

function setLoadingProgress(percent) {

    percent = Math.max(
        0,
        Math.min(100, Math.round(percent))
    );

    loadingProgress = percent;

    if (loadingPercent) {
        loadingPercent.textContent =
            percent + "%";
    }

    if (loadingBarFill) {
        loadingBarFill.style.width =
            percent + "%";
    }
}


/* =========================
   تنظیم صفحه لودینگ
========================= */

if (arLoading) {

    arLoading.style.position = "fixed";
    arLoading.style.inset = "0";

    arLoading.style.width = "100vw";
    arLoading.style.height = "100vh";

    arLoading.style.overflow = "hidden";

    arLoading.style.zIndex =
        "9999999";

    arLoading.style.backgroundImage =
        'url("./loading.png")';

    /*
       کل عکس داخل صفحه
       بدون Crop از چپ و راست
    */

    arLoading.style.backgroundSize =
        "100% 100%";

    arLoading.style.backgroundPosition =
        "center center";

    arLoading.style.backgroundRepeat =
        "no-repeat";
}


/* =========================
   نوار پیشرفت
========================= */

if (loadingBar) {

    loadingBar.style.position =
        "absolute";

    loadingBar.style.left =
        "50%";

    loadingBar.style.bottom =
        "65px";

    loadingBar.style.transform =
        "translateX(-50%)";

    loadingBar.style.width =
        "60vw";

    loadingBar.style.maxWidth =
        "280px";

    loadingBar.style.minWidth =
        "170px";

    loadingBar.style.height =
        "14px";

    loadingBar.style.zIndex =
        "20";

    loadingBar.style.boxSizing =
        "border-box";
}


/* =========================
   درصد
========================= */

if (loadingPercent) {

    loadingPercent.style.position =
        "absolute";

    loadingPercent.style.left =
        "50%";

    loadingPercent.style.bottom =
        "68px";

    loadingPercent.style.transform =
        "translate(-50%, -50%)";

    loadingPercent.style.zIndex =
        "30";

    loadingPercent.style.pointerEvents =
        "none";
}


/* =========================
   متن
========================= */

if (loadingText) {

    loadingText.style.position =
        "absolute";

    loadingText.style.left =
        "50%";

    loadingText.style.bottom =
        "30px";

    loadingText.style.transform =
        "translateX(-50%)";

    loadingText.style.zIndex =
        "30";

    loadingText.style.pointerEvents =
        "none";

    loadingText.style.whiteSpace =
        "nowrap";
}


/* =========================
   شروع
========================= */

setLoadingProgress(5);


/* =========================
   Fake Progress
========================= */

const fakeLoading =
    setInterval(() => {

        if (
            !loadingFinished &&
            loadingProgress < 95
        ) {

            setLoadingProgress(
                loadingProgress + 1
            );

        }

    }, 70);


/* =====================================================
   فقط AR READY لودینگ را می‌بندد
===================================================== */

scene.addEventListener(
    "arReady",
    () => {

        console.log(
            "MINDAR AR READY"
        );

        loadingFinished = true;

        clearInterval(fakeLoading);

        setLoadingProgress(100);

        setTimeout(() => {

            if (arLoading) {

                arLoading.style.display =
                    "none";

            }

        }, 300);

    }
);


    /* =====================================================
       30 VIDEOS
    ===================================================== */

    const videos = [];

    for (let i = 0; i < 30; i++) {

        const video =
            document.querySelector(
                "#video" + i
            );

        videos.push(video);
    }


    let activeTarget = null;


    /* =====================================================
       AR READY LOG
    ===================================================== */

    scene.addEventListener(
        "arReady",
        () => {

            console.log(
                "AR READY - 30 TARGETS"
            );

        }
    );


    /* =====================================================
       TARGET FOUND
    ===================================================== */

    scene.addEventListener(
        "targetFound",
        async (e) => {

            const target =
                e.target;


            const data =
                target.getAttribute(
                    "mindar-image-target"
                );


            if (!data) {
                return;
            }


            const index =
                data.targetIndex;


            console.log(
                "TARGET FOUND:",
                index
            );


            activeTarget =
                target;


            /*
               توقف همه ویدیوهای دیگر
            */

            videos.forEach(
                (video, i) => {

                    if (!video) {
                        return;
                    }


                    if (i !== index) {

                        video.pause();

                        try {

                            video.currentTime = 0;

                        } catch (err) {}

                    }

                }
            );


            /*
               ویدیوی مربوط به Target
            */

            const video =
                videos[index];


            if (!video) {

                console.log(
                    "VIDEO NOT FOUND:",
                    index
                );

                return;
            }


            console.log(
                "LOADING VIDEO:",
                index
            );


            /*
               ریست ویدیو
            */

            try {

                video.currentTime = 0;

            } catch (err) {}


            /*
               بارگذاری
            */

            video.load();


            /*
               ابتدا تلاش برای صدای واقعی
            */

            video.muted = false;
            video.volume = 1;


            try {

                await video.play();


                console.log(
                    "VIDEO PLAYING:",
                    index
                );

            } catch (err) {

                console.log(
                    "VIDEO PLAY ERROR:",
                    err
                );


                /*
                   اگر مرورگر اجازه صدا نداد،
                   ویدیو بی‌صدا اجرا شود
                */

                video.muted = true;


                try {

                    await video.play();


                    console.log(
                        "VIDEO PLAYING MUTED:",
                        index
                    );

                } catch (err2) {

                    console.log(
                        "VIDEO PLAY ERROR 2:",
                        err2
                    );

                }

            }

        }
    );


    /* =====================================================
       TARGET LOST
    ===================================================== */

    scene.addEventListener(
        "targetLost",
        (e) => {

            const target =
                e.target;


            const data =
                target.getAttribute(
                    "mindar-image-target"
                );


            if (!data) {
                return;
            }


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


                try {

                    video.currentTime = 0;

                } catch (err) {}

            }


            if (
                activeTarget === target
            ) {

                activeTarget = null;

            }

        }
    );


    /* =====================================================
       CHANGE GROUP
    ===================================================== */

    const changeGroup =
        document.getElementById(
            "changeGroup"
        );


    if (changeGroup) {

        changeGroup.addEventListener(
            "click",
            () => {

                window.location.href =
                    "./index.html";

            }
        );

    }


    /* =====================================================
       SHARE
    ===================================================== */

    const shareOverlay =
        document.getElementById(
            "shareOverlay"
        );


    const target1 =
        document.querySelector(
            '[mindar-image-target="targetIndex: 0"]'
        );


    const shareText = `🎉 دفتر من زنده شددد! 😍📱
باور نمی‌کنی؟!
دوربین گوشیتو بگیر روی دفتر و ببین چه اتفاقی می‌افته! 🤯✨

🎨 می‌خوای ببینی کدوم طرح‌ها زنده میشن؟
بیا توی اینستاگرام @SarzaminAr 👀💜

اونجا طرح‌های زنده رو ببین و اگه دوست داری طرح دفتر خودتم زنده کنیم، بهمون بگو! 😍🔥

🚀 سرزمین شگفت‌انگیز؛ جایی که دفترها زنده میشن!`;


    async function shareSarzamin() {

        if (navigator.share) {

            try {

                await navigator.share({

                    title:
                        "سرزمین شگفت‌انگیز",

                    text:
                        shareText

                });

            } catch (err) {

                console.log(
                    "SHARE CANCELLED:",
                    err
                );

            }

        } else {

            try {

                await navigator.clipboard.writeText(
                    shareText
                );


                alert(
                    "متن آماده کپی شد 😊"
                );

            } catch (err) {

                alert(
                    "امکان اشتراک‌گذاری در این مرورگر وجود ندارد."
                );

            }

        }

    }


    if (shareOverlay) {

        shareOverlay.addEventListener(
            "click",
            (e) => {

                e.preventDefault();
                e.stopPropagation();

                shareSarzamin();

            }
        );

    }


    let target1Visible =
        false;


    if (target1) {

        scene.addEventListener(
            "targetFound",
            (e) => {

                if (
                    e.target === target1
                ) {

                    target1Visible =
                        true;

                }

            }
        );


        scene.addEventListener(
            "targetLost",
            (e) => {

                if (
                    e.target === target1
                ) {

                    target1Visible =
                        false;


                    if (shareOverlay) {

                        shareOverlay.style.display =
                            "none";

                    }

                }

            }
        );

    }


    /* =====================================================
       SHARE OVERLAY POSITION
    ===================================================== */

    function updateShareOverlay() {

        if (
            !shareOverlay ||
            !target1 ||
            !target1Visible ||
            !target1.object3D.visible
        ) {

            if (shareOverlay) {

                shareOverlay.style.display =
                    "none";

            }


            requestAnimationFrame(
                updateShareOverlay
            );

            return;
        }


        const camera =
            scene.camera;


        const canvas =
            scene.canvas;


        if (!camera || !canvas) {

            requestAnimationFrame(
                updateShareOverlay
            );

            return;
        }


        const position =
            new THREE.Vector3(
                0.4,
                -0.6,
                0.02
            );


        target1.object3D.localToWorld(
            position
        );


        position.project(
            camera
        );


        const rect =
            canvas.getBoundingClientRect();


        const x =
            rect.left +
            (
                (position.x + 1) *
                0.5 *
                rect.width
            );


        const y =
            rect.top +
            (
                (1 - position.y) *
                0.5 *
                rect.height
            );


        shareOverlay.style.left =
            `${x}px`;


        shareOverlay.style.top =
            `${y}px`;


        shareOverlay.style.display =
            "block";


        requestAnimationFrame(
            updateShareOverlay
        );

    }


    /* =====================================================
       INSTAGRAM
    ===================================================== */

    const instagramOverlay =
        document.getElementById(
            "instagramOverlay"
        );


    const instagramTarget =
        document.querySelector(
            '[mindar-image-target="targetIndex: 0"]'
        );


    let instagramTargetVisible =
        false;


    if (instagramOverlay) {

        instagramOverlay.addEventListener(
            "click",
            (e) => {

                e.preventDefault();
                e.stopPropagation();


                const username =
                    "SarzaminAr";


                const appUrl =
                    `instagram://user?username=${username}`;


                const webUrl =
                    `https://www.instagram.com/${username}/`;


                const startTime =
                    Date.now();


                /*
                   اول تلاش برای باز کردن اپ اینستاگرام
                */

                window.location.href =
                    appUrl;


                /*
                   اگر اپ باز نشد،
                   سایت اینستاگرام باز شود
                */

                setTimeout(
                    () => {

                        if (
                            Date.now() -
                            startTime <
                            2000
                        ) {

                            window.location.href =
                                webUrl;

                        }

                    },
                    1500
                );

            }
        );

    }


    /* =====================================================
       INSTAGRAM TARGET
    ===================================================== */

    if (instagramTarget) {

        scene.addEventListener(
            "targetFound",
            (e) => {

                if (
                    e.target ===
                    instagramTarget
                ) {

                    instagramTargetVisible =
                        true;

                }

            }
        );


        scene.addEventListener(
            "targetLost",
            (e) => {

                if (
                    e.target ===
                    instagramTarget
                ) {

                    instagramTargetVisible =
                        false;


                    if (
                        instagramOverlay
                    ) {

                        instagramOverlay.style.display =
                            "none";

                    }

                }

            }
        );

    }


    /* =====================================================
       INSTAGRAM OVERLAY POSITION
    ===================================================== */

    function updateInstagramOverlay() {

        if (
            !instagramOverlay ||
            !instagramTarget ||
            !instagramTargetVisible ||
            !instagramTarget.object3D.visible
        ) {

            if (instagramOverlay) {

                instagramOverlay.style.display =
                    "none";

            }


            requestAnimationFrame(
                updateInstagramOverlay
            );

            return;
        }


        const camera =
            scene.camera;


        const canvas =
            scene.canvas;


        if (!camera || !canvas) {

            requestAnimationFrame(
                updateInstagramOverlay
            );

            return;
        }


        const position =
            new THREE.Vector3(
                0.1,
                0.7,
                0.02
            );


        instagramTarget.object3D.localToWorld(
            position
        );


        position.project(
            camera
        );


        const rect =
            canvas.getBoundingClientRect();


        const x =
            rect.left +
            (
                (position.x + 1) *
                0.5 *
                rect.width
            );


        const y =
            rect.top +
            (
                (1 - position.y) *
                0.5 *
                rect.height
            );


        instagramOverlay.style.left =
            `${x}px`;


        instagramOverlay.style.top =
            `${y}px`;


        instagramOverlay.style.display =
            "block";


        requestAnimationFrame(
            updateInstagramOverlay
        );

    }


    /* =====================================================
       START OVERLAYS
    ===================================================== */

    scene.addEventListener(
        "renderstart",
        () => {

            requestAnimationFrame(
                updateShareOverlay
            );


            requestAnimationFrame(
                updateInstagramOverlay
            );

        }
    );


    console.log(
        "SARZAMIN AR APP LOADED"
    );

});
