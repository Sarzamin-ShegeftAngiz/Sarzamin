document.addEventListener("DOMContentLoaded", () => {

    const scene = document.querySelector("a-scene");

    const videos = [];

    for (let i = 0; i < 30; i++) {
        videos.push(
            document.querySelector("#video" + i)
        );
    }

    let activeTarget = null;


    // --------------------------------
    // متن آماده اشتراک گذاری
    // --------------------------------

    const shareText =
`🎉 دفتر من زنده شددد! 😍📱
باور نمی‌کنی؟!

دوربین گوشیتو بگیر روی دفتر و ببین چه اتفاقی می‌افته! 🤯✨

🎨 می‌خوای ببینی کدوم طرح‌ها زنده میشن؟
بیا توی اینستاگرام @SarzaminAr 👀💜

اونجا طرح‌های زنده رو ببین و اگه دوست داری طرح دفتر خودتم زنده کنیم، بهمون بگو! 😍🔥

🚀 سرزمین شگفت‌انگیز؛ جایی که دفترها زنده میشن!`;


    // --------------------------------
    // اشتراک گذاری
    // --------------------------------

    async function shareSarzamin() {

        console.log("SHARE BUTTON CLICKED");


        if (navigator.share) {

            try {

                await navigator.share({

                    title: "سرزمین شگفت‌انگیز",

                    text: shareText

                });

                console.log("SHARE SUCCESS");

            } catch (err) {

                console.log(
                    "SHARE CANCELLED:",
                    err
                );

            }

        } else {

            // اگر مرورگر Share را پشتیبانی نکرد
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


    // --------------------------------
    // فعال کردن دکمه اشتراک روی تارگت‌ها
    // --------------------------------

    const shareButtons =
        document.querySelectorAll(
            ".shareButton"
        );


    shareButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                (event) => {

                    event.stopPropagation();

                    shareSarzamin();

                }
            );


            button.addEventListener(
                "touchstart",
                (event) => {

                    event.preventDefault();

                    event.stopPropagation();

                    shareSarzamin();

                },
                {
                    passive: false
                }
            );

        }
    );


    // --------------------------------
    // AR آماده شد
    // --------------------------------

    scene.addEventListener(
        "arReady",
        () => {

            console.log(
                "AR READY - 30 TARGETS"
            );

        }
    );


    // --------------------------------
    // تارگت پیدا شد
    // --------------------------------

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


            // توقف همه ویدیوهای دیگر
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


            // فقط همین ویدیو لود شود
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


                // حالت بی‌صدا در صورت محدودیت مرورگر
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


    // --------------------------------
    // تارگت گم شد
    // --------------------------------

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
