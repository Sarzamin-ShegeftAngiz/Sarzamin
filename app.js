document.addEventListener("DOMContentLoaded", () => {


    // =====================================================
    // تنظیمات گروه‌ها
    // =====================================================

    const GROUPS = {

        1: {
            folder: "Group1",
            startNumber: 1,
            count: 30
        },

        2: {
            folder: "Group2",
            startNumber: 31,
            count: 30
        }

    };


    // =====================================================
    // عناصر صفحه
    // =====================================================

    const menu =
        document.querySelector("#group-menu");

    const backButton =
        document.querySelector("#back-button");


    // =====================================================
    // انتخاب گروه
    // =====================================================

    document
        .querySelectorAll(".group-button")
        .forEach((button) => {

            button.addEventListener(
                "click",
                () => {

                    const group =
                        button.dataset.group;

                    window.location.href =
                        "?group=" + group;

                }
            );

        });


    // =====================================================
    // گرفتن گروه از URL
    // =====================================================

    const params =
        new URLSearchParams(
            window.location.search
        );


    const groupNumber =
        Number(params.get("group"));


    // =====================================================
    // اگر گروه انتخاب نشده
    // =====================================================

    if (!GROUPS[groupNumber]) {

        menu.style.display = "flex";

        return;

    }


    // =====================================================
    // اطلاعات گروه
    // =====================================================

    const group =
        GROUPS[groupNumber];


    menu.style.display = "none";

    backButton.style.display = "block";


    backButton.addEventListener(
        "click",
        () => {

            window.location.href =
                window.location.pathname;

        }
    );


    console.log(
        "START GROUP:",
        group.folder
    );


    // =====================================================
    // ساخت A-SCENE
    // =====================================================

    const scene =
        document.createElement(
            "a-scene"
        );


    scene.setAttribute(
        "mindar-image",
        "imageTargetSrc: ./" +
        group.folder +
        "/targets.mind; " +
        "warmupTolerance: 2; " +
        "missTolerance: 1;"
    );


    scene.setAttribute(
        "embedded",
        ""
    );


    scene.setAttribute(
        "vr-mode-ui",
        "enabled:false"
    );


    scene.setAttribute(
        "device-orientation-permission-ui",
        "enabled:false"
    );


    scene.setAttribute(
        "renderer",
        "colorManagement:true; alpha:true;"
    );


    document.body.appendChild(scene);


    // =====================================================
    // A-ASSETS
    // =====================================================

    const assets =
        document.createElement(
            "a-assets"
        );


    scene.appendChild(assets);


    // =====================================================
    // ویدئوها
    // =====================================================

    const videos = [];


    for (
        let i = 0;
        i < group.count;
        i++
    ) {


        const number =
            group.startNumber + i;


        const fileNumber =
            String(number).padStart(
                2,
                "0"
            );


        const video =
            document.createElement(
                "video"
            );


        video.id =
            "video" + i;


        video.src =
            "./" +
            group.folder +
            "/" +
            fileNumber +
            ".mp4";


        video.setAttribute(
            "preload",
            "auto"
        );


        video.setAttribute(
            "loop",
            ""
        );


        video.setAttribute(
            "muted",
            ""
        );


        video.setAttribute(
            "playsinline",
            ""
        );


        video.setAttribute(
            "webkit-playsinline",
            ""
        );


        video.muted = true;


        assets.appendChild(video);


        videos.push(video);


        console.log(
            "VIDEO",
            i,
            "→",
            group.folder +
            "/" +
            fileNumber +
            ".mp4"
        );

    }


    // =====================================================
    // TARGETها
    // =====================================================

    const targets = [];


    for (
        let i = 0;
        i < group.count;
        i++
    ) {


        const target =
            document.createElement(
                "a-entity"
            );


        target.setAttribute(
            "mindar-image-target",
            "targetIndex: " + i
        );


        // ---------------------------------------------
        // ویدئو
        // ---------------------------------------------

        const videoPlane =
            document.createElement(
                "a-video"
            );


        videoPlane.setAttribute(
            "src",
            "#video" + i
        );


        videoPlane.setAttribute(
            "width",
            "1"
        );


        videoPlane.setAttribute(
            "height",
            "1.42"
        );


        target.appendChild(
            videoPlane
        );


        // ---------------------------------------------
        // متن بعد از اولین دور
        // ---------------------------------------------

        const afterText =
            document.createElement(
                "a-text"
            );


        afterText.classList.add(
            "after-video-text"
        );


        afterText.setAttribute(
            "value",
            "می‌خوای دوستاتو هم سورپرایز کنی؟ 😍👇"
        );


        afterText.setAttribute(
            "align",
            "center"
        );


        afterText.setAttribute(
            "width",
            "1.5"
        );


        afterText.setAttribute(
            "position",
            "0 -0.72 0.03"
        );


        afterText.setAttribute(
            "color",
            "#FFFFFF"
        );


        afterText.setAttribute(
            "visible",
            "false"
        );


        target.appendChild(
            afterText
        );


        // ---------------------------------------------
        // Instagram text
        // ---------------------------------------------

        const instagramText =
            document.createElement(
                "a-text"
            );


        instagramText.setAttribute(
            "value",
            "دفترهای زنده اینجا 👈"
        );


        instagramText.setAttribute(
            "align",
            "center"
        );


        instagramText.setAttribute(
            "width",
            "1.4"
        );


        instagramText.setAttribute(
            "position",
            "-0.31 0.62 0.03"
        );


        instagramText.setAttribute(
            "color",
            "#FFFFFF"
        );


        target.appendChild(
            instagramText
        );


        // ---------------------------------------------
        // Instagram Hitbox
        // ---------------------------------------------

        const instagramZone =
            document.createElement(
                "a-plane"
            );


        instagramZone.classList.add(
            "instagram-zone"
        );


        instagramZone.setAttribute(
            "width",
            "0.70"
        );


        instagramZone.setAttribute(
            "height",
            "0.16"
        );


        instagramZone.setAttribute(
            "position",
            "-0.31 0.62 0.02"
        );


        instagramZone.setAttribute(
            "material",
            "transparent: true; opacity: 0;"
        );


        target.appendChild(
            instagramZone
        );


        // ---------------------------------------------
        // نام برند
        // ---------------------------------------------

        const brandText =
            document.createElement(
                "a-text"
            );


        brandText.setAttribute(
            "value",
            "سرزمین شگفت‌انگیز"
        );


        brandText.setAttribute(
            "align",
            "center"
        );


        brandText.setAttribute(
            "width",
            "1.5"
        );


        brandText.setAttribute(
            "position",
            "0 -0.62 0.03"
        );


        brandText.setAttribute(
            "color",
            "#FFFFFF"
        );


        target.appendChild(
            brandText
        );


        // ---------------------------------------------
        // Share Hitbox
        // ---------------------------------------------

        const shareZone =
            document.createElement(
                "a-plane"
            );


        shareZone.classList.add(
            "share-zone"
        );


        shareZone.setAttribute(
            "width",
            "0.90"
        );


        shareZone.setAttribute(
            "height",
            "0.18"
        );


        shareZone.setAttribute(
            "position",
            "0 -0.62 0.02"
        );


        shareZone.setAttribute(
            "material",
            "transparent: true; opacity: 0;"
        );


        target.appendChild(
            shareZone
        );


        // ---------------------------------------------
        // اضافه کردن Target
        // ---------------------------------------------

        scene.appendChild(
            target
        );


        targets.push(target);

    }


    // =====================================================
    // وضعیت فعلی
    // =====================================================

    let activeTarget = null;

    let activeVideo = null;

    let firstPlayFinished = false;


    // =====================================================
    // AR READY
    // =====================================================

    scene.addEventListener(
        "arReady",
        () => {

            console.log(
                "AR READY -",
                group.folder
            );

        }
    );


    // =====================================================
    // TARGET FOUND
    // =====================================================

    scene.addEventListener(
        "targetFound",
        async (event) => {


            const target =
                event.target;


            const data =
                target.getAttribute(
                    "mindar-image-target"
                );


            if (!data) return;


            const index =
                Number(
                    data.targetIndex
                );


            console.log(
                "TARGET FOUND:",
                index
            );


            activeTarget =
                target;


            // ---------------------------------------------
            // توقف همه ویدئوهای دیگر
            // ---------------------------------------------

            videos.forEach(
                (video, i) => {

                    if (!video) return;

                    if (i !== index) {

                        video.pause();

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


            activeVideo =
                video;


            // ---------------------------------------------
            // شروع از اول
            // ---------------------------------------------

            try {

                video.currentTime = 0;

            }

            catch (error) {

                console.log(
                    "CURRENT TIME ERROR:",
                    error
                );

            }


            // ---------------------------------------------
            // پخش صدادار
            // ---------------------------------------------

            video.muted = false;


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


                // -----------------------------------------
                // اگر صدادار اجازه نداد
                // -----------------------------------------

                video.muted = true;


                try {

                    await video.play();

                    console.log(
                        "VIDEO PLAYING MUTED:",
                        index
                    );

                }

                catch (error2) {

                    console.log(
                        "VIDEO STILL FAILED:",
                        error2
                    );

                }

            }


            // ---------------------------------------------
            // متن را مخفی کن
            // ---------------------------------------------

            hideAfterTexts(
                target
            );


            firstPlayFinished =
                false;


            // ---------------------------------------------
            // بررسی اولین دور
            // ---------------------------------------------

            watchFirstLoop(
                video,
                target
            );

        }
    );


    // =====================================================
    // TARGET LOST
    // =====================================================

    scene.addEventListener(
        "targetLost",
        (event) => {


            const target =
                event.target;


            const data =
                target.getAttribute(
                    "mindar-image-target"
                );


            if (!data) return;


            const index =
                Number(
                    data.targetIndex
                );


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

                activeVideo = null;

            }

        }
    );


    // =====================================================
    // تشخیص پایان اولین دور
    // =====================================================

    function watchFirstLoop(
        video,
        target
    ) {


        function check() {


            if (
                activeTarget !== target
            ) {

                return;

            }


            if (
                firstPlayFinished
            ) {

                return;

            }


            if (
                video.duration &&
                video.duration > 0 &&
                video.currentTime >=
                video.duration - 0.15
            ) {


                firstPlayFinished =
                    true;


                showAfterTexts(
                    target
                );


                console.log(
                    "FIRST LOOP FINISHED"
                );


                return;

            }


            requestAnimationFrame(
                check
            );

        }


        requestAnimationFrame(
            check
        );

    }


    // =====================================================
    // مخفی کردن متن
    // =====================================================

    function hideAfterTexts(
        target
    ) {


        const texts =
            target.querySelectorAll(
                ".after-video-text"
            );


        texts.forEach(
            (text) => {

                text.setAttribute(
                    "visible",
                    "false"
                );

            }
        );

    }


    // =====================================================
    // نمایش متن
    // =====================================================

    function showAfterTexts(
        target
    ) {


        const texts =
            target.querySelectorAll(
                ".after-video-text"
            );


        texts.forEach(
            (text) => {

                text.setAttribute(
                    "visible",
                    "true"
                );

            }
        );

    }


    // =====================================================
    // لمس صفحه
    // =====================================================

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
                    / rect.width
                ) * 2 - 1;


            mouse.y =
                -(
                    (touch.clientY - rect.top)
                    / rect.height
                ) * 2 + 1;


            const raycaster =
                new THREE.Raycaster();


            raycaster.setFromCamera(
                mouse,
                scene.camera
            );


            // =================================================
            // INSTAGRAM
            // =================================================

            const instagramZone =
                activeTarget.querySelector(
                    ".instagram-zone"
                );


            if (instagramZone) {


                const mesh =
                    instagramZone.getObject3D(
                        "mesh"
                    );


                if (mesh) {


                    const hits =
                        raycaster.intersectObject(
                            mesh,
                            true
                        );


                    if (
                        hits.length > 0
                    ) {


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


            // =================================================
            // SHARE
            // =================================================

            const shareZone =
                activeTarget.querySelector(
                    ".share-zone"
                );


            if (shareZone) {


                const mesh =
                    shareZone.getObject3D(
                        "mesh"
                    );


                if (mesh) {


                    const hits =
                        raycaster.intersectObject(
                            mesh,
                            true
                        );


                    if (
                        hits.length > 0
                    ) {


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
                                        "Sarzamin AR",

                                    text:
                                        shareText,

                                    url:
                                        window.location.href

                                });


                            }

                            catch (error) {


                                console.log(
                                    "Share cancelled:",
                                    error
                                );

                            }


                        }

                        else {


                            try {


                                await navigator.clipboard.writeText(

                                    shareText +
                                    "\n" +
                                    window.location.href

                                );


                                alert(
                                    "متن آماده شد و کپی شد 😊"
                                );


                            }

                            catch (error) {


                                console.log(
                                    "Clipboard error:",
                                    error
                                );

                            }

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
