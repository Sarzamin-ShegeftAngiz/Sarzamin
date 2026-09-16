document.addEventListener("DOMContentLoaded", () => {

    const scene = document.querySelector("a-scene");

    if (!scene) {
        console.error("A-FRAME SCENE NOT FOUND");
        return;
    }

    /* =====================================================
       LOADING SCREEN
       فقط رویداد واقعی arReady آن را می‌بندد.
    ===================================================== */
    const arLoading = document.getElementById("arLoading");
    const loadingPercent = document.getElementById("loadingPercent");
    const loadingBarFill = document.getElementById("loadingBarFill");

    let loadingProgress = 0;
    let loadingFinished = false;

    function setLoadingProgress(percent) {
        percent = Math.max(0, Math.min(100, Math.round(percent)));
        loadingProgress = percent;

        if (loadingPercent) loadingPercent.textContent = percent + "%";
        if (loadingBarFill) loadingBarFill.style.width = percent + "%";
    }

    setLoadingProgress(5);

    const fakeLoading = setInterval(() => {
        if (!loadingFinished && loadingProgress < 95) {
            setLoadingProgress(loadingProgress + 1);
        }
    }, 70);

    scene.addEventListener("arReady", () => {
        console.log("MINDAR AR READY - LOADING FINISHED");
        loadingFinished = true;
        clearInterval(fakeLoading);
        setLoadingProgress(100);

        setTimeout(() => {
            if (arLoading) arLoading.style.display = "none";
        }, 300);
    });

    /* =====================================================
       30 VIDEOS
    ===================================================== */
    const videos = [];

    for (let i = 0; i < 30; i++) {
        videos.push(document.querySelector("#video" + i));
    }

    let activeTarget = null;

    /* =====================================================
       TARGET FOUND
    ===================================================== */
    scene.addEventListener("targetFound", async (e) => {
        const target = e.target;
        const data = target.getAttribute("mindar-image-target");

        if (!data) return;

        const index = data.targetIndex;
        console.log("TARGET FOUND:", index);

        activeTarget = target;

        videos.forEach((video, i) => {
            if (!video) return;
            if (i !== index) {
                video.pause();
                try { video.currentTime = 0; } catch (err) {}
            }
        });

        const video = videos[index];

        if (!video) {
            console.log("VIDEO NOT FOUND:", index);
            return;
        }

        try { video.currentTime = 0; } catch (err) {}

        video.load();
        video.muted = false;
        video.volume = 1;

        try {
            await video.play();
            console.log("VIDEO PLAYING:", index);
        } catch (err) {
            console.log("VIDEO PLAY ERROR:", err);
            video.muted = true;

            try {
                await video.play();
                console.log("VIDEO PLAYING MUTED:", index);
            } catch (err2) {
                console.log("VIDEO PLAY ERROR 2:", err2);
            }
        }
    });

    /* =====================================================
       TARGET LOST
    ===================================================== */
    scene.addEventListener("targetLost", (e) => {
        const target = e.target;
        const data = target.getAttribute("mindar-image-target");

        if (!data) return;

        const index = data.targetIndex;
        console.log("TARGET LOST:", index);

        const video = videos[index];

        if (video) {
            video.pause();
            try { video.currentTime = 0; } catch (err) {}
        }

        if (activeTarget === target) activeTarget = null;
    });

    /* =====================================================
       CHANGE GROUP
    ===================================================== */
    const changeGroup = document.getElementById("changeGroup");

    if (changeGroup) {
        changeGroup.addEventListener("click", () => {
            window.location.href = "./index.html";
        });
    }

    /* =====================================================
       SHARE
       این لینک نامرئی برای تمام ۳۰ دفتر فعال است،
       چون همیشه روی activeTarget قرار می‌گیرد.
    ===================================================== */
    const shareOverlay = document.getElementById("shareOverlay");

    const shareText = `🎉 دفتر من زنده شددد! 😍📱
باور نمی‌کنی?!
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
        shareOverlay.addEventListener("touchend", (e) => {
            e.preventDefault();
            e.stopPropagation();
            shareSarzamin();
        }, { passive: false });
    }

    /* =====================================================
       INSTAGRAM
       این لینک نامرئی هم برای تمام ۳۰ دفتر فعال است.
    ===================================================== */
    const instagramOverlay = document.getElementById("instagramOverlay");

    if (instagramOverlay) {
        instagramOverlay.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();

            const username = "SarzaminAr";
            const appUrl = `instagram://user?username=${username}`;
            const webUrl = `https://www.instagram.com/${username}/`;
            const startTime = Date.now();

            window.location.href = appUrl;

            setTimeout(() => {
                if (Date.now() - startTime < 2000) {
                    window.location.href = webUrl;
                }
            }, 1500);
        });

        instagramOverlay.addEventListener("touchend", (e) => {
            e.preventDefault();
            e.stopPropagation();

            const username = "SarzaminAr";
            const appUrl = `instagram://user?username=${username}`;
            const webUrl = `https://www.instagram.com/${username}/`;
            const startTime = Date.now();

            window.location.href = appUrl;

            setTimeout(() => {
                if (Date.now() - startTime < 2000) {
                    window.location.href = webUrl;
                }
            }, 1500);
        }, { passive: false });
    }

    /* =====================================================
       OVERLAY POSITION
       Share: 0.4, -0.6
       Instagram: 0.1, 0.7
       این دو مستقل از هم هستند.
    ===================================================== */
    function projectTargetPosition(target, localX, localY, localZ = 0.02) {
        const camera = scene.camera;
        const canvas = scene.canvas;

        if (!camera || !canvas || !target || !target.object3D.visible) {
            return null;
        }

        const position = new THREE.Vector3(localX, localY, localZ);
        target.object3D.localToWorld(position);
        position.project(camera);

        const rect = canvas.getBoundingClientRect();

        return {
            x: rect.left + ((position.x + 1) * 0.5 * rect.width),
            y: rect.top + ((1 - position.y) * 0.5 * rect.height)
        };
    }

    function updateOverlays() {
        if (!activeTarget || !activeTarget.object3D.visible) {
            if (shareOverlay) shareOverlay.style.display = "none";
            if (instagramOverlay) instagramOverlay.style.display = "none";
            requestAnimationFrame(updateOverlays);
            return;
        }

        const sharePos = projectTargetPosition(activeTarget, 0.4, -0.6, 0.02);
        const instagramPos = projectTargetPosition(activeTarget, 0.1, 0.7, 0.02);

        if (shareOverlay && sharePos) {
            shareOverlay.style.left = `${sharePos.x}px`;
            shareOverlay.style.top = `${sharePos.y}px`;
            shareOverlay.style.display = "block";
        }

        if (instagramOverlay && instagramPos) {
            instagramOverlay.style.left = `${instagramPos.x}px`;
            instagramOverlay.style.top = `${instagramPos.y}px`;
            instagramOverlay.style.display = "block";
        }

        requestAnimationFrame(updateOverlays);
    }

    scene.addEventListener("renderstart", () => {
        requestAnimationFrame(updateOverlays);
    });

    console.log("SARZAMIN AR APP LOADED - 30 TARGETS + ALL INVISIBLE LINKS");
});
