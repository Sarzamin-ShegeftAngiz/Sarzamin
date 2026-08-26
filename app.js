```javascript
console.log("APP JS START");

document.addEventListener("DOMContentLoaded", () => {

    console.log("DOM READY");

    const phoneInput =
        document.getElementById("phoneNumber");

    const sendButton =
        document.getElementById("sendCode");

    const codeSection =
        document.getElementById("codeSection");

    const codeInput =
        document.getElementById("verificationCode");

    const verifyButton =
        document.getElementById("verifyCode");

    const message =
        document.getElementById("loginMessage");

    const loginScreen =
        document.getElementById("loginScreen");


    let confirmationResult = null;
    let recaptchaVerifier = null;


    /*
    =================================
    وضعیت اولیه
    =================================
    */

    message.innerText =
        "صفحه ورود آماده است";


    /*
    =================================
    ساخت reCAPTCHA
    =================================
    */

    try {

        recaptchaVerifier =
            new firebase.auth.RecaptchaVerifier(
                "recaptcha-container",
                {
                    size: "normal",

                    callback: function () {

                        console.log(
                            "RECAPTCHA SUCCESS"
                        );

                        message.innerText =
                            "تأیید امنیتی انجام شد";

                    },

                    "expired-callback": function () {

                        message.innerText =
                            "تأیید امنیتی منقضی شد";

                    }
                }
            );


        recaptchaVerifier
            .render()
            .then(function (id) {

                console.log(
                    "RECAPTCHA READY:",
                    id
                );

            })
            .catch(function (error) {

                console.error(
                    "RECAPTCHA ERROR:",
                    error
                );

                message.innerText =
                    "خطا در فعال شدن تأیید امنیتی";

            });

    }

    catch (error) {

        console.error(
            "RECAPTCHA CREATE ERROR:",
            error
        );

        message.innerText =
            "خطا در ساخت تأیید امنیتی";

    }


    /*
    =================================
    ارسال کد
    =================================
    */

    sendButton.addEventListener(
        "click",
        async function () {

            console.log(
                "SEND BUTTON CLICKED"
            );


            message.innerText =
                "در حال بررسی شماره...";


            let phone =
                phoneInput.value.trim();


            /*
            0912xxxxxxx
            تبدیل به
            +98912xxxxxxx
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


            /*
            بررسی شماره ایران
            */

            if (
                !/^\+989\d{9}$/.test(phone)
            ) {

                message.innerText =
                    "شماره را به شکل 09123456789 وارد کنید";

                return;

            }


            message.innerText =
                "در حال ارسال کد پیامکی...";


            sendButton.disabled =
                true;


            try {

                const auth =
                    firebase.auth();


                confirmationResult =
                    await auth.signInWithPhoneNumber(
                        phone,
                        recaptchaVerifier
                    );


                console.log(
                    "SMS SENT"
                );


                message.innerText =
                    "کد پیامک شد؛ کد ۶ رقمی را وارد کنید";


                codeSection.style.display =
                    "flex";


            }

            catch (error) {

                console.error(
                    "FIREBASE ERROR:",
                    error
                );


                message.innerText =
                    "خطا: " + error.code;


                sendButton.disabled =
                    false;


                /*
                ریست reCAPTCHA
                */

                try {

                    if (
                        window.grecaptcha
                    ) {

                        grecaptcha.reset();

                    }

                }

                catch (e) {

                    console.log(e);

                }

            }

        }
    );


    /*
    =================================
    تایید کد پیامک
    =================================
    */

    verifyButton.addEventListener(
        "click",
        async function () {

            const code =
                codeInput.value.trim();


            if (!confirmationResult) {

                message.innerText =
                    "ابتدا کد را درخواست کنید";

                return;

            }


            if (
                !/^\d{6}$/.test(code)
            ) {

                message.innerText =
                    "کد باید ۶ رقمی باشد";

                return;

            }


            message.innerText =
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
                    "UID:",
                    user.uid
                );


                console.log(
                    "PHONE:",
                    user.phoneNumber
                );


                /*
                ذخیره کاربر فعلی
                */

                window.currentUser =
                    user;


                message.innerText =
                    "ورود موفق شد";


                /*
                بستن صفحه ورود
                */

                setTimeout(
                    function () {

                        loginScreen.style.display =
                            "none";

                    },
                    700
                );

            }

            catch (error) {

                console.error(
                    "VERIFY ERROR:",
                    error
                );


                message.innerText =
                    "کد اشتباه است یا منقضی شده";

            }

        }
    );

});
```
