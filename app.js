document.addEventListener("DOMContentLoaded", () => {

const scene =
document.querySelector("a-scene");


const frontVideo =
document.querySelector("#frontVideo");


const video02 =
document.querySelector("#video02");


const frontARVideo =
document.querySelector("#frontARVideo");


const target0 =
document.querySelector("#target0");


const target1 =
document.querySelector("#target1");


const canvas =
document.querySelector("#video02Canvas");


const ctx =
canvas.getContext("2d");


const video02Plane =
document.querySelector("#video02Plane");


let video02Active = false;


console.log("APP VERSION 112");


/* =====================================
   AR READY
===================================== */

scene.addEventListener("arReady", () => {

console.log("AR READY");

});


/* =====================================
   TARGET 0
===================================== */

target0.addEventListener(
"targetFound",
async () => {

console.log("TARGET 0 FOUND");


video02Active = false;

video02.pause();


frontVideo.currentTime = 0;

frontVideo.muted = false;


try {

await frontVideo.play();

console.log("VIDEO 1 PLAYING");

}

catch(error) {

console.log(
"VIDEO 1 ERROR:",
error
);

}

});


target0.addEventListener(
"targetLost",
() => {

console.log("TARGET 0 LOST");

frontVideo.pause();

});


/* =====================================
   TARGET 1
===================================== */

target1.addEventListener(
"targetFound",
async () => {

console.log("TARGET 1 FOUND");


/* ویدیوی اول متوقف شود */

frontVideo.pause();


/* فعال کردن Canvas */

video02Active = true;


/* ویدیوی دوم از اول */

video02.currentTime = 0;


/*
اول بدون صدا پخش می‌کنیم
تا Chrome اجازه بدهد
*/

video02.muted = true;


try {

await video02.play();

console.log("VIDEO 2 PLAYING");

}

catch(error) {

console.log(
"VIDEO 2 ERROR:",
error
);

}

});


target1.addEventListener(
"targetLost",
() => {

console.log("TARGET 1 LOST");

video02Active = false;

video02.pause();

});


/* =====================================
   CANVAS VIDEO TEXTURE
===================================== */

function updateVideo02Canvas() {

if (
video02Active &&
video02.readyState >= 2
) {

ctx.drawImage(
video02,
0,
0,
canvas.width,
canvas.height
);


/*
Texture مربوط به Canvas
را مجبور به آپدیت می‌کنیم
*/

const mesh =
video02Plane.getObject3D("mesh");


if (
mesh &&
mesh.material &&
mesh.material.map
) {

mesh.material.map.needsUpdate =
true;

}

}


requestAnimationFrame(
updateVideo02Canvas
);

}


updateVideo02Canvas();


/* =====================================
   VIDEO 1 TEXTURE
===================================== */

scene.addEventListener(
"renderstart",
() => {

scene.addEventListener(
"tick",
() => {


const mesh =
frontARVideo.getObject3D("mesh");


if (
mesh &&
mesh.material &&
mesh.material.map
) {

mesh.material.map.needsUpdate =
true;

}

});

});

});
