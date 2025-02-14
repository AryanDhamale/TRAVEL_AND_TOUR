const application = document.getElementById("sendLocation");
const Loading = document.getElementById("load-btn");
const bookingCon = document.getElementById("booking-con");
const loadingCon = document.getElementById("loading-con");
const contactApplication = document.getElementById("contactInfor");
const contactBtn=document.getElementById("ContactBtn");

async function sendData(data,keyLoc) {
    if (!data) return;
    if(keyLoc)
    {
        Loading.disabled = true;
        bookingCon.style.display = 'none';
        loadingCon.style.display = 'block';
    }
    else 
    {
        contactBtn.disabled=true;
    }
    //const url="https://travel-and-tour-fjis.onrender.com/Loc" ;
    const url = "http://localhost:8080/Loc";
    try {
        const responce = await fetch(url, {
            method: "POST",
            body: JSON.stringify({ ...data, key: keyLoc , send : false}),
            headers: {
                "Content-type": "application/json"
            }
        });
        const MSG = await responce.json();
        console.log(MSG);
        alert("Your email has sent succesfully!");

    } catch (err) {
        console.log({ err: "LTA ERROR:10", err });
        alert("there might be some inter-server issue , please kindly contact with team!");
    }
    if(keyLoc)
    {
        Loading.disabled = false;
        bookingCon.style.display = 'block';
        loadingCon.style.display = 'none';
    }
    else {
        contactBtn.disabled=false;
    }
}


function clear(collection)
{
    if(!collection) return;
    for(let ele of collection){
       ele.value="";
    }
}


if (application) {
    application.onsubmit = function (event) {
        event.preventDefault();
        const formData = new FormData(application);
        const wanted_instruciton = {
            fullName: formData.get("fullName"),
            mobileNo: formData.get("mobileNo"),
            whereTo: formData.get("placeName"),
            howMany: formData.get("noCount"),
            arrivals: formData.get("dateArrival"),
            leaving: formData.get("dateLeaving")
        }
        sendData(wanted_instruciton,true);
        clear(this.elements);
    }
}
else {
    console.log("cant't access book application");
}

if (contactApplication) {
    contactApplication.onsubmit = function (event) {
        event.preventDefault();
        const wanted_instruciton = {
            name: this.elements[0].value,
            email: this.elements[1].value,
            mobileNo: this.elements[2].value,
            subject: this.elements[3].value,
            message: this.elements[4].value,
        }
        sendData(wanted_instruciton,false);
        clear(this.elements);
    }
}
else {
    console.log("can't access contact application");
}