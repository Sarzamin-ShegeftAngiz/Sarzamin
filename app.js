document.addEventListener("DOMContentLoaded", () => {
    const scene = document.querySelector("a-scene");
    if (!scene) return;

    /* ================= LOADING ================= */
    const arLoading = document.getElementById("arLoading");
    const loadingPercent = document.getElementById("loadingPercent");
    const loadingBarFill = document.getElementById("loadingBarFill");
    const loadingText = document.getElementById("loadingText");
    let loadingProgress = 0;
    let loadingFinished = false;

    function setLoadingProgress(p) {
        p = Math.max(0, Math.min(100, Math.round(p)));
        loadingProgress = p;
        if (loadingPercent) loadingPercent.textContent = p + "%";
        if (loadingBarFill) loadingBarFill.style.width = p + "%";
    }

    setLoadingProgress(5);
    const fakeLoading = setInterval(() => {
        if (!loadingFinished && loadingProgress < 95) setLoadingProgress(loadingProgress + 1);
    }, 120);

    function finishLoading() {
        if (loadingFinished) return;
        loadingFinished = true;
        clearInterval(fakeLoading);
        setLoadingProgress(100);
        setTimeout(() => {
            if (arLoading) arLoading.style.display = "none";
        }, 250);
    }

    /* فقط آماده شدن واقعی MindAR */
    scene.addEventListener("arReady", finishLoading);
    scene.addEventListener("arError", () => {
        console.error("MINDAR ERROR");
    });

    /* ================= VIDEOS ================= */
    const videos = [];
    for (let i = 0; i < 30; i++) videos.push(document.getElementById("video" + i));
    let activeTarget = null;

    scene.addEventListener("targetFound", async (e) => {
        const target = e.target;
        const data = target.getAttribute("mindar-image-target");
        if (!data) return;
        const index = Number(data.targetIndex);
        activeTarget = target;

        videos.forEach((v, i) => {
            if (!v || i === index) return;
            v.pause();
            try { v.currentTime = 0; } catch (_) {}
        });

        const video = videos[index];
        if (!video) return;
        try { video.currentTime = 0; } catch (_) {}
        video.load();
        video.muted = false;
        video.volume = 1;
        try { await video.play(); }
        catch (_) {
            video.muted = true;
            try { await video.play(); } catch (_) {}
        }
    });

    scene.addEventListener("targetLost", (e) => {
        const data = e.target.getAttribute("mindar-image-target");
        if (!data) return;
        const index = Number(data.targetIndex);
        const video = videos[index];
        if (video) {
            video.pause();
            try { video.currentTime = 0; } catch (_) {}
        }
        if (activeTarget === e.target) activeTarget = null;
    });

    /* ================= SHARE ================= */
    const shareText = `🎉 دفتر من زنده شددد! 😍📱
باور نمی‌کنی؟!
دوربین گوشیتو بگیر روی دفتر و ببین چه اتفاقی می‌افته! 🤯✨

🎨 می‌خوای ببینی کدوم طرح‌ها زنده میشن؟
بیا توی اینستاگرام @SarzaminAr 👀💜

اونجا طرح‌های زنده رو ببین و اگه دوست داری طرح دفتر خودتم زنده کنیم، بهمون بگو! 😍🔥

🚀 سرزمین شگفت‌انگیز؛ جایی که دفترها زنده میشن!`;

    async function shareSarzamin() {
        if (navigator.share) {
            try { await navigator.share({title:"سرزمین شگفت‌انگیز", text:shareText}); return; }
            catch (_) {}
        }
        try {
            await navigator.clipboard.writeText(shareText);
            alert("متن آماده کپی شد 😊");
        } catch (_) { alert("امکان اشتراک‌گذاری در این مرورگر وجود ندارد."); }
    }

    function openInstagram() {
        const appUrl = "instagram://user?username=SarzaminAr";
        const webUrl = "https://www.instagram.com/SarzaminAr/";
        const started = Date.now();
        window.location.href = appUrl;
        setTimeout(() => { if (Date.now() - started < 2200) window.location.href = webUrl; }, 1500);
    }

    /* هر ۳۰ دفتر: ناحیه نامرئی اشتراک و اینستاگرام */
    const targets = Array.from(scene.querySelectorAll('[mindar-image-target]'));
    targets.forEach((target) => {
        const shareButton = target.querySelector(".shareButton");
        const instagramButton = target.querySelector(".instagramButton");
        if (shareButton) {
            const handler = e => { e.preventDefault(); e.stopPropagation(); shareSarzamin(); };
            shareButton.addEventListener("click", handler);
            shareButton.addEventListener("touchend", handler, {passive:false});
        }
        if (instagramButton) {
            const handler = e => { e.preventDefault(); e.stopPropagation(); openInstagram(); };
            instagramButton.addEventListener("click", handler);
            instagramButton.addEventListener("touchend", handler, {passive:false});
        }
    });

    const changeGroup = document.getElementById("changeGroup");
    if (changeGroup) changeGroup.addEventListener("click", () => { window.location.href = "./index.html"; });

    console.log("SARZAMIN AR FINAL LOADED");
});
