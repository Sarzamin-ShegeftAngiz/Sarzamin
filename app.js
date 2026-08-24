document.addEventListener("DOMContentLoaded",()=>{

const scene=document.querySelector("a-scene");

const videos=[
document.querySelector("#video0"),
document.querySelector("#video1"),
document.querySelector("#video2"),
document.querySelector("#video3"),
document.querySelector("#video4"),
document.querySelector("#video5")
];


scene.addEventListener("arReady",()=>{

console.log("AR READY");

});


scene.addEventListener(
"targetFound",
async(e)=>{

const index=
e.target.getAttribute(
"mindar-image-target"
).targetIndex;

console.log("TARGET FOUND:",index);


/* توقف همه ویدئوها */

videos.forEach((video,i)=>{

if(i!==index){

video.pause();

}

});


/* پخش ویدیوی تارگت */

const video=videos[index];

if(!video) return;


video.currentTime=0;

video.muted=false;


try{

await video.play();

console.log(
"VIDEO PLAYING:",
index
);

}catch(err){

console.log(
"VIDEO ERROR:",
index,
err
);

}

});


scene.addEventListener(
"targetLost",
(e)=>{

const index=
e.target.getAttribute(
"mindar-image-target"
).targetIndex;

console.log(
"TARGET LOST:",
index
);


const video=videos[index];

if(video){

video.pause();

}

});

});
