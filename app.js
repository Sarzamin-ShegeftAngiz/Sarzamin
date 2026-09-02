document.addEventListener("DOMContentLoaded", () => {

    const scene =
        document.querySelector("a-scene");


    const videos = [

        document.querySelector("#video0"),
        document.querySelector("#video1"),
        document.querySelector("#video2"),
        document.querySelector("#video3"),
        document.querySelector("#video4"),
        document.querySelector("#video5")

    ];


    let activeTarget = null;


    /*
    =================================
    AR READY
    =================================
    */

    scene.addEventListener(
        "arReady",
        () => {

            console.log("AR READY");

        }
    );


    /*
    =================================
    TARGET FOUND
    =================================
    */

    scene.addEventListener(
        "targetFound",
        async (e) => {

            const target =
                e.target;


            const data =
                target.getAttribute(
                    "mindar-image-target"
                );


            const index =
                data.targetIndex;


            console.log(
                "TARGET FOUND:",
                index
            );


            activeTarget =
                target;


            /*
            توقف بقیه ویدئوها
            */

            videos.forEach(
                (video, i) => {

                    if (
                        video &&
                        i !== index
                    ) {

                        video.pause();

                    }

                }
            );


            /*
            متن‌ها دوباره مخفی شوند
            */

            const liveText =
                target.querySelector(
                    ".live-text"
                );

            const surpriseText =
                target.querySelector(
                    ".surprise-text"
                );


            if (liveText) {

                liveText.setAttribute(
                    "visible",
                    false
                );

            }


            if (surpriseText) {

                surpriseText.setAttribute(
                    "visible",
                    false
                );

            }


            const video =
                videos[index];


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


                /*
                =================================
                بعد از یک بار کامل شدن ویدیو
                نوشته‌ها ظاهر شوند
                =================================
                */

                const showTextsOnce =
                    () => {

                        if (
                            activeTarget !== target
                        ) {

                            return;

                        }


                        if (liveText) {

                            liveText.setAttribute(
                                "visible",
                                true
                            );

                        }


                        if (surpriseText) {

                            surpriseText.setAttribute(
                                "visible",
                                true
                            );

                        }


                        console.log(
                            "TEXTS VISIBLE"
                        );

                    };


                /*
                فقط اولین پایان ویدیو
                */

                video.addEventListener(
                    "ended",
                    showTextsOnce,
                    {
                        once: true
                    }
                );


                /*
                اگر ویدیو Loop باشد،
                مرورگر ممکن است ended را اجرا نکند.
                بنابراین زمان پایان را بررسی می‌کنیم.
                */

                const checkEnd =
                    () => {

                        if (
                            activeTarget !== target
                        ) {

                            return;

                        }


                        if (
                            video.duration &&
                            video.currentTime >=
                            video.duration - 0.15
                        ) {

                            showTextsOnce();

                            return;

                        }


                        if (
                            !video.paused
                        ) {

                            requestAnimationFrame(
                                checkEnd
                            );

                        }

                    };


                requestAnimationFrame(
                    checkEnd
                );


            }

            catch (err) {

                console.log(
                    "VIDEO ERROR:",
                    index,
                    err
                );

            }

        }
    );


    /*
    =================================
    TARGET LOST
    =================================
    */

    scene.addEventListener(
        "targetLost",
        (e) => {

            const target =
                e.target;


            const data =
                target.getAttribute(
                    "mindar-image-target"
                );


            const index =
                data.targetIndex;


            console.log(
                "TARGET LOST:",
                index
            );


            const video =
                videos[index];


            if (video) {

                video.pause();

            }


            if (
                activeTarget === target
            ) {

                activeTarget = null;

            }

        }
    );


    /*
    =================================
    TOUCH
    =================================
    */

    document.addEventListener(
        "touchend",
        async (event) => {

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
                scene.camera
            );


            /*
            =================================
            INSTAGRAM
            =================================
            */

            const instagramZone =
                activeTarget.querySelector(
                    ".instagram-zone"
                );


            if (instagramZone) {

                const instagramMesh =
                    instagramZone.getObject3D(
                        "mesh"
                    );


                if (instagramMesh) {

                    const hits =
                        raycaster.intersectObject(
                            instagramMesh,
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
            =================================
            SHARE
            =================================
            */

            const shareZone =
                activeTarget.querySelector(
                    ".share-zone"
                );


            if (shareZone) {

                const shareMesh =
                    shareZone.getObject3D(
                        "mesh"
                    );


                if (shareMesh) {

                    const hits =
                        raycaster.intersectObject(
                            shareMesh,
                            true
                        );


                    if (
                        hits.length > 0
                    ) {

                        console.log(
                            "SHARE PRESSED"
                        );


                        const shareText =
                            "یه چیز خیلی باحال پیدا کردم! 😍📚 " +
                            "فکر کن یه دفتر معمولی رو با دوربین گوشیت بگیری و یهو زنده بشه! 🤯✨ " +
                            "شخصیت روی دفتر شروع می‌کنه به حرکت و انگار خود دفتر جون می‌گیره! 😍 " +
                            "اگه کنجکاوی ببینی چطوریه، این لینک رو باز کن و دوربین گوشیت رو روی دفتر بگیر 👇 " +
                            "بعدش حتماً یکی از دوستات رو هم سورپرایز کن! 😉🔥";


                        if (
                            navigator.share
                        ) {

                            try {

                                await navigator.share({

                                    title:
                                        "سرزمین شگفت‌انگیز",

                                    text:
                                        shareText,

                                    url:
                                        window.location.href

                                });

                            }

                            catch (err) {

                                console.log(
                                    "SHARE CANCELLED",
                                    err
                                );

                            }

                        }

                        else {

                            alert(
                                "اشتراک‌گذاری در این مرورگر پشتیبانی نمی‌شود."
                            );

                        }


                        return;

                    }

                }

            }

        },

        {
            passive: true
        }

    );

});
