document.addEventListener("DOMContentLoaded", () => {

    const scene = document.querySelector("a-scene");

    const videos = [];

    for (let i = 0; i < 30; i++) {
        videos.push(
            document.querySelector("#video" + i)
        );
    }

    let activeTarget = null;


    scene.addEventListener("arReady", () => {
        console.log("AR READY - 30 TARGETS");
    });


    scene.addEventListener("targetFound", async (e) => {

        const target = e.target;

        const data =
            target.getAttribute("mindar-image-target");

        const index = data.targetIndex;

        console.log("TARGET FOUND:", index);

        activeTarget = target;


        videos.forEach((video, i) => {

            if (video && i !== index) {
                video.pause();
            }

        });


        const video = videos[index];

        if (!video) {
            console.log("VIDEO NOT FOUND:", index);
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

        } catch (err) {

            console.log(
                "VIDEO ERROR:",
                index,
                err
            );

        }

    });


    scene.addEventListener("targetLost", (e) => {

        const target = e.target;

        const data =
            target.getAttribute("mindar-image-target");

        const index = data.targetIndex;

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


            const mouse =
                new THREE.Vector2();


            mouse.x =
                (
                    (
                        touch.clientX -
                        rect.left
                    ) /
                    rect.width
                ) * 2 - 1;


            mouse.y =
                -(
                    (
                        touch.clientY -
                        rect.top
                    ) /
                    rect.height
                ) * 2 + 1;


            const raycaster =
                new THREE.Raycaster();


            raycaster.setFromCamera(
                mouse,
                scene.camera
            );


            // =============================
            // INSTAGRAM
            // =============================

            const instagramZone =
                activeTarget.querySelector(
                    ".instagram-zone"
                );


            if (instagramZone) {

                const instagramMesh =
                    instagramZone.getObject3D("mesh");


                if (instagramMesh) {

                    const hits =
                        raycaster.intersectObject(
                            instagramMesh,
                            true
                        );


                    if (hits.length > 0) {

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


            // =============================
            // SHARE
            // =============================

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


            if (shareHits.length > 0) {

                console.log(
                    "SHARE PRESSED"
                );


                const shareURL =
                    window.location.href;


                const shareText =
                    "📚✨ این فقط یه دفتر معمولی نیست!\n\n" +
                    "این دفتر می‌تونه زنده بشه! 😱\n" +
                    "دوربین گوشیت رو بگیر روی جلد و خودت ببین چه اتفاقی می‌افته! 👀\n\n" +
                    "🔥 طرح‌های زنده‌ی دیگه رو هم ببین!\n" +
                    "سرزمین شگفت‌انگیز 😍📚";


                if (navigator.share) {

                    navigator.share({

                        title:
                            "سرزمین شگفت‌انگیز 📚✨",

                        text:
                            shareText,

                        url:
                            shareURL

                    }).catch((err) => {

                        console.log(
                            "SHARE CANCELLED",
                            err
                        );

                    });

                } else {

                    navigator.clipboard
                        .writeText(
                            shareText +
                            "\n\n" +
                            shareURL
                        )

                        .then(() => {

                            alert(
                                "متن و لینک کپی شد ❤️"
                            );

                        })

                        .catch(() => {

                            prompt(
                                "این متن و لینک را بفرست:",
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
