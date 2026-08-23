document.addEventListener("DOMContentLoaded",()=>{


const scene=document.querySelector("a-scene");

const frontVideo=document.querySelector("#frontVideo");


scene.addEventListener("arReady",()=>{
console.log("AR READY");
});


scene.addEventListener("targetFound",async(e)=>{


console.log("TARGET FOUND");


frontVideo.currentTime=0;

frontVideo.muted=false;


try{

await frontVideo.play();

}catch(err){

console.log(err);

}


});


scene.addEventListener("targetLost",()=>{


console.log("TARGET LOST");


frontVideo.pause();


});


});
