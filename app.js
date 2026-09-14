document.addEventListener("DOMContentLoaded", () => {

    const scene = document.querySelector("a-scene");

    const videos = [];

    for (let i = 0; i < 30; i++) {

        videos.push(
            document.querySelector("#video" + i)
        );

    }

    let activeTarget = null;


    // ================================
    // SHARE TEXT
    // ================================

    const shareText =
`🎉 دفتر من زنده شددد! 😍📱
باور نمی‌کنی؟!

دوربین گوشیتو بگیر روی دفتر و ببین چه اتفاقی می‌افته! 🤯✨

🎨 می‌خوای ببینی کدوم طرح‌ها زنده میشن؟
بیا توی اینستاگرام @SarzaminAr 👀💜

اونجا طرح‌های زنده رو ببین و اگه دوست داری طرح دفتر خودتم زنده کنیم، بهمون بگو! 😍🔥

🚀 سرزمین شگفت‌انگیز؛ جایی که دفترها زنده میشن!`;


    // ================================
    // SHARE FUNCTION
    // ================================

    async function shareSarzamin() {

        console.log("🟢 SHARE CLICKED");


        const shareURL =
            window.location.href;


        if (navigator.share) {

            try {

                await navigator.share({

                    title:
                        "سرزمین شگفت‌انگیز 📚✨",

                    text:
                        shareText,

                    url:
                        shareURL

                });

                console.log(
                    "✅ SHARE SUCCESS"
                );

            }
            catch (err) {

                console.log(
                    "SHARE CANCELLED",
                    err
                );

            }

        }

        else {

            try {

                await navigator.clipboard.writeText(
                    shareText +
                    "\n\n" +
                    shareURL
                );

                alert(
                    "متن و لینک کپی شد ❤️"
                );

            }
            catch (err) {

                prompt(
                    "این متن و لینک را برای دوستت بفرست:",
                    shareText +
                    "\n\n" +
                    shareURL
                );

            }

        }

    }


    // ================================
    // SHARE CLICK
    // ================================

    scene.addEventListener(
        "click",
        (event) => {

            console.log(
                "CLICK EVENT"
            );


            const clickedObject =
                event.detail &&
                event.detail.intersection &&
                event.detail.intersection.object;


            if (!clickedObject) {

                console.log(
                    "NO INTERSECTION"
                );

                return;

            }


            const shareZone =
                document.querySelector(
                    ".share-zone"
                );


            if (!shareZone) {

                return;

            }


            const shareMesh =
                shareZone.getObject3D(
                    "mesh"
                );


            if (!shareMesh) {

                return;

            }


            let object =
                clickedObject;


            let isShare =
                false;


            while (object) {

                if (
                    object === shareMesh
                ) {

                    isShare = true;

                    break;

                }

                object =
                    object.parent;

            }


            if (!isShare) {

                console.log(
                    "CLICK WAS NOT ON SHARE"
                );

                return;

            }


            console.log(
                "🎯 SHARE ZONE CLICKED"
            );


            shareSarzamin();

        }

    );


    // ================================
    // AR READY
    // ================================

    scene.addEventListener(
        "arReady",
        () => {

            console.log(
                "AR READY - 30 TARGETS"
            );

        }
    );


    // ================================
    // TARGET FOUND
    // ================================

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


            // توقف ویدیوهای دیگر

            videos.forEach(
                (video, i) => {

                    if (!video) {
                        return;
                    }


                    if (i !== index) {

                        video.pause();


                        try {

                            video.currentTime = 0;

                        }
                        catch (err) {}

                    }

                }
            );


            // ویدیوی مربوط به Target

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

            }
            catch (err) {}


            video.load();


            video.muted = false;

            video.volume = 1;


            try {

                await video.play();


                console.log(
                    "VIDEO PLAYING:",
                    index
                );

            }
            catch (err) {

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

                }
                catch (err2) {

                    console.log(
                        "VIDEO PLAY ERROR 2:",
                        err2
                    );

                }

            }

        }

    );


    // ================================
    // TARGET LOST
    // ================================

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

                }
                catch (err) {}

            }


            if (
                activeTarget === target
            ) {

                activeTarget = null;

            }

        }

    );

});
