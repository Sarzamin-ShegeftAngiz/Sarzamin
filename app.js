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
   برگشت به انتخاب گروه
========================= */

window.changeGroup = function () {

    console.log("CHANGE GROUP");

    if (scene) {

        const arSystem =
            scene.systems["mindar-image"];

        if (arSystem) {
            try {
                arSystem.stop();
            } catch (e) {
                console.log("AR STOP ERROR:", e);
            }
        }

        scene.remove();
        scene = null;
    }

    const oldButton =
        document.getElementById("changeGroupButton");

    if (oldButton) {
        oldButton.remove();
    }

    const menu =
        document.getElementById("groupMenu");

    if (menu) {
        menu.style.display = "flex";
    }

    const loadingText =
        document.getElementById("loadingText");

    if (loadingText) {
        loadingText.style.display = "none";
    }
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
        "colorManagement:true; alpha:true;"
    );

    document.body.appendChild(scene);

    createAssets();
    createCamera();
    createChangeGroupButton();
    createTargets();
    setupAR();

    scene.addEventListener("loaded", () => {

        console.log(
            "SCENE LOADED:",
            selectedGroup.folder
        );

        const loadingText =
            document.getElementById("loadingText");

        if (loadingText) {
            loadingText.style.display = "none";
        }
    });
}


/* =========================
   دکمه تغییر گروه
========================= */

function createChangeGroupButton() {

    const button =
        document.createElement("button");

    button.id = "changeGroupButton";

    button.innerHTML = "🔄 تغییر گروه";

    button.onclick = function () {
        window.changeGroup();
    };

    button.style.position = "fixed";
    button.style.top = "15px";
    button.style.right = "15px";
    button.style.zIndex = "999999";

    button.style.padding = "10px 15px";
    button.style.border = "none";
    button.style.borderRadius = "12px";

    button.style.background =
        "rgba(0,0,0,0.65)";

    button.style.color = "#fff";

    button.style.fontSize = "14px";
    button.style.fontFamily = "sans-serif";

    document.body.appendChild(button);
}


/* =========================
   Assets
========================= */

function createAssets() {

    const assets =
        document.createElement("a-assets");

    /*
     * فقط یک ویدئو داریم.
     * هیچ ویدئویی در شروع دانلود نمی‌شود.
     */

    const video =
        document.createElement("video");

    video.id = "arVideo";

    video.setAttribute(
        "preload",
        "none"
    );

    video.setAttribute(
        "loop",
        ""
    );

    video.setAttribute(
        "muted",
        ""
    );

    video.setAttribute(
        "playsinline",
        ""
    );

    video.setAttribute(
        "webkit-playsinline",
        ""
    );

    video.playsInline = true;
    video.muted = true;

    assets.appendChild(video);

    scene.appendChild(assets);
}


/* =========================
   Camera
========================= */

function createCamera() {

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

    scene.appendChild(camera);
}


/* =========================
   Targets
========================= */

function createTargets() {

    for (
        let i = 0;
        i < selectedGroup.count;
        i++
    ) {

        const target =
            document.createElement(
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
            document.createElement(
                "a-video"
            );

        videoPlane.classList.add(
            "video-plane"
        );

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

        /*
         * تا آماده شدن ویدئوی جدید
         * فریم قبلی دیده نشود.
         */

        videoPlane.setAttribute(
            "visible",
            "false"
        );

        target.appendChild(
            videoPlane
        );


        /* =========================
           متن اول
        ========================= */

        const afterText =
            document.createElement(
                "a-text"
            );

        afterText.classList.add(
            "after-video-text"
        );

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
            "0 -0.72 0.05"
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

        target.appendChild(
            afterText
        );


        /* =========================
           Instagram Text
        ========================= */

        const instagramText =
            document.createElement(
                "a-text"
            );

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
            "0 -0.82 0.05"
        );

        instagramText.setAttribute(
            "width",
            "1.8"
        );

        instagramText.setAttribute(
            "color",
            "#FFFFFF"
        );

        target.appendChild(
            instagramText
        );


        /* =========================
           Instagram Hitbox
        ========================= */

        const instagramZone =
            document.createElement(
                "a-plane"
            );

        instagramZone.classList.add(
            "instagram-zone"
        );

        instagramZone.setAttribute(
            "width",
            "1.10"
        );

        instagramZone.setAttribute(
            "height",
            "0.22"
        );

        instagramZone.setAttribute(
            "position",
            "0 -0.82 0.10"
        );

        /*
         * تقریباً نامرئی ولی قابل Raycast
         */

        instagramZone.setAttribute(
            "material",
            "transparent:true; opacity:0.001; side:double;"
        );

        target.appendChild(
            instagramZone
        );


        /* =========================
           متن سرزمین
        ========================= */

        const brandText =
            document.createElement(
                "a-text"
            );

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
            "0 -0.94 0.05"
        );

        brandText.setAttribute(
            "width",
            "1.8"
        );

        brandText.setAttribute(
            "color",
            "#FFFFFF"
        );

        target.appendChild(
            brandText
        );


        /* =========================
           Share Hitbox
        ========================= */

        const shareZone =
            document.createElement(
                "a-plane"
            );

        shareZone.classList.add(
            "share-zone"
        );

        shareZone.setAttribute(
            "width",
            "1.35"
        );

        shareZone.setAttribute(
            "height",
            "0.24"
        );

        shareZone.setAttribute(
            "position",
            "0 -0.94 0.10"
        );

        shareZone.setAttribute(
            "material",
            "transparent:true; opacity:0.001; side:double;"
        );

        target.appendChild(
            shareZone
        );


        scene.appendChild(
            target
        );
    }
}


/* =========================
   AR
========================= */

function setupAR() {

    const video =
        document.querySelector(
            "#arVideo"
        );

    let activeTarget = null;
    let activeIndex = -1;
    let activeVideoPlane = null;

    let firstPlayFinished = false;


    /* =========================
       AR READY
    ========================= */

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

            const target =
                event.target;

            const data =
                target.getAttribute(
                    "mindar-image-target"
                );

            if (!data) return;

            const index =
                Number(
                    data.targetIndex
                );

            console.log(
                "TARGET FOUND:",
                index
            );


            activeTarget = target;
            activeIndex = index;

            firstPlayFinished = false;


            /* =========================
               مخفی کردن تمام ویدئوها
            ========================= */

            const allPlanes =
                scene.querySelectorAll(
                    ".video-plane"
                );

            allPlanes.forEach(
                plane => {
                    plane.setAttribute(
                        "visible",
                        "false"
                    );
                }
            );


            /*
             * ویدئوی قبلی فوراً متوقف شود
             */

            video.pause();

            video.currentTime = 0;


            const videoPlane =
                target.querySelector(
                    ".video-plane"
                );

            activeVideoPlane =
                videoPlane;


            /*
             * شماره فایل
             */

            const fileNumber =
                selectedGroup.startNumber +
                index;

            const fileName =
                String(
                    fileNumber
                ).padStart(
                    2,
                    "0"
                ) + ".mp4";

            const videoPath =
                "./" +
                selectedGroup.folder +
                "/" +
                fileName;


            console.log(
                "LOADING:",
                videoPath
            );


            try {

                /*
                 * منبع قبلی را کاملاً پاک می‌کنیم.
                 * این کار جلوی نمایش ۲ ثانیه
                 * از فیلم قبلی را می‌گیرد.
                 */

                video.removeAttribute(
                    "src"
                );

                video.load();


                /*
                 * منبع جدید
                 */

                video.src =
                    videoPath;

                video.load();


                await waitForVideo(
                    video
                );


                /*
                 * اگر در همین فاصله
                 * Target عوض شده باشد،
                 * دیگر اجرا نکن.
                 */

                if (
                    activeTarget !== target
                ) {
                    return;
                }


                video.currentTime = 0;


                /*
                 * اول با صدا
                 */

                video.muted = false;


                try {

                    await video.play();

                } catch (error) {

                    console.log(
                        "Sound play failed - muted"
                    );

                    video.muted = true;

                    try {

                        await video.play();

                    } catch (error2) {

                        console.log(
                            "VIDEO PLAY ERROR:",
                            error2
                        );
                    }
                }


                /*
                 * فقط حالا ویدئوی جدید
                 * روی Target دیده شود.
                 */

                if (
                    activeVideoPlane ===
                    videoPlane
                ) {

                    videoPlane.setAttribute(
                        "visible",
                        "true"
                    );
                }


                hideAfterTexts(
                    target
                );


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
                Number(
                    data.targetIndex
                );

            console.log(
                "TARGET LOST:",
                index
            );


            if (
                activeTarget === target
            ) {

                video.pause();

                video.currentTime = 0;

                if (activeVideoPlane) {

                    activeVideoPlane.setAttribute(
                        "visible",
                        "false"
                    );
                }

                activeTarget = null;
                activeIndex = -1;
                activeVideoPlane = null;
            }
        }
    );


    /* =========================
       اولین دور ویدئو
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

                showAfterTexts(
                    target
                );

                return;
            }

            requestAnimationFrame(
                check
            );
        }

        requestAnimationFrame(
            check
        );
    }


    /* =========================
       مخفی کردن متن
    ========================= */

    function hideAfterTexts(target) {

        const texts =
            target.querySelectorAll(
                ".after-video-text"
            );

        texts.forEach(
            text => {

                text.setAttribute(
                    "visible",
                    "false"
                );
            }
        );
    }


    /* =========================
       نمایش متن
    ========================= */

    function showAfterTexts(target) {

        const texts =
            target.querySelectorAll(
                ".after-video-text"
            );

        texts.forEach(
            text => {

                text.setAttribute(
                    "visible",
                    "true"
                );
            }
        );
    }


    /* =========================
       لمس
    ========================= */

    document.addEventListener(
        "touchend",
        handleTouch,
        {
            passive: true
        }
    );


    /* =========================
       کلیک
    ========================= */

    document.addEventListener(
        "click",
        handleClick
    );


    function handleTouch(event) {

        if (!activeTarget) {
            return;
        }

        const touch =
            event.changedTouches[0];

        if (!touch) return;

        handleScreenPosition(
            touch.clientX,
            touch.clientY
        );
    }


    function handleClick(event) {

        if (!activeTarget) {
            return;
        }

        handleScreenPosition(
            event.clientX,
            event.clientY
        );
    }


    /* =========================
       Raycast
    ========================= */

    function handleScreenPosition(
        clientX,
        clientY
    ) {

        if (
            !scene.camera ||
            !scene.renderer
        ) {
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
                (clientX - rect.left) /
                rect.width
            ) * 2 - 1;


        mouse.y =
            -(
                (clientY - rect.top) /
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

                    openInstagram();

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

                    shareContent();

                    return;
                }
            }
        }
    }


    /* =========================
       Instagram
    ========================= */

    function openInstagram() {

        const intentURL =
            "intent://www.instagram.com/_u/SarzaminAr/#Intent;" +
            "package=com.instagram.android;" +
            "scheme=https;" +
            "end";


        window.location.href =
            intentURL;
    }


    /* =========================
       Share
    ========================= */

    async function shareContent() {

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
    }
}


/* =========================
   آماده شدن ویدئو
========================= */

function waitForVideo(video) {

    return new Promise(
        (resolve, reject) => {

            if (
                video.readyState >= 2
            ) {

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
                done
            );

            video.addEventListener(
                "canplay",
                done
            );

            video.addEventListener(
                "error",
                error
            );
        }
    );
}
