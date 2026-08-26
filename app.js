```javascript
console.log("APP JS LOADED");

document.addEventListener("DOMContentLoaded", () => {

    const scene =
        document.querySelector("a-scene");


    /*
    =================================
    LOGIN ELEMENTS
    =================================
    */

    const loginScreen =
        document.querySelector("#loginScreen");

    const phoneInput =
        document.querySelector("#phoneNumber");

    const sendCodeButton =
        document.querySelector("#sendCode");

    const verificationCodeInput =
        document.querySelector("#verificationCode");

    const verifyCodeButton =
        document.querySelector("#verifyCode");

    const codeSection =
        document.querySelector("#codeSection");

    const loginMessage =
        document.querySelector("#loginMessage");


    let confirmationResult = null;


    /*
    =================================
    FIREBASE AUTH
    =================================
    */

    const auth =
        firebase.auth();


    /*
    =================================
    STOP AR UNTIL LOGIN
    =================================
    */

    if (scene) {

        scene.setAttribute(
            "mindar-image",
            "autoStart: false; imageTargetSrc: ./targets.mind; warmupTolerance: 2; missTolerance: 1;"
        );

    }


    /*
    =================================
    CHECK LOGIN STATUS
    =================================
    */

    auth.onAuthStateChanged(
        (user) => {

            if (user) {

                console.log(
                    "USER LOGGED IN:",
                    user.uid
                );


                window.currentUser =
                    user;


                /*
                مخفی کردن صفحه ورود
                */

                if (loginScreen) {

                    loginScreen.style.display =
                        "none";

                }


                /*
                شروع AR
                */

                if (
                    scene &&
                    scene.systems &&
                    scene.systems["mindar-image-system"]
                ) {

                    try {

                        scene.systems[
                            "mindar-image-system"
                        ].start();

                    }

                    catch (error) {

                        console.log(
                            "AR START ERROR:",
                            error
                        );

                    }

                }

            }

            else {

                console.log(
                    "NO USER"
                );


                window.currentUser =
                    null;


                if (loginScreen) {

                    loginScreen.style.display =
                        "flex";

                }

            }

        }
    );


    /*
    =================================
    CREATE RECAPTCHA
    =================================
    */

    try {

        auth.languageCode = "fa";


        window.recaptchaVerifier =
            new firebase.auth.RecaptchaVerifier(
                "recaptcha-container",
                {
                    size: "normal",

                    callback: () => {

                        console.log(
                            "RECAPTCHA OK"
                        );

                        if (loginMessage) {

                            loginMessage.innerText =
                                "تأیید امنیتی انجام شد";

                        }

                    },

                    "expired-callback": () => {

                        console.log(
                            "RECAPTCHA EXPIRED"
                        );

                        if (loginMessage) {

                            loginMessage.innerText =
                                "تأیید امنیتی منقضی شد";

                        }

                    }

                }
            );


        window.recaptchaVerifier
            .render()
            .then(
                (widgetId) => {

                    window.recaptchaWidgetId =
                        widgetId;


                    console.log(
                        "RECAPTCHA RENDERED"
                    );

                }
            )
            .catch(
                (error) => {

                    console.error(
                        "RECAPTCHA ERROR:",
                        error
                    );


                    if (loginMessage) {

                        loginMessage.innerText =
                            "خطا در فعال شدن تأیید امنیتی";

                    }

                }
            );

    }

    catch (error) {

        console.error(
            "RECAPTCHA CREATE ERROR:",
            error
        );

    }


    /*
    =================================
    SEND SMS
    =================================
    */

    if (sendCodeButton) {

        sendCodeButton.addEventListener(
            "click",
            async () => {

                console.log(
                    "SEND CODE CLICKED"
                );


                let phone =
                    phoneInput.value.trim();


                /*
                تبدیل 09 به +98
                */

                if (
                    phone.startsWith("0")
                ) {

                    phone =
                        "+98" +
                        phone.substring(1);

                }


                console.log(
                    "PHONE:",
                    phone
                );


                if (
                    !/^\+989\d{9}$/.test(phone)
                ) {

                    loginMessage.innerText =
                        "شماره را به شکل 09123456789 وارد کنید";

                    return;

                }


                loginMessage.innerText =
                    "در حال ارسال کد...";


                sendCodeButton.disabled =
                    true;


                try {

                    confirmationResult =
                        await auth.signInWithPhoneNumber(
                            phone,
                            window.recaptchaVerifier
                        );


                    console.log(
                        "SMS SENT SUCCESSFULLY"
                    );


                    loginMessage.innerText =
                        "کد تایید برای شما ارسال شد";


                    codeSection.style.display =
                        "flex";


                }

                catch (error) {

                    console.error(
                        "SEND SMS ERROR:",
                        error
                    );


                    loginMessage.innerText =
                        "خطا: " +
                        error.code;


                    sendCodeButton.disabled =
                        false;


                    /*
                    Reset reCAPTCHA
                    */

                    if (
                        window.recaptchaWidgetId !==
                        undefined
                    ) {

                        grecaptcha.reset(
                            window.recaptchaWidgetId
                        );

                    }

                }

            }
        );

    }


    /*
    =================================
    VERIFY SMS CODE
    =================================
    */

    if (verifyCodeButton) {

        verifyCodeButton.addEventListener(
            "click",
            async () => {

                const code =
                    verificationCodeInput
                        .value
                        .trim();


                if (!confirmationResult) {

                    loginMessage.innerText =
                        "ابتدا روی ارسال کد بزنید";

                    return;

                }


                if (
                    !/^\d{6}$/.test(code)
                ) {

                    loginMessage.innerText =
                        "کد ۶ رقمی را وارد کنید";

                    return;

                }


                verifyCodeButton.disabled =
                    true;


                loginMessage.innerText =
                    "در حال بررسی کد...";


                try {

                    const result =
                        await confirmationResult.confirm(
                            code
                        );


                    const user =
                        result.user;


                    console.log(
                        "LOGIN SUCCESS"
                    );


                    console.log(
                        "USER UID:",
                        user.uid
                    );


                    console.log(
                        "PHONE:",
                        user.phoneNumber
                    );


                    window.currentUser =
                        user;


                    loginMessage.innerText =
                        "ورود موفق شد";


                    setTimeout(
                        () => {

                            if (loginScreen) {

                                loginScreen.style.display =
                                    "none";

                            }


                            /*
                            شروع AR
                            */

                            if (
                                scene &&
                                scene.systems &&
                                scene.systems[
                                    "mindar-image-system"
                                ]
                            ) {

                                try {

                                    scene.systems[
                                        "mindar-image-system"
                                    ].start();

                                }

                                catch (error) {

                                    console.log(
                                        "AR START ERROR:",
                                        error
                                    );

                                }

                            }

                        },
                        700
                    );

                }

                catch (error) {

                    console.error(
                        "VERIFY ERROR:",
                        error
                    );


                    loginMessage.innerText =
                        "کد اشتباه است یا منقضی شده";


                    verifyCodeButton.disabled =
                        false;

                }

            }
        );

    }


    /*
    =================================
    AR VIDEOS
    =================================
    */

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

            console.log(
                "AR READY"
            );

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
            =================================
            اینجا بعداً کارت را ثبت می‌کنیم
            =================================
            */

            if (window.currentUser) {

                console.log(
                    "CARD OWNER UID:",
                    window.currentUser.uid
                );

                console.log(
                    "CARD TARGET:",
                    index
                );

            }


            /*
            توقف ویدئوهای دیگر
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


            const video =
                videos[index];


            if (!video) {

                return;

            }


            video.currentTime =
                0;


            video.muted =
                false;


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

                activeTarget =
                    null;

            }

        }
    );


    /*
    =================================
    INSTAGRAM
    =================================
    */

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


                const intentURL =
                    "intent://www.instagram.com/_u/SarzaminAr/#Intent;" +
                    "package=com.instagram.android;" +
                    "scheme=https;" +
                    "end";


                window.location.href =
                    intentURL;

            }

        },

        {
            passive: true
        }

    );

});
```
