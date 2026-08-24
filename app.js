document.addEventListener("DOMContentLoaded", () => {


const scene =
    document.querySelector("a-scene");


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


console.log("APP VERSION 111");



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

target0.addEventListener(
    "targetFound",
    async () => {

        console.log("TARGET 0 FOUND");


        /* توقف ویدیوی دوم */

        video02.pause();


        /* شروع ویدیوی اول */

        frontVideo.currentTime = 0;

        frontVideo.muted = false;


        try {

            await frontVideo.play();

            console.log(
                "VIDEO 1 PLAYING"
            );

        }

        catch(error) {

            console.log(
                "VIDEO 1 ERROR:",
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
   دفتر دوم
===================================== */

target1.addEventListener(
    "targetFound",
    async () => {

        console.log("TARGET 1 FOUND");


        /* توقف ویدیوی اول */

        frontVideo.pause();


        /* آماده کردن ویدیوی دوم */

        video02.currentTime = 0;

        video02.muted = true;


        try {

            await video02.play();

            console.log(
                "VIDEO 2 PLAYING"
            );


            /*
            بعد از شروع پخش،
            صدا را باز می‌کنیم
            */

            video02.muted = false;

        }

        catch(error) {

            console.log(
                "VIDEO 2 ERROR:",
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


                /* ======================
                   VIDEO 1
                ====================== */

                const mesh1 =
                    frontARVideo.getObject3D(
                        "mesh"
                    );


                if (
                    mesh1 &&
                    mesh1.material &&
                    mesh1.material.map
                ) {

                    mesh1.material.map.needsUpdate =
                        true;

                }



                /* ======================
                   VIDEO 2
                ====================== */

                const mesh2 =
                    video02AR.getObject3D(
                        "mesh"
                    );


                if (
                    mesh2 &&
                    mesh2.material &&
                    mesh2.material.map
                ) {

                    mesh2.material.map.needsUpdate =
                        true;

                }

            }
        );

    }
);


});
