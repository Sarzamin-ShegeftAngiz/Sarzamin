const GROUPS = {
    1: {
        name: "گروه یک",
        targetSrc: "./Group1/targets.mind",
        firstVideo: 1,
        lastVideo: 30
    },

    2: {
        name: "گروه دو",
        targetSrc: "./Group2/targets.mind",
        firstVideo: 31,
        lastVideo: 60
    }

    // گروه‌های بعدی را بعداً اینجا اضافه می‌کنیم
    // 3: {
    //     name: "گروه سه",
    //     targetSrc: "./Group3/targets.mind",
    //     firstVideo: 61,
    //     lastVideo: 90
    // }
};


/* =====================================================
   انتخاب گروه
===================================================== */

window.startGroup = function (groupNumber) {

    if (!GROUPS[groupNumber]) return;

    window.location.href =
        window.location.pathname +
        "?group=" +
        groupNumber +
        "&v=125";
};


/* =====================================================
   صفحه انتخاب گروه
===================================================== */

function showGroupMenu() {

    const oldMenu = document.getElementById("groupMenu");

    if (oldMenu) {
        oldMenu.remove();
    }

    document.body.innerHTML = "";

    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.width = "100%";
    document.body.style.height = "100%";
    document.body.style.overflow = "hidden";

    const menu = document.createElement("div");

    menu.id = "groupMenu";

    menu.innerHTML = `
        <div class="menu-box">

            <div class="menu-title">
                سرزمین شگفت انگیز
            </div>

            <div class="menu-subtitle">
                انتخاب گروه دفترها
            </div>

            <div class="groups-container"></div>

        </div>
    `;

    document.body.appendChild(menu);

    const groupsContainer =
        menu.querySelector(".groups-container");

    Object.keys(GROUPS).forEach((number) => {

        const button =
            document.createElement("button");

        button.className = "group-button";

        button.textContent =
            GROUPS[number].name;

        button.onclick = () => {
            startGroup(Number(number));
        };

        groupsContainer.appendChild(button);
    });
}


/* =====================================================
   ساخت صفحه آبی SARZAMINAR
===================================================== */

function showBlueLoading() {

    const loading =
        document.createElement("div");

    loading.id = "sarzaminLoading";

    loading.innerHTML = `
        <div class="sarzamin-logo">
            SARZAMINAR
        </div>

        <div class="sarzamin-loading-text">
            در حال آماده‌سازی دوربین...
        </div>
    `;

    document.body.appendChild(loading);

    return loading;
}


/* =====================================================
   CSS داخلی
===================================================== */

function addAppStyles() {

    if (document.getElementById("appStyles")) return;

    const style =
        document.createElement("style");

    style.id = "appStyles";

    style.textContent = `

        html,
        body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
        }


        /* -------------------------
           صفحه انتخاب گروه
        ------------------------- */

        #groupMenu {

            position: fixed;

            inset: 0;

            width: 100%;
            height: 100%;

            display: flex;

            justify-content: center;

            align-items: center;

            text-align: center;

            direction: rtl;

            background:
                linear-gradient(
                    180deg,
                    #101d42 0%,
                    #182d62 50%,
                    #0d1939 100%
                );

            z-index: 999999;

            font-family:
                "Vazirmatn",
                "Tahoma",
                Arial,
                sans-serif;
        }


        .menu-box {

            width: min(88%, 430px);

            display: flex;

            flex-direction: column;

            align-items: center;

            justify-content: center;

            padding: 30px 20px 35px;

            box-sizing: border-box;
        }


        .menu-title {

            color: #ffffff;

            font-size: clamp(28px, 7vw, 40px);

            font-weight: 900;

            line-height: 1.4;

            margin-bottom: 8px;

            text-shadow:
                0 3px 12px rgba(0,0,0,.35);
        }


        .menu-subtitle {

            color: rgba(255,255,255,.9);

            font-size: clamp(18px, 4.8vw, 25px);

            font-weight: 600;

            margin-bottom: 28px;

            line-height: 1.5;
        }


        .groups-container {

            width: 100%;

            display: flex;

            flex-direction: column;

            align-items: center;

            gap: 12px;

            max-height: 58vh;

            overflow-y: auto;

            padding: 5px 8px 15px;

            box-sizing: border-box;
        }


        .group-button {

            width: min(100%, 330px);

            min-height: 56px;

            border: 0;

            border-radius: 18px;

            background:
                rgba(255,255,255,.96);

            color: #17254b;

            font-family:
                "Vazirmatn",
                "Tahoma",
                Arial,
                sans-serif;

            font-size: 20px;

            font-weight: 800;

            cursor: pointer;

            box-shadow:
                0 7px 20px rgba(0,0,0,.25);

            transition:
                transform .15s ease,
                box-shadow .15s ease;
        }


        .group-button:active {

            transform: scale(.96);

            box-shadow:
                0 3px 10px rgba(0,0,0,.2);
        }


        /* -------------------------
           صفحه آبی قبل از دوربین
        ------------------------- */

        #sarzaminLoading {

            position: fixed;

            inset: 0;

            width: 100%;
            height: 100%;

            display: flex;

            flex-direction: column;

            justify-content: center;

            align-items: center;

            text-align: center;

            background:
                linear-gradient(
                    180deg,
                    #101d42,
                    #17316c
                );

            z-index: 999998;

            direction: rtl;

            font-family:
                "Vazirmatn",
                "Tahoma",
                Arial,
                sans-serif;
        }


        .sarzamin-logo {

            color: #ffffff;

            font-size: clamp(34px, 9vw, 54px);

            font-weight: 900;

            letter-spacing: 2px;

            margin-bottom: 22px;
        }


        .sarzamin-loading-text {

            color: rgba(255,255,255,.9);

            font-size: 18px;

            font-weight: 500;
        }


        /* -------------------------
           دکمه تغییر گروه
        ------------------------- */

        #changeGroupButton {

            position: fixed;

            top: 15px;

            right: 15px;

            z-index: 99999;

            border: 0;

            border-radius: 14px;

            padding: 10px 15px;

            background:
                rgba(0,0,0,.55);

            color: white;

            font-family:
                "Vazirmatn",
                "Tahoma",
                Arial,
                sans-serif;

            font-size: 14px;

            font-weight: 700;
        }


        /* -------------------------
           جلوگیری از نمایش hitbox
        ------------------------- */

        .instagram-zone,
        .share-zone {

            opacity: 0 !important;

            pointer-events: none;
        }

    `;

    document.head.appendChild(style);
}


/* =====================================================
   ساخت Scene
===================================================== */

function bootGroup(groupNumber) {

    const group = GROUPS[groupNumber];

    if (!group) {
        showGroupMenu();
        return;
    }

    document.body.innerHTML = "";

    const loading = showBlueLoading();

    const scene = document.createElement("a-scene");

    scene.setAttribute(
        "mindar-image",
        `imageTargetSrc: ${group.targetSrc}; warmupTolerance: 2; missTolerance: 1;`
    );

    scene.setAttribute(
        "embedded",
        ""
    );

    scene.setAttribute(
        "vr-mode-ui",
        "enabled:false"
    );

    scene.setAttribute(
        "device-orientation-permission-ui",
        "enabled:false"
    );

    scene.setAttribute(
        "renderer",
        "colorManagement:true;"
    );


    /* -------------------------
       Camera
    ------------------------- */

    const camera =
        document.createElement("a-camera");

    camera.setAttribute(
        "position",
        "0 0 0"
    );

    camera.setAttribute(
        "look-controls",
        "enabled:false"
    );


    /* -------------------------
       Assets
    ------------------------- */

    const assets =
        document.createElement("a-assets");

    const video =
        document.createElement("video");

    video.id = "arVideo";

    video.setAttribute("preload", "none");
    video.setAttribute("loop", "");
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    video.style.display = "none";

    assets.appendChild(video);


    /* -------------------------
       Target container
    ------------------------- */

    const target =
        document.createElement(
            "a-entity"
        );

    target.setAttribute(
        "mindar-image-target",
        "targetIndex: 0"
    );

    const videoPlane =
        document.createElement("a-video");

    videoPlane.setAttribute(
        "src",
        "#arVideo"
    );

    videoPlane.setAttribute(
        "width",
        "1"
    );

    videoPlane.setAttribute(
        "height",
        "1.42"
    );

    videoPlane.setAttribute(
        "position",
        "0 0 0"
    );

    videoPlane.setAttribute(
        "visible",
        "false"
    );

    target.appendChild(videoPlane);


    /* -------------------------
       Instagram zone
       همان محدوده قبلی
    ------------------------- */

    const instagram =
        document.createElement("a-plane");

    instagram.className =
        "instagram-zone";

    instagram.setAttribute(
        "position",
        "0 -0.82 0.04"
    );

    instagram.setAttribute(
        "width",
        "0.70"
    );

    instagram.setAttribute(
        "height",
        "0.16"
    );

    instagram.setAttribute(
        "material",
        "transparent:true; opacity:0.001; side:double;"
    );

    instagram.setAttribute(
        "visible",
        "true"
    );

    target.appendChild(instagram);


    /* -------------------------
       Share zone
    ------------------------- */

    const share =
        document.createElement("a-plane");

    share.className =
        "share-zone";

    share.setAttribute(
        "position",
        "0 -0.96 0.04"
    );

    share.setAttribute(
        "width",
        "0.82"
    );

    share.setAttribute(
        "height",
        "0.17"
    );

    share.setAttribute(
        "material",
        "transparent:true; opacity:0.001; side:double;"
    );

    share.setAttribute(
        "visible",
        "true"
    );

    target.appendChild(share);


    /* -------------------------
       متن‌ها
    ------------------------- */

    const instagramText =
        document.createElement(
            "a-text"
        );

    instagramText.className =
        "after-video-text";

    instagramText.setAttribute(
        "value",
        "دفترهای زنده اینجا 👈"
    );

    instagramText.setAttribute(
        "align",
        "center"
    );

    instagramText.setAttribute(
        "position",
        "0 -0.82 0.03"
    );

    instagramText.setAttribute(
        "width",
        "1.8"
    );

    instagramText.setAttribute(
        "color",
        "#ffffff"
    );

    instagramText.setAttribute(
        "opacity",
        "1"
    );

    target.appendChild(instagramText);


    const shareText =
        document.createElement(
            "a-text"
        );

    shareText.className =
        "after-video-text";

    shareText.setAttribute(
        "value",
        "سرزمین شگفت‌انگیز"
    );

    shareText.setAttribute(
        "align",
        "center"
    );

    shareText.setAttribute(
        "position",
        "0 -0.96 0.03"
    );

    shareText.setAttribute(
        "width",
        "1.8"
    );

    shareText.setAttribute(
        "color",
        "#ffffff"
    );

    shareText.setAttribute(
        "opacity",
        "1"
    );

    target.appendChild(shareText);


    const surpriseText =
        document.createElement(
            "a-text"
        );

    surpriseText.className =
        "after-video-text";

    surpriseText.setAttribute(
        "value",
        "می‌خوای دوستاتو هم سورپرایز کنی؟ 😍👇"
    );

    surpriseText.setAttribute(
        "align",
        "center"
    );

    surpriseText.setAttribute(
        "position",
        "0 -0.70 0.03"
    );

    surpriseText.setAttribute(
        "width",
        "1.8"
    );

    surpriseText.setAttribute(
        "color",
        "#ffffff"
    );

    surpriseText.setAttribute(
        "opacity",
        "0"
    );

    target.appendChild(surpriseText);


    scene.appendChild(assets);
    scene.appendChild(target);
    scene.appendChild(camera);

    document.body.appendChild(scene);


    /* -------------------------
       تغییر گروه
    ------------------------- */

    const changeButton =
        document.createElement("button");

    changeButton.id =
        "changeGroupButton";

    changeButton.textContent =
        "تغییر گروه";

    changeButton.onclick = () => {

        window.location.href =
            window.location.pathname +
            "?v=125";
    };

    document.body.appendChild(
        changeButton
    );


    let activeTarget = null;
    let activeIndex = null;
    let firstLoopDone = false;
    let loadingVideo = false;


    /* =================================================
       AR READY
    ================================================= */

    scene.addEventListener(
        "arReady",
        () => {

            console.log("AR READY");

            if (loading) {
                loading.remove();
            }
        }
    );


    /* =================================================
       TARGET FOUND
    ================================================= */

    scene.addEventListener(
        "targetFound",
        async (e) => {

            const currentTarget =
                e.target;

            const data =
                currentTarget.getAttribute(
                    "mindar-image-target"
                );

            const index =
                data.targetIndex;

            console.log(
                "TARGET FOUND:",
                index
            );

            activeTarget =
                currentTarget;

            activeIndex =
                index;


            /* -------------------------
               متن‌ها را مخفی کن
            ------------------------- */

            instagramText.setAttribute(
                "opacity",
                "1"
            );

            shareText.setAttribute(
                "opacity",
                "1"
            );

            surpriseText.setAttribute(
                "opacity",
                "0"
            );


            /* -------------------------
               جلوگیری از نشان دادن
               فریم ویدئوی قبلی
            ------------------------- */

            videoPlane.setAttribute(
                "visible",
                "false"
            );

            video.pause();

            video.currentTime = 0;

            video.removeAttribute(
                "src"
            );

            video.load();


            loadingVideo = true;


            /* -------------------------
               شماره واقعی ویدئو
            ------------------------- */

            const videoNumber =
                group.firstVideo + index;

            const videoSrc =
                `./Group${groupNumber}/${String(videoNumber).padStart(2, "0")}.mp4`;


            console.log(
                "VIDEO SRC:",
                videoSrc
            );


            video.src =
                videoSrc;

            video.muted = false;

            video.load();


            const playVideo =
                async () => {

                    if (
                        activeTarget !==
                        currentTarget
                    ) {
                        return;
                    }

                    try {

                        await video.play();

                        videoPlane.setAttribute(
                            "visible",
                            "true"
                        );

                        loadingVideo = false;

                        console.log(
                            "VIDEO PLAYING:",
                            videoNumber
                        );

                    }
                    catch (err) {

                        console.log(
                            "VIDEO ERROR:",
                            err
                        );

                        video.muted = true;

                        try {

                            await video.play();

                            videoPlane.setAttribute(
                                "visible",
                                "true"
                            );

                        }
                        catch (e2) {

                            console.log(
                                "VIDEO MUTED ERROR:",
                                e2
                            );
                        }

                        loadingVideo = false;
                    }
                };


            if (
                video.readyState >= 2
            ) {

                await playVideo();

            } else {

                video.addEventListener(
                    "loadeddata",
                    playVideo,
                    { once: true }
                );
            }
        }
    );


    /* =================================================
       TARGET LOST
    ================================================= */

    scene.addEventListener(
        "targetLost",
        (e) => {

            const currentTarget =
                e.target;

            const data =
                currentTarget.getAttribute(
                    "mindar-image-target"
                );

            const index =
                data.targetIndex;

            console.log(
                "TARGET LOST:",
                index
            );


            if (
                activeTarget ===
                currentTarget
            ) {

                activeTarget = null;
                activeIndex = null;

                video.pause();

                videoPlane.setAttribute(
                    "visible",
                    "false"
                );
            }
        }
    );


    /* =================================================
       پایان اولین دور ویدئو
    ================================================= */

    video.addEventListener(
        "timeupdate",
        () => {

            if (
                video.duration &&
                video.currentTime >=
                video.duration - 0.25 &&
                !firstLoopDone
            ) {

                firstLoopDone = true;

                surpriseText.setAttribute(
                    "opacity",
                    "1"
                );
            }
        }
    );


    /* =================================================
       TOUCH
       همان منطق قبلی و تست‌شده
    ================================================= */

    document.addEventListener(
        "touchend",
        (event) => {

            if (!activeTarget) return;

            if (
                !scene.camera ||
                !scene.renderer
            ) {
                return;
            }


            const touch =
                event.changedTouches[0];

            if (!touch) return;


            const canvas =
                scene.renderer.domElement;

            const rect =
                canvas.getBoundingClientRect();


            const mouse =
                new THREE.Vector2();


            mouse.x =
                ((touch.clientX - rect.left) /
                    rect.width) *
                    2 - 1;


            mouse.y =
                -((touch.clientY - rect.top) /
                    rect.height) *
                    2 + 1;


            const raycaster =
                new THREE.Raycaster();


            raycaster.setFromCamera(
                mouse,
                scene.camera
            );


            /* =========================================
               INSTAGRAM
            ========================================= */

            const instagramZone =
                activeTarget.querySelector(
                    ".instagram-zone"
                );


            if (instagramZone) {

                const instagramMesh =
                    instagramZone.getObject3D(
                        "mesh"
                    );


                if (instagramMesh) {

                    const instagramHits =
                        raycaster.intersectObject(
                            instagramMesh,
                            true
                        );


                    if (
                        instagramHits.length > 0
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


                        return;
                    }
                }
            }


            /* =========================================
               SHARE
            ========================================= */

            const shareZone =
                activeTarget.querySelector(
                    ".share-zone"
                );


            if (!shareZone) return;


            const shareMesh =
                shareZone.getObject3D(
                    "mesh"
                );


            if (!shareMesh) return;


            const shareHits =
                raycaster.intersectObject(
                    shareMesh,
                    true
                );


            if (
                shareHits.length > 0
            ) {

                console.log(
                    "SHARE PRESSED"
                );


                const shareURL =
                    window.location.href;


                const shareText =
                    "📚✨ این فقط یه دفتر معمولی نیست!\n\n" +
                    "این دفتر می‌تونه زنده بشه! 😱\n" +
                    "دوربین گوشیت رو بگیر روی جلد و خودت ببین چه اتفاقی می‌افته! 👀\n\n" +
                    "🔥 حالا اگه دوست داری طرح‌های زنده‌ی دیگه رو هم ببینی، " +
                    "این لینک رو بزن و بیا آیدی اینستاگرام سرزمین شگفت‌انگیز رو ببین!\n" +
                    "شاید طرح مورد علاقه‌ات اونجا منتظرت باشه 😍📚\n\n" +
                    "اگه دفترت هنوز زنده نشده، درخواست زنده‌شدنش رو بده! 😉✨";


                if (
                    navigator.share
                ) {

                    navigator.share({

                        title:
                            "سرزمین شگفت‌انگیز 📚✨",

                        text:
                            shareText,

                        url:
                            shareURL

                    })
                    .then(() => {

                        console.log(
                            "SHARE SUCCESS"
                        );

                    })
                    .catch((err) => {

                        console.log(
                            "SHARE CANCELLED",
                            err
                        );
                    });


                } else {

                    navigator.clipboard
                        .writeText(
                            shareText +
                            "\n\n" +
                            shareURL
                        )
                        .then(() => {

                            alert(
                                "متن و لینک کپی شد ❤️\nبرای دوستت بفرست"
                            );

                        })
                        .catch(() => {

                            prompt(
                                "این متن و لینک را برای دوستت بفرست:",
                                shareText +
                                "\n\n" +
                                shareURL
                            );
                        });
                }
            }

        },
        {
            passive: true
        }
    );
}


/* =====================================================
   شروع برنامه
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        addAppStyles();

        const params =
            new URLSearchParams(
                window.location.search
            );

        const group =
            params.get("group");


        if (
            group &&
            GROUPS[group]
        ) {

            bootGroup(
                Number(group)
            );

        } else {

            showGroupMenu();
        }
    }
);
