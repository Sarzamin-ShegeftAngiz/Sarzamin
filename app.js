console.log("APP JS START");


document.addEventListener("DOMContentLoaded", async () => {

    console.log("DOM READY");


    /*
    ==========================================
    FIREBASE
    ==========================================
    */

    const auth = firebase.auth();

    const db = firebase.firestore();


    let currentUser = null;


    /*
    ==========================================
    ساخت کاربر Anonymous
    ==========================================
    */

    try {

        const result = await auth.signInAnonymously();

        currentUser = result.user;

        console.log(
            "ANONYMOUS USER READY:",
            currentUser.uid
        );

    }

    catch (error) {

        console.error(
            "ANONYMOUS LOGIN ERROR:",
            error
        );

    }


    /*
    ==========================================
    AR SCENE
    ==========================================
    */

    const scene =
        document.querySelector("a-scene");


    /*
    ==========================================
    VIDEOS
    ==========================================
    */

    const videos = [

        document.querySelector("#video0"),

        document.querySelector("#video1"),

        document.querySelector("#video2"),

        document.querySelector("#video3"),

        document.querySelector("#video4"),

        document.querySelector("#video5")

    ];


    /*
    ==========================================
    نام کارت‌ها
    ==========================================
    */

    const characters = [

        "choromi",

        "character2",

        "character3",

        "character4",

        "character5",

        "character6"

    ];


    /*
    ==========================================
    متغیرهای اصلی
    ==========================================
    */

    let currentTargetIndex = null;

    let currentCharacter = null;

    let activeTarget = null;

    let animationFinished = false;


    /*
    ==========================================
    RECEIVE BOX
    ==========================================
    */

    const receiveBox =
        document.querySelector("#receiveBox");


    const receiveButton =
        document.querySelector("#receiveButton");


    const receiveMessage =
        document.querySelector("#receiveMessage");


    /*
    ==========================================
    AR READY
    ==========================================
    */

    scene.addEventListener(
        "arReady",
        () => {

            console.log("AR READY");

        }
    );


    /*
    ==========================================
    TARGET FOUND
    ==========================================
    */

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


            animationFinished =
                false;


            /*
            ------------------------------------------
            مخفی کردن دکمه قبلی
            ------------------------------------------
            */

            receiveBox.style.display =
                "none";


            receiveMessage.innerText =
                "";


            receiveButton.disabled =
                false;


            receiveButton.innerText =
                "🎁 دریافت این شخصیت";


            /*
            ------------------------------------------
            توقف همه ویدئوهای دیگر
            ------------------------------------------
            */

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


            /*
            ==========================================
            دو بار اجرای کامل انیمیشن
            ==========================================
            */

            video.loop =
                false;


            video.currentTime =
                0;


            /*
            تعداد دفعات اجرا
            */

            let playCount =
                0;


            /*
            ------------------------------------------
            وقتی ویدئو تمام شد
            ------------------------------------------
            */

            const playAnimation =
                async () => {

                    playCount++;


                    console.log(
                        "ANIMATION PLAY:",
                        playCount,
                        "OF 2"
                    );


                    video.currentTime =
                        0;


                    try {

                        await video.play();

                    }

                    catch (error) {

                        console.log(
                            "VIDEO PLAY ERROR:",
                            error
                        );


                        /*
                        تلاش دوباره بدون صدا
                        */

                        video.muted =
                            true;


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

                };


            video.onended =
                async () => {

                    console.log(
                        "ANIMATION ENDED:",
                        playCount
                    );


                    /*
                    اگر بار اول تمام شده،
                    بار دوم اجرا شود
                    */

                    if (playCount < 2) {

                        await playAnimation();

                        return;

                    }


                    /*
                    ==================================
                    دو بار کامل تمام شد
                    ==================================
                    */

                    animationFinished =
                        true;


                    console.log(
                        "ANIMATION COMPLETELY FINISHED"
                    );


                    receiveBox.style.display =
                        "block";


                    receiveMessage.innerText =
                        "برای دریافت این شخصیت کلیک کنید 🎁";

                };


            /*
            شروع اجرای اول
            */

            await playAnimation();

        }
    );


    /*
    ==========================================
    TARGET LOST
    ==========================================
    */

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
            اگر انیمیشن هنوز تمام نشده،
            دکمه را مخفی کن.

            ولی اگر انیمیشن تمام شده،
            دکمه را نگه دار.
            */

            if (!animationFinished) {

                receiveBox.style.display =
                    "none";

            }


            if (
                activeTarget === target
            ) {

                /*
                فعلاً activeTarget را پاک نمی‌کنیم
                تا Instagram و دکمه دریافت کار کنند.
                */

            }

        }
    );


    /*
    ==========================================
    RECEIVE CHARACTER
    ==========================================
    */

    receiveButton.addEventListener(
        "click",
        async () => {

            console.log(
                "RECEIVE BUTTON CLICKED"
            );


            /*
            بررسی انیمیشن
            */

            if (!animationFinished) {

                receiveMessage.innerText =
                    "لطفاً صبر کنید تا انیمیشن تمام شود";

                return;

            }


            /*
            بررسی کاربر
            */

            if (!currentUser) {

                receiveMessage.innerText =
                    "در حال آماده‌سازی حساب...";

                try {

                    const result =
                        await auth.signInAnonymously();


                    currentUser =
                        result.user;


                    console.log(
                        "USER READY:",
                        currentUser.uid
                    );

                }

                catch (error) {

                    console.error(
                        "AUTH ERROR:",
                        error
                    );


                    receiveMessage.innerText =
                        "خطا در ساخت حساب";

                    return;

                }

            }


            /*
            بررسی شخصیت
            */

            if (!currentCharacter) {

                receiveMessage.innerText =
                    "شخصیت پیدا نشد";

                return;

            }


            receiveButton.disabled =
                true;


            receiveMessage.innerText =
                "در حال دریافت شخصیت...";


            try {

                /*
                ======================================
                مسیر کارت در Firestore
                ======================================

                users
                  └── UID
                       └── cards
                            └── choromi
                */


                const cardRef =
                    db
                    .collection("users")
                    .doc(currentUser.uid)
                    .collection("cards")
                    .doc(currentCharacter);


                /*
                بررسی اینکه قبلاً گرفته یا نه
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
                ======================================
                ذخیره کارت
                ======================================
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


                /*
                ======================================
                موفقیت
                ======================================
                */

                receiveMessage.innerText =
                    "🎉 شخصیت با موفقیت به پروفایل اضافه شد";


                receiveButton.innerText =
                    "✅ دریافت شد";


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


    /*
    ==========================================
    INSTAGRAM
    ==========================================
    */

    document.addEventListener(
        "touchend",
        (event) => {

            /*
            اگر Target نداریم
            */

            if (!activeTarget) {

                return;

            }


            /*
            بررسی Scene
            */

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


            /*
            مختصات لمس
            */

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


            /*
            Raycaster
            */

            const raycaster =
                new THREE.Raycaster();


            raycaster.setFromCamera(
                mouse,
                scene.camera
            );


            /*
            Instagram Zone
            */

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


            /*
            بررسی برخورد لمس
            */

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


                /*
                باز کردن Instagram
                */

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
