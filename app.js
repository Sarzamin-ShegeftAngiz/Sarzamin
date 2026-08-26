console.log("APP JS START");


document.addEventListener("DOMContentLoaded", () => {


    const scene =
        document.querySelector("a-scene");


    /*
    ================================
    FIREBASE ANONYMOUS
    ================================
    */

    let currentUser = null;


    firebase.auth()
    .signInAnonymously()
    .then((result)=>{

        currentUser =
            result.user;


        console.log(
            "USER:",
            currentUser.uid
        );


    })
    .catch((error)=>{

        console.log(
            "AUTH ERROR",
            error
        );

    });



    const db =
        firebase.firestore();



    /*
    ================================
    VIDEOS
    ================================
    */


    const videos = [

        document.querySelector("#video0"),

        document.querySelector("#video1"),

        document.querySelector("#video2"),

        document.querySelector("#video3"),

        document.querySelector("#video4"),

        document.querySelector("#video5")

    ];



    /*
    ================================
    CHARACTERS
    ================================
    */


    const characters = [

        "choromi",

        "character2",

        "character3",

        "character4",

        "character5",

        "character6"

    ];



    let currentCharacter = null;



    /*
    ================================
    BUTTON
    ================================
    */


    const receiveBox =
        document.querySelector("#receiveBox");


    const receiveButton =
        document.querySelector("#receiveButton");


    const receiveMessage =
        document.querySelector("#receiveMessage");




    /*
    ================================
    TARGET FOUND
    ================================
    */


    scene.addEventListener(
        "targetFound",
        async (event)=>{


            const target =
                event.target;


            const data =
                target.getAttribute(
                    "mindar-image-target"
                );


            const index =
                data.targetIndex;



            console.log(
                "TARGET FOUND",
                index
            );



            currentCharacter =
                characters[index];



            receiveBox.style.display =
                "none";



            const video =
                videos[index];



            if(!video){

                return;

            }



            /*
            توقف بقیه ویدئوها
            */

            videos.forEach(
                (v,i)=>{

                    if(v && i!==index){

                        v.pause();

                    }

                }
            );



            /*
            فقط یک بار پخش شود
            */

            video.loop =
                false;


            video.currentTime =
                0;


            video.muted =
                false;



            video.onended =
            ()=>{


                console.log(
                    "VIDEO END"
                );


                receiveBox.style.display =
                    "block";


            };



            try{


                await video.play();


                console.log(
                    "VIDEO PLAY"
                );


            }
            catch(error){


                console.log(
                    "VIDEO ERROR",
                    error
                );


                video.muted =
                    true;


                await video.play();


            }



        }

    );





    /*
    ================================
    TARGET LOST
    ================================
    */


    scene.addEventListener(
        "targetLost",
        (event)=>{


            const data =
                event.target.getAttribute(
                    "mindar-image-target"
                );


            const index =
                data.targetIndex;



            if(videos[index]){

                videos[index].pause();

            }



            receiveBox.style.display =
                "none";



        }

    );






    /*
    ================================
    RECEIVE CARD
    ================================
    */


    receiveButton.addEventListener(
        "click",
        async ()=>{


            if(!currentUser){

                receiveMessage.innerText =
                "در حال آماده سازی حساب...";


                return;

            }



            if(!currentCharacter){

                return;

            }




            receiveButton.disabled =
                true;



            receiveMessage.innerText =
            "در حال دریافت...";





            const cardRef =
            db
            .collection("users")
            .doc(currentUser.uid)
            .collection("cards")
            .doc(currentCharacter);





            const oldCard =
            await cardRef.get();




            if(oldCard.exists){


                receiveMessage.innerText =
                "🎴 این شخصیت را قبلاً داری";


                return;


            }




            await cardRef.set({

                character:
                currentCharacter,


                createdAt:
                firebase.firestore.FieldValue.serverTimestamp()


            });





            receiveMessage.innerText =
            "🎉 شخصیت به پروفایل اضافه شد";



            receiveButton.innerText =
            "✅ دریافت شد";



            console.log(
                "CARD SAVED",
                currentCharacter
            );



        }

    );



});
