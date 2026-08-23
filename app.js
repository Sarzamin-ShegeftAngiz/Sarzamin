document.addEventListener("DOMContentLoaded", () => {

    const scene = document.querySelector("a-scene");
    const video = document.querySelector("#notebookVideo");

    scene.addEventListener("arReady", () => {
        console.log("AR READY");
    });

    scene.addEventListener("targetFound", async () => {

        console.log("TARGET FOUND");

        video.currentTime = 0;

        try {
            await video.play();
        } catch (error) {
            console.log("VIDEO PLAY ERROR:", error);
        }

    });

    scene.addEventListener("targetLost", () => {

        console.log("TARGET LOST");

        video.pause();

    });

});
