document.addEventListener("DOMContentLoaded", () => {

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

  let scene = null;
  let video = null;
  let activeTarget = null;
  let activePlane = null;

  /* =========================
     STYLE
  ========================= */

  const style = document.createElement("style");

  style.textContent = `
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #000;
      font-family: Tahoma, Arial, sans-serif;
    }

    button {
      font-family: Tahoma, Arial, sans-serif;
      touch-action: manipulation;
    }

    #mainMenu,
    #categoryPage {
      position: fixed;
      inset: 0;
      z-index: 999999;
      display: flex;
      justify-content: center;
      align-items: center;
      direction: rtl;

      background:
        linear-gradient(
          145deg,
          #7048ff 0%,
          #40218a 55%,
          #211044 100%
        );
    }

    .mainCard,
    .categoryCard {
      width: 86%;
      max-width: 410px;
      padding: 35px 23px;
      box-sizing: border-box;
      border-radius: 30px;
      text-align: center;

      background: rgba(255,255,255,.15);

      box-shadow:
        0 20px 60px rgba(0,0,0,.35);

      backdrop-filter: blur(18px);
    }

    .mainTitle {
      margin: 0;
      color: white;
      font-size: 34px;
      font-weight: 900;
    }

    .mainViewButton,
    .categoryButton {
      width: 100%;
      border: 0;
      border-radius: 19px;
      background: white;
      color: #29135a;
      font-size: 20px;
      font-weight: 900;
      box-shadow: 0 9px 25px rgba(0,0,0,.25);
    }

    .mainViewButton {
      margin-top: 30px;
      padding: 19px 15px;
    }

    .categoryTitle {
      color: white;
      font-size: 29px;
      font-weight: 900;
      margin-bottom: 25px;
    }

    .categoryButton {
      min-height: 58px;
      margin: 9px 0;
    }

    .categoryButton.disabled {
      opacity: .3;
      pointer-events: none;
    }

    #galleryPage {
      position: fixed;
      inset: 0;
      z-index: 999999;
      overflow-y: auto;
      box-sizing: border-box;
      padding: 25px 12px 110px;
      direction: rtl;

      background:
        linear-gradient(
          145deg,
          #7048ff 0%,
          #40218a 55%,
          #211044 100%
        );
    }

    .galleryHeader {
      text-align: center;
      color: white;
      margin-bottom: 20px;
    }

    .galleryHeader h2 {
      margin: 0 0 7px;
      font-size: 28px;
    }

    .galleryHeader p {
      margin: 0;
      font-size: 16px;
    }

    .galleryGrid {
      width: 100%;
      max-width: 600px;
      margin: auto;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 9px;
    }

    .galleryItem {
      width: 100%;
      aspect-ratio: 3 / 4;
      overflow: hidden;
      border-radius: 13px;
      background: rgba(255,255,255,.15);
    }

    .galleryItem img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .galleryBottom {
      width: 100%;
      max-width: 500px;
      margin: 25px auto 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .cameraButton,
    .backButton {
      width: 100%;
      min-height: 58px;
      border: 0;
      border-radius: 18px;
      font-size: 20px;
      font-weight: 900;
    }

    .cameraButton {
      background: white;
      color: #281252;
    }

    .backButton {
      background: rgba(255,255,255,.18);
      color: white;
      font-size: 17px;
    }

    #changeGroup {
      position: fixed;
      top: 15px;
      right: 15px;
      z-index: 9999999;

      padding: 11px 16px;
      border: 0;
      border-radius: 15px;

      background: rgba(0,0,0,.65);
      color: white;

      font-size: 14px;
      font-weight: 700;
    }

    .arLink {
      cursor: pointer;
    }
  `;

  document.head.appendChild(style);


  /* =========================
     CLEAN
  ========================= */

  function clearPage() {

    try {
      if (scene &&
          scene.systems &&
          scene.systems["mindar-image"]) {
        scene.systems["mindar-image"].stop();
      }
    } catch (e) {}

    if (video) {
      try {
        video.pause();
        video.removeAttribute("src");
        video.load();
      } catch (e) {}
    }

    document.body.innerHTML = "";

    scene = null;
    video = null;
    activeTarget = null;
    activePlane = null;
  }


  /* =========================
     MAIN
  ========================= */

  function showMainMenu() {

    clearPage();

    const page = document.createElement("div");
    page.id = "mainMenu";

    const card = document.createElement("div");
    card.className = "mainCard";

    const title = document.createElement("h1");
    title.className = "mainTitle";
    title.textContent = "سرزمین شگفت انگیز";

    const button = document.createElement("button");
    button.className = "mainViewButton";
    button.textContent = "مشاهده دفترها ›";

    button.onclick = showCategories;

    card.appendChild(title);
    card.appendChild(button);
    page.appendChild(card);
    document.body.appendChild(page);
  }


  /* =========================
     CATEGORIES
  ========================= */

  function showCategories() {

    clearPage();

    const page = document.createElement("div");
    page.id = "categoryPage";

    const card = document.createElement("div");
    card.className = "categoryCard";

    const title = document.createElement("div");
    title.className = "categoryTitle";
    title.textContent = "انتخاب دسته";

    card.appendChild(title);


    for (let i = 1; i <= 5; i++) {

      const button = document.createElement("button");
      button.className = "categoryButton";

      button.textContent =
        i <= 2
          ? `دسته ${persianNumber(i)}`
          : `دسته ${persianNumber(i)}`;

      if (i <= 2) {

        button.onclick = () => {
          showGallery(`Group${i}`);
        };

      } else {

        button.classList.add("disabled");
        button.disabled = true;
      }

      card.appendChild(button);
    }

    page.appendChild(card);
    document.body.appendChild(page);
  }


  /* =========================
     PERSIAN NUMBER
  ========================= */

  function persianNumber(n) {

    return String(n).replace(
      /\d/g,
      d => "۰۱۲۳۴۵۶۷۸۹"[d]
    );
  }


  /* =========================
     GALLERY
  ========================= */

  function showGallery(groupName) {

    clearPage();

    const config = GROUPS[groupName];

    const page = document.createElement("div");
    page.id = "galleryPage";

    const header = document.createElement("div");
    header.className = "galleryHeader";

    const title = document.createElement("h2");
    title.textContent = config.title;

    const subtitle = document.createElement("p");
    subtitle.textContent = "دفترهای این دسته";

    header.appendChild(title);
    header.appendChild(subtitle);

    page.appendChild(header);


    const grid = document.createElement("div");
    grid.className = "galleryGrid";


    for (
      let number = config.first;
      number <= config.last;
      number++
    ) {

      const item = document.createElement("div");
      item.className = "galleryItem";

      const img = document.createElement("img");

      const fileNumber =
        String(number).padStart(2, "0");

      /*
        فایل‌های عکس مستقیماً داخل Group هستند:
        Group1/01.jpg
        Group1/02.jpg
        ...
      */

      let extension = "jpg";

      if (
        number === 19 ||
        number === 24 ||
        number === 26
      ) {
        extension = "png";
      }

      img.src =
        `./${groupName}/${fileNumber}.${extension}`;

      img.alt =
        `دفتر ${fileNumber}`;

      img.draggable = false;

      item.appendChild(img);
      grid.appendChild(item);
    }


    page.appendChild(grid);


    const bottom = document.createElement("div");
    bottom.className = "galleryBottom";


    const camera = document.createElement("button");
    camera.className = "cameraButton";
    camera.textContent = "📷 ورود به دوربین";

    camera.onclick = () => {
      startAR(groupName);
    };


    const back = document.createElement("button");
    back.className = "backButton";
    back.textContent = "‹ بازگشت به انتخاب دسته";

    back.onclick = showCategories;


    bottom.appendChild(camera);
    bottom.appendChild(back);

    page.appendChild(bottom);

    document.body.appendChild(page);
  }


  /* =========================
     START AR
  ========================= */

  function startAR(groupName) {

    clearPage();

    const config = GROUPS[groupName];


    /* =========================
       VIDEO ELEMENT
    ========================= */

    video = document.createElement("video");

    video.id = "arVideo";

    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    video.autoplay = false;
    video.loop = true;
    video.muted = true;
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
      "colorManagement: true; physicallyCorrectLights: true;"
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
    scene.style.top = "0";
    scene.style.left = "0";
    scene.style.width = "100%";
    scene.style.height = "100%";
    scene.style.zIndex = "1";


    /* =========================
       CAMERA
    ========================= */

    const camera = document.createElement("a-camera");

    camera.setAttribute(
      "position",
      "0 0 0"
    );

    camera.setAttribute(
      "look-controls",
      "enabled: false"
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
         VIDEO PLANE
      ===================== */

      const plane =
        document.createElement("a-video");

      plane.classList.add("arVideoPlane");

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


      /* =====================
         INSTAGRAM LINK
      ===================== */

      const insta =
        document.createElement("a-text");

      insta.classList.add("arLink");

      insta.setAttribute(
        "value",
        "@SarzaminAr"
      );

      insta.setAttribute(
        "align",
        "center"
      );

      insta.setAttribute(
        "anchor",
        "center"
      );

      insta.setAttribute(
        "baseline",
        "center"
      );

      insta.setAttribute(
        "position",
        "0 -0.78 0.05"
      );

      insta.setAttribute(
        "width",
        "2"
      );

      insta.setAttribute(
        "color",
        "white"
      );

      target.appendChild(insta);


      insta.addEventListener(
        "click",
        () => {

          window.open(
            "https://instagram.com/SarzaminAr",
            "_blank"
          );

        }
      );


      /* =====================
         STORE LINK
      ===================== */

      const store =
        document.createElement("a-text");

      store.classList.add("arLink");

      store.setAttribute(
        "value",
        "سرزمین شگفت‌انگیز"
      );

      store.setAttribute(
        "align",
        "center"
      );

      store.setAttribute(
        "anchor",
        "center"
      );

      store.setAttribute(
        "baseline",
        "center"
      );

      store.setAttribute(
        "position",
        "0 -0.95 0.05"
      );

      store.setAttribute(
        "width",
        "1.8"
      );

      store.setAttribute(
        "color",
        "white"
      );

      target.appendChild(store);


      store.addEventListener(
        "click",
        () => {

          window.open(
            "https://instagram.com/SarzaminAr",
            "_blank"
          );

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

          activeTarget = target;
          activePlane = plane;


          /* همه ویدئوها مخفی */

          document
            .querySelectorAll(".arVideoPlane")
            .forEach(p => {
              p.setAttribute(
                "visible",
                "false"
              );
            });


          try {
            video.pause();
            video.currentTime = 0;
          } catch (e) {}


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


          video.src = src;
          video.load();


          const playVideo = () => {

            if (
              activeTarget !== target
            ) {
              return;
            }

            video.play()
              .then(() => {

                if (
                  activeTarget === target
                ) {

                  plane.setAttribute(
                    "visible",
                    "true"
                  );

                }

              })
              .catch(error => {

                console.log(
                  "PLAY ERROR:",
                  error
                );

              });
          };


          if (
            video.readyState >= 3
          ) {

            playVideo();

          } else {

            video.addEventListener(
              "canplay",
              playVideo,
              { once: true }
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

            activeTarget = null;

            if (activePlane) {
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


      scene.appendChild(target);
    }


    document.body.appendChild(scene);


    /* =========================
       CHANGE GROUP
    ========================= */

    const change =
      document.createElement("button");

    change.id = "changeGroup";

    change.textContent =
      "🔄 تغییر گروه";

    change.onclick = () => {

      try {

        if (scene &&
            scene.systems &&
            scene.systems["mindar-image"]) {

          scene.systems[
            "mindar-image"
          ].stop();

        }

      } catch (e) {}

      showCategories();
    };

    document.body.appendChild(change);


    /* =========================
       AR EVENTS
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


  /* =========================
     START APP
  ========================= */

  showMainMenu();

});
