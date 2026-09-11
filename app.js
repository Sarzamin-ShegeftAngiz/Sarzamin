let selectedGroup = null;
let scene = null;

const GROUPS = {
    1: {
        folder: "Group1",
        startNumber: 1,
        count: 30
    },

    2: {
        folder: "Group2",
        startNumber: 31,
        count: 30
    }
};


/* =========================
   شروع گروه
========================= */

window.startGroup = function (groupNumber) {

    if (!GROUPS[groupNumber]) return;

    selectedGroup = GROUPS[groupNumber];

    const menu = document.getElementById("groupMenu");
    const loadingText = document.getElementById("loadingText");

    if (menu) {
        menu.style.display = "none";
    }

    if (loadingText) {
        loadingText.style.display = "block";
    }

    createARScene();
};


/* =========================
   ساخت Scene
========================= */

function createARScene() {

    if (scene) return;

    scene = document.createElement("a-scene");

    scene.setAttribute(
        "mindar-image",
        "imageTargetSrc: ./" +
        selectedGroup.folder +
        "/targets.mind; warmupTolerance: 2; missTolerance: 1;"
    );

    scene.setAttribute("embedded", "");
    scene.setAttribute("vr-mode-ui", "enabled:false");
    scene.setAttribute(
        "device-orientation-permission-ui",
        "enabled:false"
    );

    scene.setAttribute(
        "renderer",
        "colorManagement:true; alpha:true;"
    );

    document.body.appendChild(scene);

    createAssets();
    createCamera();

    /*
     * خیلی مهم:
     * فقط یک ویدئو برای کل ۳۰ Target
     */
    createTargets();

    setupAR();

    scene.addEventListener("loaded", () => {

        console.log("SCENE LOADED");

        const loadingText =
            document.getElementById("loadingText");

        if (loadingText) {
            loadingText.style.display = "none";
        }

    });
}


/* =========================
   Assets
========================= */

function createAssets() {

    const assets = document.createElement("a-assets");

    /*
     * هیچ src اولیه‌ای ندارد.
     * بنابراین هنگام باز شدن دوربین
     * هیچ ویدئویی دانلود نمی‌شود.
     */

    const video = document.createElement("video");

    video.id = "arVideo";

    video.setAttribute("preload", "none");
    video.setAttribute("loop", "");
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    video.playsInline = true;
    video.muted = true;

    assets.appendChild(video);

    scene.appendChild(assets);
}


/* =========================
   Camera
========================= */

function createCamera() {

    const camera = document.createElement("a-camera");

    camera.setAttribute("position", "0 0 0");
    camera.setAttribute(
        "look-controls",
        "enabled:false"
    );

    scene.appendChild(camera);
}


/* =========================
   ساخت ۳۰ Target
========================= */

function createTargets() {

    for (let i = 0; i < selectedGroup.count; i++) {

        const target = document.createElement(
            "a-entity"
        );

        target.setAttribute(
            "mindar-image-target",
            "targetIndex:" + i
        );


        /* =========================
           ویدئو
        ========================= */

        const videoPlane =
            document.createElement("a-video");

        videoPlane.setAttribute(
            "src",
            "#arVideo"
        );

        videoPlane.setAttribute("width", "1");
        videoPlane.setAttribute("height", "1.42");

        target.appendChild(videoPlane);


        /* =========================
           متن بعد از اولین پخش
        ========================= */

        const afterText =
            document.createElement("a-text");

        afterText.classList.add("after-video-text");

        afterText.setAttribute(
            "value",
            "می‌خوای دوستاتو هم سورپرایز کنی؟ 😍👇"
        );

        afterText.setAttribute(
            "align",
            "center"
        );

        afterText.setAttribute(
            "position",
            "0 -0.72 0.03"
        );

        afterText.setAttribute(
            "width",
            "1.8"
        );

        afterText.setAttribute(
            "color",
            "#FFFFFF"
        );

        afterText.setAttribute(
            "visible",
            "false"
        );

        target.appendChild(afterText);


        /* =========================
           Instagram Text
        ========================= */

        const instagramText =
            document.createElement("a-text");

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
            "#FFFFFF"
        );

        target.appendChild(instagramText);


        /* =========================
           Instagram Invisible Zone
        ========================= */

        const instagramZone =
            document.createElement("a-plane");

        instagramZone.classList.add(
            "instagram-zone"
        );

        instagramZone.setAttribute(
            "width",
            "0.70"
        );

        instagramZone.setAttribute(
            "height",
            "0.16"
        );

        instagramZone.setAttribute(
            "position",
            "0 -0.82 0.04"
        );

        instagramZone.setAttribute(
            "material",
            "transparent:true; opacity:0;"
        );

        target.appendChild(instagramZone);


        /* =========================
           Brand Text
        ========================= */

        const brandText =
            document.createElement("a-text");

        brandText.setAttribute(
            "value",
            "سرزمین شگفت‌انگیز"
        );

        brandText.setAttribute(
            "align",
            "center"
        );

        brandText.setAttribute(
            "position",
            "0 -0.92 0.03"
        );

        brandText.setAttribute(
            "width",
            "1.8"
        );

        brandText.setAttribute(
            "color",
            "#FFFFFF"
        );

        target.appendChild(brandText);


        /* =========================
           Share Invisible Zone
        ========================= */

        const shareZone =
            document.createElement("a-plane");

        shareZone.classList.add(
            "share-zone"
        );

        shareZone.setAttribute(
            "width",
            "1.25"
        );

        shareZone.setAttribute(
            "height",
            "0.20"
        );

        shareZone.setAttribute(
            "position",
            "0 -0.92 0.04"
        );

        shareZone.setAttribute(
            "material",
            "transparent:true; opacity:0;"
        );

        target.appendChild(shareZone);


        scene.appendChild(target);
    }
}


/* =========================
   AR Events
========================= */

function setupAR() {

    const video =
        document.querySelector("#arVideo");

    let activeTarget = null;
    let activeIndex = -1;
    let firstPlayFinished = false;

    scene.addEventListener(
        "arReady",
        () => {

            console.log(
                "AR READY -",
                selectedGroup.folder
            );

        }
    );


    /* =========================
       TARGET FOUND
    ========================= */

    scene.addEventListener(
        "targetFound",
        async (event) => {

            const target = event.target;

            const data =
                target.getAttribute(
                    "mindar-image-target"
                );

            if (!data) return;

            const index =
                Number(data.targetIndex);

            console.log(
                "TARGET FOUND:",
                index
            );

            activeTarget = target;
            activeIndex = index;

            firstPlayFinished = false;


            /* همه چیز را متوقف کن */

            video.pause();


            /*
             * شماره واقعی فایل
             *
             * Group1:
             * target 0 -> 01.mp4
             *
             * Group2:
             * target 0 -> 31.mp4
             */

            const fileNumber =
                selectedGroup.startNumber + index;

            const fileName =
                String(fileNumber).padStart(2, "0") +
                ".mp4";

            const videoPath =
                "./" +
                selectedGroup.folder +
                "/" +
                fileName;

            console.log(
                "VIDEO:",
                videoPath
            );


            /*
             * فقط همین ویدئو را لود کن
             */

            try {

                video.pause();

                video.src = videoPath;

                video.load();

                await waitForVideo(video);

                if (activeTarget !== target) {
                    return;
                }

                video.currentTime = 0;

                /*
                 * اول با صدا
                 */

                video.muted = false;

                try {

                    await video.play();

                    console.log(
                        "VIDEO PLAYING:",
                        fileName
                    );

                } catch (error) {

                    console.log(
                        "UNMUTED PLAY FAILED"
                    );

                    /*
                     * اگر مرورگر اجازه صدا نداد،
                     * بدون صدا اجرا شود.
                     */

                    video.muted = true;

                    try {

                        await video.play();

                        console.log(
                            "VIDEO PLAYING MUTED:",
                            fileName
                        );

                    } catch (error2) {

                        console.log(
                            "VIDEO PLAY FAILED:",
                            error2
                        );

                    }
                }


                hideAfterTexts(target);

                watchFirstLoop(
                    video,
                    target
                );

            } catch (error) {

                console.log(
                    "VIDEO LOAD ERROR:",
                    error
                );

            }

        }
    );


    /* =========================
       TARGET LOST
    ========================= */

    scene.addEventListener(
        "targetLost",
        (event) => {

            const target =
                event.target;

            const data =
                target.getAttribute(
                    "mindar-image-target"
                );

            if (!data) return;

            const index =
                Number(data.targetIndex);

            console.log(
                "TARGET LOST:",
                index
            );


            /*
             * فقط ویدئو را متوقف کن.
             *
             * src را حذف نمی‌کنیم
             * تا اسکن دوباره سریع‌تر باشد.
             */

            if (activeTarget === target) {

                video.pause();

                activeTarget = null;
                activeIndex = -1;

            }

        }
    );


    /* =========================
       تشخیص پایان اولین دور
    ========================= */

    function watchFirstLoop(
        currentVideo,
        target
    ) {

        function check() {

            if (
                activeTarget !== target
            ) {
                return;
            }

            if (firstPlayFinished) {
                return;
            }

            if (
                currentVideo.duration &&
                currentVideo.duration > 0 &&
                currentVideo.currentTime >=
                currentVideo.duration - 0.15
            ) {

                firstPlayFinished = true;

                showAfterTexts(target);

                console.log(
                    "FIRST LOOP FINISHED"
                );

                return;
            }

            requestAnimationFrame(check);
        }

        requestAnimationFrame(check);
    }


    /* =========================
       مخفی کردن متن‌ها
    ========================= */

    function hideAfterTexts(target) {

        const texts =
            target.querySelectorAll(
                ".after-video-text"
            );

        texts.forEach(
            (text) => {
                text.setAttribute(
                    "visible",
                    "false"
                );
            }
        );
    }


    /* =========================
       نمایش متن‌ها
    ========================= */

    function showAfterTexts(target) {

        const texts =
            target.querySelectorAll(
                ".after-video-text"
            );

        texts.forEach(
            (text) => {
                text.setAttribute(
                    "visible",
                    "true"
                );
            }
        );
    }


    /* =========================
       Touch
    ========================= */

    document.addEventListener(
        "touchend",
        async (event) => {

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

            if (!touch) return;

            const canvas =
                scene.renderer.domElement;

            const rect =
                canvas.getBoundingClientRect();

            const mouse =
                new THREE.Vector2();

            mouse.x =
                (
                    (touch.clientX - rect.left) /
                    rect.width
                ) * 2 - 1;

            mouse.y =
                -(
                    (touch.clientY - rect.top) /
                    rect.height
                ) * 2 + 1;


            const raycaster =
                new THREE.Raycaster();

            raycaster.setFromCamera(
                mouse,
                scene.camera
            );


            /* =========================
               Instagram
            ========================= */

            const instagramZone =
                activeTarget.querySelector(
                    ".instagram-zone"
                );

            if (instagramZone) {

                const mesh =
                    instagramZone.getObject3D(
                        "mesh"
                    );

                if (mesh) {

                    const hits =
                        raycaster.intersectObject(
                            mesh,
                            true
                        );

                    if (hits.length > 0) {

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


            /* =========================
               Share
            ========================= */

            const shareZone =
                activeTarget.querySelector(
                    ".share-zone"
                );

            if (shareZone) {

                const mesh =
                    shareZone.getObject3D(
                        "mesh"
                    );

                if (mesh) {

                    const hits =
                        raycaster.intersectObject(
                            mesh,
                            true
                        );

                    if (hits.length > 0) {

                        const shareText =
                            "یه چیز خیلی باحال پیدا کردم! 😍📚 " +
                            "فکر کن یه دفتر معمولی رو با دوربین گوشیت بگیری و یهو زنده بشه! 🤯✨ " +
                            "شخصیت روی دفتر شروع می‌کنه به حرکت و انگار خود دفتر جون می‌گیره! 😍 " +
                            "اگه کنجکاوی ببینی چطوریه، این لینک رو باز کن و دوربین گوشیت رو روی دفتر بگیر 👇 " +
                            "بعدش حتماً یکی از دوستات رو هم سورپرایز کن! 😉🔥";


                        if (navigator.share) {

                            try {

                                await navigator.share({
                                    title: "Sarzamin AR",
                                    text: shareText,
                                    url: window.location.href
                                });

                            } catch (error) {

                                console.log(
                                    "Share cancelled"
                                );

                            }

                        } else {

                            try {

                                await navigator.clipboard.writeText(
                                    shareText +
                                    "\n" +
                                    window.location.href
                                );

                                alert(
                                    "متن آماده شد و کپی شد 😊"
                                );

                            } catch (error) {

                                console.log(
                                    "Clipboard error:",
                                    error
                                );

                            }
                        }

                        return;
                    }
                }
            }

        },
        {
            passive: true
        }
    );
}


/* =========================
   منتظر آماده شدن ویدئو
========================= */

function waitForVideo(video) {

    return new Promise(
        (resolve, reject) => {

            /*
             * اگر قبلاً آماده است
             */

            if (video.readyState >= 2) {

                resolve();
                return;
            }


            let finished = false;


            function done() {

                if (finished) return;

                finished = true;

                cleanup();

                resolve();
            }


            function error() {

                if (finished) return;

                finished = true;

                cleanup();

                reject(
                    new Error(
                        "Video failed to load"
                    )
                );
            }


            function cleanup() {

                video.removeEventListener(
                    "loadeddata",
                    done
                );

                video.removeEventListener(
                    "canplay",
                    done
                );

                video.removeEventListener(
                    "error",
                    error
                );
            }


            video.addEventListener(
                "loadeddata",
                done,
                {
                    once: true
                }
            );

            video.addEventListener(
                "canplay",
                done,
                {
                    once: true
                }
            );

            video.addEventListener(
                "error",
                error,
                {
                    once: true
                }
            );

        }
    );
}
