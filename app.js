document.addEventListener("DOMContentLoaded", () => {

    const scene = document.querySelector("a-scene");

    const frontVideo =
        document.querySelector("#frontVideo");

    const video02 =
        document.querySelector("#video02");

    const frontARVideo =
        document.querySelector("#frontARVideo");

    const video02AR =
        document.querySelector("#video02AR");

    const frontTarget =
        document.querySelector(
            '[mindar-image-target="targetIndex:0"]'
        );

    const target02 =
        document.querySelector(
            '[mindar-image-target="targetIndex:1"]'
        );


    console.log("APP VERSION 108");


    /* =====================================
       AR READY
    ===================================== */

    scene.addEventListener("arReady", () => {

        console.log("AR READY");

    });


    /* =====================================
       TARGET 0
       دفتر اول
    ===================================== */

    frontTarget.addEventListener(
        "targetFound",
        async () => {

            console.log("TARGET 0 FOUND");

            video02.pause();

            frontVideo.currentTime = 0;
            frontVideo.muted = false;

            try {

                await frontVideo.play();

                console.log("FRONT PLAYING");

            } catch (error) {

                console.log(
                    "FRONT VIDEO ERROR",
                    error
                );

            }

        }
    );


    frontTarget.addEventListener(
        "targetLost",
        () => {

            console.log("TARGET 0 LOST");

            frontVideo.pause();

        }
    );


    /* =====================================
       TARGET 1
       دفتر دوم
    ===================================== */

    target02.addEventListener(
        "targetFound",
        async () => {

            console.log("TARGET 1 FOUND");

            frontVideo.pause();

            /*
            ویدیوی دوم را دوباره بارگذاری می‌کنیم
            */

            video02.pause();

            video02.currentTime = 0;

            video02.muted = true;

            video02.load();


            try {

                await video02.play();

                console.log("VIDEO 02 PLAYING");

            } catch (error) {

                console.log(
                    "VIDEO 02 ERROR",
                    error
                );

            }

        }
    );


    target02.addEventListener(
        "targetLost",
        () => {

            console.log("TARGET 1 LOST");

            video02.pause();

        }
    );


    /* =====================================
       VIDEO TEXTURE UPDATE
    ===================================== */

    scene.addEventListener(
        "renderstart",
        () => {

            scene.addEventListener(
                "tick",
                () => {

                    /* VIDEO 1 */

                    const frontMesh =
                        frontARVideo.getObject3D("mesh");


                    if (
                        frontMesh &&
                        frontMesh.material &&
                        frontMesh.material.map
                    ) {

                        frontMesh.material.map.needsUpdate =
                            true;

                    }


                    /* VIDEO 2 */

                    const video02Mesh =
                        video02AR.getObject3D("mesh");


                    if (
                        video02Mesh &&
                        video02Mesh.material &&
                        video02Mesh.material.map
                    ) {

                        video02Mesh.material.map.needsUpdate =
                            true;

                    }

                }
            );

        }
    );

});
