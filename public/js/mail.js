const application = document.getElementById("sendLocation");
const Loading=document.getElementById("load-btn");
const bookingCon=document.getElementById("booking-con");
const loadingCon=document.getElementById("loading-con");

async function sentData(data)
{
    if(!data) return;
    Loading.disabled=true;
    bookingCon.style.display='none';
    loadingCon.style.display='block';

    const url= process.env.FLAG==="true" ?  "https://travel-and-tour-fjis.onrender.com/Loc" : "http://localhost:8080/Loc" ;
    try {
        const responce = await fetch(url,{
            method : "POST",
            body : JSON.stringify({...data,key : true}),
            headers: {
                "Content-type": "application/json"
            }
        });
        const MSG = await responce.json();
        console.log(MSG);
        alert("Your email has sent succesfully!");
        
    }catch(err)
    {
        console.log({err : "LTA ERROR:10",err});
        alert("there might be some inter-server issue , please kindly contact with team!");
    }
    Loading.disabled=false;
    bookingCon.style.display='block';
    loadingCon.style.display='none';
}



if(application)
{
   application.onsubmit=function(event){
    event.preventDefault();
    const formData=new FormData(application);
    const wanted_instruciton={
        fullName : formData.get("fullName"),
        mobileNo : formData.get("mobileNo"),
        whereTo : formData.get("placeName"),
        howMany : formData.get("noCount"),
        arrivals : formData.get("dateArrival"),
        leaving : formData.get("dateLeaving")
    }
     sentData(wanted_instruciton);
   }  
}
else 
{
  console.log("cant't access application");
}