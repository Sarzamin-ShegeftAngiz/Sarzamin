document.addEventListener("DOMContentLoaded",()=>{


const scene=document.querySelector("a-scene");

const frontVideo=
document.querySelector("#frontVideo");

const backVideo=
document.querySelector("#backVideo");


scene.addEventListener("arReady",()=>{

console.log("AR READY");

});



scene.addEventListener(
"targetFound",
async(e)=>{


let target=e.target;


let index=
target.getAttribute(
"mindar-image-target"
).targetIndex;



/* =====================
   Target 0
   دفتر اول
===================== */

if(index===0){

console.log("TARGET 0 FOUND");


backVideo.pause();


frontVideo.currentTime=0;

frontVideo.muted=false;


try{

await frontVideo.play();

}catch(err){

console.log(err);

}

}



/* =====================
   Target 1
   دفتر دوم
===================== */

if(index===1){

console.log("TARGET 1 FOUND");


frontVideo.pause();


backVideo.currentTime=0;

backVideo.muted=false;


try{

await backVideo.play();

}catch(err){

console.log(err);

}

}


});



scene.addEventListener(
"targetLost",
(e)=>{


let index=
e.target.getAttribute(
"mindar-image-target"
).targetIndex;



if(index===0){

frontVideo.pause();

}


if(index===1){

backVideo.pause();

}


});

});
