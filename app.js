function startAR(groupName) {

  clearPage();

  const config = GROUPS[groupName];

  /* =========================
     VIDEO
  ========================= */

  video = document.createElement("video");

  video.id = "arVideo";

  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");

  video.autoplay = false;
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";

  video.style.position = "fixed";
  video.style.width = "1px";
  video.style.height = "1px";
  video.style.opacity = "0";
  video.style.pointerEvents = "none";

  document.body.appendChild(video);


  /* =========================
     SCENE
  ========================= */

  scene = document.createElement("a-scene");

  scene.setAttribute(
    "mindar-image",
    `
      imageTargetSrc: ${config.mind};
      autoStart: true;
      uiLoading: no;
      uiScanning: yes;
      uiError: yes;
      warmupTolerance: 3;
      missTolerance: 2;
      filterMinCF: 0.0001;
      filterBeta: 0.001;
    `
  );

  scene.setAttribute("embedded", "");

  scene.setAttribute(
    "renderer",
    "alpha: true; colorManagement: true;"
  );

  scene.setAttribute(
    "vr-mode-ui",
    "enabled: false"
  );

  scene.setAttribute(
    "device-orientation-permission-ui",
    "enabled: false"
  );

  scene.style.position = "fixed";
  scene.style.left = "0";
  scene.style.top = "0";
  scene.style.width = "100%";
  scene.style.height = "100%";
  scene.style.zIndex = "1";
  scene.style.background = "transparent";


  /* =========================
     CAMERA
  ========================= */

  const camera =
    document.createElement("a-camera");

  camera.setAttribute(
    "position",
    "0 0 0"
  );

  camera.setAttribute(
    "look-controls",
    "enabled: false"
  );

  camera.setAttribute(
    "active",
    "true"
  );

  /*
     برای اینکه ناحیه‌های قابل لمس
     روی دفتر کار کنند
  */

  camera.setAttribute(
    "cursor",
    "rayOrigin: mouse"
  );

  camera.setAttribute(
    "raycaster",
    "objects: .arLink"
  );

  scene.appendChild(camera);


  /* =========================
     TARGETS
  ========================= */

  for (let i = 0; i < 30; i++) {

    const target =
      document.createElement("a-entity");

    target.setAttribute(
      "mindar-image-target",
      `targetIndex: ${i};`
    );


    /* =====================
       VIDEO
    ===================== */

    const plane =
      document.createElement("a-video");

    plane.classList.add(
      "arVideoPlane"
    );

    plane.setAttribute(
      "src",
      "#arVideo"
    );

    plane.setAttribute(
      "width",
      "1"
    );

    plane.setAttribute(
      "height",
      "1.42"
    );

    plane.setAttribute(
      "position",
      "0 0 0.01"
    );

    plane.setAttribute(
      "visible",
      "false"
    );

    target.appendChild(plane);


    /* =================================================
       این قسمت فقط یک ناحیه نامرئی روی
       @SarzaminAr موجود در خود تصویر است
       ================================================= */

    const insta =
      document.createElement("a-plane");

    insta.classList.add("arLink");

    insta.setAttribute(
      "width",
      "0.55"
    );

    insta.setAttribute(
      "height",
      "0.16"
    );

    /*
       بالا سمت چپ دفتر
    */

    insta.setAttribute(
      "position",
      "-0.28 0.61 0.06"
    );

    insta.setAttribute(
      "material",
      "transparent: true; opacity: 0; side: double;"
    );

    target.appendChild(insta);


    /* =========================
       INSTAGRAM
       باز کردن اپ
    ========================= */

    insta.addEventListener(
      "click",
      () => {

        console.log(
          "Instagram clicked"
        );

        /*
          ابتدا تلاش برای باز کردن
          اپلیکیشن اینستاگرام
        */

        window.location.href =
          "instagram://user?username=SarzaminAr";

        /*
          اگر اپلیکیشن باز نشد،
          بعد از کمی تأخیر نسخه وب
          باز می‌شود.
        */

        setTimeout(() => {

          window.location.href =
            "https://www.instagram.com/SarzaminAr/";

        }, 1200);

      }
    );


    /* =================================================
       SHARE BUTTON
       نوشته پایین دفتر
       ================================================= */

    const share =
      document.createElement("a-text");

    share.classList.add("arLink");

    share.setAttribute(
      "value",
      "سرزمین شگفت‌انگیز"
    );

    share.setAttribute(
      "align",
      "center"
    );

    share.setAttribute(
      "anchor",
      "center"
    );

    share.setAttribute(
      "baseline",
      "center"
    );

    share.setAttribute(
      "position",
      "0 -0.88 0.06"
    );

    share.setAttribute(
      "width",
      "1.8"
    );

    share.setAttribute(
      "color",
      "white"
    );

    target.appendChild(share);


    /* =========================
       متن آماده
    ========================= */

    share.addEventListener(
      "click",
      async () => {

        const message =
          "😍 من یه دفتر جادویی پیدا کردم!\n\n" +
          "دوربین گوشیت رو روی دفتر بگیر " +
          "تا ببینی چطور زنده میشه! ✨📚\n\n" +
          "سرزمین شگفت‌انگیز\n" +
          "@SarzaminAr";


        /*
          Share اصلی گوشی
          تلگرام، روبیکا، شاد و سایر
          برنامه‌های نصب‌شده را نشان می‌دهد.
        */

        if (
          navigator.share
        ) {

          try {

            await navigator.share({
              title:
                "سرزمین شگفت‌انگیز",

              text:
                message

            });

          } catch (error) {

            console.log(
              "Share cancelled:",
              error
            );

          }

        } else {

          /*
            اگر Share گوشی پشتیبانی نشد
          */

          try {

            await navigator.clipboard.writeText(
              message
            );

            alert(
              "متن آماده کپی شد؛ حالا آن را برای دوستت بفرست 😊"
            );

          } catch (error) {

            alert(
              message
            );

          }

        }

      }
    );


    /* =====================
       TARGET FOUND
    ===================== */

    target.addEventListener(
      "targetFound",
      () => {

        console.log(
          "TARGET FOUND:",
          i
        );

        activeTarget =
          target;

        activePlane =
          plane;


        /*
          مخفی کردن همه ویدئوها
        */

        document
          .querySelectorAll(
            ".arVideoPlane"
          )
          .forEach(
            p => {

              p.setAttribute(
                "visible",
                "false"
              );

            }
          );


        try {

          video.pause();

          video.currentTime = 0;

        } catch (e) {}


        /*
          شماره واقعی ویدئو
        */

        const videoNumber =
          config.first + i;

        const filename =
          String(videoNumber)
            .padStart(2, "0");


        const src =
          `./${groupName}/${filename}.mp4`;


        console.log(
          "VIDEO:",
          src
        );


        video.src =
          src;

        video.load();


        const playVideo =
          () => {

            if (
              activeTarget !== target
            ) {
              return;
            }


            video.play()
              .then(
                () => {

                  if (
                    activeTarget === target
                  ) {

                    plane.setAttribute(
                      "visible",
                      "true"
                    );

                  }

                }
              )
              .catch(
                error => {

                  console.log(
                    "VIDEO PLAY ERROR:",
                    error
                  );

                }
              );

          };


        if (
          video.readyState >= 3
        ) {

          playVideo();

        } else {

          video.addEventListener(
            "canplay",
            playVideo,
            {
              once: true
            }
          );

        }

      }
    );


    /* =====================
       TARGET LOST
    ===================== */

    target.addEventListener(
      "targetLost",
      () => {

        console.log(
          "TARGET LOST:",
          i
        );


        if (
          activeTarget === target
        ) {

          activeTarget =
            null;


          if (
            activePlane
          ) {

            activePlane.setAttribute(
              "visible",
              "false"
            );

          }


          try {

            video.pause();

          } catch (e) {}

        }

      }
    );


    scene.appendChild(
      target
    );

  }


  /* =========================
     ADD SCENE
  ========================= */

  document.body.appendChild(
    scene
  );


  /* =========================
     CHANGE GROUP
  ========================= */

  const change =
    document.createElement(
      "button"
    );

  change.id =
    "changeGroup";

  change.textContent =
    "🔄 تغییر گروه";


  change.onclick =
    () => {

      try {

        if (
          scene &&
          scene.systems &&
          scene.systems["mindar-image"]
        ) {

          scene.systems[
            "mindar-image"
          ].stop();

        }

      } catch (e) {}


      showCategories();

    };


  document.body.appendChild(
    change
  );


  /* =========================
     AR READY
  ========================= */

  scene.addEventListener(
    "arReady",
    () => {

      console.log(
        "AR READY:",
        groupName
      );

    }
  );


  /* =========================
     AR ERROR
  ========================= */

  scene.addEventListener(
    "arError",
    event => {

      console.log(
        "AR ERROR:",
        event
      );

    }
  );

}
