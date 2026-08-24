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

    const target0 =
        document.querySelector("#target0");

    const target1 =
        document.querySelector("#target1");


    console.log("APP VERSION 110");


    /* =====================================
       آماده‌سازی ویدیوی دوم
    ===================================== */

    video02.load();


    video02.addEventListener("loadeddata", () => {

        console.log("VIDEO 02 LOADEDDATA");

    });


    video02.addEventListener("canplay", () => {

        console.log("VIDEO 02 CAN PLAY");

    });


    video02.addEventListener("playing", () => {

        console.log("VIDEO 02 PLAYING");

    });


    video02.addEventListener("error", () => {

        console.log(
            "VIDEO 02 ERROR:",
            video02.error
        );

    });



    /* =====================================
       AR READY
    ===================================== */

    scene.addEventListener("arReady", () => {

        console.log("AR READY");

    });



    /* =====================================
       TARGET 0
    ===================================== */

    target0.addEventListener(
        "targetFound",
        async () => {

            console.log("TARGET 0 FOUND");


            video02.pause();


            frontVideo.currentTime = 0;

            frontVideo.muted = false;


            try {

                await frontVideo.play();

                console.log(
                    "FRONT VIDEO PLAYING"
                );

            }

            catch(error) {

                console.log(
                    "FRONT VIDEO ERROR:",
                    error
                );

            }

        }
    );


    target0.addEventListener(
        "targetLost",
        () => {

            console.log("TARGET 0 LOST");

            frontVideo.pause();

        }
    );



    /* =====================================
       TARGET 1
    ===================================== */

    target1.addEventListener(
        "targetFound",
        async () => {

            console.log("TARGET 1 FOUND");


            /* توقف ویدیوی اول */

            frontVideo.pause();


            /* ویدیوی دوم */

            video02.pause();

            video02.currentTime = 0;

            /*
            اول muted
            تا Chrome Android
            اجازه پخش بدهد
            */

            video02.muted = true;


            try {

                await video02.play();

                console.log(
                    "VIDEO 02 STARTED MUTED"
                );


                /*
                بعد از شروع واقعی،
                صدا را باز می‌کنیم
                */

                video02.muted = false;


            }

            catch(error) {

                console.log(
                    "VIDEO 02 PLAY ERROR:",
                    error
                );

            }

        }
    );


    target1.addEventListener(
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


                    /* ---------- VIDEO 1 ---------- */

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



                    /* ---------- VIDEO 2 ---------- */

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


                    /*
                    اگر ویدیوی دوم در حال پخش است،
                    Texture را در هر فریم تازه می‌کنیم.
                    */

                    if (!video02.paused) {

                        const mesh =
                            video02AR.getObject3D("mesh");


                        if (
                            mesh &&
                            mesh.material &&
                            mesh.material.map
                        ) {

                            mesh.material.map.needsUpdate =
                                true;

                        }

                    }

                }
            );

        }
    );

});
