document.addEventListener("DOMContentLoaded", () => {

  // =========================================================
  // GROUPS
  // =========================================================

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

  const params = new URLSearchParams(
    window.location.search
  );

  let selectedGroup = params.get("group");

  if (!selectedGroup || !GROUPS[selectedGroup]) {
    selectedGroup = localStorage.getItem(
      "sarzamin_selected_group"
    );
  }

  // =========================================================
  // VARIABLES
  // =========================================================

  let scene = null;
  let video = null;

  let activeTarget = null;
  let currentTargetIndex = -1;
  let currentVideoNumber = null;

  // =========================================================
  // STYLE
  // =========================================================

  const style = document.createElement("style");

  style.textContent = `
    html,body{
      margin:0;
      padding:0;
      width:100%;
      height:100%;
      overflow:hidden;
      background:#000;
      font-family:Arial,sans-serif;
    }

    #groupSelector{
      position:fixed;
      inset:0;
      width:100vw;
      height:100vh;
      z-index:100000;

      display:flex;
      align-items:center;
      justify-content:center;

      background:linear-gradient(
        145deg,
        #704cff,
        #26134f
      );

      padding:20px;
    }

    #groupCard{
      width:min(90vw,430px);
      padding:30px 22px;
      border-radius:28px;

      background:rgba(255,255,255,.15);
      border:1px solid rgba(255,255,255,.3);

      backdrop-filter:blur(15px);
      -webkit-backdrop-filter:blur(15px);

      text-align:center;
      color:white;

      box-shadow:0 20px 60px rgba(0,0,0,.4);
    }

    #groupCard h1{
      margin:0 0 8px;
      font-size:30px;
      font-weight:900;
    }

    #groupCard p{
      margin:0 0 25px;
      font-size:18px;
    }

    .groupButton{
      display:block;
      width:100%;
      margin:10px 0;
      padding:16px;

      border:0;
      border-radius:16px;

      background:white;
      color:#222;

      font-size:18px;
      font-weight:bold;

      touch-action:manipulation;
      -webkit-tap-highlight-color:transparent;
    }

    .groupButton:active{
      transform:scale(.97);
    }

    #blueLoading{
      position:fixed;
      inset:0;
      width:100vw;
      height:100vh;
      z-index:99999;

      display:flex;
      align-items:center;
      justify-content:center;
      flex-direction:column;

      background:#0878d1;
      color:white;
      text-align:center;
    }

    #blueLoading .logo{
      font-size:36px;
      font-weight:900;
      letter-spacing:2px;
      margin-bottom:15px;
    }

    #blueLoading .loadingText{
      font-size:18px;
    }

    #changeGroupButton{
      position:fixed;
      top:15px;
      right:15px;
      z-index:9999;

      padding:10px 14px;
      border:0;
      border-radius:12px;

      background:rgba(0,0,0,.55);
      color:white;

      font-size:14px;
      font-weight:bold;

      display:none;
    }

    /* TEST TOUCH AREAS */
    .testTouch{
      position:relative;
    }
  `;

  document.head.appendChild(style);

  // =========================================================
  // GROUP SELECTOR
  // =========================================================

  function showGroupSelector() {

    const old = document.getElementById(
      "groupSelector"
    );

    if (old) old.remove();

    const selector = document.createElement("div");

    selector.id = "groupSelector";

    const card = document.createElement("div");

    card.id = "groupCard";

    const title = document.createElement("h1");

    title.textContent =
      "سرزمین شگفت انگیز";

    const subtitle = document.createElement("p");

    subtitle.textContent =
      "انتخاب گروه دفترها";

    card.appendChild(title);
    card.appendChild(subtitle);

    // GROUP 1
    const group1 =
      document.createElement("button");

    group1.className = "groupButton";
    group1.textContent = "گروه یک";

    group1.addEventListener(
      "touchend",
      function(e){
        e.preventDefault();
        e.stopPropagation();
        selectGroup("Group1");
      },
      {passive:false}
    );

    group1.addEventListener(
      "click",
      function(e){
        e.preventDefault();
        e.stopPropagation();
        selectGroup("Group1");
      }
    );

    // GROUP 2
    const group2 =
      document.createElement("button");

    group2.className = "groupButton";
    group2.textContent = "گروه دو";

    group2.addEventListener(
      "touchend",
      function(e){
        e.preventDefault();
        e.stopPropagation();
        selectGroup("Group2");
      },
      {passive:false}
    );

    group2.addEventListener(
      "click",
      function(e){
        e.preventDefault();
        e.stopPropagation();
        selectGroup("Group2");
      }
    );

    card.appendChild(group1);
    card.appendChild(group2);

    selector.appendChild(card);

    document.body.appendChild(selector);
  }

  // =========================================================
  // SELECT GROUP
  // =========================================================

  function selectGroup(groupName) {

    localStorage.setItem(
      "sarzamin_selected_group",
      groupName
    );

    const selector =
      document.getElementById(
        "groupSelector"
      );

    if (selector) {
      selector.remove();
    }

    // جلوگیری از صفحه سیاه
    document.body.innerHTML = "";

    // دوباره Style را اضافه کن
    document.head.appendChild(style);

    // صفحه آبی
    showBlueLoading();

    setTimeout(() => {

      window.location.replace(
        window.location.pathname +
        "?group=" +
        encodeURIComponent(groupName)
      );

    }, 50);
  }

  // =========================================================
  // BLUE LOADING
  // =========================================================

  function showBlueLoading() {

    const old =
      document.getElementById(
        "blueLoading"
      );

    if (old) old.remove();

    const loading =
      document.createElement("div");

    loading.id = "blueLoading";

    const logo =
      document.createElement("div");

    logo.className = "logo";
    logo.textContent = "SARZAMINAR";

    const text =
      document.createElement("div");

    text.className = "loadingText";

    text.textContent =
      "در حال آماده‌سازی دوربین...";

    loading.appendChild(logo);
    loading.appendChild(text);

    document.body.appendChild(loading);
  }

  // =========================================================
  // CHANGE GROUP BUTTON
  // =========================================================

  function createChangeGroupButton() {

    const button =
      document.createElement("button");

    button.id = "changeGroupButton";

    button.textContent =
      "🔄 تغییر گروه";

    button.addEventListener(
      "click",
      changeGroup
    );

    document.body.appendChild(button);
  }

  function changeGroup() {

    if (video) {

      try {
        video.pause();
        video.currentTime = 0;
        video.removeAttribute("src");
        video.load();
      } catch(e){}
    }

    if (scene) {

      try {

        const mindar =
          scene.systems["mindar-image"];

        if (
          mindar &&
          typeof mindar.stop === "function"
        ) {
          mindar.stop();
        }

      } catch(e){}
    }

    document
      .querySelectorAll("video")
      .forEach(v => {

        if (v.srcObject) {

          try {
            v.srcObject
              .getTracks()
              .forEach(
                track => track.stop()
              );
          } catch(e){}
        }
      });

    localStorage.removeItem(
      "sarzamin_selected_group"
    );

    window.location.replace(
      window.location.pathname
    );
  }

  // =========================================================
  // NO GROUP
  // =========================================================

  if (
    !selectedGroup ||
    !GROUPS[selectedGroup]
  ) {

    showGroupSelector();
    return;
  }

  // =========================================================
  // SELECTED GROUP
  // =========================================================

  showBlueLoading();

  createChangeGroupButton();

  const groupConfig =
    GROUPS[selectedGroup];

  // =========================================================
  // A-FRAME SCENE
  // =========================================================

  scene =
    document.createElement("a-scene");

  scene.setAttribute(
    "mindar-image",
    `
      imageTargetSrc: ${groupConfig.mindFile};
      autoStart: true;
      uiLoading: no;
      uiScanning: no;
      uiError: no;

      filterMinCF: 0.0001;
      filterBeta: 0.001;
    `
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
    "enabled:false"
  );

  scene.setAttribute(
    "device-orientation-permission-ui",
    "enabled:false"
  );

  document.body.appendChild(scene);

  // =========================================================
  // CAMERA
  // =========================================================

  const camera =
    document.createElement("a-camera");

  camera.setAttribute(
    "position",
    "0 0 0"
  );

  camera.setAttribute(
    "look-controls",
    "enabled:false"
  );

  scene.appendChild(camera);

  // =========================================================
  // ONE SHARED VIDEO
  // =========================================================

  video =
    document.createElement("video");

  video.id = "arVideo";

  video.setAttribute(
    "preload",
    "none"
  );

  video.setAttribute(
    "loop",
    ""
  );

  video.setAttribute(
    "muted",
    ""
  );

  video.setAttribute(
    "playsinline",
    ""
  );

  video.setAttribute(
    "webkit-playsinline",
    ""
  );

  video.muted = true;
  video.playsInline = true;

  document.body.appendChild(video);

  // =========================================================
  // SCENE LOADED
  // =========================================================

  scene.addEventListener(
    "loaded",
    () => {

      console.log(
        "Scene loaded:",
        selectedGroup
      );

      createTargets();

      setTimeout(() => {

        const loading =
          document.getElementById(
            "blueLoading"
          );

        if (loading) {
          loading.remove();
        }

        const changeButton =
          document.getElementById(
            "changeGroupButton"
          );

        if (changeButton) {
          changeButton.style.display =
            "block";
        }

      }, 500);
    }
  );

  // =========================================================
  // CREATE 30 TARGETS
  // =========================================================

  function createTargets() {

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

      target.dataset.targetIndex =
        i;

      // =====================================================
      // VIDEO
      // =====================================================

      const videoEntity =
        document.createElement(
          "a-video"
        );

      videoEntity.id =
        `videoTarget_${i}`;

      // فعلاً اندازه پایه
      // بعداً با عکس Target دقیق تنظیم می‌کنیم

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
        "src",
        "#arVideo"
      );

      videoEntity.setAttribute(
        "visible",
        "false"
      );

      videoEntity.setAttribute(
        "material",
        "shader: flat;"
      );

      videoEntity.classList.add(
        "ar-video-plane"
      );

      target.appendChild(
        videoEntity
      );

      // =====================================================
      // INSTAGRAM RED TEST ZONE
      // =====================================================

      const instagramZone =
        document.createElement(
          "a-plane"
        );

      instagramZone.classList.add(
        "instagram-zone",
        "testTouch"
      );

      instagramZone.setAttribute(
        "width",
        "0.72"
      );

      instagramZone.setAttribute(
        "height",
        "0.18"
      );

      instagramZone.setAttribute(
        "position",
        "0 -0.39 0.03"
      );

      // قرمز برای تست
      instagramZone.setAttribute(
        "material",
        "color: red; opacity: 0.65; transparent: true;"
      );

      target.appendChild(
        instagramZone
      );

      const instagramText =
        document.createElement(
          "a-text"
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
        "0 0 0.02"
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

      // =====================================================
      // SHARE RED TEST ZONE
      // =====================================================

      const shareZone =
        document.createElement(
          "a-plane"
        );

      shareZone.classList.add(
        "share-zone",
        "testTouch"
      );

      shareZone.setAttribute(
        "width",
        "0.72"
      );

      shareZone.setAttribute(
        "height",
        "0.18"
      );

      shareZone.setAttribute(
        "position",
        "0 -0.58 0.03"
      );

      // قرمز برای تست
      shareZone.setAttribute(
        "material",
        "color: red; opacity: 0.65; transparent: true;"
      );

      target.appendChild(
        shareZone
      );

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
        "0 0 0.02"
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

      // =====================================================
      // SURPRISE MESSAGE
      // =====================================================

      const surprise =
        document.createElement(
          "a-text"
        );

      surprise.classList.add(
        "surprise-message"
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
        "0 -0.76 0.03"
      );

      surprise.setAttribute(
        "width",
        "1.25"
      );

      surprise.setAttribute(
        "color",
        "#ffffff"
      );

      surprise.setAttribute(
        "visible",
        "false"
      );

      target.appendChild(
        surprise
      );

      // =====================================================
      // TARGET FOUND
      // =====================================================

      target.addEventListener(
        "targetFound",
        () => {

          console.log(
            "TARGET FOUND:",
            i
          );

          activeTarget =
            target;

          currentTargetIndex =
            i;

          hideAllVideos();

          surprise.setAttribute(
            "visible",
            "false"
          );

          loadVideo(
            i,
            videoEntity,
            surprise
          );
        }
      );

      // =====================================================
      // TARGET LOST
      // =====================================================

      target.addEventListener(
        "targetLost",
        () => {

          console.log(
            "TARGET LOST:",
            i
          );

          if (
            activeTarget ===
            target
          ) {

            activeTarget =
              null;

            currentTargetIndex =
              -1;

            try {
              video.pause();
            } catch(e){}

            videoEntity.setAttribute(
              "visible",
              "false"
            );
          }
        }
      );

      scene.appendChild(
        target
      );
    }

    console.log(
      "30 TARGETS CREATED:",
      selectedGroup
    );
  }

  // =========================================================
  // VIDEO NUMBER
  // =========================================================

  function getVideoNumber(
    targetIndex
  ) {

    return (
      groupConfig.firstVideo +
      targetIndex
    );
  }

  // =========================================================
  // VIDEO PATH
  // =========================================================

  function getVideoPath(
    targetIndex
  ) {

    const number =
      String(
        getVideoNumber(
          targetIndex
        )
      ).padStart(2, "0");

    return (
      `${selectedGroup}/${number}.mp4`
    );
  }

  // =========================================================
  // HIDE ALL VIDEO PLANES
  // =========================================================

  function hideAllVideos() {

    document
      .querySelectorAll(
        ".ar-video-plane"
      )
      .forEach(
        entity => {

          entity.setAttribute(
            "visible",
            "false"
          );
        }
      );
  }

  // =========================================================
  // LOAD VIDEO - LAZY
  // =========================================================

  function loadVideo(
    targetIndex,
    videoEntity,
    surprise
  ) {

    const number =
      getVideoNumber(
        targetIndex
      );

    const path =
      getVideoPath(
        targetIndex
      );

    // اگر همان ویدئو است
    if (
      currentVideoNumber ===
      number
    ) {

      videoEntity.setAttribute(
        "visible",
        "true"
      );

      return;
    }

    // -----------------------------------------
    // 1. مخفی و Pause
    // -----------------------------------------

    hideAllVideos();

    try {
      video.pause();
    } catch(e){}

    // -----------------------------------------
    // 2. صفر
    // -----------------------------------------

    try {
      video.currentTime = 0;
    } catch(e){}

    // -----------------------------------------
    // 3. حذف Source قبلی
    // -----------------------------------------

    video.removeAttribute(
      "src"
    );

    while (
      video.firstChild
    ) {
      video.removeChild(
        video.firstChild
      );
    }

    // -----------------------------------------
    // 4. Source جدید
    // -----------------------------------------

    video.src =
      path;

    currentVideoNumber =
      number;

    // -----------------------------------------
    // 5. Load
    // -----------------------------------------

    video.load();

    // -----------------------------------------
    // 6. آماده شدن
    // -----------------------------------------

    const showVideo =
      () => {

        if (
          !activeTarget ||
          currentTargetIndex !==
          targetIndex
        ) {
          return;
        }

        try {
          video.currentTime = 0;
        } catch(e){}

        videoEntity.setAttribute(
          "visible",
          "true"
        );

        const playPromise =
          video.play();

        if (
          playPromise &&
          playPromise.catch
        ) {

          playPromise.catch(
            error => {
              console.log(
                "PLAY ERROR:",
                error
              );
            }
          );
        }

        // -------------------------------------
        // بعد از یک دور
        // -------------------------------------

        video.onended =
          () => {

            if (
              activeTarget &&
              currentTargetIndex ===
              targetIndex
            ) {

              surprise.setAttribute(
                "visible",
                "true"
              );
            }
          };
      };

    if (
      video.readyState >= 3
    ) {

      showVideo();

    } else {

      video.addEventListener(
        "canplay",
        showVideo,
        {once:true}
      );
    }
  }

  // =========================================================
  // INSTAGRAM
  // =========================================================

  const intentURL =
    "intent://www.instagram.com/_u/SarzaminAr/#Intent;" +
    "package=com.instagram.android;" +
    "scheme=https;" +
    "end";

  function openInstagram() {

    console.log(
      "INSTAGRAM TEST CLICK"
    );

    window.location.href =
      intentURL;

    setTimeout(
      () => {

        window.location.href =
          "https://www.instagram.com/SarzaminAr/";

      },
      1200
    );
  }

  // =========================================================
  // SHARE
  // =========================================================

  async function shareSarzamin() {

    console.log(
      "SHARE TEST CLICK"
    );

    const shareURL =
      window.location.href;

    const data = {
      title:
        "سرزمین شگفت انگیز",

      text:
        "دفترهای زنده سرزمین شگفت انگیز 😍",

      url:
        shareURL
    };

    // -----------------------------------------
    // Native Share
    // -----------------------------------------

    if (
      navigator.share
    ) {

      try {

        await navigator.share(
          data
        );

        return;

      } catch(e) {

        console.log(
          "Share cancelled"
        );
      }
    }

    // -----------------------------------------
    // Clipboard
    // -----------------------------------------

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

    } catch(e) {

      console.log(
        "Clipboard error:",
        e
      );
    }

    // -----------------------------------------
    // Prompt
    // -----------------------------------------

    window.prompt(
      "لینک را کپی کن:",
      shareURL
    );
  }

  // =========================================================
  // TOUCH
  // همان touchend + THREE.Raycaster + activeTarget
  // =========================================================

  document.addEventListener(
    "touchend",
    function(event) {

      if (!activeTarget) {
        return;
      }

      if (!scene || !scene.canvas) {
        return;
      }

      const touch =
        event.changedTouches[
          event.changedTouches.length - 1
        ];

      if (!touch) {
        return;
      }

      const canvas =
        scene.canvas;

      const rect =
        canvas.getBoundingClientRect();

      const mouse =
        new THREE.Vector2();

      mouse.x =
        (
          (touch.clientX - rect.left) /
          rect.width
        ) * 2 - 1;

      mouse.y =
        -(
          (touch.clientY - rect.top) /
          rect.height
        ) * 2 + 1;

      const raycaster =
        new THREE.Raycaster();

      const camera =
        scene.camera;

      if (!camera) {
        return;
      }

      raycaster.setFromCamera(
        mouse,
        camera
      );

      // =====================================================
      // INSTAGRAM
      // =====================================================

      const instagramZones =
        activeTarget.querySelectorAll(
          ".instagram-zone"
        );

      for (
        const zone of instagramZones
      ) {

        const hits =
          raycaster.intersectObject(
            zone.object3D,
            true
          );

        if (
          hits &&
          hits.length > 0
        ) {

          event.preventDefault();

          openInstagram();

          return;
        }
      }

      // =====================================================
      // SHARE
      // =====================================================

      const shareZones =
        activeTarget.querySelectorAll(
          ".share-zone"
        );

      for (
        const zone of shareZones
      ) {

        const hits =
          raycaster.intersectObject(
            zone.object3D,
            true
          );

        if (
          hits &&
          hits.length > 0
        ) {

          event.preventDefault();

          shareSarzamin();

          return;
        }
      }

    },
    {
      passive:false
    }
  );

  // =========================================================
  // PAGE HIDDEN
  // =========================================================

  document.addEventListener(
    "visibilitychange",
    () => {

      if (
        document.hidden &&
        video
      ) {

        try {
          video.pause();
        } catch(e){}
      }
    }
  );

});
