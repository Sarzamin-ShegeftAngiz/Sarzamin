document.addEventListener("DOMContentLoaded", () => {

    const scene = document.querySelector("a-scene");
    const arLoading =
    document.getElementById("arLoading");

const loadingPercent =
    document.getElementById("loadingPercent");

const loadingBarFill =
    document.getElementById("loadingBarFill");

let loadingProgress = 0;

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
    // ===============================
// شروع لودینگ
// ===============================

setLoadingProgress(5);

let fakeLoading = setInterval(() => {

    if (loadingProgress < 90) {

        setLoadingProgress(
            loadingProgress + 1
        );

    }

}, 80);


// وقتی MindAR کاملاً آماده شد
scene.addEventListener("arReady", () => {

    clearInterval(fakeLoading);

    setLoadingProgress(100);

    setTimeout(() => {

        if (arLoading) {
            arLoading.style.display = "none";
        }

    }, 400);

});
    const videos = [];

    for (let i = 0; i < 30; i++) {
        videos.push(document.querySelector("#video" + i));
    }

    let activeTarget = null;

    scene.addEventListener("arReady", () => {
        console.log("AR READY - 30 TARGETS");
    });

    scene.addEventListener("targetFound", async (e) => {
        const target = e.target;
        const data = target.getAttribute("mindar-image-target");
        const index = data.targetIndex;

        activeTarget = target;

        videos.forEach((video, i) => {
            if (!video) return;
            if (i !== index) {
                video.pause();
                try { video.currentTime = 0; } catch (err) {}
            }
        });

        const video = videos[index];
        if (!video) return;

        try { video.currentTime = 0; } catch (err) {}

        video.load();
        video.muted = false;
        video.volume = 1;

        try {
            await video.play();
        } catch (err) {
            video.muted = true;
            try { await video.play(); } catch (err2) {}
        }
    });

    scene.addEventListener("targetLost", (e) => {
        const target = e.target;
        const data = target.getAttribute("mindar-image-target");
        const index = data.targetIndex;
        const video = videos[index];

        if (video) {
            video.pause();
            try { video.currentTime = 0; } catch (err) {}
        }

        if (activeTarget === target) activeTarget = null;
    });

    /* SHARE */
    const shareOverlay = document.getElementById("shareOverlay");
    const target1 = document.querySelector('[mindar-image-target="targetIndex: 0"]');

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
                    title: "سرزمین شگفت‌انگیز",
                    text: shareText
                });
            } catch (err) {
                console.log("SHARE CANCELLED:", err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareText);
                alert("متن آماده کپی شد 😊");
            } catch (err) {
                alert("امکان اشتراک‌گذاری در این مرورگر وجود ندارد.");
            }
        }
    }

    if (shareOverlay) {
        shareOverlay.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            shareSarzamin();
        });
    }

    let target1Visible = false;

    scene.addEventListener("targetFound", (e) => {
        if (e.target === target1) target1Visible = true;
    });

    scene.addEventListener("targetLost", (e) => {
        if (e.target === target1) {
            target1Visible = false;
            if (shareOverlay) shareOverlay.style.display = "none";
        }
    });

    function updateShareOverlay() {
        if (!shareOverlay || !target1 || !target1Visible || !target1.object3D.visible) {
            if (shareOverlay) shareOverlay.style.display = "none";
            requestAnimationFrame(updateShareOverlay);
            return;
        }

        const camera = scene.camera;
        const canvas = scene.canvas;

        if (!camera || !canvas) {
            requestAnimationFrame(updateShareOverlay);
            return;
        }

        const position = new THREE.Vector3(0.4, -0.6, 0.02);
        target1.object3D.localToWorld(position);
        position.project(camera);

        const rect = canvas.getBoundingClientRect();
        const x = rect.left + ((position.x + 1) * 0.5 * rect.width);
        const y = rect.top + ((1 - position.y) * 0.5 * rect.height);

        shareOverlay.style.left = `${x}px`;
        shareOverlay.style.top = `${y}px`;
        shareOverlay.style.display = "block";

        requestAnimationFrame(updateShareOverlay);
    }

    /* INSTAGRAM - کاملاً مستقل از Share */
    const instagramOverlay = document.getElementById("instagramOverlay");
const instagramTarget = document.querySelector(
    '[mindar-image-target="targetIndex: 0"]'
);

let instagramTargetVisible = false;


// ===============================
// باز کردن اپلیکیشن Instagram
// ===============================

if (instagramOverlay) {

    instagramOverlay.addEventListener("click", (e) => {

        e.preventDefault();
        e.stopPropagation();

        const username = "SarzaminAr";

        const appUrl =
            `instagram://user?username=${username}`;

        const webUrl =
            `https://www.instagram.com/${username}/`;

        const startTime = Date.now();

        // اول تلاش برای باز کردن اپلیکیشن
        window.location.href = appUrl;

        // اگر اپ باز نشد → سایت
        setTimeout(() => {

            if (Date.now() - startTime < 2000) {
                window.location.href = webUrl;
            }

        }, 1500);
    });
}


// ===============================
// نمایش لینک روی دفتر
// ===============================

scene.addEventListener("targetFound", (e) => {

    if (e.target === instagramTarget) {
        instagramTargetVisible = true;
    }

});


scene.addEventListener("targetLost", (e) => {

    if (e.target === instagramTarget) {

        instagramTargetVisible = false;

        if (instagramOverlay) {
            instagramOverlay.style.display = "none";
        }
    }

});


function updateInstagramOverlay() {

    if (
        !instagramOverlay ||
        !instagramTarget ||
        !instagramTargetVisible ||
        !instagramTarget.object3D.visible
    ) {

        if (instagramOverlay) {
            instagramOverlay.style.display = "none";
        }

        requestAnimationFrame(updateInstagramOverlay);
        return;
    }


    const camera = scene.camera;
    const canvas = scene.canvas;

    if (!camera || !canvas) {
        requestAnimationFrame(updateInstagramOverlay);
        return;
    }


    const position = new THREE.Vector3(
        0.1,
        0.7,
        0.02
    );


    instagramTarget.object3D.localToWorld(position);

    position.project(camera);


    const rect =
        canvas.getBoundingClientRect();


    const x =
        rect.left +
        ((position.x + 1) * 0.5 * rect.width);


    const y =
        rect.top +
        ((1 - position.y) * 0.5 * rect.height);


    instagramOverlay.style.left =
        `${x}px`;

    instagramOverlay.style.top =
        `${y}px`;

    instagramOverlay.style.display =
        "block";


    requestAnimationFrame(updateInstagramOverlay);
}


// ===============================
// شروع Overlay
// ===============================

scene.addEventListener("renderstart", () => {

    requestAnimationFrame(updateShareOverlay);

    requestAnimationFrame(updateInstagramOverlay);

});

});
