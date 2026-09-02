document.addEventListener("DOMContentLoaded", () => {

    const scene = document.querySelector("a-scene");

    const videos = [
        document.querySelector("#video0"),
        document.querySelector("#video1"),
        document.querySelector("#video2"),
        document.querySelector("#video3"),
        document.querySelector("#video4"),
        document.querySelector("#video5")
    ];

    const targets = [
        document.querySelector('[mindar-image-target="targetIndex:0"]'),
        document.querySelector('[mindar-image-target="targetIndex:1"]'),
        document.querySelector('[mindar-image-target="targetIndex:2"]'),
        document.querySelector('[mindar-image-target="targetIndex:3"]'),
        document.querySelector('[mindar-image-target="targetIndex:4"]'),
        document.querySelector('[mindar-image-target="targetIndex:5"]')
    ];

    let activeTarget = null;


    // ================================
    // AR READY
    // ================================

    scene.addEventListener("arReady", () => {

        console.log("AR READY");

    });


    // ================================
    // TARGET FOUND
    // ================================

    scene.addEventListener("targetFound", async (e) => {

        const target = e.target;

        const data =
            target.getAttribute("mindar-image-target");

        const index =
            data.targetIndex;

        console.log("TARGET FOUND:", index);

        activeTarget = target;


        // توقف همه ویدئوهای دیگر
        videos.forEach((video, i) => {

            if (video && i !== index) {

                video.pause();

            }

        });


        // ویدئوی تارگت فعلی
        const video = videos[index];

        if (!video) {

            return;

        }

        video.currentTime = 0;

        video.muted = false;


        try {

            await video.play();

            console.log(
                "VIDEO PLAYING:",
                index
            );

        }

        catch (err) {

            console.log(
                "VIDEO ERROR:",
                index,
                err
            );

        }

    });


    // ================================
    // TARGET LOST
    // ================================

    scene.addEventListener("targetLost", (e) => {

        const target = e.target;

        const data =
            target.getAttribute("mindar-image-target");

        const index =
            data.targetIndex;

        console.log(
            "TARGET LOST:",
            index
        );

        const video = videos[index];

        if (video) {

            video.pause();

        }

        if (activeTarget === target) {

            activeTarget = null;

        }

    });


    // ================================
    // لمس روی Instagram و Share
    // ================================

    document.addEventListener(
        "touchend",
        (event) => {

            if (!activeTarget) {

                return;

            }

            if (
                !scene.camera ||
                !scene.renderer
            ) {

                return;

            }

            const touch =
                event.changedTouches[0];

            if (!touch) {

                return;

            }

            const canvas =
                scene.renderer.domElement;

            const rect =
                canvas.getBoundingClientRect();


            // مختصات لمس
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


            // Raycaster
            const raycaster =
                new THREE.Raycaster();

            raycaster.setFromCamera(
                mouse,
                scene.camera
            );


            // ================================
            // INSTAGRAM
            // ================================

            const instagramZone =
                activeTarget.querySelector(
                    ".instagram-zone"
                );

            if (instagramZone) {

                const instagramMesh =
                    instagramZone.getObject3D("mesh");

                if (instagramMesh) {

                    const instagramHits =
                        raycaster.intersectObject(
                            instagramMesh,
                            true
                        );

                    if (
                        instagramHits.length > 0
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


            // ================================
            // SHARE
            // ================================

            const shareZone =
                activeTarget.querySelector(
                    ".share-zone"
                );

            if (!shareZone) {

                return;

            }

            const shareMesh =
                shareZone.getObject3D("mesh");

            if (!shareMesh) {

                return;

            }

            const shareHits =
                raycaster.intersectObject(
                    shareMesh,
                    true
                );


            if (
                shareHits.length > 0
            ) {

                console.log(
                    "SHARE PRESSED"
                );


                // لینک همین صفحه
                const shareURL =
                    window.location.href;


                // متن پیام
                const shareText =
                    "📚✨ این فقط یه دفتر معمولی نیست!\n\n" +
                    "این دفتر می‌تونه زنده بشه! 😱\n" +
                    "دوربین گوشیت رو بگیر روی جلد و خودت ببین چه اتفاقی می‌افته! 👀\n\n" +
                    "🔥 حالا اگه دوست داری طرح‌های زنده‌ی دیگه رو هم ببینی، " +
                    "این لینک رو بزن و بیا آیدی اینستاگرام سرزمین شگفت‌انگیز رو ببین!\n" +
                    "شاید طرح مورد علاقه‌ات اونجا منتظرت باشه 😍📚\n\n" +
                    "اگه دفترت هنوز زنده نشده، درخواست زنده‌شدنش رو بده! 😉✨";


                // ================================
                // Share گوشی
                // ================================

                if (navigator.share) {

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

                    .catch((err) => {

                        console.log(
                            "SHARE CANCELLED",
                            err
                        );

                    });

                }


                // ================================
                // اگر Share پشتیبانی نشد
                // ================================

                else {

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

            }

        },

        {
            passive: true
        }

    );

});
