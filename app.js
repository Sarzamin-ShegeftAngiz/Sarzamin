/* =========================================================
   SARZAMIN AR - app.js
   ========================================================= */

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


/* =========================================================
   شروع برنامه
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    createMain();
    showCategories();
});


/* =========================================================
   ساخت صفحه اصلی
   ========================================================= */

function createMain() {

    let old = document.getElementById("mainApp");

    if (old) {
        old.remove();
    }

    const main = document.createElement("div");

    main.id = "mainApp";

    document.body.appendChild(main);
}


/* =========================================================
   پاک کردن صفحه
   ========================================================= */

function clearPage() {

    const main = document.getElementById("mainApp");

    if (main) {
        main.innerHTML = "";
    }

    const oldScene = document.querySelector("a-scene");

    if (oldScene) {
        try {
            oldScene.remove();
        } catch (e) {}
    }

    currentScene = null;
    currentVideo = null;
}


/* =========================================================
   انتخاب گروه
   ========================================================= */

function showCategories() {

    clearPage();

    const main = document.getElementById("mainApp");

    const page = document.createElement("div");

    page.className = "category-page";

    page.innerHTML = `
        <div class="main-title">
            سرزمین شگفت‌انگیز ✨
        </div>

        <div class="main-subtitle">
            گروه دفترها را انتخاب کنید
        </div>

        <div class="group-buttons">

            <button class="group-button" data-group="Group1">
                📚 گروه ۱
            </button>

            <button class="group-button" data-group="Group2">
                📚 گروه ۲
            </button>

            <button class="group-button" data-group="Group3">
                📚 گروه ۳
            </button>

        </div>
    `;

    main.appendChild(page);

    page.querySelectorAll(".group-button").forEach(button => {

        button.addEventListener("click", () => {

            const group = button.dataset.group;

            showGallery(group);
        });

    });
}


/* =========================================================
   صفحه لیست دفترها
   ========================================================= */

function showGallery(groupName) {

    clearPage();

    currentGroup = groupName;

    const config = GROUPS[groupName];

    const main = document.getElementById("mainApp");

    const page = document.createElement("div");

    page.className = "gallery-page";

    const header = document.createElement("div");

    header.className = "gallery-header";

    header.innerHTML = `
        <div class="gallery-title">
            ${config.title}
        </div>
    `;

    page.appendChild(header);


    /* گرید دفترها */

    const grid = document.createElement("div");

    grid.className = "gallery-grid";


    for (
        let number = config.start;
        number <= config.end;
        number++
    ) {

        const card = document.createElement("div");

        card.className = "image-card";


        const image = document.createElement("img");

        image.className = "gallery-image";


        /* 19، 24 و 26 در گروه اول PNG هستند */

        let extension = "jpg";

        if (
            groupName === "Group1" &&
            (
                number === 19 ||
                number === 24 ||
                number === 26
            )
        ) {
            extension = "png";
        }


        /* شماره‌های ۱ تا ۹ صفر دارند */

        let filename;

        if (number < 10) {
            filename = "0" + number;
        } else {
            filename = String(number);
        }


        image.src =
            `./${groupName}/${filename}.${extension}`;


        /*
         * lazy loading عمداً استفاده نشده
         * تا هر ۳۰ دفتر بدون مشکل نمایش داده شوند.
         */

        image.alt = `دفتر ${number}`;

        image.draggable = false;


        /*
         * کلیک روی عکس هیچ کاری نمی‌کند
         */

        image.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
        });


        card.appendChild(image);

        grid.appendChild(card);
    }


    page.appendChild(grid);


    /* دکمه دوربین */

    const cameraButton = document.createElement("button");

    cameraButton.id = "openCamera";

    cameraButton.innerHTML =
        "📷 باز کردن دوربین";


    cameraButton.addEventListener("click", () => {

        startAR(currentGroup);

    });


    main.appendChild(page);

    main.appendChild(cameraButton);


    /*
     * اطمینان از اینکه صفحه از اول بالاست
     */

    setTimeout(() => {

        page.scrollTop = 0;

    }, 50);
}


/* =========================================================
   شروع AR
   ========================================================= */

function startAR(groupName) {

    const config = GROUPS[groupName];

    if (!config) {
        return;
    }

    currentGroup = groupName;


    /*
     * صفحه گالری را کاملاً مخفی می‌کنیم
     * تا دوربین فقط صفحه AR را نشان دهد.
     */

    const main = document.getElementById("mainApp");

    if (main) {
        main.style.display = "none";
    }


    /*
     * حذف دکمه قبلی
     */

    const oldButton =
        document.getElementById("openCamera");

    if (oldButton) {
        oldButton.remove();
    }


    /*
     * حذف Scene قبلی
     */

    const oldScene =
        document.querySelector("a-scene");

    if (oldScene) {

        try {
            oldScene.remove();
        } catch (e) {}

    }


    /*
     * ویدیوی AR
     */

    const video = document.createElement("video");

    video.id = "arVideo";

    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.setAttribute("muted", "");
    video.muted = true;

    video.loop = false;

    video.preload = "auto";

    document.body.appendChild(video);

    currentVideo = video;


    /* =====================================================
       ساخت Scene
       ===================================================== */

    const scene =
        document.createElement("a-scene");


    /*
     * embedded مهم است
     */

    scene.setAttribute(
        "embedded",
        ""
    );


    /*
     * MindAR
     */

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


    /*
     * مهم:
     * alpha:true برای جلوگیری از سیاه شدن تصویر دوربین
     */

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


    /* =====================================================
       دوربین
       ===================================================== */

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


    /* =====================================================
       ویدیوی AR
       ===================================================== */

    const arVideo =
        document.createElement("a-video");

    arVideo.id = "arVideoPlane";

    arVideo.setAttribute(
        "src",
        "#arVideo"
    );

    arVideo.setAttribute(
        "width",
        "1"
    );

    arVideo.setAttribute(
        "height",
        "1.42"
    );

    arVideo.setAttribute(
        "position",
        "0 0 0.01"
    );

    arVideo.setAttribute(
        "visible",
        "false"
    );


    /*
     * ویدیو را روی همه Targetها می‌گذاریم
     * و هنگام پیدا شدن Target نشان می‌دهیم.
     */

    let activeTarget = null;


    /* =====================================================
       ساخت ۳۰ Target
       ===================================================== */

    for (let i = 0; i < 30; i++) {

        createTarget(
            scene,
            i,
            groupName,
            arVideo,
            () => {
                activeTarget = i;
            },
            () => {
                if (activeTarget === i) {
                    activeTarget = null;
                }
            }
        );

    }


    /*
     * خود ویدیوی A-Frame
     */

    scene.appendChild(arVideo);


    /* =====================================================
       دکمه تغییر گروه
       ===================================================== */

    const changeButton =
        document.createElement("button");

    changeButton.id = "changeGroup";

    changeButton.innerHTML =
        "🔄 تغییر گروه";


    changeButton.addEventListener(
        "click",
        () => {

            if (currentVideo) {

                try {
                    currentVideo.pause();
                } catch (e) {}

            }


            const activeScene =
                document.querySelector("a-scene");

            if (activeScene) {

                try {
                    activeScene.remove();
                } catch (e) {}

            }


            const arVid =
                document.getElementById("arVideo");

            if (arVid) {

                try {
                    arVid.pause();
                } catch (e) {}

                arVid.remove();

            }


            const mainApp =
                document.getElementById("mainApp");

            if (mainApp) {
                mainApp.style.display = "";
            }


            showCategories();

        }
    );


    document.body.appendChild(scene);

    document.body.appendChild(changeButton);

    currentScene = scene;


    /*
     * تغییر اندازه بعد از ساخته شدن Scene
     */

    setTimeout(() => {
        resizeAR();
    }, 300);


    setTimeout(() => {
        resizeAR();
    }, 1000);


    setTimeout(() => {
        resizeAR();
    }, 2000);
}


/* =========================================================
   ساخت Target
   ========================================================= */

function createTarget(
    scene,
    index,
    groupName,
    arVideoPlane,
    onFound,
    onLost
) {

    const target =
        document.createElement(
            "a-entity"
        );


    target.setAttribute(
        "mindar-image-target",
        `targetIndex: ${index}`
    );


    /* =====================================================
       ویدیو
       ===================================================== */

    const video =
        document.createElement("a-video");

    video.setAttribute(
        "src",
        "#arVideo"
    );

    video.setAttribute(
        "width",
        "1"
    );

    video.setAttribute(
        "height",
        "1.42"
    );

    video.setAttribute(
        "position",
        "0 0 0.01"
    );

    video.setAttribute(
        "visible",
        "false"
    );


    target.appendChild(video);


    /* =====================================================
       لینک اینستاگرام
       ===================================================== */

    const instagram =
        document.createElement("a-plane");

    instagram.classList.add("arLink");
    instagram.classList.add("instagram-zone");

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


            setTimeout(
                () => {
                    window.location.href =
                        webURL;
                },
                1500
            );

        }
    );


    target.appendChild(instagram);


    /* =====================================================
       متن پایین
       ===================================================== */

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


    /* =====================================================
       محدوده قابل کلیک برای Share
       ===================================================== */

    const share =
        document.createElement("a-plane");

    share.classList.add("arLink");
    share.classList.add("share-zone");

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


            /*
             * Share Sheet گوشی
             */

            if (
                navigator.share &&
                navigator.canShare &&
                navigator.canShare(shareData)
            ) {

                try {

                    await navigator.share(
                        shareData
                    );

                    return;

                } catch (error) {

                    /*
                     * اگر کاربر Share را بست،
                     * هیچ پیغام اضافی نده.
                     */

                    if (
                        error &&
                        error.name ===
                        "AbortError"
                    ) {
                        return;
                    }

                }

            }


            /*
             * روش جایگزین:
             * Clipboard
             */

            try {

                if (
                    navigator.clipboard &&
                    navigator.clipboard.writeText
                ) {

                    await navigator.clipboard.writeText(
                        message
                    );

                    alert(
                        "متن آماده اشتراک‌گذاری کپی شد ✨"
                    );

                    return;
                }

            } catch (e) {}


            /*
             * آخرین راه
             */

            alert(message);

        }
    );


    target.appendChild(share);


    /* =====================================================
       پیدا شدن Target
       ===================================================== */

    target.addEventListener(
        "targetFound",
        () => {

            onFound();


            /*
             * شماره فایل
             */

            const number =
                GROUPS[groupName].start +
                index;


            let filename;

            if (number < 10) {
                filename =
                    "0" + number;
            } else {
                filename =
                    String(number);
            }


            const videoURL =
                `./${groupName}/${filename}.mp4`;


            /*
             * اگر ویدیوی قبلی وجود دارد
             * متوقفش کن.
             */

            if (currentVideo) {

                try {
                    currentVideo.pause();
                } catch (e) {}

            }


            /*
             * آدرس ویدیوی جدید
             */

            currentVideo.src =
                videoURL;


            currentVideo.load();


            /*
             * نمایش ویدیو
             */

            video.setAttribute(
                "visible",
                "true"
            );


            /*
             * تلاش برای پخش
             */

            const playPromise =
                currentVideo.play();


            if (
                playPromise &&
                typeof playPromise.catch ===
                "function"
            ) {

                playPromise.catch(
                    () => {}
                );

            }

        }
    );


    /* =====================================================
       گم شدن Target
       ===================================================== */

    target.addEventListener(
        "targetLost",
        () => {

            onLost();


            /*
             * ویدیو مخفی می‌شود
             */

            video.setAttribute(
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


/* =========================================================
   Resize دوربین / AR
   ========================================================= */

function resizeAR() {

    const width =
        window.innerWidth;

    const height =
        window.innerHeight;


    const scene =
        document.querySelector("a-scene");


    if (!scene) {
        return;
    }


    /*
     * اندازه Scene
     */

    scene.style.width =
        width + "px";

    scene.style.height =
        height + "px";


    /*
     * اندازه Canvas
     */

    const canvas =
        scene.querySelector("canvas");


    if (canvas) {

        canvas.style.width =
            width + "px";

        canvas.style.height =
            height + "px";

    }


    /*
     * رفرش Resize خود A-Frame
     */

    try {

        if (
            scene.renderer &&
            scene.renderer.setSize
        ) {

            scene.renderer.setSize(
                width,
                height
            );

        }

    } catch (e) {}
}


/* =========================================================
   تغییر اندازه صفحه
   ========================================================= */

window.addEventListener(
    "resize",
    () => {

        if (
            document.querySelector(
                "a-scene"
            )
        ) {

            resizeAR();

        }

    }
);


/* =========================================================
   تغییر جهت گوشی
   ========================================================= */

window.addEventListener(
    "orientationchange",
    () => {

        setTimeout(
            resizeAR,
            300
        );

        setTimeout(
            resizeAR,
            1000
        );

    }
);
