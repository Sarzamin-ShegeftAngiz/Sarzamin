document.addEventListener("DOMContentLoaded", () => {

  const GROUPS = {
    Group1: {
      mind: "./Group1/targets.mind",
      startVideo: 1
    },

    Group2: {
      mind: "./Group2/targets.mind",
      startVideo: 31
    }
  };

  let group =
    new URLSearchParams(location.search).get("group");

  if (!GROUPS[group]) {
    group = localStorage.getItem("sarzamin_group");
  }

  let scene = null;
  let video = null;

  let activeTarget = null;
  let activeIndex = -1;
  let currentVideo = -1;

  /* =====================================================
     STYLE
  ===================================================== */

  const style = document.createElement("style");

  style.textContent = `

    html,
    body {
      margin: 0 !important;
      padding: 0 !important;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: transparent;
    }

    #groupSelectorNew {
      position: fixed;
      inset: 0;
      z-index: 999999;

      display: flex;
      justify-content: center;
      align-items: center;

      background:
        linear-gradient(
          145deg,
          #6d4aff,
          #241047
        );

      font-family:
        Tahoma,
        Arial,
        sans-serif;

      direction: rtl;
    }

    .groupCard {
      width: 86%;
      max-width: 390px;

      padding: 35px 25px;

      border-radius: 30px;

      text-align: center;

      color: white;

      background:
        rgba(255,255,255,.14);

      box-shadow:
        0 20px 60px rgba(0,0,0,.35);

      backdrop-filter:
        blur(18px);
    }

    .groupCard h1 {
      margin: 0 0 8px;

      font-size: 31px;

      font-weight: 900;

      text-shadow:
        0 3px 12px rgba(0,0,0,.3);
    }

    .groupCard p {
      margin: 0 0 28px;

      font-size: 19px;

      font-weight: 600;
    }

    .groupBtn {
      display: block;

      width: 100%;

      min-height: 58px;

      margin: 11px 0;

      border: 0;

      border-radius: 18px;

      background: white;

      color: #241047;

      font-family:
        Tahoma,
        Arial,
        sans-serif;

      font-size: 20px;

      font-weight: 800;

      box-shadow:
        0 8px 22px rgba(0,0,0,.2);

      touch-action: manipulation;
    }

    .groupBtn:active {
      transform: scale(.97);
    }

    #changeGroup {
      position: fixed;

      top: 15px;
      right: 15px;

      z-index: 99999;

      display: block;

      padding: 11px 16px;

      border: 0;

      border-radius: 15px;

      background:
        rgba(0,0,0,.60);

      color: white;

      font-family:
        Tahoma,
        Arial,
        sans-serif;

      font-size: 15px;

      font-weight: 700;

      direction: rtl;
    }

    /*
      ناحیه‌های لمس کاملاً نامرئی هستند.
      Mesh وجود دارد ولی دیده نمی‌شود.
    */

    .instagram-zone,
    .share-zone {
      opacity: 0 !important;
    }

  `;

  document.head.appendChild(style);


  /* =====================================================
     REMOVE OLD UI
  ===================================================== */

  function removeOldUI() {

    [
      "#groupSelectorNew",
      "#groupSelector",
      "#group-selection",
      "#groupSelection",
      "#groupPage",
      "#group-page",
      "#blueLoading"
    ].forEach(selector => {

      document
        .querySelectorAll(selector)
        .forEach(el => el.remove());

    });
  }


  /* =====================================================
     GROUP MENU
  ===================================================== */

  function showGroups() {

    removeOldUI();

    const page =
      document.createElement("div");

    page.id =
      "groupSelectorNew";

    const card =
      document.createElement("div");

    card.className =
      "groupCard";

    const title =
      document.createElement("h1");

    title.textContent =
      "سرزمین شگفت انگیز";

    const subtitle =
      document.createElement("p");

    subtitle.textContent =
      "انتخاب گروه دفترها";

    card.appendChild(title);
    card.appendChild(subtitle);


    Object.keys(GROUPS).forEach(
      (name, index) => {

        const btn =
          document.createElement("button");

        btn.className =
          "groupBtn";

        btn.textContent =
          index === 0
            ? "گروه یک"
            : "گروه دو";

        btn.addEventListener(
          "click",
          () => {

            chooseGroup(name);

          }
        );

        card.appendChild(btn);
      }
    );


    page.appendChild(card);

    document.body.appendChild(page);
  }


  /* =====================================================
     CHOOSE GROUP
  ===================================================== */

  function chooseGroup(name) {

    localStorage.setItem(
      "sarzamin_group",
      name
    );

    /*
      هیچ صفحه آبی ساخته نمی‌شود.
      مستقیماً وارد AR می‌شویم.
    */

    location.replace(
      location.pathname +
      "?group=" +
      encodeURIComponent(name) +
      "&v=126"
    );
  }


  /* =====================================================
     CHANGE GROUP
  ===================================================== */

  function createChangeButton() {

    const btn =
      document.createElement("button");

    btn.id =
      "changeGroup";

    btn.textContent =
      "🔄 تغییر گروه";


    btn.addEventListener(
      "click",
      () => {

        try {

          if (video) {

            video.pause();

            video.removeAttribute(
              "src"
            );

            video.load();
          }

        } catch (e) {}


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


        activeTarget = null;
        activeIndex = -1;
        currentVideo = -1;


        localStorage.removeItem(
          "sarzamin_group"
        );


        location.replace(
          location.pathname +
          "?v=126"
        );

      }
    );


    document.body.appendChild(btn);
  }


  /* =====================================================
     NO GROUP
  ===================================================== */

  if (!group || !GROUPS[group]) {

    showGroups();

    return;
  }


  /* =====================================================
     SELECTED GROUP
  ===================================================== */

  removeOldUI();

  const config =
    GROUPS[group];


  /* =====================================================
     CREATE VIDEO
  ===================================================== */

  video =
    document.createElement("video");

  video.id =
    "arVideo";

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


  /*
    ویدئو در صفحه باشد ولی دیده نشود.
  */

  video.style.position =
    "fixed";

  video.style.width =
    "1px";

  video.style.height =
    "1px";

  video.style.opacity =
    "0";

  video.style.pointerEvents =
    "none";


  document.body.appendChild(video);


  /* =====================================================
     CREATE SCENE
     خیلی مهم:
     همه چیز قبل از append شدن Scene ساخته می‌شود.
  ===================================================== */

  scene =
    document.createElement(
      "a-scene"
    );

  scene.id =
    "arScene";


  scene.setAttribute(
    "mindar-image",
    `
      imageTargetSrc: ${config.mind};
      autoStart: true;
      uiLoading: no;
      uiScanning: no;
      uiError: no;
      warmupTolerance: 2;
      missTolerance: 1;
      filterMinCF: 0.0001;
      filterBeta: 0.001;
    `
  );


  scene.setAttribute(
    "embedded",
    ""
  );


  scene.setAttribute(
    "color-space",
    "sRGB"
  );


  scene.setAttribute(
    "renderer",
    "colorManagement: true;"
  );


  scene.setAttribute(
    "vr-mode-ui",
    "enabled: false"
  );


  scene.setAttribute(
    "device-orientation-permission-ui",
    "enabled: false"
  );


  /* =====================================================
     CAMERA
  ===================================================== */

  const camera =
    document.createElement(
      "a-camera"
    );

  camera.setAttribute(
    "position",
    "0 0 0"
  );

  camera.setAttribute(
    "look-controls",
    "enabled: false"
  );


  /*
    Camera قبل از Scene اضافه شدن ساخته می‌شود.
  */

  scene.appendChild(camera);


  /* =====================================================
     TARGETS
  ===================================================== */

  const targetData = [];


  for (
    let i = 0;
    i < 30;
    i++
  ) {

    const target =
      document.createElement(
        "a-entity"
      );

    target.setAttribute(
      "mindar-image-target",
      `targetIndex: ${i};`
    );


    /* =================================================
       VIDEO PLANE
    ================================================= */

    const v =
      document.createElement(
        "a-video"
      );

    v.classList.add(
      "arVideoPlane"
    );


    v.setAttribute(
      "src",
      "#arVideo"
    );


    /*
      نسبت دفترهای عمودی
      همان نسبت نسخه سالم قبلی
    */

    v.setAttribute(
      "width",
      "1"
    );

    v.setAttribute(
      "height",
      "1.42"
    );


    v.setAttribute(
      "position",
      "0 0 0"
    );


    v.setAttribute(
      "rotation",
      "0 0 0"
    );


    v.setAttribute(
      "visible",
      "false"
    );


    target.appendChild(v);


    /* =================================================
       INSTAGRAM ZONE
    ================================================= */

    const insta =
      document.createElement(
        "a-plane"
      );

    insta.classList.add(
      "instagram-zone"
    );


    insta.setAttribute(
      "width",
      "0.70"
    );

    insta.setAttribute(
      "height",
      "0.16"
    );


    insta.setAttribute(
      "position",
      "0 -0.82 0.04"
    );


    insta.setAttribute(
      "material",
      "transparent: true; opacity: 0; side: double;"
    );


    target.appendChild(insta);


    /* =================================================
       INSTAGRAM TEXT
    ================================================= */

    const instaText =
      document.createElement(
        "a-text"
      );

    instaText.classList.add(
      "instagram-text"
    );


    instaText.setAttribute(
      "value",
      "دفترهای زنده اینجا 👈"
    );


    instaText.setAttribute(
      "align",
      "center"
    );


    instaText.setAttribute(
      "anchor",
      "center"
    );


    instaText.setAttribute(
      "baseline",
      "center"
    );


    instaText.setAttribute(
      "position",
      "0 -0.82 0.03"
    );


    instaText.setAttribute(
      "width",
      "1.8"
    );


    instaText.setAttribute(
      "color",
      "white"
    );


    target.appendChild(
      instaText
    );


    /* =================================================
       SHARE ZONE
    ================================================= */

    const share =
      document.createElement(
        "a-plane"
      );

    share.classList.add(
      "share-zone"
    );


    share.setAttribute(
      "width",
      "0.82"
    );


    share.setAttribute(
      "height",
      "0.17"
    );


    share.setAttribute(
      "position",
      "0 -0.96 0.04"
    );


    share.setAttribute(
      "material",
      "transparent: true; opacity: 0; side: double;"
    );


    target.appendChild(share);


    /* =================================================
       SHARE TEXT
    ================================================= */

    const shareText =
      document.createElement(
        "a-text"
      );


    shareText.classList.add(
      "share-text"
    );


    shareText.setAttribute(
      "value",
      "سرزمین شگفت‌انگیز"
    );


    shareText.setAttribute(
      "align",
      "center"
    );


    shareText.setAttribute(
      "anchor",
      "center"
    );


    shareText.setAttribute(
      "baseline",
      "center"
    );


    shareText.setAttribute(
      "position",
      "0 -0.96 0.03"
    );


    shareText.setAttribute(
      "width",
      "1.8"
    );


    shareText.setAttribute(
      "color",
      "white"
    );


    target.appendChild(
      shareText
    );


    /* =================================================
       SURPRISE TEXT
    ================================================= */

    const surprise =
      document.createElement(
        "a-text"
      );


    surprise.classList.add(
      "surprise-text"
    );


    surprise.setAttribute(
      "value",
      "می‌خوای دوستاتو هم سورپرایز کنی؟ 😍👇"
    );


    surprise.setAttribute(
      "align",
      "center"
    );


    surprise.setAttribute(
      "anchor",
      "center"
    );


    surprise.setAttribute(
      "baseline",
      "center"
    );


    surprise.setAttribute(
      "position",
      "0 -0.70 0.03"
    );


    surprise.setAttribute(
      "width",
      "1.8"
    );


    surprise.setAttribute(
      "color",
      "white"
    );


    surprise.setAttribute(
      "visible",
      "false"
    );


    target.appendChild(
      surprise
    );


    targetData.push({
      target,
      videoPlane: v,
      surprise
    });


    /*
      Target بعداً listener می‌گیرد،
      ولی خود Target همین الان داخل Scene ساخته شده.
    */

    scene.appendChild(target);
  }


  /* =====================================================
     ADD SCENE TO BODY
  ===================================================== */

  document.body.appendChild(scene);


  /* =====================================================
     CHANGE GROUP BUTTON
  ===================================================== */

  createChangeButton();


  /* =====================================================
     TARGET FOUND / LOST
  ===================================================== */

  targetData.forEach(
    (data, index) => {

      const target =
        data.target;

      const v =
        data.videoPlane;

      const surprise =
        data.surprise;


      target.addEventListener(
        "targetFound",
        () => {

          console.log(
            "TARGET FOUND:",
            index
          );


          activeTarget =
            target;

          activeIndex =
            index;


          /*
            همه planeها مخفی
          */

          hideVideos();


          surprise.setAttribute(
            "visible",
            "false"
          );


          /*
            ویدئوی قبلی متوقف و پاک می‌شود.
          */

          try {
            video.pause();
          } catch (e) {}


          try {
            video.currentTime = 0;
          } catch (e) {}


          video.removeAttribute(
            "src"
          );

          video.load();


          const videoNumber =
            config.startVideo +
            index;


          const number =
            String(videoNumber)
              .padStart(2, "0");


          const src =
            `${group}/${number}.mp4`;


          console.log(
            "LOADING VIDEO:",
            src
          );


          currentVideo =
            videoNumber;


          video.muted =
            true;


          video.src =
            src;


          video.load();


          const showAndPlay =
            () => {

              /*
                اگر در این فاصله Target عوض شده،
                این ویدئو نباید نمایش داده شود.
              */

              if (
                activeTarget !== target ||
                activeIndex !== index
              ) {
                return;
              }


              try {
                video.currentTime = 0;
              } catch (e) {}


              /*
                اول play
              */

              video.play()
                .then(() => {

                  if (
                    activeTarget === target &&
                    activeIndex === index
                  ) {

                    v.setAttribute(
                      "visible",
                      "true"
                    );
                  }

                })
                .catch(err => {

                  console.log(
                    "VIDEO PLAY ERROR:",
                    err
                  );


                  /*
                    fallback
                  */

                  video.muted = true;

                  video.play()
                    .then(() => {

                      if (
                        activeTarget === target &&
                        activeIndex === index
                      ) {

                        v.setAttribute(
                          "visible",
                          "true"
                        );
                      }

                    })
                    .catch(() => {});
                });
            };


          if (
            video.readyState >= 3
          ) {

            showAndPlay();

          } else {

            video.addEventListener(
              "canplay",
              showAndPlay,
              {
                once: true
              }
            );
          }


          /*
            بعد از اولین دور
          */

          video.onended =
            () => {

              if (
                activeTarget === target &&
                activeIndex === index
              ) {

                surprise.setAttribute(
                  "visible",
                  "true"
                );
              }
            };
        }
      );


      target.addEventListener(
        "targetLost",
        () => {

          console.log(
            "TARGET LOST:",
            index
          );


          if (
            activeTarget === target
          ) {

            activeTarget =
              null;

            activeIndex =
              -1;


            try {
              video.pause();
            } catch (e) {}


            v.setAttribute(
              "visible",
              "false"
            );


            surprise.setAttribute(
              "visible",
              "false"
            );
          }
        }
      );
    }
  );


  /* =====================================================
     HIDE ALL VIDEOS
  ===================================================== */

  function hideVideos() {

    document
      .querySelectorAll(
        ".arVideoPlane"
      )
      .forEach(el => {

        el.setAttribute(
          "visible",
          "false"
        );
      });
  }


  /* =====================================================
     INSTAGRAM
  ===================================================== */

  function openInstagram() {

    console.log(
      "INSTAGRAM PRESSED"
    );


    const intentURL =
      "intent://www.instagram.com/_u/SarzaminAr/#Intent;" +
      "package=com.instagram.android;" +
      "scheme=https;" +
      "end";


    window.location.href =
      intentURL;


    /*
      اگر Intent باز نشد،
      مرورگر Instagram را باز می‌کند.
    */

    setTimeout(
      () => {

        window.location.href =
          "https://www.instagram.com/SarzaminAr/";

      },
      1200
    );
  }


  /* =====================================================
     SHARE
  ===================================================== */

  function sharePage() {

    console.log(
      "SHARE PRESSED"
    );


    const shareURL =
      window.location.href;


    const shareText =
      "📚✨ این فقط یه دفتر معمولی نیست!\n\n" +
      "این دفتر می‌تونه زنده بشه! 😱\n" +
      "دوربین گوشیت رو بگیر روی جلد و خودت ببین چه اتفاقی می‌افته! 👀\n\n" +
      "🔥 حالا اگه دوست داری طرح‌های زنده‌ی دیگه رو هم ببینی، " +
      "این لینک رو بزن و بیا آیدی اینستاگرام سرزمین شگفت‌انگیز رو ببین!\n" +
      "شاید طرح مورد علاقه‌ات اونجا منتظرت باشه 😍📚\n\n" +
      "اگه دفترت هنوز زنده نشده، درخواست زنده‌شدنش رو بده! 😉✨";


    if (
      navigator.share
    ) {

      navigator.share({

        title:
          "سرزمین شگفت‌انگیز 📚✨",

        text:
          shareText,

        url:
          shareURL

      })
      .then(() => {

        console.log(
          "SHARE SUCCESS"
        );

      })
      .catch(err => {

        console.log(
          "SHARE CANCELLED",
          err
        );
      });


    } else {

      navigator.clipboard
        .writeText(
          shareText +
          "\n\n" +
          shareURL
        )
        .then(() => {

          alert(
            "متن و لینک کپی شد ❤️\nبرای دوستت بفرست"
          );

        })
        .catch(() => {

          prompt(
            "این متن و لینک را برای دوستت بفرست:",
            shareText +
            "\n\n" +
            shareURL
          );
        });
    }
  }


  /* =====================================================
     OLD WORKING TOUCH SYSTEM
     THREE.Raycaster
  ===================================================== */

  document.addEventListener(
    "touchend",
    event => {

      if (!activeTarget)
        return;


      if (
        !scene ||
        !scene.camera ||
        !scene.renderer
      )
        return;


      const touch =
        event.changedTouches[0];

      if (!touch)
        return;


      const canvas =
        scene.renderer.domElement;


      const rect =
        canvas.getBoundingClientRect();


      const mouse =
        new THREE.Vector2();


      mouse.x =
        ((touch.clientX - rect.left) /
          rect.width) *
          2 - 1;


      mouse.y =
        -((touch.clientY - rect.top) /
          rect.height) *
          2 + 1;


      const raycaster =
        new THREE.Raycaster();


      raycaster.setFromCamera(
        mouse,
        scene.camera
      );


      /* =========================================
         INSTAGRAM
      ========================================= */

      const instagramZone =
        activeTarget.querySelector(
          ".instagram-zone"
        );


      if (instagramZone) {

        const instagramMesh =
          instagramZone.getObject3D(
            "mesh"
          );


        if (instagramMesh) {

          const instagramHits =
            raycaster.intersectObject(
              instagramMesh,
              true
            );


          if (
            instagramHits.length > 0
          ) {

            event.preventDefault();

            openInstagram();

            return;
          }
        }
      }


      /* =========================================
         SHARE
      ========================================= */

      const shareZone =
        activeTarget.querySelector(
          ".share-zone"
        );


      if (!shareZone)
        return;


      const shareMesh =
        shareZone.getObject3D(
          "mesh"
        );


      if (!shareMesh)
        return;


      const shareHits =
        raycaster.intersectObject(
          shareMesh,
          true
        );


      if (
        shareHits.length > 0
      ) {

        event.preventDefault();

        sharePage();

        return;
      }

    },
    {
      passive: false
    }
  );


  /* =====================================================
     AR READY
  ===================================================== */

  scene.addEventListener(
    "arReady",
    () => {

      console.log(
        "AR READY:",
        group
      );

    }
  );


  scene.addEventListener(
    "arError",
    e => {

      console.log(
        "AR ERROR:",
        e
      );

    }
  );

});
