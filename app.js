document.addEventListener("DOMContentLoaded", () => {

    const scene = document.querySelector("a-scene");

    const videos = [];

    // Group2 = ویدئوهای 21 تا 40
    for (let i = 0; i < 20; i++) {

        const video =
            document.querySelector("#video" + i);

        videos.push(video);

    }


    let activeTarget = null;
    let activeVideo = null;

    let firstPlayFinished = false;



    // =============================
    // AR READY
    // =============================

    scene.addEventListener("arReady", () => {

        console.log("AR READY - GROUP 2");

    });



    // =============================
    // TARGET FOUND
    // =============================

    scene.addEventListener("targetFound", async (event) => {

        const target = event.target;

        const data =
            target.getAttribute("mindar-image-target");

        if (!data) return;

        const index =
            Number(data.targetIndex);

        console.log("TARGET FOUND:", index);

        activeTarget = target;


        // -----------------------------
        // توقف همه ویدئوهای دیگر
        // -----------------------------

        videos.forEach((video, i) => {

            if (!video) return;

            if (i !== index) {

                video.pause();

            }

        });


        // -----------------------------
        // ویدئوی مربوط به Target
        // -----------------------------

        const video = videos[index];

        if (!video) {

            console.log(
                "VIDEO NOT FOUND:",
                index
            );

            return;

        }


        activeVideo = video;


        // -----------------------------
        // شروع از ابتدا
        // -----------------------------

        video.currentTime = 0;

        video.muted = false;


        try {

            await video.play();

            console.log(
                "VIDEO PLAYING:",
                index
            );

        }

        catch (error) {

            console.log(
                "VIDEO PLAY ERROR:",
                error
            );


            // تلاش دوباره به صورت بی‌صدا

            video.muted = true;

            try {

                await video.play();

                console.log(
                    "VIDEO PLAYING MUTED:",
                    index
                );

            }

            catch (error2) {

                console.log(
                    "VIDEO STILL FAILED:",
                    error2
                );

            }

        }


        // -----------------------------
        // متن‌ها
        // -----------------------------

        hideAfterTexts(target);

        firstPlayFinished = false;

        watchFirstLoop(
            video,
            target
        );

    });



    // =============================
    // TARGET LOST
    // =============================

    scene.addEventListener("targetLost", (event) => {

        const target = event.target;

        const data =
            target.getAttribute("mindar-image-target");

        if (!data) return;

        const index =
            Number(data.targetIndex);

        console.log(
            "TARGET LOST:",
            index
        );


        const video =
            videos[index];

        if (video) {

            video.pause();

        }


        if (activeTarget === target) {

            activeTarget = null;

            activeVideo = null;

        }

    });



    // =============================
    // اولین دور ویدئو
    // =============================

    function watchFirstLoop(
        video,
        target
    ) {

        function check() {

            if (
                activeTarget !== target
            ) {

                return;

            }


            if (firstPlayFinished) {

                return;

            }


            if (
                video.duration &&
                video.duration > 0 &&
                video.currentTime >=
                video.duration - 0.15
            ) {

                firstPlayFinished = true;

                showAfterTexts(target);

                console.log(
                    "FIRST LOOP FINISHED"
                );

                return;

            }


            requestAnimationFrame(check);

        }


        requestAnimationFrame(check);

    }



    // =============================
    // مخفی کردن متن‌ها
    // =============================

    function hideAfterTexts(target) {

        const texts =
            target.querySelectorAll(
                ".after-video-text"
            );


        texts.forEach((text) => {

            text.setAttribute(
                "visible",
                "false"
            );

        });

    }



    // =============================
    // نمایش متن‌ها
    // =============================

    function showAfterTexts(target) {

        const texts =
            target.querySelectorAll(
                ".after-video-text"
            );


        texts.forEach((text) => {

            text.setAttribute(
                "visible",
                "true"
            );

        });

    }



    // =============================
    // TOUCH
    // =============================

    document.addEventListener(
        "touchend",
        async (event) => {

            if (!activeTarget) return;

            if (
                !scene.camera ||
                !scene.renderer
            ) {

                return;

            }


            const touch =
                event.changedTouches[0];

            if (!touch) return;


            const canvas =
                scene.renderer.domElement;

            const rect =
                canvas.getBoundingClientRect();


            const mouse =
                new THREE.Vector2();


            mouse.x =
                (
                    (touch.clientX - rect.left)
                    / rect.width
                ) * 2 - 1;


            mouse.y =
                -(
                    (touch.clientY - rect.top)
                    / rect.height
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

                const mesh =
                    instagramZone.getObject3D(
                        "mesh"
                    );


                if (mesh) {

                    const hits =
                        raycaster.intersectObject(
                            mesh,
                            true
                        );


                    if (hits.length > 0) {

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


            if (shareZone) {

                const mesh =
                    shareZone.getObject3D(
                        "mesh"
                    );


                if (mesh) {

                    const hits =
                        raycaster.intersectObject(
                            mesh,
                            true
                        );


                    if (hits.length > 0) {

                        const shareText =
                            "یه چیز خیلی باحال پیدا کردم! 😍📚 " +
                            "فکر کن یه دفتر معمولی رو با دوربین گوشیت بگیری و یهو زنده بشه! 🤯✨ " +
                            "شخصیت روی دفتر شروع می‌کنه به حرکت و انگار خود دفتر جون می‌گیره! 😍 " +
                            "اگه کنجکاوی ببینی چطوریه، این لینک رو باز کن و دوربین گوشیت رو روی دفتر بگیر 👇 " +
                            "بعدش حتماً یکی از دوستات رو هم سورپرایز کن! 😉🔥";


                        if (navigator.share) {

                            try {

                                await navigator.share({

                                    title:
                                        "Sarzamin AR",

                                    text:
                                        shareText,

                                    url:
                                        window.location.href

                                });

                            }

                            catch (error) {

                                console.log(
                                    "Share cancelled:",
                                    error
                                );

                            }

                        }

                        else {

                            try {

                                await navigator.clipboard.writeText(

                                    shareText +
                                    "\n" +
                                    window.location.href

                                );


                                alert(
                                    "متن آماده شد و کپی شد 😊"
                                );

                            }

                            catch (error) {

                                console.log(
                                    "Clipboard error:",
                                    error
                                );

                            }

                        }


                        return;

                    }

                }

            }

        },

        { passive: true }

    );

});
