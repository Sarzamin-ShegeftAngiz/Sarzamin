// ==============================
// TEST SHARE - TARGET 1
// ==============================

const shareZone = document.querySelector(
    '[mindar-image-target="targetIndex: 0"] .share-zone'
);

if (shareZone) {

    shareZone.addEventListener("click", () => {

        alert("✅ لمس Share دریافت شد!");

    });

    shareZone.addEventListener("touchend", () => {

        alert("✅ لمس Share دریافت شد!");

    });

    console.log("✅ SHARE ZONE CONNECTED");

} else {

    console.log("❌ SHARE ZONE NOT FOUND");

}
