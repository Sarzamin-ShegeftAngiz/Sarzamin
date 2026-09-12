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
let activeTarget = null;


/* =====================================
   شروع
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    showCategories();

});


/* =====================================
   صفحه انتخاب گروه
===================================== */

function showCategories() {

    stopAR();


    const main =
        document.getElementById("mainApp");

    if (!main) return;


    main.style.display = "block";


    main.innerHTML = `

        <div class="category-page">

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

        </div>

    `;


    main
        .querySelectorAll(".group-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    startAR(
                        button.dataset.group
                    );

                }
            );

        });

}


/* =====================================
   شروع AR
===================================== */

function startAR(groupName) {

    const config =
        GROUPS[groupName];

    if (!config) return;


    currentGroup =
        groupName;

    activeTarget = null;


    /* صفحه انتخاب گروه مخفی */

    const main =
        document.getElementById("mainApp");

    if (main) {

        main.style.display =
            "none";

    }


    /* پاک کردن AR قبلی */

    stopAR();


    /*
       ساخت VIDEO اصلی
       این فقط منبع a-video است
    */

    const video =
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


    video.setAttribute(
        "preload",
        "auto"
    );


    video.setAttribute(
        "loop",
        ""
    );


    video.muted =
        true;


    document.body.appendChild(
        video
    );


    currentVideo =
        video;


    /*
       ساخت Scene
    */

    const scene =
        document.createElement(
            "a-scene"
        );


    /*
       دقیقاً همان تنظیم اصلی
       که قبلاً دوربین با آن کار می‌کرد
    */

    scene.setAttribute(
        "mindar-image",
        `
        imageTargetSrc: ${config.mind};
        warmupTolerance: 2;
        missTolerance: 1;
        uiLoading: no;
        uiScanning: yes;
        uiError: yes;
        `
    );


    scene.setAttribute(
        "embedded",
        ""
    );


    scene.setAttribute(
        "vr-mode-ui",
        "enabled: false"
    );


    scene.setAttribute(
        "device-orientation-permission-ui",
        "enabled: false"
    );


    scene.setAttribute(
        "renderer",
        "colorManagement: true;"
    );


    /*
       CAMERA
    */

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


    scene.appendChild(
        camera
    );


    /*
       ۳۰ تارگت
    */

    for (
        let i = 0;
        i < 30;
        i++
    ) {

        createTarget(
            scene,
            i,
            groupName
        );

    }


    /*
       اضافه کردن Scene
    */

    document.body.appendChild(
        scene
    );


    currentScene =
        scene;


    /*
       دکمه تغییر گروه
    */

    const changeButton =
        document.createElement(
            "button"
        );


    changeButton.id =
        "changeGroup";


    changeButton.innerHTML =
        "🔄 تغییر گروه";


    changeButton.addEventListener(
        "click",
        () => {

            showCategories();

        }
    );


    document.body.appendChild(
        changeButton
    );


    /*
       وقتی AR آماده شد
    */

    scene.addEventListener(
        "arReady",
        () => {

            console.log(
                "AR READY"
            );

        }
    );

}


/* =====================================
   ساخت هر Target
===================================== */

function createTarget(
    scene,
    index,
    groupName
) {

    const target =
        document.createElement(
            "a-entity"
        );


    target.setAttribute(
        "mindar-image-target",
        `targetIndex: ${index}`
    );


    /*
       VIDEO PLANE
    */

    const videoPlane =
        document.createElement(
            "a-video"
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


    videoPlane.setAttribute(
        "position",
        "0 0 0"
    );


    videoPlane.setAttribute(
        "visible",
        "false"
    );


    target.appendChild(
        videoPlane
    );


    /*
       =========================
       Instagram
       =========================
    */

    const instagram =
        document.createElement(
            "a-plane"
        );


    instagram.classList.add(
        "instagram-zone"
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
        "position",
        "-0.31 0.62 0.02"
    );


    instagram.setAttribute(
        "material",
        "shader: flat; color: red; opacity: 0; transparent: true;"
    );


    target.appendChild(
        instagram
    );


    /*
       =========================
       Share
       =========================
    */

    const share =
        document.createElement(
            "a-plane"
        );


    share.classList.add(
        "share-zone"
    );


    share.setAttribute(
        "width",
        "0.70"
    );


    share.setAttribute(
        "height",
        "0.16"
    );


    share.setAttribute(
        "position",
        "0 -0.62 0.02"
    );


    share.setAttribute(
        "material",
        "shader: flat; color: white; opacity: 0; transparent: true;"
    );


    target.appendChild(
        share
    );


    /*
       =========================
       TARGET FOUND
       =========================
    */

    target.addEventListener(
        "targetFound",
        async () => {

            console.log(
                "TARGET FOUND:",
                index
            );


            activeTarget =
                target;


            const config =
                GROUPS[groupName];


            const number =
                config.start +
                index;


            const filename =
                number < 10
                    ? "0" + number
                    : String(number);


            const videoURL =
                `./${groupName}/${filename}.mp4`;


            /*
               توقف ویدئوی قبلی
            */

            if (currentVideo) {

                try {

                    currentVideo.pause();

                } catch (e) {}

            }


            /*
               مخفی کردن Plane های قبلی
            */

            if (currentScene) {

                currentScene
                    .querySelectorAll(
                        "a-video"
                    )
                    .forEach(
                        element => {

                            element.setAttribute(
                                "visible",
                                "false"
                            );

                        }
                    );

            }


            /*
               ویدئوی جدید
            */

            if (!currentVideo) {
                return;
            }


            currentVideo.src =
                videoURL;


            currentVideo.currentTime =
                0;


            currentVideo.load();


            videoPlane.setAttribute(
                "visible",
                "true"
            );


            try {

                await currentVideo.play();

                console.log(
                    "VIDEO PLAYING:",
                    number
                );

            } catch (error) {

                console.log(
                    "VIDEO ERROR:",
                    error
                );

            }

        }
    );


    /*
       =========================
       TARGET LOST
       =========================
    */

    target.addEventListener(
        "targetLost",
        () => {

            console.log(
                "TARGET LOST:",
                index
            );


            videoPlane.setAttribute(
                "visible",
                "false"
            );


            if (currentVideo) {

                try {

                    currentVideo.pause();

                } catch (e) {}

            }


            if (
                activeTarget ===
                target
            ) {

                activeTarget =
                    null;

            }

        }
    );


    scene.appendChild(
        target
    );

}


/* =====================================
   لمس Instagram و Share
   همان روش نسخه قدیمی تو
===================================== */

document.addEventListener(
    "touchend",
    event => {

        if (!activeTarget) {
            return;
        }


        if (
            !currentScene ||
            !currentScene.camera ||
            !currentScene.renderer
        ) {

            return;

        }


        const touch =
            event.changedTouches[0];


        if (!touch) {
            return;
        }


        const canvas =
            currentScene
                .renderer
                .domElement;


        const rect =
            canvas.getBoundingClientRect();


        const mouse =
            new THREE.Vector2();


        mouse.x =
            (
                (touch.clientX - rect.left)
                /
                rect.width
            ) * 2 - 1;


        mouse.y =
            -(
                (touch.clientY - rect.top)
                /
                rect.height
            ) * 2 + 1;


        const raycaster =
            new THREE.Raycaster();


        raycaster.setFromCamera(
            mouse,
            currentScene.camera
        );


        /*
           =========================
           INSTAGRAM
        =========================
        */

        const instagramZone =
            activeTarget.querySelector(
                ".instagram-zone"
            );


        if (instagramZone) {

            const mesh =
                instagramZone
                    .getObject3D(
                        "mesh"
                    );


            if (mesh) {

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


                    return;

                }

            }

        }


        /*
           =========================
           SHARE
        =========================
        */

        const shareZone =
            activeTarget.querySelector(
                ".share-zone"
            );


        if (!shareZone) {
            return;
        }


        const shareMesh =
            shareZone.getObject3D(
                "mesh"
            );


        if (!shareMesh) {
            return;
        }


        const shareHits =
            raycaster.intersectObject(
                shareMesh,
                true
            );


        if (
            shareHits.length === 0
        ) {

            return;

        }


        console.log(
            "SHARE PRESSED"
        );


        const shareURL =
            window.location.href;


        const shareText =
`📚✨ این فقط یه دفتر معمولی نیست!

این دفتر می‌تونه زنده بشه! 😱

دوربین گوشیت رو بگیر روی جلد و خودت ببین چه اتفاقی می‌افته! 👀

🔥 حالا اگه دوست داری طرح‌های زنده‌ی دیگه رو هم ببینی، این لینک رو بزن و بیا آیدی اینستاگرام سرزمین شگفت‌انگیز رو ببین!

شاید طرح مورد علاقه‌ات اونجا منتظرت باشه 😍📚

اگه دفترت هنوز زنده نشده، درخواست زنده‌شدنش رو بده! 😉✨`;


        /*
           Share گوشی
        */

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
            .catch(error => {

                console.log(
                    "SHARE CANCELLED",
                    error
                );

            });


            return;

        }


        /*
           Clipboard
        */

        if (
            navigator.clipboard
        ) {

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

    },
    {
        passive: true
    }
);


/* =====================================
   توقف AR
===================================== */

function stopAR() {

    activeTarget =
        null;


    if (currentVideo) {

        try {

            currentVideo.pause();

        } catch (e) {}

    }


    const scene =
        document.querySelector(
            "a-scene"
        );


    if (scene) {

        try {

            scene.remove();

        } catch (e) {}

    }


    const video =
        document.getElementById(
            "arVideo"
        );


    if (video) {

        try {

            video.pause();

        } catch (e) {}

        video.remove();

    }


    const button =
        document.getElementById(
            "changeGroup"
        );


    if (button) {

        button.remove();

    }


    currentScene =
        null;


    currentVideo =
        null;

}
