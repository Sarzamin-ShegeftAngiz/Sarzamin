// ==========================================
// SARZAMIN AR
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
// START
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    createMain();

    showCategories();

});


// ==========================================
// MAIN
// ==========================================

function createMain() {

    let main = document.getElementById("mainApp");

    if (!main) {

        main = document.createElement("div");

        main.id = "mainApp";

        document.body.appendChild(main);

    }

    return main;

}


// ==========================================
// CLEAR
// ==========================================

function clearPage() {

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


    activeTarget = null;
    activePlane = null;


    if (scene) {

        try {
            scene.remove();
        } catch (e) {}

        scene = null;

    }


    if (video) {

        try {

            video.pause();

            video.removeAttribute("src");

            video.load();

            video.remove();

        } catch (e) {}

        video = null;

    }


    document
        .querySelectorAll(
            "#openCamera, #changeGroup"
        )
        .forEach(el => el.remove());


    const main =
        document.getElementById("mainApp");

    if (main) {

        main.innerHTML = "";

        main.style.display = "";

    }


    // پاک کردن هر scene قدیمی

    document
        .querySelectorAll("a-scene")
        .forEach(el => {

            try {
                el.remove();
            } catch (e) {}

        });

}


// ==========================================
// GROUP MENU
// ==========================================

function showCategories() {

    clearPage();

    const main = createMain();

    main.className = "category-page";


    const title =
        document.createElement("div");

    title.className = "main-title";

    title.textContent =
        "✨ سرزمین شگفت‌انگیز ✨";

    main.appendChild(title);


    const subtitle =
        document.createElement("div");

    subtitle.className = "main-subtitle";

    subtitle.textContent =
        "یک گروه را انتخاب کنید";

    main.appendChild(subtitle);


    const groupContainer =
        document.createElement("div");

    groupContainer.className =
        "group-buttons";

    main.appendChild(groupContainer);


    Object.keys(GROUPS).forEach(groupName => {

        const button =
            document.createElement("button");

        button.className =
            "group-button";

        button.textContent =
            GROUPS[groupName].title;


        button.onclick = () => {

            showGallery(groupName);

        };


        groupContainer.appendChild(button);

    });

}


// ==========================================
// GALLERY
// ==========================================

function showGallery(groupName) {

    clearPage();

    const main = createMain();

    main.className = "gallery-page";


    const config = GROUPS[groupName];


    const header =
        document.createElement("div");

    header.className =
        "gallery-header";


    const title =
        document.createElement("div");

    title.className =
        "gallery-title";

    title.textContent =
        config.title;


    header.appendChild(title);

    main.appendChild(header);


    // ======================================
    // GRID
    // ======================================

    const grid =
        document.createElement("div");

    grid.className =
        "gallery-grid";

    main.appendChild(grid);


    // ======================================
    // ALL 30 IMAGES
    // ======================================

    for (
        let number = config.first;
        number <= config.last;
        number++
    ) {

        const filename =
            String(number).padStart(2, "0");


        let extension = "jpg";


        if (
            number === 19 ||
            number === 24 ||
            number === 26
        ) {

            extension = "png";

        }


        const card =
            document.createElement("div");

        card.className =
            "image-card";


        const img =
            document.createElement("img");

        img.className =
            "gallery-image";


        img.src =
            `./${groupName}/${filename}.${extension}`;


        img.alt = "";

        img.loading = "lazy";

        img.draggable = false;


        // عکس هیچ کاری انجام نمی‌دهد

        img.onclick = event => {

            event.preventDefault();

        };


        card.appendChild(img);

        grid.appendChild(card);

    }


    // ======================================
    // CAMERA BUTTON
    // ======================================

    const cameraButton =
        document.createElement("button");

    cameraButton.id =
        "openCamera";

    cameraButton.textContent =
        "📷 باز کردن دوربین";


    cameraButton.onclick = () => {

        startAR(groupName);

    };


    document.body.appendChild(
        cameraButton
    );

}


// ==========================================
// START AR
// ==========================================

function startAR(groupName) {

    console.log(
        "START AR:",
        groupName
    );


    // ======================================
    // HIDE GALLERY COMPLETELY
    // ======================================

    const main =
        document.getElementById(
            "mainApp"
        );


    if (main) {

        main.style.display = "none";

    }


    const cameraButton =
        document.getElementById(
            "openCamera"
        );


    if (cameraButton) {

        cameraButton.remove();

    }


    // ======================================
    // REMOVE OLD AR
    // ======================================

    if (scene) {

        try {

            if (
                scene.systems &&
                scene.systems[
                    "mindar-image-system"
                ]
            ) {

                scene.systems[
                    "mindar-image-system"
                ].stop();

            }

        } catch (e) {}


        try {
            scene.remove();
        } catch (e) {}

        scene = null;

    }


    if (video) {

        try {

            video.pause();

            video.removeAttribute("src");

            video.load();

            video.remove();

        } catch (e) {}

        video = null;

    }


    const config =
        GROUPS[groupName];


    // ======================================
    // VIDEO ELEMENT
    // ======================================

    video =
        document.createElement("video");


    video.id =
        "arVideo";


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

    video.autoplay = false;

    video.loop = false;

    video.preload = "auto";


    video.style.position =
        "fixed";

    video.style.width =
        "1px";

    video.style.height =
        "1px";

    video.style.left =
        "-20px";

    video.style.top =
        "-20px";

    video.style.opacity =
        "0";

    video.style.pointerEvents =
        "none";


    document.body.appendChild(
        video
    );


    // ======================================
    // CREATE A-FRAME SCENE
    // ======================================

    scene =
        document.createElement(
            "a-scene"
        );


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


    // مهم:
    // embedded عمداً استفاده نمی‌کنیم


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
    // FULL SCREEN SCENE
    // ======================================

    scene.style.position =
        "fixed";

    scene.style.top =
        "0";

    scene.style.left =
        "0";

    scene.style.width =
        "100vw";

    scene.style.height =
        "100vh";

    scene.style.zIndex =
        "99999";

    scene.style.margin =
        "0";

    scene.style.padding =
        "0";

    scene.style.background =
        "transparent";

    scene.style.display =
        "block";


    // ======================================
    // CAMERA
    // ======================================

    const camera =
        document.createElement(
            "a-camera"
        );


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


    scene.appendChild(
        camera
    );


    // ======================================
    // CREATE 30 TARGETS
    // ======================================

    for (
        let i = 0;
        i < 30;
        i++
    ) {

        createTarget(
            scene,
            config,
            groupName,
            i
        );

    }


    // ======================================
    // ADD SCENE TO BODY
    // ======================================

    document.body.appendChild(
        scene
    );


    // ======================================
    // FORCE FULL SIZE
    // ======================================

    requestAnimationFrame(() => {

        if (!scene) return;


        scene.style.width =
            window.innerWidth + "px";

        scene.style.height =
            window.innerHeight + "px";


        const canvas =
            scene.querySelector(
                "canvas"
            );


        if (canvas) {

            canvas.style.position =
                "fixed";

            canvas.style.top =
                "0";

            canvas.style.left =
                "0";

            canvas.style.width =
                window.innerWidth + "px";

            canvas.style.height =
                window.innerHeight + "px";

        }

    });


    // ======================================
    // RESIZE
    // ======================================

    window.addEventListener(
        "resize",
        resizeAR,
        {
            passive: true
        }
    );


    // ======================================
    // CHANGE GROUP
    // ======================================

    const change =
        document.createElement(
            "button"
        );


    change.id =
        "changeGroup";


    change.textContent =
        "🔄 تغییر گروه";


    change.onclick = () => {

        try {

            if (
                scene &&
                scene.systems &&
                scene.systems[
                    "mindar-image-system"
                ]
            ) {

                scene.systems[
                    "mindar-image-system"
                ].stop();

            }

        } catch (e) {}


        window.removeEventListener(
            "resize",
            resizeAR
        );


        showCategories();

    };


    document.body.appendChild(
        change
    );


    // ======================================
    // EVENTS
    // ======================================

    scene.addEventListener(
        "loaded",
        () => {

            console.log(
                "A-FRAME LOADED"
            );

            resizeAR();

        }
    );


    scene.addEventListener(
        "arReady",
        () => {

            console.log(
                "AR READY:",
                groupName
            );

            resizeAR();

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
// RESIZE AR
// ==========================================

function resizeAR() {

    if (!scene) return;


    const width =
        window.innerWidth;


    const height =
        window.innerHeight;


    scene.style.width =
        width + "px";


    scene.style.height =
        height + "px";


    const canvas =
        scene.querySelector(
            "canvas"
        );


    if (canvas) {

        canvas.style.position =
            "fixed";

        canvas.style.top =
            "0";

        canvas.style.left =
            "0";

        canvas.style.width =
            width + "px";

        canvas.style.height =
            height + "px";

    }

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


    target.appendChild(
        plane
    );


    // ======================================
    // INSTAGRAM CLICK ZONE
    // ======================================

    const insta =
        document.createElement(
            "a-plane"
        );


    insta.classList.add(
        "arLink"
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


    target.appendChild(
        insta
    );


    insta.addEventListener(
        "click",
        () => {

            const appURL =
                "instagram://user?username=SarzaminAr";


            const webURL =
                "https://www.instagram.com/SarzaminAr/";


            window.location.href =
                appURL;


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


    target.appendChild(
        shareText
    );


    // ======================================
    // SHARE CLICK ZONE
    // ======================================

    const share =
        document.createElement(
            "a-plane"
        );


    share.classList.add(
        "arLink"
    );


    share.setAttribute(
        "width",
        "1.05"
    );


    share.setAttribute(
        "height",
        "0.20"
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
    // SHARE
    // ======================================

    share.addEventListener(
        "click",
        async () => {

            const message =
                "😍 من یه دفتر جادویی پیدا کردم!\n\n" +
                "دوربین گوشیت رو روی دفتر بگیر " +
                "تا ببینی چطور زنده میشه! ✨📚\n\n" +
                "سرزمین شگفت‌انگیز ✨\n" +
                "@SarzaminAr";


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

                } catch (error) {

                    console.log(
                        "Share cancelled:",
                        error
                    );

                }

            } else {

                try {

                    await navigator.clipboard.writeText(
                        message
                    );


                    alert(
                        "متن آماده کپی شد 😊"
                    );

                } catch (error) {

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


            try {

                video.pause();

                video.currentTime = 0;

            } catch (e) {}


            const videoNumber =
                config.first + index;


            const filename =
                String(videoNumber)
                    .padStart(
                        2,
                        "0"
                    );


            const src =
                `./${groupName}/${filename}.mp4`;


            console.log(
                "VIDEO:",
                src
            );


            video.src =
                src;


            video.load();


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

            } else {

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

                } catch (e) {}

            }

        }
    );


    scene.appendChild(
        target
    );

}
