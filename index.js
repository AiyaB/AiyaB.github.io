
//password
let cookie=document.cookie;
if(cookie!="isLoch=true"){
    let password=prompt("Enter the Wallaby wifi password","");
    if(password=="112233"){
        document.cookie="isLoch=true";
    }
    else{
        window.location="https://www.google.com/search?q=no";
    }
}

//Time functions
let currentTime=new Date();
let currentHour=0;
let currentDay=0;
let currentDate=0;
let currentMonth=0;
function getTimes(){
    currentTime=new Date();
    currentHour=currentTime.getUTCHours()+2;//UTC to CET
    currentDay=currentTime.getDay()+(Math.floor(currentHour/24));//next day if >24 hours
    currentDay=currentDay%7;
    currentDate=currentTime.getDate()+(Math.floor(currentHour/24));
    currentMonth=currentTime.getUTCMonth()+1;//if dates start from 1 then so should months
    currentHour=currentHour%24;
}
function isOpen(){
    getTimes();
    let openTimes=((currentHour>=18 || currentHour<=1)&&currentDay!=2);//18:00-1:00, closed Tuesdays
    let openDisplay=document.getElementById("openDisplay");
    if(openTimes)
    {
        openDisplay.textContent="Currently Open";
        openDisplay.style.color="hsl(215, 38%, 9%)";
        openDisplay.style.backgroundColor="hsl(185, 100%, 98%)";
    }
    else
    {
        openDisplay.textContent="Currently Closed";
        openDisplay.style.color="hsl(185, 100%, 98%)";
        openDisplay.style.backgroundColor="hsl(215, 38%, 9%)";
    }
}
isOpen();

function menuToggle(){
    let toggle=document.getElementById("navToggle");
    let menu=document.getElementById("navList");
    toggle.onclick=function(){
        if(menu.style.display=="block"){
            menu.style.display="none";
            toggle.style.backgroundColor="hsl(220, 1%, 52%)";
        }
        else{
            menu.style.display="block";
            toggle.style.backgroundColor="hsl(215, 38%, 9%)";
        }
    }
}
menuToggle();

function isHappyHour(){
    //getTimes(); just rely on isOpen being called recently enough
    let happyTimes=((currentHour>=14 && currentHour<16) && currentDay==3);//14:00-16:00, Wednesdays
    return happyTimes;
}

//unplanned closure
function sorryClosed(reason){//put reason in quotes
    let sec=document.getElementById("sorryClosed");
    let sign=document.createElement("img");
    sign.src="sorryClosed.jpg";
    sign.style.width="80%";
    let message=document.createElement("p");
    message.innerHTML=reason;
    sec.appendChild(sign);
    sec.appendChild(message);
}
//sorryClosed("Unfortunately we have power problem. We're trying to fix it");

//highlight current day's hours
function currentHours(){
    getTimes();
    let hours=document.getElementById("hours");
    if(hours){
        hours.rows[(currentDay+6)%7].style.color="hsl(355, 82%, 60%)";//1 less day since table starts Monday
    }
}
currentHours();

async function googleMap(){
    if(!document.getElementById("googleMap")){
        return;
    }
    const { Map } = await google.maps.importLibrary("maps");
    let mapInfo={
        center:{lat:39.87271811904638, lng:20.01440111945435},
        zoom:16,
    };
    let map=new Map(document.getElementById("googleMap"),mapInfo);
    let tunnelQuery={
        query:"The Tunnel Bar Saranda",
        fields:["name","geometry","rating"]
    };
    
    let service=new google.maps.places.PlacesService(map);
    service.findPlaceFromQuery(tunnelQuery,function(results,status){
        if(status===google.maps.places.PlacesServiceStatus.OK){
            const marker=new google.maps.Marker({
                map,
                position:results[0].geometry.location
            });
            console.log("rating:"+results[0].rating);
            let tunnelInfo=
"<div id='content'>"+
    "<h2>The Tunnel Bar</h2>"+
    "<a target='_blank' style='font-size:18px;outline:none' href='https://www.google.com/maps/dir//V2F7%2B3QP+The+Tunnel+Bar,+Rruga+40+Shenjtor%C3%ABt,+Sarand%C3%AB,+Albania/@39.872702,19.9732428,13z/data=!3m1!4b1!4m9!4m8!1m0!1m5!1m1!1s0x135b150be8beb6bd:0xac098e111081f181!2m2!1d20.0144423!2d39.8727093!3e2'>"+
        "<img src='directionsSymbol.png' style='width:18px;position:relative;top:5px;right:2px;background-color:hsl(214, 82%, 51%);border-radius:50%;padding:2px'>"+
        "Directions</a>"+
    "<div id='mapRating' style='font-size:16px;color:hsl(210, 4%, 44%)'>"+
        results[0].rating+"<img id='mapRatingStars' src='ratingStars.png' alt='rating' "+
        "style='background:linear-gradient(90deg,hsl(45, 98%, 47%) "+
        (results[0].rating*20)+
        "%,hsl(220, 7%, 83%) "+
        (100-results[0].rating*20)+
        "%);width:80px;position:relative;top:4px'></div>";
            let infoWindow=new google.maps.InfoWindow({
                ariaLabel:"The Tunnel Bar",
                content:tunnelInfo
            });
            infoWindow.open({anchor:marker,map});
            google.maps.event.addListener(marker,"click",()=>{
                infoWindow.open({anchor:marker,map});
            });
            map.setCenter(results[0].geometry.location);
        }
    });


    
}
googleMap();



//menus

//full image popup
function imgPopup(pic)
{
    const modal=document.createElement("aside");
    modal.id="menuPopup";
    const close=document.createElement("span");
    close.innerHTML="&times;";
    close.id="popupClose";
    const img=document.createElement("img");
    img.src=pic;
    img.id="popupImg";
    const imgHolder=document.createElement("div");
    imgHolder.id="popupImgHolder"

    close.onclick=function(){
        modal.style.display="none";
    }
    modal.appendChild(close);
    imgHolder.appendChild(img);
    modal.appendChild(imgHolder);
    document.body.appendChild(modal);

    //click outside to close
    modal.addEventListener("click",function(event){ 
        if(event.target.id!="popupImg"){
            modal.style.display="none";
        }
    });
}

//price changes
function applyCurrency(exchange,currency){
    let menuPrices=document.getElementsByClassName("menuPrice");
    let convertPrices=document.getElementsByClassName("convertPrice");
    let happyConverts=document.getElementsByClassName("happyConvert");
    for(let i=0;i<menuPrices.length;i++){
        let newPrice="";
        let newHappy="";
        if(currency=="USD"||currency=="AUD"){
            newPrice+="$";
            newHappy+="$";
        }
        if(currency=="GBP"){
            newPrice+="£";
            newHappy+="£";
        }
        newPrice=newPrice+(parseInt(menuPrices[i].innerHTML)*exchange).toFixed(2);
        newHappy=newHappy+((parseInt(menuPrices[i].innerHTML)-100)*exchange).toFixed(2);
        if(currency==("EUR")){
            newPrice+="€";
            newHappy+="€";
        }
        convertPrices[i].innerHTML=newPrice;
        convertPrices[i].style.display="inline-block";
        if(isHappyHour()){
            happyConverts[i].innerHTML=newHappy;
            happyConverts[i].style.display="inline-block";
            convertPrices[i].style.textDecoration="line-through red solid 1.5px";
        }
    }
}
function convertLeke(currency){//ALL, EUR, USD, GBP, AUD
    let url="https://api.exchangerate.host/convert";
    fetch(url+"?from=ALL&to="+currency)
    .then((response)=>{
        return response.json();
    })
    .then((data)=>{
        let value=data.result;
        console.log("lekë to "+currency+": "+data.result);
        applyCurrency(value,currency);
    });
}

function happyHourPrices(){
    let drinkPrices=document.getElementsByClassName("menuPrice","convertPrice");
    let happyPrices=document.getElementsByClassName("happyPrice");
    let j=0;
    for(let i=0;i<drinkPrices.length;i++){
        if(drinkPrices[i].classList.contains("menuPrice")){
            happyPrices[i].style.display="inline-block";
            happyPrices[j].innerHTML=(parseInt(drinkPrices[i].innerHTML)-100)+" lekë";
            drinkPrices[i].style.textDecoration="line-through red solid 1.5px";
            j++;
        }
    }
}
if(isHappyHour()){
    happyHourPrices();
    if(document.getElementById("happyHour")){
        document.getElementById("happyHour").style.display="block";

    }
}


//Specials

//highlight current day's hours
function specialsDates(){
    getTimes();
    
    let dates=document.getElementsByClassName("sDate");
    let suffixes=document.getElementsByClassName("numSuffix");
    let months=document.getElementsByClassName("sMonth");
    let dateCount=0;
    let monthCount=currentMonth;
    let year=currentTime.getUTCFullYear();
    if(currentDay>=2){//Usually posted Tuesday
        dateCount=currentDate-currentDay+3;//this week's
        if(dateCount<1){
            monthCount--;
        }
    }
    else{
        dateCount=dateCount=currentDate-currentDay-4;//last week's
        monthCount--;
        if(monthCount==0){
            monthCount=12;
        }
    }
    if(dates){
        for(let i=0;i<dates.length;i++){
            if((dateCount==32)||
            (monthCount==2 && dateCount==30)||
            (monthCount==2 && dateCount==29 && year%4!=0)||
            (monthCount==4 && dateCount==31)||
            (monthCount==6 && dateCount==31)||
            (monthCount==9 && dateCount==31)||
            (monthCount==11 && dateCount==31)
            ){
                dateCount=1;
                monthCount++;
                monthCount%12;
            }
            if(dateCount<1){
                if(monthCount==2 && year%4!=0){
                    dateCount+=28;
                }
                else if(monthCount==2 && year%4==0){
                    dateCount+=29;
                }
                else if(monthCount==4 || monthCount==6 || monthCount==9 || monthCount==11){
                    dateCount+=30;
                }
                else{
                    dateCount+=31;
                }
            }
            if(dateCount%10==1 && dateCount!=11){
                suffixes[i].innerHTML="st";
            }
            else if(dateCount%10==2 && dateCount!=12){
                suffixes[i].innerHTML="nd";
            }
            else if(dateCount%10==3 && dateCount!=13){
                suffixes[i].innerHTML="rd";
            }
            if(monthCount==1)
            {
                months[i].innerHTML="January";
            }
            else if(monthCount==2){
                months[i].innerHTML="February";
            }
            else if(monthCount==3){
                months[i].innerHTML="March";
            }
            else if(monthCount==4){
                months[i].innerHTML="April";
            }
            else if(monthCount==5){
                months[i].innerHTML="May";
            }
            else if(monthCount==6){
                months[i].innerHTML="June";
            }
            else if(monthCount==7){
                months[i].innerHTML="July";
            }
            else if(monthCount==8){
                months[i].innerHTML="August";
            }
            else if(monthCount==9){
                months[i].innerHTML="September";
            }
            else if(monthCount==10){
                months[i].innerHTML="October";
            }
            else if(monthCount==11){
                months[i].innerHTML="November";
            }
            else if(monthCount==12){
                months[i].innerHTML="December";
            }
            dates[i].innerHTML=dateCount;
            dateCount++;
        }
    }
}
specialsDates();