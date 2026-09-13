document.addEventListener("DOMContentLoaded", () => {

    const scene = document.querySelector("a-scene");

    const videos = [];

    for (let i = 0; i < 30; i++) {
        videos.push(document.querySelector("#video" + i));
    }

    let activeTarget = null;
    let selectedGroup = null;

    const groupMenu = document.querySelector("#groupMenu");
    const group1Btn = document.querySelector("#group1Btn");
    const group2Btn = document.querySelector("#group2Btn");

    const GROUPS = {
        group1: {
            mind: "./Group1/targets.mind",
            first: 1,
            folder: "Group1"
        },

        group2: {
            mind: "./Group2/targets.mind",
            first: 31,
            folder: "Group2"
        }
    };


    // -----------------------------
    // تنظیم ویدیوهای گروه انتخاب شده
    // -----------------------------

    function setGroupVideos(group) {

        const config = GROUPS[group];

        videos.forEach((video, i) => {

            if (!video) return;

            const number = config.first + i;
            const filename = String(number).padStart(2, "0");

            video.pause();

            try {
                video.currentTime = 0;
            } catch (err) {}

            video.src = `./${config.folder}/${filename}.mp4`;

        });
    }


    // -----------------------------
    // شروع گروه
    // -----------------------------

    async function startGroup(group) {

        if (selectedGroup) return;

        selectedGroup = group;

        const config = GROUPS[group];

        console.log("SELECTED GROUP:", group);

        // قرار دادن ویدیوهای همان گروه
        setGroupVideos(group);

        // تنظیم MindAR
        scene.setAttribute("mindar-image", {
            imageTargetSrc: config.mind,
            autoStart: false,
            uiLoading: "no",
            uiScanning: "yes",
            uiError: "no",
            warmupTolerance: 2,
            missTolerance: 1,
            filterMinCF: 0.0001,
            filterBeta: 0.001
        });

        // مخفی کردن منوی انتخاب گروه
        if (groupMenu) {
            groupMenu.style.display = "none";
        }

        // کمی صبر برای آماده شدن MindAR
        setTimeout(() => {

            const mindarSystem =
                scene.systems["mindar-image-system"];

            if (!mindarSystem) {

                console.log("MINDAR SYSTEM NOT FOUND");

                return;
            }

            console.log("STARTING CAMERA...");

            mindarSystem.start();

        }, 300);
    }


    // -----------------------------
    // دکمه گروه یک
    // -----------------------------

    if (group1Btn) {

        group1Btn.addEventListener("click", () => {

            console.log("GROUP 1 CLICKED");

            startGroup("group1");

        });

    }


    // -----------------------------
    // دکمه گروه دو
    // -----------------------------

    if (group2Btn) {

        group2Btn.addEventListener("click", () => {

            console.log("GROUP 2 CLICKED");

            startGroup("group2");

        });

    }


    // -----------------------------
    // AR آماده شد
    // -----------------------------

    scene.addEventListener("arReady", () => {

        console.log("AR READY");

    });


    // -----------------------------
    // وقتی تارگت پیدا شد
    // -----------------------------

    scene.addEventListener("targetFound", async (e) => {

        const target = e.target;

        const data =
            target.getAttribute("mindar-image-target");

        const index = data.targetIndex;

        console.log("TARGET FOUND:", index);

        activeTarget = target;


        // توقف همه ویدیوهای دیگر
        videos.forEach((video, i) => {

            if (!video) return;

            if (i !== index) {

                video.pause();

                try {
                    video.currentTime = 0;
                } catch (err) {}

            }

        });


        const video = videos[index];

        if (!video) {

            console.log("VIDEO NOT FOUND:", index);

            return;

        }


        console.log("LOADING VIDEO:", index);


        try {
            video.currentTime = 0;
        } catch (err) {}


        // فقط همین ویدیو را لود کن
        video.load();


        video.muted = false;
        video.volume = 1;


        try {

            await video.play();

            console.log("VIDEO PLAYING:", index);

        } catch (err) {

            console.log("VIDEO PLAY ERROR:", err);


            // اگر صدا توسط مرورگر اجازه داده نشد
            video.muted = true;

            try {

                await video.play();

                console.log("VIDEO PLAYING MUTED:", index);

            } catch (err2) {

                console.log("VIDEO PLAY ERROR 2:", err2);

            }

        }

    });


    // -----------------------------
    // وقتی تارگت گم شد
    // -----------------------------

    scene.addEventListener("targetLost", (e) => {

        const target = e.target;

        const data =
            target.getAttribute("mindar-image-target");

        const index = data.targetIndex;

        console.log("TARGET LOST:", index);


        const video = videos[index];

        if (video) {

            video.pause();

            try {
                video.currentTime = 0;
            } catch (err) {}

        }


        if (activeTarget === target) {

            activeTarget = null;

        }

    });

});
