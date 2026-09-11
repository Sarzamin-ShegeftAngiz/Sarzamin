/* =========================================================
   SARZAMIN AR
   A-Frame 1.4.2
   MindAR 1.2.5

   Group1:
   Target 0  -> 01.mp4
   ...
   Target 29 -> 30.mp4

   Group2:
   Target 0  -> 31.mp4
   ...
   Target 29 -> 60.mp4
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  // ---------------------------------------------------------
  // CONFIG
  // ---------------------------------------------------------

  const GROUPS = {
    Group1: {
      mindFile: "Group1/targets.mind",
      firstVideo: 1
    },

    Group2: {
      mindFile: "Group2/targets.mind",
      firstVideo: 31
    }
  };

  const params = new URLSearchParams(window.location.search);
  const selectedGroup = params.get("group");

  // ---------------------------------------------------------
  // GLOBAL STATE
  // ---------------------------------------------------------

  let activeTarget = null;
  let currentTargetIndex = -1;
  let currentVideoNumber = null;
  let isLoadingVideo = false;

  let scene = null;
  let video = null;
  let videoPlane = null;

  // ---------------------------------------------------------
  // BASIC PAGE STYLE
  // ---------------------------------------------------------

  const style = document.createElement("style");

  style.textContent = `
    * {
      box-sizing: border-box;
    }

    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      font-family: Arial, sans-serif;
      background: #111;
    }

    #groupSelector {
      position: fixed;
      inset: 0;
      z-index: 99999;

      display: flex;
      align-items: center;
      justify-content: center;

      background:
        radial-gradient(circle at top, #7b5cff 0%, #342080 38%, #101020 100%);

      padding: 20px;
    }

    #groupCard {
      width: min(90vw, 430px);
      padding: 30px 22px;

      border-radius: 28px;

      background: rgba(255,255,255,0.14);
      border: 1px solid rgba(255,255,255,0.25);

      backdrop-filter: blur(15px);
      -webkit-backdrop-filter: blur(15px);

      text-align: center;
      color: white;

      box-shadow: 0 20px 60px rgba(0,0,0,0.35);
    }

    #groupCard h1 {
      margin: 0 0 8px;
      font-size: 30px;
      font-weight: 900;
    }

    #groupCard p {
      margin: 0 0 25px;
      font-size: 18px;
      opacity: 0.95;
    }

    .groupButton {
      width: 100%;
      margin: 8px 0;
      padding: 15px;

      border: 0;
      border-radius: 16px;

      font-size: 18px;
      font-weight: bold;

      color: #222;
      background: white;

      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }

    .groupButton:active {
      transform: scale(0.97);
    }

    #blueLoading {
      position: fixed;
      inset: 0;
      z-index: 99998;

      display: none;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      background: #0878d1;
      color: white;

      text-align: center;
    }

    #blueLoading .logo {
      font-size: 36px;
      font-weight: 900;
      letter-spacing: 2px;
      margin-bottom: 15px;
    }

    #blueLoading .loadingText {
      font-size: 18px;
    }

    #changeGroupButton {
      position: fixed;
      top: 15px;
      right: 15px;

      z-index: 9999;

      padding: 9px 13px;

      border: 0;
      border-radius: 12px;

      background: rgba(0,0,0,0.55);
      color: white;

      font-size: 13px;
      font-weight: bold;

      display: none;
    }

    .ar-overlay-text {
      pointer-events: none;
    }
  `;

  document.head.appendChild(style);

  // ---------------------------------------------------------
  // GROUP SELECTOR
  // ---------------------------------------------------------

  function createGroupSelector() {

    const old = document.getElementById("groupSelector");
    if (old) old.remove();

    const selector = document.createElement("div");
    selector.id = "groupSelector";

    const card = document.createElement("div");
    card.id = "groupCard";

    const title = document.createElement("h1");
    title.textContent = "سرزمین شگفت انگیز";

    const subtitle = document.createElement("p");
    subtitle.textContent = "انتخاب گروه دفترها";

    card.appendChild(title);
    card.appendChild(subtitle);

    Object.keys(GROUPS).forEach((groupName, index) => {

      const button = document.createElement("button");

      button.className = "groupButton";

      if (groupName === "Group1") {
        button.textContent = "گروه یک";
      } else if (groupName === "Group2") {
        button.textContent = "گروه دو";
      } else {
        button.textContent = `گروه ${index + 1}`;
      }

      button.addEventListener("click", () => {

        // انتخاب گروه و Reload
        window.location.href =
          window.location.pathname +
          "?group=" +
          encodeURIComponent(groupName);
      });

      card.appendChild(button);
    });

    selector.appendChild(card);
    document.body.appendChild(selector);
  }

  // ---------------------------------------------------------
  // BLUE LOADING SCREEN
  // ---------------------------------------------------------

  function createBlueLoading() {

    const loading = document.createElement("div");
    loading.id = "blueLoading";

    const logo = document.createElement("div");
    logo.className = "logo";
    logo.textContent = "SARZAMINAR";

    const text = document.createElement("div");
    text.className = "loadingText";
    text.textContent = "در حال آماده‌سازی دوربین...";

    loading.appendChild(logo);
    loading.appendChild(text);

    document.body.appendChild(loading);

    return loading;
  }

  // ---------------------------------------------------------
  // CHANGE GROUP BUTTON
  // ---------------------------------------------------------

  function createChangeGroupButton() {

    const button = document.createElement("button");

    button.id = "changeGroupButton";
    button.textContent = "تغییر گروه";

    button.addEventListener("click", () => {

      // توقف ویدئو
      if (video) {
        try {
          video.pause();
          video.currentTime = 0;
          video.removeAttribute("src");
          video.load();
        } catch (e) {}
      }

      // خاموش کردن دوربین MindAR
      if (scene) {

        try {
          const mindarSystem =
            scene.systems["mindar-image"];

          if (
            mindarSystem &&
            typeof mindarSystem.stop === "function"
          ) {
            mindarSystem.stop();
          }
        } catch (e) {
          console.log("MindAR stop:", e);
        }
      }

      // توقف تمام Streamهای دوربین
      document.querySelectorAll("video").forEach(v => {

        if (v.srcObject) {

          try {
            v.srcObject
              .getTracks()
              .forEach(track => track.stop());
          } catch (e) {}
        }
      });

      // برگشت کامل به انتخاب گروه
      window.location.href = window.location.pathname;
    });

    document.body.appendChild(button);
  }

  // ---------------------------------------------------------
  // NO GROUP SELECTED
  // ---------------------------------------------------------

  if (!selectedGroup || !GROUPS[selectedGroup]) {

    createGroupSelector();

    return;
  }

  // ---------------------------------------------------------
  // SELECTED GROUP
  // ---------------------------------------------------------

  const groupConfig = GROUPS[selectedGroup];

  const loadingScreen = createBlueLoading();

  loadingScreen.style.display = "flex";

  createChangeGroupButton();

  // ---------------------------------------------------------
  // CREATE A-FRAME SCENE
  // ---------------------------------------------------------

  scene = document.createElement("a-scene");

  scene.setAttribute(
    "mindar-image",
    `imageTargetSrc: ${groupConfig.mindFile}; autoStart: true; uiLoading: no; uiScanning: no; uiError: no;`
  );

  scene.setAttribute(
    "color-space",
    "sRGB"
  );

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

  document.body.appendChild(scene);

  // ---------------------------------------------------------
  // CAMERA
  // ---------------------------------------------------------

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

  // ---------------------------------------------------------
  // SHARED VIDEO
  // فقط یک Video برای تمام Targetها
  // ---------------------------------------------------------

  video = document.createElement("video");

  video.id = "arVideo";

  video.setAttribute("preload", "none");
  video.setAttribute("loop", "");
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");

  video.muted = true;
  video.playsInline = true;

  // خیلی مهم:
  // هیچ sourceای در ابتدا قرار نمی‌دهیم.

  document.body.appendChild(video);

  // ---------------------------------------------------------
  // WAIT FOR A-FRAME
  // ---------------------------------------------------------

  scene.addEventListener("loaded", () => {

    console.log(
      "A-Frame loaded - " + selectedGroup
    );

    createTargets();

    // وقتی Scene آماده شد،
    // صفحه آبی کنار می‌رود.
    setTimeout(() => {

      loadingScreen.style.display = "none";

      const changeButton =
        document.getElementById("changeGroupButton");

      if (changeButton) {
        changeButton.style.display = "block";
      }

    }, 500);
  });

  // ---------------------------------------------------------
  // CREATE ALL 30 TARGETS
  // ---------------------------------------------------------

  function createTargets() {

    for (let i = 0; i < 30; i++) {

      const target = document.createElement(
        "a-entity"
      );

      target.setAttribute(
        "mindar-image-target",
        `targetIndex: ${i};`
      );

      target.dataset.targetIndex = i;

      // -----------------------------------------------------
      // VIDEO PLANE
      // -----------------------------------------------------

      const videoEntity =
        document.createElement("a-video");

      videoEntity.id =
        `videoTarget_${i}`;

      // فعلاً اندازه پایه
      // بعد از دیدن عکس Target دقیق تنظیم می‌کنیم.
      videoEntity.setAttribute(
        "width",
        "1"
      );

      videoEntity.setAttribute(
        "height",
        "0.5625"
      );

      videoEntity.setAttribute(
        "position",
        "0 0 0"
      );

      videoEntity.setAttribute(
        "rotation",
        "0 0 0"
      );

      videoEntity.setAttribute(
        "material",
        "shader: flat; transparent: true; opacity: 1;"
      );

      // Video مشترک
      videoEntity.setAttribute(
        "src",
        "#arVideo"
      );

      videoEntity.setAttribute(
        "visible",
        "false"
      );

      videoEntity.classList.add(
        "ar-video-plane"
      );

      target.appendChild(videoEntity);

      // -----------------------------------------------------
      // INSTAGRAM ZONE
      // -----------------------------------------------------

      const instagramZone =
        document.createElement("a-plane");

      instagramZone.classList.add(
        "instagram-zone"
      );

      instagramZone.setAttribute(
        "width",
        "0.72"
      );

      instagramZone.setAttribute(
        "height",
        "0.16"
      );

      instagramZone.setAttribute(
        "position",
        "0 -0.39 0.02"
      );

      instagramZone.setAttribute(
        "material",
        "transparent: true; opacity: 0;"
      );

      instagramZone.dataset.targetIndex = i;

      target.appendChild(instagramZone);

      // متن Instagram
      const instagramText =
        document.createElement("a-text");

      instagramText.classList.add(
        "ar-overlay-text"
      );

      instagramText.setAttribute(
        "value",
        "دفترهای زنده اینجا 👈"
      );

      instagramText.setAttribute(
        "align",
        "center"
      );

      instagramText.setAttribute(
        "anchor",
        "center"
      );

      instagramText.setAttribute(
        "baseline",
        "center"
      );

      instagramText.setAttribute(
        "position",
        "0 0 0.01"
      );

      instagramText.setAttribute(
        "width",
        "1.2"
      );

      instagramText.setAttribute(
        "color",
        "#ffffff"
      );

      instagramZone.appendChild(
        instagramText
      );

      // -----------------------------------------------------
      // SHARE ZONE
      // -----------------------------------------------------

      const shareZone =
        document.createElement("a-plane");

      shareZone.classList.add(
        "share-zone"
      );

      shareZone.setAttribute(
        "width",
        "0.72"
      );

      shareZone.setAttribute(
        "height",
        "0.16"
      );

      shareZone.setAttribute(
        "position",
        "0 -0.57 0.02"
      );

      shareZone.setAttribute(
        "material",
        "transparent: true; opacity: 0;"
      );

      shareZone.dataset.targetIndex = i;

      target.appendChild(shareZone);

      // متن Share
      const shareText =
        document.createElement("a-text");

      shareText.classList.add(
        "ar-overlay-text"
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
        "0 0 0.01"
      );

      shareText.setAttribute(
        "width",
        "1.2"
      );

      shareText.setAttribute(
        "color",
        "#ffffff"
      );

      shareZone.appendChild(
        shareText
      );

      // -----------------------------------------------------
      // AFTER VIDEO MESSAGE
      // -----------------------------------------------------

      const surpriseZone =
        document.createElement("a-text");

      surpriseZone.classList.add(
        "surprise-message"
      );

      surpriseZone.setAttribute(
        "value",
        "می‌خوای دوستاتو هم سورپرایز کنی؟ 😍👇"
      );

      surpriseZone.setAttribute(
        "align",
        "center"
      );

      surpriseZone.setAttribute(
        "anchor",
        "center"
      );

      surpriseZone.setAttribute(
        "baseline",
        "center"
      );

      surpriseZone.setAttribute(
        "position",
        "0 -0.75 0.02"
      );

      surpriseZone.setAttribute(
        "width",
        "1.25"
      );

      surpriseZone.setAttribute(
        "color",
        "#ffffff"
      );

      surpriseZone.setAttribute(
        "visible",
        "false"
      );

      target.appendChild(
        surpriseZone
      );

      // -----------------------------------------------------
      // TARGET FOUND
      // -----------------------------------------------------

      target.addEventListener(
        "targetFound",
        () => {

          console.log(
            "Target Found:",
            i,
            "Video:",
            getVideoNumber(i)
          );

          activeTarget = target;
          currentTargetIndex = i;

          hideAllVideoPlanes();

          // پیام بعد از ویدئو مخفی شود
          surpriseZone.setAttribute(
            "visible",
            "false"
          );

          loadTargetVideo(
            i,
            videoEntity,
            surpriseZone
          );
        }
      );

      // -----------------------------------------------------
      // TARGET LOST
      // -----------------------------------------------------

      target.addEventListener(
        "targetLost",
        () => {

          console.log(
            "Target Lost:",
            i
          );

          if (activeTarget === target) {

            activeTarget = null;

            // توقف سریع
            if (video) {

              try {
                video.pause();
              } catch (e) {}
            }

            videoEntity.setAttribute(
              "visible",
              "false"
            );

            currentTargetIndex = -1;
          }
        }
      );

      scene.appendChild(target);
    }

    console.log(
      "30 Targets created for",
      selectedGroup
    );
  }

  // ---------------------------------------------------------
  // VIDEO NUMBER
  // ---------------------------------------------------------

  function getVideoNumber(targetIndex) {

    return groupConfig.firstVideo +
      targetIndex;
  }

  // ---------------------------------------------------------
  // VIDEO FILE NAME
  // ---------------------------------------------------------

  function getVideoPath(targetIndex) {

    const number =
      String(
        getVideoNumber(targetIndex)
      ).padStart(2, "0");

    return `${selectedGroup}/${number}.mp4`;
  }

  // ---------------------------------------------------------
  // HIDE ALL VIDEO PLANES
  // ---------------------------------------------------------

  function hideAllVideoPlanes() {

    document
      .querySelectorAll(".ar-video-plane")
      .forEach(entity => {

        entity.setAttribute(
          "visible",
          "false"
        );
      });
  }

  // ---------------------------------------------------------
  // LOAD TARGET VIDEO
  // ---------------------------------------------------------

  function loadTargetVideo(
    targetIndex,
    targetVideoEntity,
    surpriseZone
  ) {

    const videoPath =
      getVideoPath(targetIndex);

    // اگر همان ویدئو است،
    // دوباره Load نکن.
    if (
      currentVideoNumber ===
      getVideoNumber(targetIndex)
    ) {

      targetVideoEntity.setAttribute(
        "visible",
        "true"
      );

      return;
    }

    isLoadingVideo = true;

    // -------------------------------------------------------
    // 1. ویدئوی قبلی فوراً مخفی و Pause
    // -------------------------------------------------------

    hideAllVideoPlanes();

    try {
      video.pause();
    } catch (e) {}

    // -------------------------------------------------------
    // 2. صفر کردن زمان
    // -------------------------------------------------------

    try {
      video.currentTime = 0;
    } catch (e) {}

    // -------------------------------------------------------
    // 3. حذف Source قبلی
    // -------------------------------------------------------

    video.removeAttribute("src");

    // پاک کردن sourceهای احتمالی
    while (video.firstChild) {
      video.removeChild(
        video.firstChild
      );
    }

    // -------------------------------------------------------
    // 4. Source جدید
    // -------------------------------------------------------

    video.src = videoPath;

    currentVideoNumber =
      getVideoNumber(targetIndex);

    // -------------------------------------------------------
    // 5. Load
    // -------------------------------------------------------

    video.load();

    // -------------------------------------------------------
    // 6. بعد از آماده شدن، نمایش بده
    // -------------------------------------------------------

    const showVideo = () => {

      if (
        !activeTarget ||
        currentTargetIndex !== targetIndex
      ) {
        return;
      }

      isLoadingVideo = false;

      try {
        video.currentTime = 0;
      } catch (e) {}

      targetVideoEntity.setAttribute(
        "visible",
        "true"
      );

      // پخش
      const playPromise =
        video.play();

      if (
        playPromise &&
        typeof playPromise.catch === "function"
      ) {

        playPromise.catch(err => {
          console.log(
            "Video play:",
            err
          );
        });
      }

      // بعد از یک دور کامل
      // پیام سورپرایز نمایش داده می‌شود.
      video.onended = () => {

        if (
          activeTarget &&
          currentTargetIndex === targetIndex
        ) {

          surpriseZone.setAttribute(
            "visible",
            "true"
          );
        }
      };
    };

    // اگر metadata قبلاً آماده باشد
    if (video.readyState >= 3) {

      showVideo();

    } else {

      video.addEventListener(
        "canplay",
        showVideo,
        {
          once: true
        }
      );
    }
  }

  // ---------------------------------------------------------
  // INSTAGRAM INTENT
  // همان Intent قبلی
  // ---------------------------------------------------------

  const intentURL =
    "intent://www.instagram.com/_u/SarzaminAr/#Intent;" +
    "package=com.instagram.android;" +
    "scheme=https;" +
    "end";

  function openInstagram() {

    // همان روش قبلی
    window.location.href =
      intentURL;

    // fallback
    setTimeout(() => {

      window.location.href =
        "https://www.instagram.com/SarzaminAr/";

    }, 1200);
  }

  // ---------------------------------------------------------
  // SHARE
  // ---------------------------------------------------------

  async function shareSarzamin() {

    const shareURL =
      window.location.href;

    const shareData = {
      title: "سرزمین شگفت انگیز",
      text:
        "دفترهای زنده سرزمین شگفت انگیز 😍",
      url: shareURL
    };

    // Android / Browser Share
    if (
      navigator.share &&
      typeof navigator.share === "function"
    ) {

      try {

        await navigator.share(
          shareData
        );

        return;

      } catch (error) {

        // کاربر ممکن است Share را بسته باشد
        console.log(
          "Share cancelled:",
          error
        );
      }
    }

    // -------------------------------------------------------
    // Clipboard fallback
    // -------------------------------------------------------

    try {

      if (
        navigator.clipboard &&
        navigator.clipboard.writeText
      ) {

        await navigator.clipboard.writeText(
          shareURL
        );

        alert(
          "لینک کپی شد؛ برای دوستات بفرست 😍"
        );

        return;
      }

    } catch (error) {

      console.log(
        "Clipboard failed:",
        error
      );
    }

    // -------------------------------------------------------
    // Prompt fallback
    // -------------------------------------------------------

    window.prompt(
      "لینک را کپی کن و برای دوستات بفرست:",
      shareURL
    );
  }

  // ---------------------------------------------------------
  // TOUCH LOGIC
  //
  // مهم:
  // همان touchend + THREE.Raycaster + activeTarget
  // ---------------------------------------------------------

  document.addEventListener(
    "touchend",
    function (event) {

      if (!activeTarget) {
        return;
      }

      // -----------------------------------------------------
      // Touch location
      // -----------------------------------------------------

      const touch =
        event.changedTouches[
          event.changedTouches.length - 1
        ];

      if (!touch) {
        return;
      }

      const canvas =
        scene &&
        scene.canvas;

      if (!canvas) {
        return;
      }

      const rect =
        canvas.getBoundingClientRect();

      // -----------------------------------------------------
      // تبدیل Touch به NDC
      // -----------------------------------------------------

      const mouse =
        new THREE.Vector2();

      mouse.x =
        ((touch.clientX - rect.left) /
          rect.width) * 2 - 1;

      mouse.y =
        -((touch.clientY - rect.top) /
          rect.height) * 2 + 1;

      // -----------------------------------------------------
      // Raycaster
      // -----------------------------------------------------

      const raycaster =
        new THREE.Raycaster();

      const cameraObject =
        scene.camera;

      if (!cameraObject) {
        return;
      }

      raycaster.setFromCamera(
        mouse,
        cameraObject
      );

      // -----------------------------------------------------
      // فقط Objectهای Target فعال
      // -----------------------------------------------------

      const instagramZones =
        activeTarget.querySelectorAll(
          ".instagram-zone"
        );

      const shareZones =
        activeTarget.querySelectorAll(
          ".share-zone"
        );

      // -----------------------------------------------------
      // Instagram
      // -----------------------------------------------------

      for (
        const zone
        of instagramZones
      ) {

        const intersections =
          raycaster.intersectObject(
            zone.object3D,
            true
          );

        if (
          intersections &&
          intersections.length > 0
        ) {

          event.preventDefault();

          console.log(
            "Instagram clicked"
          );

          openInstagram();

          return;
        }
      }

      // -----------------------------------------------------
      // Share
      // -----------------------------------------------------

      for (
        const zone
        of shareZones
      ) {

        const intersections =
          raycaster.intersectObject(
            zone.object3D,
            true
          );

        if (
          intersections &&
          intersections.length > 0
        ) {

          event.preventDefault();

          console.log(
            "Share clicked"
          );

          shareSarzamin();

          return;
        }
      }

    },
    {
      passive: false
    }
  );

  // ---------------------------------------------------------
  // SAFETY:
  // وقتی صفحه Hide می‌شود ویدئو متوقف شود
  // ---------------------------------------------------------

  document.addEventListener(
    "visibilitychange",
    () => {

      if (
        document.hidden &&
        video
      ) {

        try {
          video.pause();
        } catch (e) {}
      }
    }
  );

});
