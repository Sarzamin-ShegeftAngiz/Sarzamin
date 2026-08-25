document.addEventListener("DOMContentLoaded", () => {

    const scene =
        document.querySelector("a-scene");

    const assets =
        document.querySelector("a-assets");


    /*
    =========================================
    تنظیمات
    =========================================
    */

    const MAX_TARGETS = 100;


    const instagramURL =
        "instagram://user?username=SarzaminAr";


    /*
    =========================================
    ساخت Target ها و ویدئوها
    =========================================
    */

    for (
        let i = 0;
        i < MAX_TARGETS;
        i++
    ) {

        /*
        شماره پوشه
        Target 0 = notebook
        Target 1 = notebook2
        Target 2 = notebook3
        */

        const folder =
            i === 0
                ? "notebook"
                : "notebook" + (i + 1);


        /*
        نام ویدئو
        Target 0 = choromi.mp4
        Target 1 = 02.mp4
        Target 2 = 03.mp4
        */

        const videoName =
            i === 0
                ? "choromi.mp4"
                : String(i + 1).padStart(2, "0") + ".mp4";


        /*
        =================================
        Video
        =================================
        */

        const video =
            document.createElement("video");


        video.id =
            "video" + i;


        video.src =
            "./" +
            folder +
            "/" +
            videoName;


        video.preload =
            "none";


        video.loop =
            true;


        video.muted =
            true;


        video.playsInline =
            true;


        video.setAttribute(
            "webkit-playsinline",
            ""
        );


        assets.appendChild(
            video
        );


        /*
        =================================
        Target
        =================================
        */

        const target =
            document.createElement("a-entity");


        target.setAttribute(
            "mindar-image-target",
            "targetIndex:" + i
        );


        /*
        =================================
        Video روی دفتر
        =================================
        */

        const arVideo =
            document.createElement("a-video");


        arVideo.setAttribute(
            "src",
            "#video" + i
        );


        arVideo.setAttribute(
            "width",
            "1"
        );


        arVideo.setAttribute(
            "height",
            "1.42"
        );


        arVideo.setAttribute(
            "position",
            "0 0 0"
        );


        target.appendChild(
            arVideo
        );


        /*
        =================================
        Instagram Zone
        کاملاً نامرئی
        =================================
        */

        const instagramZone =
            document.createElement("a-plane");


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
            "shader:flat;color:red;opacity:0;transparent:true"
        );


        target.appendChild(
            instagramZone
        );


        /*
        اضافه کردن Target
        */

        scene.appendChild(
            target
        );

    }


    /*
    =========================================
    وضعیت Target فعال
    =========================================
    */

    let activeTarget = null;


    /*
    =========================================
    AR READY
    =========================================
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
    =========================================
    TARGET FOUND
    =========================================
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


            activeTarget =
                target;


            console.log(
                "TARGET FOUND:",
                index
            );


            const video =
                document.querySelector(
                    "#video" + index
                );


            if (!video) {

                console.log(
                    "VIDEO NOT FOUND:",
                    index
                );

                return;

            }


            /*
            توقف ویدئوهای دیگر
            */

            document
                .querySelectorAll("video")
                .forEach(
                    (v) => {

                        if (
                            v !== video
                        ) {

                            v.pause();

                        }

                    }
                );


            /*
            شروع ویدئوی Target
            */

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

            catch (error) {

                console.log(
                    "VIDEO ERROR:",
                    error
                );

            }

        }
    );


    /*
    =========================================
    TARGET LOST
    =========================================
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


            const video =
                document.querySelector(
                    "#video" + index
                );


            if (video) {

                video.pause();

            }


            if (
                activeTarget === target
            ) {

                activeTarget =
                    null;

            }


            console.log(
                "TARGET LOST:",
                index
            );

        }
    );


    /*
    =========================================
    لمس Instagram
    =========================================
    */

    document.addEventListener(
        "touchend",
        (event) => {

            if (!activeTarget) {

                return;

            }


            const touch =
                event.changedTouches[0];


            if (!touch) {

                return;

            }


            const x =
                touch.clientX;


            const y =
                touch.clientY;


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


            const box =
                getScreenBox(
                    mesh
                );


            if (!box) {

                return;

            }


            if (

                x >= box.left &&
                x <= box.right &&
                y >= box.top &&
                y <= box.bottom

            ) {

                console.log(
                    "INSTAGRAM PRESSED"
                );


                window.location.href =
                    instagramURL;

            }

        },

        {
            passive: true
        }

    );


    /*
    =========================================
    تبدیل مختصات Target
    به مختصات صفحه
    =========================================
    */

    function getScreenBox(mesh) {

        if (
            !scene.camera ||
            !scene.renderer
        ) {

            return null;

        }


        const geometry =
            mesh.geometry;


        if (!geometry) {

            return null;

        }


        geometry.computeBoundingBox();


        const box =
            geometry.boundingBox;


        const points = [

            new THREE.Vector3(
                box.min.x,
                box.min.y,
                0
            ),

            new THREE.Vector3(
                box.min.x,
                box.max.y,
                0
            ),

            new THREE.Vector3(
                box.max.x,
                box.min.y,
                0
            ),

            new THREE.Vector3(
                box.max.x,
                box.max.y,
                0
            )

        ];


        const screenPoints = [];


        points.forEach(
            (point) => {

                mesh.localToWorld(
                    point
                );


                point.project(
                    scene.camera
                );


                const rect =
                    scene.renderer
                        .domElement
                        .getBoundingClientRect();


                screenPoints.push({

                    x:
                        rect.left +
                        (point.x + 1) *
                        rect.width /
                        2,

                    y:
                        rect.top +
                        (1 - point.y) *
                        rect.height /
                        2

                });

            }
        );


        const xs =
            screenPoints.map(
                p => p.x
            );


        const ys =
            screenPoints.map(
                p => p.y
            );


        return {

            left:
                Math.min(...xs),

            right:
                Math.max(...xs),

            top:
                Math.min(...ys),

            bottom:
                Math.max(...ys)

        };

    }

});
