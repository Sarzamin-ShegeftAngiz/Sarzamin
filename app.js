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
       متن آماده اشتراک گذاری
    ===================================== */

    const shareText =
`🎉 دفتر من زنده شددد! 😍📱
باور نمی‌کنی؟!

دوربین گوشیتو بگیر روی دفتر و ببین چه اتفاقی می‌افته! 🤯✨

🎨 می‌خوای ببینی کدوم طرح‌ها زنده میشن؟
بیا توی اینستاگرام @SarzaminAr 👀💜

اونجا طرح‌های زنده رو ببین و اگه دوست داری طرح دفتر خودتم زنده کنیم، بهمون بگو! 😍🔥

🚀 سرزمین شگفت‌انگیز؛ جایی که دفترها زنده میشن!`;


    /* =====================================
       SHARE
    ===================================== */

    async function shareSarzamin() {

        console.log("🔴 SHARE AREA TOUCHED");

        if (navigator.share) {

            try {

                await navigator.share({
                    title: "سرزمین شگفت‌انگیز",
                    text: shareText
                });

                console.log("✅ SHARE SUCCESS");

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
       فقط Target 1
       ===================================== */

    const target1 =
        document.querySelector(
            '[mindar-image-target="targetIndex: 0"]'
        );


    if (target1) {

        const shareButton =
            target1.querySelector(".shareButton");


        if (shareButton) {

            console.log("✅ TARGET 1 SHARE AREA FOUND");


            /*
             * کلیک
             */

            shareButton.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();
                    event.stopPropagation();

                    console.log(
                        "🟢 TARGET 1 CLICK"
                    );

                    shareSarzamin();

                }
            );


            /*
             * لمس مستقیم موبایل
             */

            shareButton.addEventListener(
                "touchend",
                (event) => {

                    event.preventDefault();
                    event.stopPropagation();

                    console.log(
                        "🟢 TARGET 1 TOUCH"
                    );

                    shareSarzamin();

                },
                {
                    passive: false
                }
            );

        }

    }


    /* =====================================
       AR READY
    ===================================== */

    scene.addEventListener(
        "arReady",
        () => {

            console.log(
                "AR READY - 30 TARGETS"
            );

        }
    );


    /* =====================================
       TARGET FOUND
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


            /* توقف ویدیوهای دیگر */

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


            /* ویدیوی مربوط به تارگت */

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

});
