```javascript
console.log("APP JS LOADED");
document.addEventListener("DOMContentLoaded", () => {

    const scene =
        document.querySelector("a-scene");


    /*
    =================================
    FIREBASE PHONE LOGIN
    =================================
    */

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

    const loginScreen =
        document.querySelector("#loginScreen");


    let confirmationResult = null;


    /*
    =================================
    FIREBASE AUTH STATE
    =================================
    */

    firebase.auth().onAuthStateChanged((user) => {

        if (user) {

            console.log(
                "USER LOGGED IN:",
                user.uid
            );


            /*
            کاربر قبلاً وارد شده
            */

            if (loginScreen) {

                loginScreen.style.display =
                    "none";

            }

        }

    });


    /*
    =================================
    RECAPTCHA
    =================================
    */

    if (
        sendCodeButton &&
        phoneInput
    ) {

        window.recaptchaVerifier =
    new firebase.auth.RecaptchaVerifier(
        "recaptcha-container",
        {
            size: "normal",

            callback: function () {

                console.log("RECAPTCHA OK");

                loginMessage.innerText =
                    "تأیید امنیتی انجام شد";

            },

            "expired-callback": function () {

                loginMessage.innerText =
                    "تأیید امنیتی منقضی شد";

            }

        }
    );

window.recaptchaVerifier
    .render()
    .then(function (widgetId) {

        window.recaptchaWidgetId =
            widgetId;

        console.log(
            "RECAPTCHA RENDERED"
        );

    })
    .catch(function (error) {

        console.error(
            "RECAPTCHA ERROR:",
            error
        );

        loginMessage.innerText =
            "خطا در فعال شدن تأیید امنیتی";

    });

        /*
        =================================
        SEND SMS CODE
        =================================
        */

        sendCodeButton.addEventListener(
            "click",
            async () => {

                let phone =
                    phoneInput.value.trim();


                /*
                تبدیل 0912 به +98912
                */

                if (
                    phone.startsWith("0")
                ) {

                    phone =
                        "+98" +
                        phone.substring(1);

                }


                /*
                بررسی شماره
                */

                if (
                    !phone.startsWith("+98")
                ) {

                    loginMessage.innerText =
                        "شماره موبایل را با 09 وارد کنید";

                    return;

                }


                loginMessage.innerText =
                    "در حال ارسال کد...";


                try {

                    confirmationResult =
                        await firebase
                            .auth()
                            .signInWithPhoneNumber(
                                phone,
                                window.recaptchaVerifier
                            );


                    console.log(
                        "SMS SENT"
                    );


                    loginMessage.innerText =
                        "کد تایید برای شما ارسال شد";


                    codeSection.style.display =
                        "flex";


                }

                catch (error) {

                    console.error(
                        "SMS ERROR:",
                        error
                    );


                    loginMessage.innerText =
                        "ارسال کد انجام نشد";


                    /*
                    اگر reCAPTCHA خراب شد
                    دوباره ساخته شود
                    */

                    try {

                        window.recaptchaVerifier =
                            new firebase.auth.RecaptchaVerifier(
                                "recaptcha-container",
                                {
                                    size: "normal"
                                }
                            );

                    }

                    catch (e) {

                        console.log(e);

                    }

                }

            }
        );

    }


    /*
    =================================
    VERIFY CODE
    =================================
    */

    if (
        verifyCodeButton
    ) {

        verifyCodeButton.addEventListener(
            "click",
            async () => {

                const code =
                    verificationCodeInput
                        .value
                        .trim();


                if (!code) {

                    loginMessage.innerText =
                        "کد تایید را وارد کنید";

                    return;

                }


                if (!confirmationResult) {

                    loginMessage.innerText =
                        "ابتدا کد را درخواست کنید";

                    return;

                }


                try {

                    const result =
                        await confirmationResult
                            .confirm(code);


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


                    loginMessage.innerText =
                        "ورود موفق بود";


                    /*
                    بستن صفحه ورود
                    */

                    setTimeout(
                        () => {

                            loginScreen.style.display =
                                "none";

                        },
                        500
                    );


                }

                catch (error) {

                    console.error(
                        "VERIFY ERROR:",
                        error
                    );


                    loginMessage.innerText =
                        "کد وارد شده صحیح نیست";

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


    const targets = [

        document.querySelector(
            '[mindar-image-target="targetIndex:0"]'
        ),

        document.querySelector(
            '[mindar-image-target="targetIndex:1"]'
        ),

        document.querySelector(
            '[mindar-image-target="targetIndex:2"]'
        ),

        document.querySelector(
            '[mindar-image-target="targetIndex:3"]'
        ),

        document.querySelector(
            '[mindar-image-target="targetIndex:4"]'
        ),

        document.querySelector(
            '[mindar-image-target="targetIndex:5"]'
        )

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
            توقف همه ویدئوهای دیگر
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
            ویدئوی تارگت فعلی
            */

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
                zone.getObject3D("mesh");


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
