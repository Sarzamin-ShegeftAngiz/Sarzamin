document.addEventListener("DOMContentLoaded", () => {


const scene =
document.querySelector("a-scene");

const assets =
document.querySelector("#videoAssets");


/*
========================================
ویدئوهای فعال
========================================
*/

const videos = [];


/*
========================================
ساخت ویدئو و Target
========================================
*/

function createTarget(index) {


    /*
    Target 0 استثنا دارد:
    
    Target 0
    ↓
    notebook/choromi.mp4
    */


    let folder;
    let filename;


    if (index === 0) {

        folder = "notebook";
        filename = "choromi.mp4";

    } else {

        /*
        Target 1
        ↓
        notebook2/02.mp4

        Target 2
        ↓
        notebook3/03.mp4

        Target 6
        ↓
        notebook7/07.mp4
        */

        const number = index + 1;

        folder = "notebook" + number;

        filename =
            String(number).padStart(2, "0") + ".mp4";

    }


    /*
    ====================================
    ساخت Video
    ====================================
    */

    const video =
        document.createElement("video");


    video.id =
        "video" + index;


    video.src =
        "./" + folder + "/" + filename;


    video.preload = "none";

    video.loop = true;

    video.muted = true;

    video.playsInline = true;

    video.setAttribute(
        "webkit-playsinline",
        ""
    );


    assets.appendChild(video);


    videos[index] = video;


    /*
    ====================================
    ساخت Target
    ====================================
    */

    const entity =
        document.createElement("a-entity");


    entity.setAttribute(
        "mindar-image-target",
        "targetIndex:" + index
    );


    /*
    ====================================
    ساخت Video روی Target
    ====================================
    */

    const arVideo =
        document.createElement("a-video");


    arVideo.id =
        "videoAR" + index;


    arVideo.setAttribute(
        "src",
        "#video" + index
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


    entity.appendChild(arVideo);


    scene.appendChild(entity);


    /*
    ====================================
    پیدا شدن Target
    ====================================
    */

    entity.addEventListener(
        "targetFound",
        async () => {


            console.log(
                "TARGET FOUND:",
                index
            );


            /*
            توقف تمام ویدئوهای دیگر
            */

            videos.forEach(
                (otherVideo, otherIndex) => {

                    if (
                        otherVideo &&
                        otherIndex !== index
                    ) {

                        otherVideo.pause();

                    }

                }
            );


            /*
            ویدیوی فعلی
            */

            video.currentTime = 0;


            /*
            اول muted
            برای سازگاری بهتر با Chrome Android
            */

            video.muted = true;


            /*
            ویدئو را فقط وقتی Target
            پیدا شد بارگذاری کن
            */

            if (
                video.readyState === 0
            ) {

                video.load();

            }


            try {

                await video.play();


                console.log(
                    "VIDEO PLAYING:",
                    index,
                    folder + "/" + filename
                );


            } catch (error) {


                console.log(
                    "VIDEO PLAY ERROR:",
                    index,
                    error
                );

            }

        }
    );


    /*
    ====================================
    گم شدن Target
    ====================================
    */

    entity.addEventListener(
        "targetLost",
        () => {


            console.log(
                "TARGET LOST:",
                index
            );


            video.pause();

        }
    );

}


/*
========================================
تعداد Targetهای واقعی
را از MindAR می‌گیریم
========================================
*/

scene.addEventListener(
    "arReady",
    () => {


        console.log("AR READY");


        const mindarSystem =
            scene.systems[
                "mindar-image-system"
            ];


        let targetCount = 0;


        /*
        تعداد واقعی Targetها
        */

        if (
            mindarSystem &&
            mindarSystem.controller
        ) {

            targetCount =
                mindarSystem.controller
                    .imageTargetCount;

        }


        console.log(
            "TARGET COUNT:",
            targetCount
        );


        /*
        اگر تعداد Target مشخص نشد،
        حداقل 1 Target ایجاد می‌کنیم.
        */

        if (
            !targetCount ||
            targetCount < 1
        ) {

            targetCount = 1;

        }


        /*
        ساخت Targetها
        */

        for (
            let i = 0;
            i < targetCount;
            i++
        ) {

            createTarget(i);

        }


        console.log(
            "ALL TARGETS CREATED"
        );

    }
);


});
