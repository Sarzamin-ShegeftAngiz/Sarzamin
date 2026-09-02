document.addEventListener("DOMContentLoaded", () => {

  const videos = [
    document.querySelector("#video0"),
    document.querySelector("#video1"),
    document.querySelector("#video2"),
    document.querySelector("#video3"),
    document.querySelector("#video4"),
    document.querySelector("#video5")
  ];

  const targets = [
    document.querySelector('[mindar-image-target="targetIndex: 0"]'),
    document.querySelector('[mindar-image-target="targetIndex: 1"]'),
    document.querySelector('[mindar-image-target="targetIndex: 2"]'),
    document.querySelector('[mindar-image-target="targetIndex: 3"]'),
    document.querySelector('[mindar-image-target="targetIndex: 4"]'),
    document.querySelector('[mindar-image-target="targetIndex: 5"]')
  ];

  const completedOnce = [false, false, false, false, false, false];


  // --------------------------------------------------
  // مخفی / ظاهر کردن نوشته‌ها
  // --------------------------------------------------

  function setTexts(index, visible) {

    const ids = [
      `promo${index}`,
      `liveText${index}`,
      `shareText${index}`
    ];

    ids.forEach(id => {

      const el = document.querySelector(`#${id}`);

      if (el) {
        el.setAttribute("visible", visible);
      }

    });
  }


  // --------------------------------------------------
  // آماده‌سازی هر ویدیو
  // --------------------------------------------------

  videos.forEach((video, index) => {

    if (!video) return;

    // اول نوشته‌های جدید مخفی باشند
    setTexts(index, false);


    // وقتی یک دور کامل ویدیو تمام شد
    video.addEventListener("ended", async () => {

      // فقط اولین دور
      if (!completedOnce[index]) {

        completedOnce[index] = true;

        // نمایش نوشته‌های جدید
        setTexts(index, true);
      }


      // دوباره ویدیو از اول شروع شود
      try {

        video.currentTime = 0;

        await video.play();

      } catch (error) {

        console.log(
          "Video دوباره پخش نشد:",
          index,
          error
        );

      }

    });

  });



  // --------------------------------------------------
  // TARGET FOUND
  // --------------------------------------------------

  targets.forEach((target, index) => {

    if (!target) return;

    target.addEventListener("targetFound", async () => {

      console.log("TARGET FOUND:", index);


      const video = videos[index];

      if (!video) return;


      // شروع یک سیکل جدید
      completedOnce[index] = false;

      // نوشته‌های جدید دوباره مخفی شوند
      setTexts(index, false);


      // ویدیو از اول
      try {

        video.pause();

        video.currentTime = 0;

      } catch (e) {}


      // پخش
      try {

        await video.play();

      } catch (error) {

        console.log(
          "Video play blocked:",
          index,
          error
        );

      }

    });



    // --------------------------------------------------
    // TARGET LOST
    // --------------------------------------------------

    target.addEventListener("targetLost", () => {

      console.log("TARGET LOST:", index);

      const video = videos[index];

      if (!video) return;


      video.pause();

      completedOnce[index] = false;

      setTexts(index, false);

    });

  });



  // --------------------------------------------------
  // لینک اینستاگرام
  // --------------------------------------------------

  for (let i = 0; i < 6; i++) {

    const instagram =
      document.querySelector(`#instagram${i}`);

    const instagramZone =
      document.querySelector(`#instagramZone${i}`);


    function openInstagram() {

      window.open(
        "https://www.instagram.com/SarzaminAr/",
        "_blank"
      );

    }


    if (instagram) {

      instagram.addEventListener(
        "click",
        openInstagram
      );

    }


    if (instagramZone) {

      instagramZone.addEventListener(
        "click",
        openInstagram
      );

    }

  }



  // --------------------------------------------------
  // لینک / اشتراک‌گذاری سرزمین شگفت‌انگیز
  // --------------------------------------------------

  for (let i = 0; i < 6; i++) {

    const store =
      document.querySelector(`#store${i}`);

    const shareZone =
      document.querySelector(
        `#shareZone${i}`
      );


    async function sharePage() {

      const url = window.location.href;


      // اگر گوشی قابلیت Share داشته باشد
      if (
        navigator.share
      ) {

        try {

          await navigator.share({
            title: "سرزمین شگفت‌انگیز",
            text: "این دفتر رو ببین 😍",
            url: url
          });

        } catch (error) {

          console.log(
            "Share cancelled"
          );

        }

        return;
      }


      // اگر Share نداشت، لینک کپی شود
      try {

        await navigator.clipboard.writeText(url);

        alert(
          "لینک کپی شد ❤️\nبرای دوستت بفرست"
        );

      } catch (error) {

        prompt(
          "این لینک رو کپی کن:",
          url
        );

      }

    }


    if (store) {

      store.addEventListener(
        "click",
        sharePage
      );

    }


    if (shareZone) {

      shareZone.addEventListener(
        "click",
        sharePage
      );

    }

  }



  // --------------------------------------------------
  // کمک به اجازه صدای ویدیو در موبایل
  // بدون نمایش دکمه
  // --------------------------------------------------

  function unlockAudio() {

    videos.forEach(video => {

      if (!video) return;

      video.muted = false;

    });

  }


  document.addEventListener(
    "touchstart",
    unlockAudio,
    {
      once: true,
      passive: true
    }
  );


  document.addEventListener(
    "click",
    unlockAudio,
    {
      once: true
    }
  );


});
