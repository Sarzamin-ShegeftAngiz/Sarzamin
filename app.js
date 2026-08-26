console.log("APP JS START");

document.addEventListener("DOMContentLoaded", () => {

    console.log("DOM READY");

    const scene = document.querySelector("a-scene");

    /* =================================
       FIREBASE
    ================================= */

    const auth = firebase.auth();
    const db = firebase.firestore();

    let currentUser = null;

    /* ساخت حساب ناشناس */
    auth.onAuthStateChanged((user) => {

        if (user) {

            currentUser = user;

            console.log(
                "FIREBASE USER READY:",
                user.uid
            );

        }

    });

    auth.signInAnonymously()
        .then((result) => {

            currentUser = result.user;

            console.log(
                "ANONYMOUS LOGIN OK:",
                currentUser.uid
            );

        })
        .catch((error) => {

            console.error(
                "ANONYMOUS LOGIN ERROR:",
                error
            );

        });


    /* =================================
       VIDEOS
    ================================= */

    const videos = [

        document.querySelector("#video0"),
        document.querySelector("#video1"),
        document.querySelector("#video2"),
        document.querySelector("#video3"),
        document.querySelector("#video4"),
        document.querySelector("#video5")

    ];


    /* =================================
       شخصیت‌ها
    ================================= */

    const characters = [

        "choromi",
        "character2",
        "character3",
        "character4",
        "character5",
        "character6"

    ];


    /* =================================
       VARIABLES
    ================================= */

    let currentTargetIndex = null;

    let currentCharacter = null;

    let activeTarget = null;

    let animationFinishedOnce = false;


    /* =================================
       RECEIVE UI
    ================================= */

    const receiveBox =
        document.querySelector("#receiveBox");

    const receiveButton =
        document.querySelector("#receiveButton");

    const receiveMessage =
        document.querySelector("#receiveMessage");


    /* =================================
       TARGET FOUND
    ================================= */

    scene.addEventListener(
        "targetFound",
        async (event) => {

            const target =
                event.target;

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

            currentTargetIndex =
                index;

            currentCharacter =
                characters[index];

            animationFinishedOnce =
                false;


            /* دکمه مخفی شود */

            receiveBox.style.display =
                "none";

            receiveMessage.innerText =
                "";

            receiveButton.disabled =
                false;

            receiveButton.innerText =
                "🎁 دریافت این شخصیت";


            /* =================================
               توقف ویدئوهای دیگر
            ================================= */

            videos.forEach(
                (video, i) => {

                    if (
                        video &&
                        i !== index
                    ) {

                        video.pause();

                        video.currentTime = 0;

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


            /* =================================
               ویدئو باید همیشه Loop باشد
            ================================= */

            video.loop = true;

            video.muted = false;


            /*
            فقط برای اینکه بفهمیم
            اولین دور تمام شده
            */

            video.onended = null;


            let firstPlayFinished = false;


            const firstLoopFinished = () => {

                if (firstPlayFinished) {

                    return;

                }


                firstPlayFinished = true;

                animationFinishedOnce = true;


                console.log(
                    "FIRST ANIMATION FINISHED"
                );


                /*
                دکمه را نشان بده
                */

                receiveBox.style.display =
                    "block";


                receiveMessage.innerText =
                    "برای دریافت این شخصیت کلیک کنید 🎁";


                /*
                از اینجا به بعد
                ویدئو همچنان Loop می‌شود
                */

            };


            /*
            چون loop فعال است،
            ended همیشه اجرا نمی‌شود.
            بنابراین timeupdate را بررسی می‌کنیم.
            */

            const checkVideoEnd = () => {

                if (
                    !firstPlayFinished &&
                    video.duration &&
                    video.currentTime >=
                    video.duration - 0.15
                ) {

                    firstLoopFinished();

                }

            };


            video.addEventListener(
                "timeupdate",
                checkVideoEnd
            );


            /*
            شروع ویدئو
            */

            video.currentTime = 0;


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


                /*
                اگر صدا اجازه نداد
                */

                video.muted = true;


                try {

                    await video.play();

                }

                catch (error2) {

                    console.log(
                        "VIDEO SECOND ERROR:",
                        error2
                    );

                }

            }

        }
    );


    /* =================================
       TARGET LOST
    ================================= */

    scene.addEventListener(
        "targetLost",
        (event) => {

            const target =
                event.target;

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


            /*
            فقط اگر هنوز دور اول تمام نشده
            دکمه را مخفی کن
            */

            if (!animationFinishedOnce) {

                receiveBox.style.display =
                    "none";

            }

        }
    );


    /* =================================
       RECEIVE CHARACTER
    ================================= */

    receiveButton.addEventListener(
        "click",
        async () => {

            console.log(
                "RECEIVE BUTTON CLICKED"
            );


            if (!currentCharacter) {

                receiveMessage.innerText =
                    "شخصیت پیدا نشد";

                return;

            }


            /*
            حساب Firebase هنوز آماده نشده؟
            */

            if (!currentUser) {

                receiveMessage.innerText =
                    "در حال آماده‌سازی حساب...";

                try {

                    const result =
                        await auth.signInAnonymously();


                    currentUser =
                        result.user;

                }

                catch (error) {

                    console.error(
                        "AUTH ERROR:",
                        error
                    );


                    receiveMessage.innerText =
                        "❌ خطا در ساخت حساب";

                    return;

                }

            }


            receiveButton.disabled =
                true;


            receiveMessage.innerText =
                "در حال دریافت شخصیت...";


            try {

                /*
                =================================
                مسیر کارت
                =================================

                users
                   ↓
                 UID
                   ↓
                 cards
                   ↓
               character
                */

                const cardRef =
                    db
                    .collection("users")
                    .doc(currentUser.uid)
                    .collection("cards")
                    .doc(currentCharacter);


                /*
                بررسی کارت قبلی
                */

                const existingCard =
                    await cardRef.get();


                if (existingCard.exists) {

                    receiveMessage.innerText =
                        "🎴 این شخصیت را قبلاً دریافت کرده‌اید";


                    receiveButton.disabled =
                        false;


                    return;

                }


                /*
                ذخیره کارت
                */

                await cardRef.set({

                    character:
                        currentCharacter,

                    targetIndex:
                        currentTargetIndex,

                    receivedAt:
                        firebase.firestore
                        .FieldValue
                        .serverTimestamp()

                });


                console.log(
                    "CARD SAVED:",
                    currentCharacter
                );


                receiveMessage.innerText =
                    "🎉 شخصیت به پروفایل شما اضافه شد";


                receiveButton.innerText =
                    "✅ دریافت شد";


                /*
                ویدئو نباید متوقف شود
                */

                const video =
                    videos[currentTargetIndex];


                if (
                    video &&
                    video.paused
                ) {

                    video.play();

                }

            }

            catch (error) {

                console.error(
                    "FIRESTORE ERROR:",
                    error
                );


                receiveMessage.innerText =
                    "❌ خطا در دریافت شخصیت";


                receiveButton.disabled =
                    false;

            }

        }
    );


    /* =================================
       INSTAGRAM
    ================================= */

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


            const zone =
                activeTarget.querySelector(
                    ".instagram-zone"
                );


            if (!zone) {

                return;

            }


            const mesh =
                zone.getObject3D(
                    "mesh"
                );


            if (!mesh) {

                return;

            }


            const hits =
                raycaster.intersectObject(
                    mesh,
                    true
                );


            if (
                hits.length > 0
            ) {

                console.log(
                    "INSTAGRAM PRESSED"
                );


                const instagramURL =
                    "https://www.instagram.com/SarzaminAr/";


                window.open(
                    instagramURL,
                    "_blank"
                );

            }

        },
        {
            passive: true
        }
    );

});
