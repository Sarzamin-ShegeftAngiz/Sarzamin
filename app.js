document.addEventListener("DOMContentLoaded",()=>{


const scene =
document.querySelector("a-scene");


const video0 =
document.querySelector("#video0");


const video1 =
document.querySelector("#video1");



scene.addEventListener("arReady",()=>{

console.log("AR READY");

});



scene.addEventListener(
"targetFound",
async(e)=>{


let target = e.target;


let index =
target.getAttribute(
"mindar-image-target"
).targetIndex;



/* =====================
   TARGET 0
===================== */

if(index === 0){

console.log("TARGET 0 FOUND");


video1.pause();


video0.currentTime = 0;

video0.muted = false;


try{

await video0.play();

}catch(err){

console.log(err);

}

}



/* =====================
   TARGET 1
===================== */

if(index === 1){

console.log("TARGET 1 FOUND");


video0.pause();


video1.currentTime = 0;

video1.muted = false;


try{

await video1.play();

}catch(err){

console.log(err);

}

}


});



scene.addEventListener(
"targetLost",
(e)=>{


let index =
e.target.getAttribute(
"mindar-image-target"
).targetIndex;



if(index === 0){

video0.pause();

}



if(index === 1){

video1.pause();

}


});

});
