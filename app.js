const instagramButton =
    document.createElement("button");

instagramButton.innerText =
    "@SarzaminAr";

instagramButton.style.position = "fixed";

/* ===== تنظیم جای دکمه ===== */

instagramButton.style.top = "8%";
instagramButton.style.left = "8%";

/* ===== تنظیم اندازه ===== */

instagramButton.style.width = "145px";
instagramButton.style.height = "45px";

/* ===== ظاهر موقت برای تنظیم ===== */

instagramButton.style.zIndex = "99999999";

instagramButton.style.background = "red";
instagramButton.style.color = "white";

instagramButton.style.border =
    "3px solid yellow";

instagramButton.style.borderRadius =
    "10px";

instagramButton.style.fontSize =
    "16px";

instagramButton.style.fontWeight =
    "bold";

instagramButton.style.pointerEvents =
    "auto";

instagramButton.style.touchAction =
    "manipulation";

document.body.appendChild(
    instagramButton
);
