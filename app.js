const GROUPS = {

    Group1: {
        title: "دفترهای گروه ۱",
        mind: "./Group1/targets.mind",
        start: 1,
        end: 30
    },

    Group2: {
        title: "دفترهای گروه ۲",
        mind: "./Group2/targets.mind",
        start: 31,
        end: 60
    },

    Group3: {
        title: "دفترهای گروه ۳",
        mind: "./Group3/targets.mind",
        start: 61,
        end: 90
    }

};


let currentGroup = null;

let currentScene = null;

let currentVideo = null;


/* =========================================
   شروع برنامه
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    createMain();

    showCategories();

});


/* =========================================
   ساخت صفحه اصلی
========================================= */

function createMain() {

    const old = document.getElementById("mainApp");

    if (old) {
        old.remove();
    }

    const main = document.createElement("div");

    main.id = "mainApp";

    document.body.appendChild(main);

}


/* =========================================
   پاک کردن صفحه
========================================= */

function clearPage() {

    const main = document.getElementById("mainApp");

    if (main) {

        main.innerHTML = "";

        main.style.display = "block";

    }


    const oldScene = document.querySelector("a-scene");

    if (oldScene) {

        try {
            oldScene.remove();
        } catch (e) {}

    }


    const oldVideo = document.getElementById("arVideo");

    if (oldVideo) {

        try {
            oldVideo.pause();
        } catch (e) {}

        oldVideo.remove();

    }


    const oldChange =
        document.getElementById("changeGroup");

    if (oldChange) {
        oldChange.remove();
    }


    currentScene = null;

    currentVideo = null;

}


/* =========================================
   صفحه انتخاب گروه
========================================= */

function showCategories() {

    clearPage();


    const main =
        document.getElementById("mainApp");

    if (!main) return;


    main.style.display = "block";


    const page =
        document.createElement("div");

    page.className = "category-page";


    page.innerHTML = `

        <div class="main-title">
            سرزمین شگفت‌انگیز ✨
        </div>

        <div class="main-subtitle">
            گروه دفترها را انتخاب کنید
        </div>

        <div class="group-buttons">

            <button
                class="group-button"
                data-group="Group1">

                📚 گروه ۱

            </button>


            <button
                class="group-button"
                data-group="Group2">

                📚 گروه ۲

            </button>


            <button
                class="group-button"
                data-group="Group3">

                📚 گروه ۳

            </button>

        </div>

    `;


    main.appendChild(page);


    page
        .querySelectorAll(".group-button")
        .forEach(button => {

            button.addEventListener("click", () => {

                const group =
                    button.dataset.group;

                startAR(group);

            });

        });

}


/* =========================================
   شروع AR
========================================= */

function startAR(groupName) {

    const config = GROUPS[groupName];

    if (!config) return;


    currentGroup = groupName;


    const main =
        document.getElementById("mainApp");

    if (main) {

        main.style.display = "none";

    }


    /* حذف Scene قبلی */

    const oldScene =
        document.querySelector("a-scene");

    if (oldScene) {

        try {
            oldScene.remove();
        } catch (e) {}

    }


    /* حذف Video قبلی */

    const oldVideo =
        document.getElementById("arVideo");

    if (oldVideo) {

        try {
            oldVideo.pause();
        } catch (e) {}

        oldVideo.remove();

    }


    /* =====================================
       ساخت ویدئوی اصلی
    ===================================== */

    const video =
        document.createElement("video");


    video.id = "arVideo";


    video.setAttribute(
        "playsinline",
        ""
    );


    video.setAttribute(
        "webkit-playsinline",
        ""
    );


    video.setAttribute(
        "muted",
        ""
    );


    video.muted = true;


    video.loop = false;


    video.preload = "auto";


    document.body.appendChild(video);


    currentVideo = video;


    /* =====================================
       ساخت A-Frame Scene
    ===================================== */

    const scene =
        document.createElement("a-scene");


    /*
       embedded را نگه می‌داریم
    */

    scene.setAttribute(
        "embedded",
        ""
    );


    /* =====================================
       MindAR
    ===================================== */

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


    /* =====================================
       Renderer
    ===================================== */

    scene.setAttribute(
        "renderer",
        `
        alpha: true;
        colorManagement: true;
        physicallyCorrectLights: true;
        `
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


    /* =====================================
       Camera
    ===================================== */

    const camera =
        document.createElement("a-camera");


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


    /* =====================================
       ساخت ۳۰ Target
    ===================================== */

    for (let i = 0; i < 30; i++) {

        createTarget(
            scene,
            i,
            groupName
        );

    }


    /* =====================================
       دکمه تغییر گروه
    ===================================== */

    const changeButton =
        document.createElement("button");


    changeButton.id =
        "changeGroup";


    changeButton.innerHTML =
        "🔄 تغییر گروه";


    changeButton.addEventListener(
        "click",
        () => {

            stopAR();

            showCategories();

        }
    );


    /* =====================================
       اضافه کردن به صفحه
    ===================================== */

    document.body.appendChild(scene);

    document.body.appendChild(changeButton);


    currentScene = scene;


    /*
       کمی زمان می‌دهیم تا MindAR
       خودش اندازه دوربین را تنظیم کند.
    */

    setTimeout(() => {

        resizeAR();

    }, 500);


    setTimeout(() => {

        resizeAR();

    }, 1500);

}


/* =========================================
   ساخت Target
========================================= */

function createTarget(
    scene,
    index,
    groupName
) {

    const target =
        document.createElement("a-entity");


    target.setAttribute(
        "mindar-image-target",
        `targetIndex: ${index}`
    );


    /* =====================================
       Video Plane
    ===================================== */

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
        "0 0 0.01"
    );


    videoPlane.setAttribute(
        "visible",
        "false"
    );


    target.appendChild(videoPlane);


    /* =====================================
       Instagram
    ===================================== */

    const instagram =
        document.createElement("a-plane");


    instagram.classList.add("arLink");

    instagram.classList.add(
        "instagram-zone"
    );


    instagram.setAttribute(
        "width",
        "0.55"
    );


    instagram.setAttribute(
        "height",
        "0.16"
    );


    instagram.setAttribute(
        "position",
        "-0.28 0.61 0.06"
    );


    instagram.setAttribute(
        "material",
        "transparent: true; opacity: 0; side: double;"
    );


    instagram.addEventListener(
        "click",
        () => {

            const appURL =
                "instagram://user?username=SarzaminAr";


            const webURL =
                "https://www.instagram.com/SarzaminAr/";


            window.location.href =
                appURL;


            setTimeout(() => {

                window.location.href =
                    webURL;

            }, 1500);

        }
    );


    target.appendChild(instagram);


    /* =====================================
       متن پایین دفتر
    ===================================== */

    const shareText =
        document.createElement("a-text");


    shareText.setAttribute(
        "value",
        "سرزمین شگفت‌انگیز"
    );


    shareText.setAttribute(
        "align",
        "center"
    );


    shareText.setAttribute(
        "width",
        "1.8"
    );


    shareText.setAttribute(
        "position",
        "0 -0.88 0.06"
    );


    shareText.setAttribute(
        "color",
        "#ffffff"
    );


    target.appendChild(shareText);


    /* =====================================
       ناحیه اشتراک‌گذاری
    ===================================== */

    const share =
        document.createElement("a-plane");


    share.classList.add("arLink");

    share.classList.add(
        "share-zone"
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


    share.addEventListener(
        "click",
        async () => {

            const message =
`😍 من یه دفتر جادویی پیدا کردم!

دوربین گوشیت رو روی دفتر بگیر تا ببینی چطور زنده میشه! ✨📚

سرزمین شگفت‌انگیز ✨
@SarzaminAr`;


            const shareData = {

                title:
                    "سرزمین شگفت‌انگیز ✨",

                text:
                    message,

                url:
                    "https://www.instagram.com/SarzaminAr/"

            };


            if (navigator.share) {

                try {

                    await navigator.share(
                        shareData
                    );

                    return;

                } catch (error) {

                    if (
                        error &&
                        error.name ===
                        "AbortError"
                    ) {

                        return;

                    }

                }

            }


            try {

                await navigator.clipboard.writeText(
                    message
                );


                alert(
                    "متن آماده اشتراک‌گذاری کپی شد ✨"
                );

            } catch (error) {

                alert(message);

            }

        }
    );


    target.appendChild(share);


    /* =====================================
       وقتی دفتر پیدا شد
    ===================================== */

    target.addEventListener(
        "targetFound",
        () => {

            const config =
                GROUPS[groupName];


            const number =
                config.start + index;


            const filename =
                number < 10
                    ? "0" + number
                    : String(number);


            const videoURL =
                `./${groupName}/${filename}.mp4`;


            /* توقف ویدئوی قبلی */

            if (currentVideo) {

                try {

                    currentVideo.pause();

                } catch (e) {}

            }


            /* مخفی کردن همه Plane ها */

            if (currentScene) {

                currentScene
                    .querySelectorAll("a-video")
                    .forEach(element => {

                        element.setAttribute(
                            "visible",
                            "false"
                        );

                    });

            }


            if (!currentVideo) return;


            /* قرار دادن ویدئوی جدید */

            currentVideo.src =
                videoURL;


            currentVideo.load();


            /* نمایش Plane */

            videoPlane.setAttribute(
                "visible",
                "true"
            );


            /* پخش */

            const playPromise =
                currentVideo.play();


            if (
                playPromise &&
                playPromise.catch
            ) {

                playPromise.catch(
                    () => {}
                );

            }

        }
    );


    /* =====================================
       وقتی دفتر گم شد
    ===================================== */

    target.addEventListener(
        "targetLost",
        () => {

            videoPlane.setAttribute(
                "visible",
                "false"
            );


            if (currentVideo) {

                try {

                    currentVideo.pause();

                } catch (e) {}

            }

        }
    );


    scene.appendChild(target);

}


/* =========================================
   توقف AR
========================================= */

function stopAR() {

    if (currentVideo) {

        try {

            currentVideo.pause();

        } catch (e) {}

    }


    const scene =
        document.querySelector("a-scene");


    if (scene) {

        try {

            scene.remove();

        } catch (e) {}

    }


    const video =
        document.getElementById("arVideo");


    if (video) {

        try {

            video.pause();

        } catch (e) {}

        video.remove();

    }


    const changeButton =
        document.getElementById("changeGroup");


    if (changeButton) {

        changeButton.remove();

    }


    currentScene = null;

    currentVideo = null;

}


/* =========================================
   تغییر اندازه AR
========================================= */

function resizeAR() {

    const scene =
        document.querySelector("a-scene");


    if (!scene) return;


    const width =
        window.innerWidth;


    const height =
        window.innerHeight;


    /*
       فقط اندازه Scene را تنظیم می‌کنیم.
       به ویدئوی دوربین MindAR دست نمی‌زنیم.
    */

    scene.style.width =
        width + "px";


    scene.style.height =
        height + "px";

}


/* =========================================
   Resize
========================================= */

window.addEventListener(
    "resize",
    () => {

        resizeAR();

    }
);


/* =========================================
   Orientation
========================================= */

window.addEventListener(
    "orientationchange",
    () => {

        setTimeout(
            resizeAR,
            500
        );


        setTimeout(
            resizeAR,
            1200
        );

    }
);
