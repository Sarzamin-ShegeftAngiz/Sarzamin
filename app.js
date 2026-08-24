document.addEventListener("DOMContentLoaded", () => {

    const scene = document.querySelector("a-scene");
    const assets = document.querySelector("a-assets");

    console.log("APP VERSION 106");


    /*
    ==========================================
    تنظیمات
    ==========================================

    Target 0:
    notebook/choromi.mp4

    Target 1:
    02/02.mp4

    Target 2:
    03/03.mp4

    Target 3:
    04/04.mp4

    و به همین ترتیب...
    */

    const MAX_TARGETS = 100;


    /*
    ==========================================
    ساخت ویدئوها و Targetها
    ==========================================
    */

    for (let targetIndex = 0; targetIndex < MAX_TARGETS; targetIndex++) {

        let videoId;
        let videoPath;

        let folderNumber;


        // ==============================
        // Target 0 = دفتر اول
        // ==============================

        if (targetIndex === 0) {

            videoId = "video0";
            videoPath = "./notebook/choromi.mp4";

        }


        // ==============================
        // Target 1 به بعد
        // Target 1 = پوشه 02
        // Target 2 = پوشه 03
        // ==============================

        else {

            folderNumber = String(targetIndex + 1).padStart(2, "0");

            videoId = "video" + folderNumber;

            videoPath =
                "./" +
                folderNumber +
                "/" +
                folderNumber +
                ".mp4";

        }


        // ==============================
        // ساخت Video
        // ==============================

        const video = document.createElement("video");

        video.id = videoId;

        video.src = videoPath;

        video.preload = "auto";

        video.loop = true;

        video.muted = true;

        video.playsInline = true;

        video.setAttribute("webkit-playsinline", "");

        assets.appendChild(video);


        // ==============================
        // ساخت Target
        // ==============================

        const target = document.createElement("a-entity");

        target.setAttribute(
            "mindar-image-target",
            "targetIndex:" + targetIndex
        );


        // ==============================
        // ساخت Video Plane
        // ==============================

        const arVideo = document.createElement("a-video");

        arVideo.id = videoId + "AR";

        arVideo.setAttribute(
            "src",
            "#" + videoId
        );

        arVideo.setAttribute("width", "1");

        arVideo.setAttribute("height", "1.42");

        arVideo.setAttribute(
            "position",
            "0 0 0"
        );


        target.appendChild(arVideo);

        scene.appendChild(target);


        // ==============================
        // Target Found
        // ==============================

        target.addEventListener(
            "targetFound",
            async () => {

                console.log(
                    "TARGET FOUND:",
                    targetIndex
                );


                // توقف تمام ویدئوهای دیگر

                const allVideos =
                    assets.querySelectorAll("video");

                allVideos.forEach(otherVideo => {

                    if (otherVideo !== video) {

                        otherVideo.pause();

                    }

                });


                // شروع ویدئوی این Target

                video.currentTime = 0;

                video.muted = false;


                try {

                    await video.play();

                    console.log(
                        "VIDEO PLAYING:",
                        videoPath
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


        // ==============================
        // Target Lost
        // ==============================

        target.addEventListener(
            "targetLost",
            () => {

                console.log(
                    "TARGET LOST:",
                    targetIndex
                );

                video.pause();

            }
        );


        // ==============================
        // Video Texture Update
        // ==============================

        scene.addEventListener(
            "renderstart",
            () => {

                scene.addEventListener(
                    "tick",
                    () => {

                        const mesh =
                            arVideo.getObject3D("mesh");


                        if (
                            mesh &&
                            mesh.material &&
                            mesh.material.map
                        ) {

                            mesh.material.map.needsUpdate =
                                true;

                        }

                    }
                );

            },
            { once: true }
        );

    }


    /*
    ==========================================
    AR READY
    ==========================================
    */

    scene.addEventListener(
        "arReady",
        () => {

            console.log("AR READY");

        }
    );

});
