document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     GROUPS
  ===================================================== */

  const GROUPS = {
    Group1: {
      mind: "./Group1/targets.mind",
      first: 1,
      last: 30,
      title: "دسته یک"
    },

    Group2: {
      mind: "./Group2/targets.mind",
      first: 31,
      last: 60,
      title: "دسته دو"
    }
  };


  let selectedGroup = null;

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
      background: #000;
    }


    /* =========================
       MAIN MENU
    ========================= */

    #mainMenu {
      position: fixed;
      inset: 0;

      z-index: 999999;

      display: flex;
      justify-content: center;
      align-items: center;

      background:
        linear-gradient(
          145deg,
          #7048ff 0%,
          #40218a 55%,
          #211044 100%
        );

      direction: rtl;

      font-family:
        Tahoma,
        Arial,
        sans-serif;
    }


    .mainCard {
      width: 86%;
      max-width: 410px;

      padding: 38px 24px;

      box-sizing: border-box;

      border-radius: 30px;

      text-align: center;

      background:
        rgba(255,255,255,.15);

      box-shadow:
        0 20px 60px rgba(0,0,0,.35);

      backdrop-filter:
        blur(18px);
    }


    .mainTitle {
      margin: 0;

      color: #fff;

      font-size: 34px;

      font-weight: 900;

      line-height: 1.4;

      text-shadow:
        0 4px 15px rgba(0,0,0,.3);
    }


    .mainViewButton {
      width: 100%;

      margin-top: 30px;

      padding: 19px 15px;

      border: 0;

      border-radius: 19px;

      background: #fff;

      color: #271354;

      font-family:
        Tahoma,
        Arial,
        sans-serif;

      font-size: 21px;

      font-weight: 900;

      box-shadow:
        0 9px 25px rgba(0,0,0,.25);

      touch-action: manipulation;
    }


    .mainViewButton:active {
      transform: scale(.97);
    }


    /* =========================
       CATEGORY PAGE
    ========================= */

    #categoryPage {
      position: fixed;
      inset: 0;

      z-index: 999999;

      display: flex;
      justify-content: center;
      align-items: center;

      background:
        linear-gradient(
          145deg,
          #7048ff 0%,
          #40218a 55%,
          #211044 100%
        );

      direction: rtl;

      font-family:
        Tahoma,
        Arial,
        sans-serif;
    }


    .categoryCard {
      width: 86%;
      max-width: 410px;

      padding: 35px 23px;

      box-sizing: border-box;

      border-radius: 30px;

      text-align: center;

      background:
        rgba(255,255,255,.15);

      box-shadow:
        0 20px 60px rgba(0,0,0,.35);

      backdrop-filter:
        blur(18px);
    }


    .categoryTitle {
      color: white;

      font-size: 29px;

      font-weight: 900;

      margin-bottom: 28px;
    }


    .categoryButton {
      width: 100%;

      min-height: 58px;

      margin: 9px 0;

      border: 0;

      border-radius: 18px;

      background: white;

      color: #29135a;

      font-family:
        Tahoma,
        Arial,
        sans-serif;

      font-size: 20px;

      font-weight: 900;

      box-shadow:
        0 8px 22px rgba(0,0,0,.22);

      touch-action: manipulation;
    }


    .categoryButton:active {
      transform: scale(.97);
    }


    .categoryButton.disabled {
      opacity: .30;

      background: #ddd;

      color: #777;

      pointer-events: none;

      box-shadow: none;
    }


    /* =========================
       GALLERY
    ========================= */

    #galleryPage {
      position: fixed;
      inset: 0;

      z-index: 999999;

      overflow-y: auto;

      box-sizing: border-box;

      padding:
        25px 12px 105px;

      background:
        linear-gradient(
          145deg,
          #7048ff 0%,
          #40218a 55%,
          #211044 100%
        );

      direction: rtl;

      font-family:
        Tahoma,
        Arial,
        sans-serif;
    }


    .galleryHeader {
      text-align: center;

      color: white;

      margin-bottom: 20px;
    }


    .galleryHeader h2 {
      margin: 0 0 7px;

      font-size: 28px;

      font-weight: 900;
    }


    .galleryHeader p {
      margin: 0;

      font-size: 16px;

      opacity: .9;
    }


    .galleryGrid {
      width: 100%;

      max-width: 600px;

      margin: 0 auto;

      display: grid;

      grid-template-columns:
        repeat(3, 1fr);

      gap: 9px;
    }


    .galleryItem {
      width: 100%;

      aspect-ratio: 3 / 4;

      overflow: hidden;

      border-radius: 13px;

      background: rgba(255,255,255,.15);

      box-shadow:
        0 5px 15px rgba(0,0,0,.25);
    }


    .galleryItem img {
      width: 100%;
      height: 100%;

      display: block;

      object-fit: cover;

      pointer-events: none;

      user-select: none;

      -webkit-user-drag: none;
    }


    .galleryBottom {
      width: 100%;

      max-width: 500px;

      margin: 25px auto 0;

      display: flex;

      flex-direction: column;

      gap: 10px;
    }


    .cameraButton {
      width: 100%;

      min-height: 60px;

      border: 0;

      border-radius: 19px;

      background: white;

      color: #281252;

      font-family:
        Tahoma,
        Arial,
        sans-serif;

      font-size: 20px;

      font-weight: 900;

      box-shadow:
        0 9px 25px rgba(0,0,0,.25);
    }


    .backButton {
      width: 100%;

      min-height: 48px;

      border: 0;

      border-radius: 16px;

      background:
        rgba(255,255,255,.18);

      color: white;

      font-family:
        Tahoma,
        Arial,
        sans-serif;

      font-size: 17px;

      font-weight: 700;
    }


    /* =========================
       CHANGE GROUP
    ========================= */

    #changeGroup {
      position: fixed;

      top: 15px;
      right: 15px;

      z-index: 99999;

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

      font-size: 14px;

      font-weight: 700;

      direction: rtl;

      touch-action: manipulation;
    }


    /* =========================
       HIDE HITBOXES
    ========================= */

    .instagram-zone,
    .share-zone {
      opacity: 0 !important;
    }

  `;

  document.head.appendChild(style);


  /* =====================================================
     CLEAN PAGE
  ===================================================== */

  function clearPage() {

    document.body.innerHTML = "";

    activeTarget = null;
    activeIndex = -1;
    currentVideo = -1;

    scene = null;
    video = null;
  }


  /* =====================================================
     MAIN PAGE
  ===================================================== */

  function showMainMenu() {

    clearPage();

    const page =
      document.createElement("div");

    page.id = "mainMenu";


    const card =
      document.createElement("div");

    card.className = "mainCard";


    const title =
      document.createElement("h1");

    title.className = "mainTitle";

    title.textContent =
      "سرزمین شگفت انگیز";


    const button =
      document.createElement("button");

    button.className =
      "mainViewButton";

    button.textContent =
      "مشاهده دفترها ›";


    button.addEventListener(
      "click",
      () => {

        showCategories();

      }
    );


    card.appendChild(title);
    card.appendChild(button);

    page.appendChild(card);

    document.body.appendChild(page);
  }


  /* =====================================================
     CATEGORY PAGE
  ===================================================== */

  function showCategories() {

    clearPage();

    const page =
      document.createElement("div");

    page.id =
      "categoryPage";


    const card =
      document.createElement("div");

    card.className =
      "categoryCard";


    const title =
      document.createElement("div");

    title.className =
      "categoryTitle";

    title.textContent =
      "انتخاب دسته";


    card.appendChild(title);


    /* =========================
       CATEGORY 1
    ========================= */

    const category1 =
      document.createElement("button");

    category1.className =
      "categoryButton";

    category1.textContent =
      "دسته یک";

    category1.addEventListener(
      "click",
      () => {

        showGallery(
          "Group1"
        );

      }
    );

    card.appendChild(category1);


    /* =========================
       CATEGORY 2
    ========================= */

    const category2 =
      document.createElement("button");

    category2.className =
      "categoryButton";

    category2.textContent =
      "دسته دو";

    category2.addEventListener(
      "click",
      () => {

        showGallery(
          "Group2"
        );

      }
    );

    card.appendChild(category2);


    /* =========================
       FUTURE CATEGORIES
    ========================= */

    for (
      let i = 3;
      i <= 5;
      i++
    ) {

      const disabled =
        document.createElement(
          "button"
        );

      disabled.className =
        "categoryButton disabled";

      disabled.textContent =
        `دسته ${persianNumber(i)}`;

      disabled.disabled = true;

      card.appendChild(disabled);
    }


    page.appendChild(card);

    document.body.appendChild(page);
  }


  /* =====================================================
     PERSIAN NUMBERS
  ===================================================== */

  function persianNumber(number) {

    const numbers = [
      "۰",
      "۱",
      "۲",
      "۳",
      "۴",
      "۵",
      "۶",
      "۷",
      "۸",
      "۹"
    ];

    return String(number)
      .split("")
      .map(n => numbers[n])
      .join("");
  }


  /* =====================================================
     GALLERY
     عکس‌ها فقط برای مشاهده هستند.
     هیچ عکس قابل کلیک نیست.
  ===================================================== */

  function showGallery(groupName) {

    clearPage();

    selectedGroup =
      groupName;


    const config =
      GROUPS[groupName];


    const page =
      document.createElement("div");

    page.id =
      "galleryPage";


    const header =
      document.createElement("div");

    header.className =
      "galleryHeader";


    const title =
      document.createElement("h2");

    title.textContent =
      config.title;


    const subtitle =
      document.createElement("p");

    subtitle.textContent =
      "دفترهای این دسته";


    header.appendChild(title);
    header.appendChild(subtitle);

    page.appendChild(header);


    /* =========================
       GRID
    ========================= */

    const grid =
      document.createElement("div");

    grid.className =
      "galleryGrid";


    for (
      let number =
        config.first;
      number <= config.last;
      number++
    ) {

      const item =
        document.createElement("div");

      item.className =
        "galleryItem";


      const img =
        document.createElement("img");


      const fileNumber =
        String(number)
          .padStart(2, "0");


      /*
        فقط 19، 24 و 26 PNG هستند.
      */

      let extension =
        "jpg";


      if (
        number === 19 ||
        number === 24 ||
        number === 26
      ) {

        extension =
          "png";
      }


      img.src =
        `./${groupName}/${fileNumber}/${fileNumber}.${extension}`;


      img.alt =
        `دفتر ${fileNumber}`;


      /*
        عکس فقط نمایش داده می‌شود.
      */

      img.draggable =
        false;


      item.appendChild(img);

      grid.appendChild(item);
    }


    page.appendChild(grid);


    /* =========================
       BOTTOM BUTTONS
    ========================= */

    const bottom =
      document.createElement("div");

    bottom.className =
      "galleryBottom";


    const camera =
      document.createElement("button");

    camera.className =
      "cameraButton";

    camera.textContent =
      "📷 ورود به دوربین";


    camera.addEventListener(
      "click",
      () => {

        startAR(
          groupName
        );

      }
    );


    const back =
      document.createElement("button");

    back.className =
      "backButton";

    back.textContent =
      "‹ بازگشت به انتخاب دسته";


    back.addEventListener(
      "click",
      () => {

        showCategories();

      }
    );


    bottom.appendChild(camera);
    bottom.appendChild(back);

    page.appendChild(bottom);

    document.body.appendChild(page);
  }


  /* =====================================================
     START AR
  ===================================================== */

  function startAR(groupName) {

    clearPage();

    selectedGroup =
      groupName;


    const config =
      GROUPS[groupName];


    /* =================================================
       VIDEO
    ================================================= */

    video =
      document.createElement(
        "video"
      );


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


    /* =================================================
       SCENE
    ================================================= */

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
        uiScanning: yes;
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


    /* =================================================
       CAMERA
    ================================================= */

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


    scene.appendChild(camera);


    /* =================================================
       CREATE 30 TARGETS
    ================================================= */

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


      /* =========================
         VIDEO
      ========================= */

      const plane =
        document.createElement(
          "a-video"
        );


      plane.classList.add(
        "arVideoPlane"
      );


      plane.setAttribute(
        "src",
        "#arVideo"
      );


      /*
        نسبت قبلی و سالم دفتر
      */

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
        "0 0 0"
      );


      plane.setAttribute(
        "rotation",
        "0 0 0"
      );


      plane.setAttribute(
        "visible",
        "false"
      );


      target.appendChild(
        plane
      );


      /* =========================
         INSTAGRAM ZONE
      ========================= */

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


      target.appendChild(
        insta
      );


      /* =========================
         INSTAGRAM TEXT
      ========================= */

      const instaText =
        document.createElement(
          "a-text"
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


      /* =========================
         SHARE ZONE
      ========================= */

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


      target.appendChild(
        share
      );


      /* =========================
         SHARE TEXT
      ========================= */

      const shareText =
        document.createElement(
          "a-text"
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


      /* =========================
         SURPRISE
      ========================= */

      const surprise =
        document.createElement(
          "a-text"
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
        plane,
        surprise
      });


      scene.appendChild(
        target
      );
    }


    /* =================================================
       PUT SCENE ON PAGE
    ================================================= */

    document.body.appendChild(
      scene
    );


    /* =================================================
       CHANGE GROUP BUTTON
    ================================================= */

    createChangeGroupButton();


    /* =================================================
       TARGET EVENTS
    ================================================= */

    targetData.forEach(
      (data, index) => {

        const target =
          data.target;

        const plane =
          data.plane;

        const surprise =
          data.surprise;


        /* =====================
           FOUND
        ===================== */

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


            hideAllPlanes();


            surprise.setAttribute(
              "visible",
              "false"
            );


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
              config.first + index;


            const filename =
              String(videoNumber)
                .padStart(2, "0");


            const src =
              `./${groupName}/${filename}.mp4`;


            currentVideo =
              videoNumber;


            video.muted =
              true;


            video.src =
              src;


            video.load();


            const playWhenReady =
              () => {

                if (
                  activeTarget !== target ||
                  activeIndex !== index
                ) {
                  return;
                }


                try {
                  video.currentTime = 0;
                } catch (e) {}


                video.play()
                  .then(() => {

                    if (
                      activeTarget === target &&
                      activeIndex === index
                    ) {

                      plane.setAttribute(
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


                    video.muted =
                      true;


                    video.play()
                      .then(() => {

                        if (
                          activeTarget === target &&
                          activeIndex === index
                        ) {

                          plane.setAttribute(
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

              playWhenReady();

            } else {

              video.addEventListener(
                "canplay",
                playWhenReady,
                {
                  once: true
                }
              );
            }


            /* =====================
               SURPRISE AFTER LOOP
            ===================== */

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


        /* =====================
           LOST
        ===================== */

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


              plane.setAttribute(
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


    /* =================================================
       AR READY
    ================================================= */

    scene.addEventListener(
      "arReady",
      () => {

        console.log(
          "AR READY:",
          groupName
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
  }


  /* =====================================================
     HIDE PLANES
  ===================================================== */

  function hideAllPlanes() {

    document
      .querySelectorAll(
        ".arVideoPlane"
      )
      .forEach(
        el => {

          el.setAttribute(
            "visible",
            "false"
          );

        }
      );
  }


  /* =====================================================
     CHANGE GROUP BUTTON
     → مستقیم انتخاب دسته
  ===================================================== */

  function createChangeGroupButton() {

    const btn =
      document.createElement(
        "button"
      );


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


        activeTarget =
          null;

        activeIndex =
          -1;

        currentVideo =
          -1;


        /*
          مستقیم برگرد به انتخاب دسته
        */

        showCategories();
      }
    );


    document.body.appendChild(
      btn
    );
  }


  /* =====================================================
     START
  ===================================================== */

  showMainMenu();

});
