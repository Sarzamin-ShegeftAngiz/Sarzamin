document.addEventListener("DOMContentLoaded", () => {

  const GROUPS = {
    Group1: {
      mind: "Group1/targets.mind",
      startVideo: 1
    },
    Group2: {
      mind: "Group2/targets.mind",
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
     REMOVE OLD GROUP UI
  ===================================================== */

  function removeOldUI() {
    [
      "#groupSelector",
      "#group-selection",
      "#groupSelection",
      "#groupPage",
      "#group-page"
    ].forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        el.remove();
      });
    });
  }

  /* =====================================================
     STYLES
  ===================================================== */

  const style = document.createElement("style");

  style.textContent = `
    html,body{
      margin:0!important;
      padding:0!important;
      width:100%;
      height:100%;
      overflow:hidden;
      background:#000;
    }

    #groupSelectorNew{
      position:fixed;
      inset:0;
      z-index:999999;
      display:flex;
      justify-content:center;
      align-items:center;
      background:linear-gradient(145deg,#6d4aff,#241047);
      font-family:Arial,sans-serif;
    }

    .groupCard{
      width:85%;
      max-width:400px;
      padding:30px 22px;
      border-radius:28px;
      text-align:center;
      color:white;
      background:rgba(255,255,255,.16);
      box-shadow:0 20px 60px rgba(0,0,0,.4);
      backdrop-filter:blur(15px);
    }

    .groupCard h1{
      margin:0 0 10px;
      font-size:30px;
    }

    .groupCard p{
      margin:0 0 25px;
      font-size:18px;
    }

    .groupBtn{
      width:100%;
      padding:16px;
      margin:9px 0;
      border:0;
      border-radius:16px;
      background:white;
      color:#222;
      font-size:18px;
      font-weight:bold;
      touch-action:manipulation;
    }

    #blueLoading{
      position:fixed;
      inset:0;
      z-index:999998;
      display:flex;
      flex-direction:column;
      justify-content:center;
      align-items:center;
      background:#0878d1;
      color:white;
      font-family:Arial,sans-serif;
      text-align:center;
    }

    #blueLoading strong{
      font-size:36px;
      margin-bottom:15px;
    }

    #blueLoading span{
      font-size:18px;
    }

    #changeGroup{
      position:fixed;
      top:15px;
      right:15px;
      z-index:9999;
      display:none;
      padding:11px 15px;
      border:0;
      border-radius:14px;
      background:rgba(0,0,0,.6);
      color:white;
      font-size:15px;
    }

    .testZone{
      opacity:.7;
    }
  `;

  document.head.appendChild(style);

  /* =====================================================
     GROUP PAGE
  ===================================================== */

  function showGroups() {

    removeOldUI();

    const page = document.createElement("div");
    page.id = "groupSelectorNew";

    const card = document.createElement("div");
    card.className = "groupCard";

    card.innerHTML = `
      <h1>سرزمین شگفت انگیز</h1>
      <p>انتخاب گروه دفترها</p>
    `;

    ["Group1","Group2"].forEach((name,index) => {

      const btn = document.createElement("button");

      btn.className = "groupBtn";
      btn.textContent =
        index === 0 ? "گروه یک" : "گروه دو";

      btn.addEventListener(
        "touchend",
        e => {
          e.preventDefault();
          e.stopPropagation();
          chooseGroup(name);
        },
        {passive:false}
      );

      btn.addEventListener(
        "click",
        e => {
          e.preventDefault();
          e.stopPropagation();
          chooseGroup(name);
        }
      );

      card.appendChild(btn);
    });

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

    removeOldUI();

    document
      .querySelectorAll("a-scene")
      .forEach(el => el.remove());

    document.body.innerHTML = "";

    document.head.appendChild(style);

    showLoading();

    setTimeout(() => {

      location.replace(
        location.pathname +
        "?group=" +
        encodeURIComponent(name)
      );

    },100);

  }

  /* =====================================================
     BLUE LOADING
  ===================================================== */

  function showLoading() {

    const old =
      document.getElementById("blueLoading");

    if(old) old.remove();

    const box =
      document.createElement("div");

    box.id = "blueLoading";

    box.innerHTML = `
      <strong>SARZAMINAR</strong>
      <span>در حال آماده‌سازی دوربین...</span>
    `;

    document.body.appendChild(box);
  }

  /* =====================================================
     CHANGE GROUP
  ===================================================== */

  function createChangeButton() {

    const btn =
      document.createElement("button");

    btn.id = "changeGroup";
    btn.textContent = "🔄 تغییر گروه";

    btn.addEventListener("click",() => {

      try {
        if(video){
          video.pause();
          video.removeAttribute("src");
          video.load();
        }
      }catch(e){}

      try {
        if(scene &&
           scene.systems["mindar-image"]){

          scene.systems["mindar-image"].stop();
        }
      }catch(e){}

      localStorage.removeItem(
        "sarzamin_group"
      );

      location.replace(
        location.pathname
      );
    });

    document.body.appendChild(btn);
  }

  /* =====================================================
     IF NO GROUP
  ===================================================== */

  if(!group || !GROUPS[group]) {
    showGroups();
    return;
  }

  /* =====================================================
     START SELECTED GROUP
  ===================================================== */

  removeOldUI();
  showLoading();
  createChangeButton();

  const config = GROUPS[group];

  /* =====================================================
     CREATE SCENE
  ===================================================== */

  scene =
    document.createElement("a-scene");

  scene.id = "arScene";

  scene.setAttribute(
    "mindar-image",
    `
      imageTargetSrc: ${config.mind};
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

  document.body.appendChild(scene);

  /* =====================================================
     CAMERA
  ===================================================== */

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

  /* =====================================================
     ONE VIDEO
  ===================================================== */

  video =
    document.createElement("video");

  video.id = "arVideo";

  video.preload = "none";
  video.loop = true;
  video.muted = true;
  video.playsInline = true;

  video.setAttribute(
    "webkit-playsinline",
    ""
  );

  document.body.appendChild(video);

  /* =====================================================
     SCENE READY
  ===================================================== */

  scene.addEventListener(
    "loaded",
    () => {

      console.log(
        "AR SCENE READY:",
        group
      );

      createTargets();

      setTimeout(() => {

        const loading =
          document.getElementById(
            "blueLoading"
          );

        if(loading)
          loading.remove();

        const change =
          document.getElementById(
            "changeGroup"
          );

        if(change)
          change.style.display =
            "block";

      },500);

    }
  );

  /* =====================================================
     CREATE 30 TARGETS
  ===================================================== */

  function createTargets() {

    for(let i=0;i<30;i++){

      const target =
        document.createElement(
          "a-entity"
        );

      target.setAttribute(
        "mindar-image-target",
        `targetIndex:${i};`
      );

      /* ================= VIDEO ================= */

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

      v.setAttribute(
        "width",
        "1"
      );

      v.setAttribute(
        "height",
        "0.5625"
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

      /* ================= INSTAGRAM ================= */

      const insta =
        document.createElement(
          "a-plane"
        );

      insta.classList.add(
        "instagram-zone"
      );

      insta.setAttribute(
        "width",
        ".72"
      );

      insta.setAttribute(
        "height",
        ".18"
      );

      insta.setAttribute(
        "position",
        "0 -.39 .03"
      );

      insta.setAttribute(
        "material",
        "color:red;opacity:.7;transparent:true;"
      );

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
        "width",
        "1.2"
      );

      instaText.setAttribute(
        "color",
        "white"
      );

      insta.appendChild(
        instaText
      );

      target.appendChild(insta);

      /* ================= SHARE ================= */

      const share =
        document.createElement(
          "a-plane"
        );

      share.classList.add(
        "share-zone"
      );

      share.setAttribute(
        "width",
        ".72"
      );

      share.setAttribute(
        "height",
        ".18"
      );

      share.setAttribute(
        "position",
        "0 -.59 .03"
      );

      share.setAttribute(
        "material",
        "color:red;opacity:.7;transparent:true;"
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
        "width",
        "1.2"
      );

      shareText.setAttribute(
        "color",
        "white"
      );

      share.appendChild(
        shareText
      );

      target.appendChild(share);

      /* ================= SURPRISE ================= */

      const surprise =
        document.createElement(
          "a-text"
        );

      surprise.classList.add(
        "surprise"
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
        "position",
        "0 -.78 .03"
      );

      surprise.setAttribute(
        "width",
        "1.2"
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

      /* ================= FOUND ================= */

      target.addEventListener(
        "targetFound",
        () => {

          activeTarget =
            target;

          activeIndex =
            i;

          hideVideos();

          surprise.setAttribute(
            "visible",
            "false"
          );

          loadVideo(
            i,
            v,
            surprise
          );

        }
      );

      /* ================= LOST ================= */

      target.addEventListener(
        "targetLost",
        () => {

          if(
            activeTarget ===
            target
          ){

            activeTarget = null;
            activeIndex = -1;

            try{
              video.pause();
            }catch(e){}

            v.setAttribute(
              "visible",
              "false"
            );
          }
        }
      );

      scene.appendChild(target);
    }

    console.log(
      "30 TARGETS CREATED:",
      group
    );
  }

  /* =====================================================
     HIDE VIDEOS
  ===================================================== */

  function hideVideos(){

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
     VIDEO PATH
  ===================================================== */

  function videoPath(index){

    const number =
      String(
        config.startVideo + index
      ).padStart(2,"0");

    return (
      `${group}/${number}.mp4`
    );
  }

  /* =====================================================
     LAZY LOAD
  ===================================================== */

  function loadVideo(
    index,
    entity,
    surprise
  ){

    const number =
      config.startVideo + index;

    if(currentVideo === number){

      entity.setAttribute(
        "visible",
        "true"
      );

      video.play().catch(()=>{});

      return;
    }

    hideVideos();

    try{
      video.pause();
    }catch(e){}

    try{
      video.currentTime = 0;
    }catch(e){}

    video.removeAttribute("src");

    video.load();

    currentVideo = number;

    video.src =
      videoPath(index);

    video.load();

    const ready = () => {

      if(
        activeTarget === null ||
        activeIndex !== index
      ){
        return;
      }

      try{
        video.currentTime = 0;
      }catch(e){}

      entity.setAttribute(
        "visible",
        "true"
      );

      video.play().catch(()=>{});

    };

    video.addEventListener(
      "canplay",
      ready,
      {once:true}
    );

    video.onended = () => {

      if(
        activeTarget &&
        activeIndex === index
      ){

        surprise.setAttribute(
          "visible",
          "true"
        );
      }
    };
  }

  /* =====================================================
     INSTAGRAM
  ===================================================== */

  const intentURL =
    "intent://www.instagram.com/_u/SarzaminAr/#Intent;" +
    "package=com.instagram.android;" +
    "scheme=https;" +
    "end";

  function openInstagram(){

    console.log(
      "INSTAGRAM TEST"
    );

    window.location.href =
      intentURL;

    setTimeout(() => {

      window.location.href =
        "https://www.instagram.com/SarzaminAr/";

    },1200);
  }

  /* =====================================================
     SHARE
  ===================================================== */

  async function sharePage(){

    const url =
      location.href;

    if(
      navigator.share
    ){

      try{

        await navigator.share({
          title:
            "سرزمین شگفت انگیز",
          text:
            "دفترهای زنده سرزمین شگفت انگیز 😍",
          url:url
        });

        return;

      }catch(e){}
    }

    try{

      await navigator.clipboard.writeText(
        url
      );

      alert(
        "لینک کپی شد 😍"
      );

      return;

    }catch(e){}

    prompt(
      "لینک را کپی کن:",
      url
    );
  }

  /* =====================================================
     TOUCH
     touchend + THREE.Raycaster + activeTarget
  ===================================================== */

  document.addEventListener(
    "touchend",
    event => {

      if(!activeTarget)
        return;

      if(
        !scene ||
        !scene.canvas ||
        !scene.camera
      )
        return;

      const touch =
        event.changedTouches[
          event.changedTouches.length - 1
        ];

      if(!touch)
        return;

      const rect =
        scene.canvas.getBoundingClientRect();

      const mouse =
        new THREE.Vector2();

      mouse.x =
        ((touch.clientX - rect.left) /
        rect.width) * 2 - 1;

      mouse.y =
        -((touch.clientY - rect.top) /
        rect.height) * 2 + 1;

      const raycaster =
        new THREE.Raycaster();

      raycaster.setFromCamera(
        mouse,
        scene.camera
      );

      const insta =
        activeTarget.querySelector(
          ".instagram-zone"
        );

      if(insta){

        const hits =
          raycaster.intersectObject(
            insta.object3D,
            true
          );

        if(hits.length){

          event.preventDefault();

          openInstagram();

          return;
        }
      }

      const share =
        activeTarget.querySelector(
          ".share-zone"
        );

      if(share){

        const hits =
          raycaster.intersectObject(
            share.object3D,
            true
          );

        if(hits.length){

          event.preventDefault();

          sharePage();

          return;
        }
      }

    },
    {passive:false}
  );

});
