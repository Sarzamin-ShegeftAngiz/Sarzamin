document.addEventListener("DOMContentLoaded", () => {

    const scene = document.querySelector("a-scene");

    const videos = [];

    for (let i = 0; i < 30; i++) {

        videos.push(
            document.querySelector("#video" + i)
        );

    }


    let activeTarget = null;


    /* =====================================
       AR READY
    ===================================== */

    scene.addEventListener("arReady", () => {

        console.log("AR READY - 30 TARGETS");

    });


    /* =====================================
       TARGET FOUND
       سیستم اصلی ۳۰ ویدیو
    ===================================== */

    scene.addEventListener(
        "targetFound",

        async (e) => {

            const target = e.target;


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


            activeTarget = target;


            /* توقف همه ویدیوهای دیگر */

            videos.forEach(
                (video, i) => {

                    if (!video) return;


                    if (i !== index) {

                        video.pause();


                        try {

                            video.currentTime = 0;

                        } catch (err) {}

                    }

                }
            );


            const video =
                videos[index];


            if (!video) {

                console.log(
                    "VIDEO NOT FOUND:",
                    index
                );

                return;

            }


            console.log(
                "LOADING VIDEO:",
                index
            );


            try {

                video.currentTime = 0;

            } catch (err) {}


            /* فقط همین ویدیو لود شود */

            video.load();


            video.muted = false;

            video.volume = 1;


            try {

                await video.play();


                console.log(
                    "VIDEO PLAYING:",
                    index
                );


            } catch (err) {

                console.log(
                    "VIDEO PLAY ERROR:",
                    err
                );


                /* اگر صدای خودکار اجازه داده نشد */

                video.muted = true;


                try {

                    await video.play();


                    console.log(
                        "VIDEO PLAYING MUTED:",
                        index
                    );


                } catch (err2) {

                    console.log(
                        "VIDEO PLAY ERROR 2:",
                        err2
                    );

                }

            }

        }

    );


    /* =====================================
       TARGET LOST
    ===================================== */

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


                try {

                    video.currentTime = 0;

                } catch (err) {}

            }


            if (
                activeTarget === target
            ) {

                activeTarget = null;

            }

        }

    );



    /* =====================================
       SHARE SYSTEM
    ===================================== */

    const shareOverlay =
        document.getElementById(
            "shareOverlay"
        );


    const target1 =
        document.querySelector(
            '[mindar-image-target="targetIndex: 0"]'
        );


    const shareText = `🎉 دفتر من زنده شددد! 😍📱
باور نمی‌کنی؟!
دوربین گوشیتو بگیر روی دفتر و ببین چه اتفاقی می‌افته! 🤯✨

🎨 می‌خوای ببینی کدوم طرح‌ها زنده میشن؟
بیا توی اینستاگرام @SarzaminAr 👀💜

اونجا طرح‌های زنده رو ببین و اگه دوست داری طرح دفتر خودتم زنده کنیم، بهمون بگو! 😍🔥

🚀 سرزمین شگفت‌انگیز؛ جایی که دفترها زنده میشن!`;


    /* =====================================
       باز کردن Share گوشی
    ===================================== */

    async function shareSarzamin() {

        console.log(
            "SHARE CLICK"
        );


        if (
            navigator.share
        ) {

            try {

                await navigator.share({

                    title:
                        "سرزمین شگفت‌انگیز",

                    text:
                        shareText

                });


                console.log(
                    "SHARE SUCCESS"
                );


            } catch (err) {

                console.log(
                    "SHARE CANCELLED:",
                    err
                );

            }

        } else {

            try {

                await navigator.clipboard.writeText(
                    shareText
                );


                alert(
                    "متن آماده کپی شد 😊"
                );


            } catch (err) {

                alert(
                    "امکان اشتراک‌گذاری در این مرورگر وجود ندارد."
                );

            }

        }

    }



    /* =====================================
       کلیک روی ناحیه Share
    ===================================== */

    if (shareOverlay) {

        shareOverlay.addEventListener(
            "click",

            (e) => {

                e.preventDefault();

                e.stopPropagation();

                shareSarzamin();

            }

        );

    }



    /* =====================================
       دنبال کردن Target 1
    ===================================== */

    let target1Visible = false;


    scene.addEventListener(
        "targetFound",

        (e) => {

            if (
                e.target === target1
            ) {

                target1Visible = true;

            }

        }

    );


    scene.addEventListener(
        "targetLost",

        (e) => {

            if (
                e.target === target1
            ) {

                target1Visible = false;


                if (shareOverlay) {

                    shareOverlay.style.display =
                        "none";

                }

            }

        }

    );



    /* =====================================
       محاسبه جای Share
       
       مختصات دقیق:
       0 -0.60 0.02
    ===================================== */

    function updateShareOverlay() {

        if (
            !shareOverlay ||
            !target1 ||
            !target1Visible ||
            !target1.object3D.visible
        ) {

            if (shareOverlay) {

                shareOverlay.style.display =
                    "none";

            }


            requestAnimationFrame(
                updateShareOverlay
            );


            return;

        }


        const camera =
            scene.camera;


        const canvas =
            scene.canvas;


        if (
            !camera ||
            !canvas
        ) {

            requestAnimationFrame(
                updateShareOverlay
            );


            return;

        }


        /*
         مختصات Share روی Target
        */

        const position =
    new THREE.Vector3(
        0.4,
        -0.6,
        0.02
    );


        /*
         تبدیل مختصات Target
         به مختصات جهان
        */

        target1.object3D.localToWorld(
            position
        );


        /*
         تبدیل مختصات جهان
         به مختصات دوربین
        */

        position.project(
            camera
        );


        const rect =
            canvas.getBoundingClientRect();


        /*
         مختصات صفحه
        */

        const x =
            rect.left +
            (
                (position.x + 1) *
                0.5 *
                rect.width
            );


        const y =
            rect.top +
            (
                (1 - position.y) *
                0.5 *
                rect.height
            );


        shareOverlay.style.left =
            `${x}px`;


        shareOverlay.style.top =
            `${y}px`;


        shareOverlay.style.display =
            "block";


        requestAnimationFrame(
            updateShareOverlay
        );

    }



    /* =====================================
       شروع دنبال کردن Target
    ===================================== */

    scene.addEventListener(
        "renderstart",

        () => {

            requestAnimationFrame(
                updateShareOverlay
            );

        }

    );

});
