document.addEventListener("DOMContentLoaded", () => {

    const scene = document.querySelector("a-scene");

    const videos = [];

    for (let i = 0; i < 30; i++) {
        videos.push(document.querySelector("#video" + i));
    }

    let activeTarget = null;

    // ==============================
    // SHARE
    // ==============================

    async function shareSarzamin() {

        console.log("SHARE PRESSED");

        const shareURL = window.location.href;

        const shareText = `🎉 دفتر من زنده شددد! 😍📱
باور نمی‌کنی؟!
دوربین گوشیتو بگیر روی دفتر و ببین چه اتفاقی می‌افته! 🤯✨

🎨 می‌خوای ببینی کدوم طرح‌ها زنده میشن؟
بیا توی اینستاگرام @SarzaminAr 👀💜

اونجا طرح‌های زنده رو ببین و اگه دوست داری طرح دفتر خودتم زنده کنیم، بهمون بگو! 😍🔥

🚀 سرزمین شگفت‌انگیز؛ جایی که دفترها زنده میشن!`;

        if (navigator.share) {

            try {

                await navigator.share({
                    title: "سرزمین شگفت‌انگیز",
                    text: shareText,
                    url: shareURL
                });

                console.log("SHARE SUCCESS");

            } catch (err) {

                console.log("SHARE CANCELLED:", err);

            }

        } else {

            try {

                await navigator.clipboard.writeText(
                    shareText + "\n\n" + shareURL
                );

                alert("متن آماده شد و کپی شد؛ حالا می‌تونی برای دوستات بفرستی 😍");

            } catch (err) {

                alert(shareText + "\n\n" + shareURL);

            }
        }
    }


    // ==============================
    // TOUCH SHARE
    // ==============================

    const canvas = scene ? scene.querySelector("canvas") : null;

    if (scene) {

        scene.addEventListener("touchend", (e) => {

            if (!activeTarget) return;

            // فقط Target 1
            const data = activeTarget.getAttribute("mindar-image-target");

            if (!data || data.targetIndex !== 0) {
                return;
            }

            const shareZone = activeTarget.querySelector(".share-zone");

            if (!shareZone) {
                console.log("SHARE ZONE NOT FOUND");
                return;
            }

            const shareMesh = shareZone.getObject3D("mesh");

            if (!shareMesh) {
                console.log("SHARE MESH NOT READY");
                return;
            }

            const touch = e.changedTouches[0];

            if (!touch) return;

            const renderer = scene.renderer;

            if (!renderer || !scene.camera) {
                return;
            }

            const domElement = renderer.domElement;
            const rect = domElement.getBoundingClientRect();

            const mouse = new THREE.Vector2();

            mouse.x =
                ((touch.clientX - rect.left) / rect.width) * 2 - 1;

            mouse.y =
                -((touch.clientY - rect.top) / rect.height) * 2 + 1;

            const raycaster = new THREE.Raycaster();

            raycaster.setFromCamera(mouse, scene.camera);

            const hits =
                raycaster.intersectObject(shareMesh, true);

            if (hits.length > 0) {

                console.log("SHARE ZONE HIT");

                e.preventDefault();

                shareSarzamin();
            }

        }, {
            passive: false
        });
    }


    // ==============================
    // AR READY
    // ==============================

    scene.addEventListener("arReady", () => {

        console.log("AR READY - 30 TARGETS");

    });


    // ==============================
    // TARGET FOUND
    // ==============================

    scene.addEventListener("targetFound", async (e) => {

        const target = e.target;

        const data =
            target.getAttribute("mindar-image-target");

        const index = data.targetIndex;

        console.log("TARGET FOUND:", index);

        activeTarget = target;


        // توقف تمام ویدیوهای دیگر

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


    // ==============================
    // TARGET LOST
    // ==============================

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
