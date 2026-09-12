/* =========================================================
   SARZAMIN SHEGEFTANGIZ - WEB AR
   ========================================================= */

let scene = null;
let video = null;
let activeTarget = null;
let activePlane = null;


/* =========================================================
   GROUPS
   ========================================================= */

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
  },

  Group3: {
    mind: "./Group3/targets.mind",
    first: 61,
    last: 90,
    title: "دسته سه"
  }

};


/* =========================================================
   START
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  showCategories();
});


/* =========================================================
   CLEAR PAGE
   ========================================================= */

function clearPage() {

  try {
    if (
      scene &&
      scene.systems &&
      scene.systems["mindar-image-system"]
    ) {
      scene.systems["mindar-image-system"].stop();
    }
  } catch (e) {}

  scene = null;
  video = null;
  activeTarget = null;
  activePlane = null;

  document.body.innerHTML = "";

}


/* =========================================================
   BASIC STYLE
   ========================================================= */

function addStyle() {

  if (document.getElementById("sarzaminStyle")) {
    return;
  }

  const style = document.createElement("style");

  style.id = "sarzaminStyle";

  style.innerHTML = `

    * {
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
    }

    html,
    body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      font-family: Arial, sans-serif;
      direction: rtl;
      background: #111;
    }

    button {
      font-family: Arial, sans-serif;
      border: 0;
      cursor: pointer;
    }

    .mainPage {
      width: 100%;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 25px;
      background:
        radial-gradient(circle at top, #5b21b6, #111 65%);
    }

    .mainTitle {
      color: white;
      font-size: 32px;
      font-weight: bold;
      margin-bottom: 10px;
      text-align: center;
    }

    .mainSub {
      color: #ddd;
      font-size: 17px;
      margin-bottom: 35px;
      text-align: center;
    }

    .groupButton {
      width: min(90%, 330px);
      padding: 17px;
      margin: 8px;
      border-radius: 18px;
      background: white;
      color: #222;
      font-size: 18px;
      font-weight: bold;
      box-shadow: 0 5px 20px rgba(0,0,0,.25);
    }

    .groupButton:active {
      transform: scale(.97);
    }

    .galleryPage {
      width: 100%;
      min-height: 100vh;
      overflow-y: auto;
      padding: 20px 12px 40px;
      background:
        linear-gradient(180deg, #24104f, #090909);
    }

    .galleryTitle {
      color: white;
      text-align: center;
      font-size: 25px;
      font-weight: bold;
      margin: 10px 0 22px;
    }

    .galleryGrid {
      width: 100%;
      max-width: 700px;
      margin: auto;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .galleryItem {
      background: white;
      border-radius: 14px;
      padding: 7px;
      box-shadow: 0 4px 15px rgba(0,0,0,.3);
      overflow: hidden;
    }

    .galleryItem img {
      width: 100%;
      display: block;
      aspect-ratio: 3 / 4;
      object-fit: cover;
      border-radius: 10px;
      background: #ddd;
    }

    .galleryNumber {
      text-align: center;
      color: #222;
      font-weight: bold;
      font-size: 15px;
      padding: 7px 2px 4px;
    }

    .galleryAR {
      width: 100%;
      margin-top: 6px;
      padding: 10px 5px;
      border-radius: 10px;
      background: #6d28d9;
      color: white;
      font-size: 14px;
      font-weight: bold;
    }

    .backButton {
      display: block;
      margin: 5px auto 18px;
      padding: 11px 20px;
      border-radius: 12px;
      background: white;
      color: #222;
      font-size: 15px;
      font-weight: bold;
    }

    #changeGroup {
      position: fixed !important;
      top: 12px !important;
      right: 12px !important;
      z-index: 99999 !important;
      padding: 10px 13px;
      border-radius: 12px;
      background: rgba(0,0,0,.72);
      color: white;
      font-size: 14px;
      font-weight: bold;
      box-shadow: 0 3px 12px rgba(0,0,0,.35);
    }

    #arVideo {
      pointer-events: none !important;
    }

    .a-canvas {
      width: 100% !important;
      height: 100% !important;
    }

    .a-scene {
      width: 100% !important;
      height: 100% !important;
    }

  `;

  document.head.appendChild(style);

}


/* =========================================================
   CATEGORY MENU
   ========================================================= */

function showCategories() {

  clearPage();

  addStyle();

  const page =
    document.createElement("div");

  page.className = "mainPage";


  const title =
    document.createElement("div");

  title.className = "mainTitle";

  title.textContent =
    "✨ سرزمین شگفت‌انگیز ✨";

  page.appendChild(title);


  const sub =
    document.createElement("div");

  sub.className = "mainSub";

  sub.textContent =
    "دفتر مورد علاقه‌ات را انتخاب کن";

  page.appendChild(sub);


  Object.keys(GROUPS).forEach(
    groupName => {

      const button =
        document.createElement("button");

      button.className =
        "groupButton";

      button.textContent =
        GROUPS[groupName].title;

      button.onclick =
        () => showGallery(groupName);

      page.appendChild(button);

    }
  );


  document.body.appendChild(page);

}


/* =========================================================
   IMAGE EXTENSION
   ========================================================= */

function getImageExtension(number) {

  /*
     تصاویر PNG خاص
  */

  if (
    number === 19 ||
    number === 24 ||
    number === 26
  ) {
    return "png";
  }

  return "jpg";

}


/* =========================================================
   GALLERY
   ========================================================= */

function showGallery(groupName) {

  clearPage();

  addStyle();

  const config =
    GROUPS[groupName];


  const page =
    document.createElement("div");

  page.className =
    "galleryPage";


  const back =
    document.createElement("button");

  back.className =
    "backButton";

  back.textContent =
    "← برگشت";

  back.onclick =
    showCategories;

  page.appendChild(back);


  const title =
    document.createElement("div");

  title.className =
    "galleryTitle";

  title.textContent =
    config.title;

  page.appendChild(title);


  const grid =
    document.createElement("div");

  grid.className =
    "galleryGrid";


  for (
    let number = config.first;
    number <= config.last;
    number++
  ) {

    const item =
      document.createElement("div");

    item.className =
      "galleryItem";


    const img =
      document.createElement("img");

    const extension =
      getImageExtension(number);


    /*
       فایل‌ها مستقیماً داخل Group هستند
       مثال:
       Group1/01.jpg
       Group1/02.jpg
    */

    img.src =
      `./${groupName}/${number}.${extension}`;

    img.alt =
      `دفتر ${number}`;

    img.loading =
      "lazy";


    item.appendChild(img);


    const num =
      document.createElement("div");

    num.className =
      "galleryNumber";

    num.textContent =
      `دفتر ${number}`;

    item.appendChild(num);


    const ar =
      document.createElement("button");

    ar.className =
      "galleryAR";

    ar.textContent =
      "✨ اجرای انیمیشن";

    ar.onclick =
      () => startAR(groupName);

    item.appendChild(ar);


    grid.appendChild(item);

  }


  page.appendChild(grid);

  document.body.appendChild(page);

}


/* =========================================================
   START AR
   ========================================================= */

function startAR(groupName) {

  clearPage();

  addStyle();

  const config =
    GROUPS[groupName];


  /* =======================================================
     VIDEO
  ======================================================= */

  video =
    document.createElement("video");

  video.id =
    "arVideo";

  video.setAttribute(
    "playsinline",
    ""
  );

  video.setAttribute(
    "webkit-playsinline",
    ""
  );

  video.autoplay =
    false;

  video.loop =
    false;

  video.muted =
    true;

  video.playsInline =
    true;

  video.preload =
    "auto";

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


  /* =======================================================
     SCENE
     ======================================================= */

  scene =
    document.createElement("a-scene");


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


  scene.setAttribute(
    "embedded",
    ""
  );


  scene.setAttribute(
    "color-space",
    "sRGB"
  );


  /*
     alpha:true حذف شده
     تا دوربین سیاه نشود
  */

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


  scene.style.position =
    "fixed";

  scene.style.left =
    "0";

  scene.style.top =
    "0";

  scene.style.width =
    "100%";

  scene.style.height =
    "100%";

  scene.style.zIndex =
    "1";

  scene.style.background =
    "transparent";


  /* =======================================================
     CAMERA
     ======================================================= */

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


  /*
     فعال کردن لمس روی عناصر AR
  */

  camera.setAttribute(
    "cursor",
    "fuse: false; rayOrigin: mouse;"
  );


  camera.setAttribute(
    "raycaster",
    "near: 0; far: 100; objects: .arLink;"
  );


  scene.appendChild(camera);


  /* =======================================================
     TARGETS
     ======================================================= */

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


    /* =====================================================
       VIDEO PLANE
       ===================================================== */

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


    /* =====================================================
       INSTAGRAM CLICK AREA
       روی @SarzaminAr که داخل خود ویدئو است
       ===================================================== */

    const insta =
      document.createElement(
        "a-plane"
      );


    insta.classList.add(
      "arLink"
    );


    insta.setAttribute(
      "width",
      "0.55"
    );


    insta.setAttribute(
      "height",
      "0.16"
    );


    /*
       بالا سمت چپ
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


    /* =====================================================
       INSTAGRAM CLICK
       ===================================================== */

    insta.addEventListener(
      "click",
      () => {

        console.log(
          "Instagram clicked"
        );


        const appURL =
          "instagram://user?username=SarzaminAr";


        const webURL =
          "https://www.instagram.com/SarzaminAr/";


        /*
           اول اپ اینستاگرام
        */

        window.location.href =
          appURL;


        /*
           اگر اپ باز نشد،
           سایت اینستاگرام
        */

        setTimeout(
          () => {

            window.location.href =
              webURL;

          },
          1500
        );

      }
    );


    /* =====================================================
       SHARE TEXT
       ===================================================== */

    const share =
      document.createElement(
        "a-text"
      );


    share.classList.add(
      "arLink"
    );


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


    /* =====================================================
       SHARE ACTION
       ===================================================== */

    share.addEventListener(
      "click",
      async () => {

        const message =
          "😍 من یه دفتر جادویی پیدا کردم!\n\n" +
          "دوربین گوشیت رو روی دفتر بگیر " +
          "تا ببینی چطور زنده میشه! ✨📚\n\n" +
          "سرزمین شگفت‌انگیز ✨\n" +
          "@SarzaminAr";


        /*
           Share گوشی
           تلگرام، روبیکا، شاد و برنامه‌های
           سازگار نصب‌شده را نمایش می‌دهد.
        */

        if (
          navigator.share
        ) {

          try {

            await navigator.share({

              title:
                "سرزمین شگفت‌انگیز",

              text:
                message,

              url:
                window.location.href

            });

          } catch (error) {

            console.log(
              "Share cancelled:",
              error
            );

          }

        } else {

          /*
             گوشی قدیمی یا مرورگر بدون Share
          */

          try {

            await navigator.clipboard.writeText(
              message
            );

            alert(
              "متن آماده کپی شد 😊"
            );

          } catch (error) {

            alert(
              message
            );

          }

        }

      }
    );


    /* =====================================================
       TARGET FOUND
       ===================================================== */

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


        /*
           توقف ویدئوی قبلی
        */

        try {

          video.pause();

          video.currentTime =
            0;

        } catch (e) {}


        /* =================================================
           شماره واقعی فایل ویدئو
           Group1 = 01 تا 30
           Group2 = 31 تا 60
           Group3 = 61 تا 90
        ================================================= */

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


        /* =================================================
           PLAY
        ================================================= */

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


    /* =====================================================
       TARGET LOST
       ===================================================== */

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


  /* =======================================================
     ADD SCENE
     ======================================================= */

  document.body.appendChild(
    scene
  );


  /* =======================================================
     CHANGE GROUP BUTTON
     ======================================================= */

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
          scene.systems[
            "mindar-image-system"
          ]
        ) {

          scene.systems[
            "mindar-image-system"
          ].stop();

        }

      } catch (e) {

        console.log(e);

      }


      showCategories();

    };


  document.body.appendChild(
    change
  );


  /* =======================================================
     AR READY
     ======================================================= */

  scene.addEventListener(
    "arReady",
    () => {

      console.log(
        "AR READY:",
        groupName
      );

    }
  );


  /* =======================================================
     AR ERROR
     ======================================================= */

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
