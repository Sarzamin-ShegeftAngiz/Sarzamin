// ==========================================
// SARZAMIN AR - APP.JS
// ==========================================

let scene = null;
let video = null;

let activeTarget = null;
let activePlane = null;


// ==========================================
// GROUPS
// ==========================================

const GROUPS = {

    Group1: {
        title: "گروه اول",
        mind: "./Group1/targets.mind",
        first: 1,
        last: 30
    },

    Group2: {
        title: "گروه دوم",
        mind: "./Group2/targets.mind",
        first: 31,
        last: 60
    },

    Group3: {
        title: "گروه سوم",
        mind: "./Group3/targets.mind",
        first: 61,
        last: 90
    }

};


// ==========================================
// START APP
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    createAppRoot();

    showCategories();

});


// ==========================================
// APP ROOT
// ==========================================

function createAppRoot() {

    let root = document.getElementById("appRoot");

    if (!root) {

        root = document.createElement("div");

        root.id = "appRoot";

        document.body.appendChild(root);

    }

    return root;
}


// ==========================================
// CLEAR APP
// ==========================================

function clearPage() {

    try {

        if (
            scene &&
            scene.systems &&
            scene.systems["mindar-image-system"]
        ) {

            scene.systems["mindar-image-system"].stop();

        }

    } catch (e) {}

    activeTarget = null;
    activePlane = null;

    if (video) {

        try {

            video.pause();

            video.removeAttribute("src");

            video.load();

        } catch (e) {}

        video.remove();

        video = null;

    }

    if (scene) {

        try {

            scene.remove();

        } catch (e) {}

        scene = null;

    }

    const root = document.getElementById("appRoot");

    if (root) {

        root.innerHTML = "";

    }

    const oldCameraButton = document.getElementById("openCamera");

    if (oldCameraButton) {

        oldCameraButton.remove();

    }

    const oldChange = document.getElementById("changeGroup");

    if (oldChange) {

        oldChange.remove();

    }

}


// ==========================================
// GROUP SELECTION
// ==========================================

function showCategories() {

    clearPage();

    const root = createAppRoot();

    root.style.width = "100%";

    root.style.minHeight = "100vh";

    root.innerHTML = "";


    const title = document.createElement("div");

    title.className = "gallery-title";

    title.textContent = "سرزمین شگفت‌انگیز";

    root.appendChild(title);


    const subtitle = document.createElement("div");

    subtitle.style.textAlign = "center";

    subtitle.style.fontSize = "16px";

    subtitle.style.marginBottom = "20px";

    subtitle.textContent = "یک گروه را انتخاب کنید";

    root.appendChild(subtitle);


    Object.keys(GROUPS).forEach(groupName => {

        const button = document.createElement("button");

        button.textContent = GROUPS[groupName].title;

        button.style.display = "block";

        button.style.width = "calc(100% - 30px)";

        button.style.margin = "12px auto";

        button.style.padding = "18px";

        button.style.border = "none";

        button.style.borderRadius = "16px";

        button.style.background = "#111";

        button.style.color = "white";

        button.style.fontSize = "18px";

        button.style.fontWeight = "bold";

        button.style.cursor = "pointer";


        button.onclick = () => {

            showGallery(groupName);

        };


        root.appendChild(button);

    });

}


// ==========================================
// GALLERY
// ==========================================

function showGallery(groupName) {

    clearPage();

    const root = createAppRoot();

    root.innerHTML = "";

    root.id = "galleryPage";


    const config = GROUPS[groupName];


    // عنوان

    const title = document.createElement("div");

    title.className = "gallery-title";

    title.textContent = config.title;

    root.appendChild(title);


    // شبکه عکس‌ها

    const grid = document.createElement("div");

    grid.className = "gallery-grid";

    root.appendChild(grid);


    // ======================================
    // CREATE 30 IMAGES
    // ======================================

    for (
        let number = config.first;
        number <= config.last;
        number++
    ) {

        const filename = String(number).padStart(2, "0");

        let extension = "jpg";


        // فایل‌های PNG

        if (
            number === 19 ||
            number === 24 ||
            number === 26
        ) {

            extension = "png";

        }


        const img = document.createElement("img");

        img.className = "gallery-image";

        img.src =
            `./${groupName}/${filename}.${extension}`;

        img.alt = "";

        img.draggable = false;


        // ==================================
        // IMPORTANT:
        // IMAGE IS NOT CLICKABLE
        // ==================================

        img.onclick = (event) => {

            event.preventDefault();

        };


        grid.appendChild(img);

    }


    // ======================================
    // CAMERA BUTTON
    // ======================================

    const cameraButton = document.createElement("button");

    cameraButton.id = "openCamera";

    cameraButton.textContent = "📷 باز کردن دوربین";


    cameraButton.onclick = () => {

        startAR(groupName);

    };


    document.body.appendChild(cameraButton);

}


// ==========================================
// START AR
// ==========================================

function startAR(groupName) {

    clearPage();

    const config = GROUPS[groupName];


    // ======================================
    // VIDEO ELEMENT
    // ======================================

    video = document.createElement("video");

    video.id = "arVideo";

    video.setAttribute("playsinline", "");

    video.setAttribute("webkit-playsinline", "");

    video.autoplay = false;

    video.loop = false;

    video.muted = true;

    video.playsInline = true;

    video.preload = "auto";


    video.style.position = "fixed";

    video.style.width = "1px";

    video.style.height = "1px";

    video.style.opacity = "0";

    video.style.pointerEvents = "none";

    video.style.left = "-10px";

    video.style.top = "-10px";


    document.body.appendChild(video);


    // ======================================
    // A-FRAME SCENE
    // ======================================

    scene = document.createElement("a-scene");


    scene.setAttribute(
        "mindar-image",
        `
        imageTargetSrc: ${config.mind};
        autoStart: true;
        uiLoading: no;
        uiScanning: yes;
        uiError: yes;
        warmupTolerance: 3;
        missTolerance: 2;
        filterMinCF: 0.0001;
        filterBeta: 0.001;
        `
    );


    scene.setAttribute("embedded", "");

    scene.setAttribute(
        "renderer",
        "colorManagement: true; physicallyCorrectLights: true;"
    );

    scene.setAttribute(
        "color-space",
        "sRGB"
    );

    scene.setAttribute(
        "vr-mode-ui",
        "enabled: false"
    );

    scene.setAttribute(
        "device-orientation-permission-ui",
        "enabled: false"
    );


    // ======================================
    // SCENE STYLE
    // ======================================

    scene.style.position = "fixed";

    scene.style.left = "0";

    scene.style.top = "0";

    scene.style.width = "100%";

    scene.style.height = "100%";

    scene.style.zIndex = "1";

    scene.style.background = "transparent";


    // ======================================
    // CAMERA
    // ======================================

    const camera = document.createElement("a-camera");

    camera.setAttribute(
        "position",
        "0 0 0"
    );

    camera.setAttribute(
        "look-controls",
        "enabled: false"
    );

    camera.setAttribute(
        "active",
        "true"
    );

    camera.setAttribute(
        "cursor",
        "fuse: false; rayOrigin: mouse;"
    );

    camera.setAttribute(
        "raycaster",
        "near: 0; far: 100; objects: .arLink;"
    );


    scene.appendChild(camera);


    // ======================================
    // CREATE 30 TARGETS
    // ======================================

    for (let i = 0; i < 30; i++) {

        createTarget(
            scene,
            config,
            groupName,
            i
        );

    }


    document.body.appendChild(scene);


    // ======================================
    // CHANGE GROUP BUTTON
    // ======================================

    const change = document.createElement("button");

    change.id = "changeGroup";

    change.textContent = "🔄 تغییر گروه";


    change.onclick = () => {

        try {

            if (
                scene &&
                scene.systems &&
                scene.systems["mindar-image-system"]
            ) {

                scene.systems[
                    "mindar-image-system"
                ].stop();

            }

        } catch (e) {}


        showCategories();

    };


    document.body.appendChild(change);


    // ======================================
    // EVENTS
    // ======================================

    scene.addEventListener(
        "loaded",
        () => {

            console.log(
                "A-Frame loaded:",
                groupName
            );

        }
    );


    scene.addEventListener(
        "arReady",
        () => {

            console.log(
                "AR READY:",
                groupName
            );

        }
    );


    scene.addEventListener(
        "arError",
        event => {

            console.log(
                "AR ERROR:",
                event
            );

        }
    );

}


// ==========================================
// CREATE TARGET
// ==========================================

function createTarget(
    scene,
    config,
    groupName,
    index
) {

    const target =
        document.createElement(
            "a-entity"
        );


    target.setAttribute(
        "mindar-image-target",
        `targetIndex: ${index};`
    );


    // ======================================
    // VIDEO PLANE
    // ======================================

    const plane =
        document.createElement(
            "a-video"
        );


    plane.classList.add(
        "arVideoPlane"
    );


    plane.setAttribute(
        "src",
        "#arVideo"
    );


    plane.setAttribute(
        "width",
        "1"
    );


    plane.setAttribute(
        "height",
        "1.42"
    );


    plane.setAttribute(
        "position",
        "0 0 0.01"
    );


    plane.setAttribute(
        "visible",
        "false"
    );


    target.appendChild(plane);


    // ======================================
    // INSTAGRAM TRANSPARENT CLICK AREA
    // ======================================

    const insta =
        document.createElement(
            "a-plane"
        );


    insta.classList.add(
        "arLink",
        "instagram-zone"
    );


    insta.setAttribute(
        "width",
        "0.55"
    );


    insta.setAttribute(
        "height",
        "0.16"
    );


    insta.setAttribute(
        "position",
        "-0.28 0.61 0.06"
    );


    insta.setAttribute(
        "material",
        "transparent: true; opacity: 0; side: double;"
    );


    target.appendChild(insta);


    // ======================================
    // INSTAGRAM CLICK
    // ======================================

    insta.addEventListener(
        "click",
        () => {

            console.log(
                "Instagram clicked"
            );


            const appURL =
                "instagram://user?username=SarzaminAr";


            const webURL =
                "https://www.instagram.com/SarzaminAr/";


            // ابتدا اپ اینستاگرام

            window.location.href =
                appURL;


            // اگر اپ باز نشد، سایت

            setTimeout(
                () => {

                    window.location.href =
                        webURL;

                },
                1500
            );

        }
    );


    // ======================================
    // SHARE TEXT
    // ======================================

    const shareText =
        document.createElement(
            "a-text"
        );


    shareText.setAttribute(
        "value",
        "سرزمین شگفت‌انگیز"
    );


    shareText.setAttribute(
        "align",
        "center"
    );


    shareText.setAttribute(
        "anchor",
        "center"
    );


    shareText.setAttribute(
        "baseline",
        "center"
    );


    shareText.setAttribute(
        "position",
        "0 -0.88 0.06"
    );


    shareText.setAttribute(
        "width",
        "1.8"
    );


    shareText.setAttribute(
        "color",
        "white"
    );


    // متن خودش قابل کلیک نیست

    target.appendChild(
        shareText
    );


    // ======================================
    // TRANSPARENT SHARE BUTTON
    // روی نوشته قرار می‌گیرد
    // ======================================

    const share =
        document.createElement(
            "a-plane"
        );


    share.classList.add(
        "arLink",
        "share-zone"
    );


    share.setAttribute(
        "width",
        "0.95"
    );


    share.setAttribute(
        "height",
        "0.18"
    );


    share.setAttribute(
        "position",
        "0 -0.88 0.08"
    );


    share.setAttribute(
        "material",
        "transparent: true; opacity: 0; side: double;"
    );


    target.appendChild(
        share
    );


    // ======================================
    // SHARE CLICK
    // ======================================

    share.addEventListener(
        "click",
        async () => {

            console.log(
                "Share clicked"
            );


            const message =
                "😍 من یه دفتر جادویی پیدا کردم!\n\n" +
                "دوربین گوشیت رو روی دفتر بگیر " +
                "تا ببینی چطور زنده میشه! ✨📚\n\n" +
                "سرزمین شگفت‌انگیز ✨\n" +
                "@SarzaminAr";


            // =================================
            // NATIVE SHARE
            // =================================

            if (
                navigator.share
            ) {

                try {

                    await navigator.share({

                        title:
                            "سرزمین شگفت‌انگیز",

                        text:
                            message,

                        url:
                            window.location.href

                    });

                    console.log(
                        "Share successful"
                    );

                }

                catch (error) {

                    console.log(
                        "Share cancelled:",
                        error
                    );

                }

            }

            // =================================
            // FALLBACK
            // =================================

            else {

                try {

                    await navigator.clipboard.writeText(
                        message
                    );


                    alert(
                        "متن آماده کپی شد 😊\n\n" +
                        "حالا آن را برای دوستت بفرست."
                    );

                }

                catch (error) {

                    alert(
                        message
                    );

                }

            }

        }
    );


    // ======================================
    // TARGET FOUND
    // ======================================

    target.addEventListener(
        "targetFound",
        () => {

            console.log(
                "TARGET FOUND:",
                index
            );


            activeTarget =
                target;


            activePlane =
                plane;


            // مخفی کردن همه ویدیوها

            document
                .querySelectorAll(
                    ".arVideoPlane"
                )
                .forEach(
                    p => {

                        p.setAttribute(
                            "visible",
                            "false"
                        );

                    }
                );


            // توقف ویدیوی قبلی

            try {

                video.pause();

                video.currentTime = 0;

            }

            catch (e) {}


            // =================================
            // VIDEO NUMBER
            // =================================

            const videoNumber =
                config.first + index;


            const filename =
                String(videoNumber)
                    .padStart(2, "0");


            const src =
                `./${groupName}/${filename}.mp4`;


            console.log(
                "VIDEO:",
                src
            );


            // =================================
            // LOAD VIDEO
            // =================================

            video.src =
                src;


            video.load();


            // =================================
            // PLAY
            // =================================

            const playVideo =
                () => {

                    if (
                        activeTarget !==
                        target
                    ) {

                        return;

                    }


                    video
                        .play()
                        .then(
                            () => {

                                if (
                                    activeTarget ===
                                    target
                                ) {

                                    plane.setAttribute(
                                        "visible",
                                        "true"
                                    );

                                }

                            }
                        )
                        .catch(
                            error => {

                                console.log(
                                    "VIDEO PLAY ERROR:",
                                    error
                                );

                            }
                        );

                };


            if (
                video.readyState >= 3
            ) {

                playVideo();

            }

            else {

                video.addEventListener(
                    "canplay",
                    playVideo,
                    {
                        once: true
                    }
                );

            }

        }
    );


    // ======================================
    // TARGET LOST
    // ======================================

    target.addEventListener(
        "targetLost",
        () => {

            console.log(
                "TARGET LOST:",
                index
            );


            if (
                activeTarget ===
                target
            ) {

                activeTarget =
                    null;


                if (
                    activePlane
                ) {

                    activePlane.setAttribute(
                        "visible",
                        "false"
                    );

                }


                try {

                    video.pause();

                }

                catch (e) {}

            }

        }
    );


    scene.appendChild(
        target
    );

}


// ==========================================
// PREVENT ACCIDENTAL PAGE SCROLL IN AR
// ==========================================

document.addEventListener(
    "touchmove",
    event => {

        if (scene) {

            event.preventDefault();

        }

    },
    {
        passive: false
    }
);
