document.addEventListener("DOMContentLoaded", () => {

    const scene =
        document.querySelector("a-scene");

    const videos = [

        document.querySelector("#video0"),
        document.querySelector("#video1"),
        document.querySelector("#video2"),
        document.querySelector("#video3"),
        document.querySelector("#video4"),
        document.querySelector("#video5")

    ];


    let activeTarget = null;


    const instagramURL =
        "instagram://user?username=SarzaminAr";


    /*
    ==============================
    AR READY
    ==============================
    */

    scene.addEventListener(
        "arReady",
        () => {

            console.log("AR READY");

        }
    );


    /*
    ==============================
    TARGET FOUND
    ==============================
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
                videos[index];


            if (!video) {
                return;
            }


            /*
            توقف ویدئوهای دیگر
            */

            videos.forEach(
                (v, i) => {

                    if (
                        v &&
                        i !== index
                    ) {

                        v.pause();

                    }

                }
            );


            video.currentTime = 0;

            video.muted = false;


            try {

                await video.play();

                console.log(
                    "VIDEO PLAYING:",
                    index
                );

            }

            catch(error) {

                console.log(
                    "VIDEO ERROR:",
                    error
                );

            }

        }
    );


    /*
    ==============================
    TARGET LOST
    ==============================
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
    ==============================
    لمس ناحیه Instagram
    ==============================
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


            const box =
                getScreenBox(mesh);


            if (!box) {
                return;
            }


            const x =
                touch.clientX;

            const y =
                touch.clientY;


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
            passive:true
        }

    );


    /*
    ==============================
    تبدیل مختصات سه‌بعدی
    به صفحه گوشی
    ==============================
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

                mesh.localToWorld(point);

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
                        rect.width / 2,

                    y:
                        rect.top +
                        (1 - point.y) *
                        rect.height / 2

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
