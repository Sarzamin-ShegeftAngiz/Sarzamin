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


    /*
    ====================================
    Instagram
    ====================================
    */

    const instagramURL =
        "instagram://user?username=SarzaminAr";


    /*
    ====================================
    Target فعال
    ====================================
    */

    let activeTarget = null;


    /*
    ====================================
    AR READY
    ====================================
    */

    scene.addEventListener(
        "arReady",
        () => {

            console.log("AR READY");

        }
    );


    /*
    ====================================
    TARGET FOUND
    ====================================
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
            توقف همه ویدئوهای دیگر
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


            /*
            اجرای ویدئوی مربوطه
            */

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
    ====================================
    TARGET LOST
    ====================================
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


            if (
                activeTarget === target
            ) {

                activeTarget = null;

            }


            const video =
                videos[index];


            if (video) {

                video.pause();

            }


            console.log(
                "TARGET LOST:",
                index
            );

        }
    );


    /*
    ====================================
    لمس صفحه
    ====================================
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


            /*
            مختصات لمس گوشی
            */

            const x =
                touch.clientX;


            const y =
                touch.clientY;


            /*
            پیدا کردن ناحیه قرمز
            */

            const zones =
                activeTarget.querySelectorAll(
                    ".instagram-zone"
                );


            for (
                const zone of zones
            ) {


                const mesh =
                    zone.getObject3D(
                        "mesh"
                    );


                if (!mesh) {

                    continue;

                }


                /*
                گرفتن مختصات صفحه
                */

                const box =
                    getScreenBox(
                        mesh
                    );


                if (!box) {

                    continue;

                }


                /*
                آیا انگشت داخل
                ناحیه قرمز است؟
                */

                if (

                    x >= box.left &&
                    x <= box.right &&
                    y >= box.top &&
                    y <= box.bottom

                ) {


                    console.log(
                        "INSTAGRAM PRESSED"
                    );


                    /*
                    باز کردن اپ
                    */

                    window.location.href =
                        instagramURL;


                    return;

                }

            }

        },
        {
            passive: true
        }
    );


    /*
    ====================================
    تبدیل ناحیه Target
    به مختصات واقعی صفحه
    ====================================
    */

    function getScreenBox(
        mesh
    ) {


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
                        (
                            point.x + 1
                        ) *
                        rect.width /
                        2,

                    y:
                        rect.top +
                        (
                            1 - point.y
                        ) *
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
