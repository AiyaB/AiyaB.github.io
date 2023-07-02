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

function menuToggle(){
    let toggle=document.getElementById("navToggle");
    let menu=document.getElementById("navList");
    let lines=document.getElementsByClassName("toggleLine");
    toggle.onclick=function(){
        if(menu.style.display=="flex"){
            menu.style.display=null;
            toggle.style.backgroundColor="black";
            for(i=0;i<3;i++){
                lines[i].style.backgroundColor="hsl(42, 99%, 54%)";
            }
        }
        else{
            menu.style.display="flex";
            toggle.style.backgroundColor="hsl(42, 99%, 54%)";
            for(i=0;i<3;i++){
                lines[i].style.backgroundColor="black";
            }
        }
    }
}
menuToggle();

let hostelNumber=307395

//Time functions
let currentTime=new Date();
let currentHour=0;
let currentDate=0;
let currentMonth=0;
let currentYear=0;
function getTimes(){
    currentTime=new Date();
    currentHour=currentTime.getUTCHours()+2;//UTC to CET
    currentDate=currentTime.getDate()+(Math.floor(currentHour/24));
    currentMonth=currentTime.getUTCMonth();//god I hate the month system. Jan=0,dec=11
    currentHour=currentHour%24;
    currentYear=currentTime.getUTCFullYear();
}
getTimes();

let shownMonth=currentMonth;
let shownYear=currentYear;
let weekCount=0;
let currentWeek=0;
let firstDay=0;
let monthEnd=31;
let prevEnd=31;

let checkin=new Date(2017,5,11);
let checkout=new Date(2017,5,11);
let selecting=false;
let selected=false;

function calculateLength(){
    let len=(checkout.getTime()-checkin.getTime())/(1000*60*60*24);
    let stayLength=document.getElementById("stayLength");
    if(len==0){
        stayLength.innerHTML="0 days, 0 nights"
    }
    else if(len==1){
        stayLength.innerHTML="2 days, 1 night"
    }
    else if(len>1){
        stayLength.innerHTML=(len+1)+" days, "+len+" nights"
    }
}

function calculatePrice(){
    let nights=(checkout.getTime()-checkin.getTime())/(1000*60*60*24);
    let price=0;
    let roomType=document.getElementById("roomType");
    let stayPrice=document.getElementById("stayPrice");
    let guests=document.getElementById("guestCount").value;
    let totalPrice=document.getElementById("totalPrice");
    if(roomType.value=="8-BedMixed"){
        price=1300;
    }
    else if(roomType.value=="4-BedMixed"){
        price=1400;
    }
    else if(roomType.value=="4-BedFemale"){
        price=1400;
    }
    else if(roomType.value=="Private Room"){
        price=6969;
        guests=Math.ceil(guests/2);//occupancy of 2

    }
    else{
        price=69696969;
    }

    if(nights==1){
        stayPrice.innerHTML=parseInt(nights*price*guests)+" lekë";
    }
    else if(nights==0){
        stayPrice.innerHTML="0 lekë";
    }
    else{
        stayPrice.innerHTML=parseInt(nights*price*guests)+" lekë, "+parseInt(price*guests)+" nightly";
    }
    totalPrice.value=parseInt(nights*price*guests+(100*document.getElementById("guestCount").value));
}

function resetHighlights(){
    selecting=false;
    selected=false;
    if(document.getElementById("checkin")){
        document.getElementById("checkin").removeAttribute("id");
    }
    if(document.getElementById("checkout")){
        document.getElementById("checkout").removeAttribute("id");;
    }
    let days=document.getElementsByClassName("days");
    for(let i=0;i<days.length;i++){
        days[i].style.backgroundColor=null;
        days[i].style.borderRadius="50%";
    }
    let grayDays=document.getElementsByClassName("difMonth");
    for(let i=0;i<grayDays.length;i++){
        grayDays[i].style.backgroundColor="lightgray";
        grayDays[i].style.borderRadius="50%";
    }
    checkin=new Date(2017,5,11);
    checkout=new Date(2017,5,11);
    if(document.getElementById("checkinDate")){
        document.getElementById("checkinDate").value="";
    }
    if(document.getElementById("checkoutDate")){
        document.getElementById("checkoutDate").value="";
    }
    calculateLength();
    calculatePrice();
}

function highlightDays(){
    if(!selecting){
        document.getElementById("bookingResponse").style.display="none";
        this.style.backgroundColor="hsl(42, 99%, 54%)";
        this.style.borderRadius="50% 0 0 50%";
        selecting=true;
        this.id="checkin";
        //checkin=[parseInt(this.innerHTML),shownMonth,shownYear];
        checkin=new Date(shownYear,shownMonth,parseInt(this.innerHTML));
        document.getElementById("checkinDate").value=checkin.toDateString();
    }
    else if(!selected){
        this.style.backgroundColor="hsl(42, 99%, 54%)";
        this.style.borderRadius="0 50% 50% 0";
        selected=true;
        this.id="checkout";
        checkout=new Date(shownYear,shownMonth,parseInt(this.innerHTML));
        //checkout=[parseInt(this.innerHTML),shownMonth,shownYear];
        if(checkout<checkin){//clicked reverse order
            [checkin,checkout]=[checkout,checkin];
            document.getElementById("checkinDate").value=checkin.toDateString();
            this.style.borderRadius="50% 0 0 50%";
            if(document.getElementById("checkin")){
                document.getElementById("checkin").style.borderRadius="0 50% 50% 0";
                document.getElementById("checkin").id="checkout";
            }
            this.id="checkin";
        }
        document.getElementById("checkoutDate").value=checkout.toDateString();

        let days=document.getElementsByClassName("days");
        for(let i=0;i<days.length;i++){
            let day=parseInt(days[i].innerHTML);
            let date=new Date(shownYear,shownMonth,day);
            //if(shownMonth>=checkin[1] && shownMonth<=checkout[1] && date>checkin[0] && date<checkout[0]){
            if(checkin<date && date<checkout){//between dates
                days[i].style.backgroundColor="hsl(34, 100%, 83%)";
                days[i].style.borderRadius="0";
            }
        }
        let difMonth=document.getElementsByClassName("difMonth");
        if(checkin.getMonth()<checkout.getMonth() || checkin.getFullYear()<checkout.getFullYear()){//different months
            for(let i=0;i<difMonth.length;i++){
                let day=parseInt(difMonth[i].innerHTML);
                let date=new Date();
                if(day<15){//next month
                    date=new Date(shownYear,shownMonth+1,day);
                }
                if(day>15){//last month
                    date=new Date(shownYear,shownMonth-1,day);
                }
                if(date.getTime()>checkin.getTime() && date.getTime()<checkout.getTime()){
                    console.log("changed");
                    difMonth[i].style.backgroundColor="hsl(202, 16%, 32%)";
                    difMonth[i].style.borderRadius="0";
                }
                //change border 
                if(date.getTime()==checkout.getTime()){
                    difMonth[i].style.borderRadius="0 50% 50% 0";
                    difMonth[i].id="checkout";
                }
            }
            for(let i=0;i<days.length;i++){
                let day=parseInt(days[i].innerHTML);
                let date=new Date(shownYear,shownMonth,day);
                if(date<checkout && date>checkin){
                    days[i].style.backgroundColor="hsl(34, 100%, 83%)";
                    days[i].style.borderRadius="0";
                }
            }
        }
        if(document.getElementById("bookingInfo")){
            document.getElementById("bookingInfo").style.display="block";
        }
        calculateLength();
        calculatePrice();
    }
    else{
        resetHighlights();
    }
}

function calendar(){
    let calendar=document.getElementById("calendar");
    let month=document.getElementById("month");
    let year=document.getElementById("year");
    
    for(let i=0;i<weekCount;i++){
        calendar.removeChild(calendar.lastChild);
    }

    firstDay=(new Date(shownYear,shownMonth,1)).getDay();
    monthEnd=new Date(shownYear,shownMonth+1,0).getDate();
    if(shownMonth==0 || shownMonth==12){
        prevEnd=31;
    }
    else{
        prevEnd=new Date(shownYear,shownMonth,0).getDate();
    }
    year.innerHTML=shownYear;
    if(shownMonth==0 || shownMonth==12){
        month.innerHTML="January";
    }
    else if(shownMonth==1){
        month.innerHTML="February";
    }
    else if(shownMonth==2){
        month.innerHTML="March";
    }
    else if(shownMonth==3){
        month.innerHTML="April";
    }
    else if(shownMonth==4){
        month.innerHTML="May";
    }
    else if(shownMonth==5){
        month.innerHTML="June";
    }
    else if(shownMonth==6){
        month.innerHTML="July";
    }
    else if(shownMonth==7){
        month.innerHTML="August";
    }
    else if(shownMonth==8){
        month.innerHTML="September";
    }
    else if(shownMonth==9){
        month.innerHTML="October";
    }
    else if(shownMonth==10){
        month.innerHTML="November";
    }
    else if(shownMonth==11){
        month.innerHTML="December";
    }
    let sameMonth=true;
    weekCount=0;
    currentWeek=0;
    if(firstDay==0){//don't cut off date 1 when Sunday start
        currentWeek=-1;
    }
    while(sameMonth){
        let week=document.createElement("tr");
        week.id="week"+currentWeek;
        let dateCount=0;
        for(let dayNum=1;dayNum<=7;dayNum++){
            let day=document.createElement("td");
            day.className="days";
            day.addEventListener("click",highlightDays);
            dateCount=dayNum+(7*currentWeek)-firstDay+1;//sun=0,sat=6
            if(dateCount>monthEnd){
                day.innerHTML=dateCount%monthEnd; 
            }
            else if(dateCount<1){
                day.innerHTML=(dateCount+prevEnd);
            }
            else{
                day.innerHTML=dateCount;
            }
            if(dateCount<1 || dateCount>monthEnd){//diff month, gray parts
                day.removeEventListener("click",highlightDays);
                day.style.backgroundColor="lightgray";//gray from last month
                day.style.cursor="default";
                day.className="difMonth";
                let date=new Date(shownYear,shownMonth,dateCount);
                if(date.getTime()==checkin.getTime()){
                    day.style.backgroundColor="hsl(202, 16%, 32%)";
                    day.style.borderRadius="50% 0 0 50%";
                }
                if(date.getTime()==checkout.getTime()){
                    day.style.backgroundColor="hsl(202, 16%, 32%)";
                    day.style.borderRadius="0 50% 50% 0";
                }
                if(checkin<date && date<checkout){
                    day.style.backgroundColor="hsl(202, 16%, 32%)";
                    day.style.borderRadius="0";
                }
            }
            let date=new Date(shownYear,shownMonth,dateCount);
            if(dateCount<=monthEnd && dateCount>0){
                if(checkin<date && date<checkout){
                    day.style.backgroundColor="hsl(34, 100%, 83%)";
                    day.style.borderRadius="0";
                }
                if(checkin.getTime()==date.getTime()){
                    day.style.backgroundColor="hsl(42, 99%, 54%)";
                    day.style.borderRadius="50% 0 0 50%";
                }
                if(checkout.getTime()==date.getTime()){
                    day.style.backgroundColor="hsl(42, 99%, 54%)";
                    day.style.borderRadius="0 50% 50% 0";
                }
            }
            let today=new Date(currentYear,currentMonth,currentDate);
            if(today.getTime()==date.getTime()){//green current day
                day.style.border="solid hsl(149, 100%, 26%)";
            }
            if(date.getTime()<today.getTime()){//gray out month's previous days
                day.style.cursor="default";
                day.removeEventListener("click",highlightDays);
                if(!day.classList.contains("difMonth")){
                    day.classList.add("pastDay");
                }
                else{
                    day.classList.add("pastDayMonth");
                }
            }

            week.appendChild(day);
            if(dateCount>monthEnd){
                sameMonth=false;
            }
        }
        calendar.appendChild(week);
        weekCount++;
        currentWeek++;
    }
    //change price when guests/room changed
    document.getElementById("roomType").addEventListener("click",calculatePrice);
    document.getElementById("guestCount").addEventListener("click",calculatePrice);
}
if(document.getElementById("year")){
    calendar();
    document.getElementById("leftMonth").style.backgroundColor="lightgray";
    document.getElementById("leftMonth").style.cursor="default";
    document.getElementById("leftMonth").addEventListener("click",downMonth);
    document.getElementById("rightMonth").addEventListener("click",upMonth);
}
function upMonth(){
    if((shownYear-currentYear==1 && shownMonth<currentMonth)||shownYear-currentYear<1){//year in advance
        shownMonth++;
        if(shownMonth==12){
            shownYear++;
            shownMonth=0;
        }
        calendar();
        if((shownYear-currentYear==1 && shownMonth<currentMonth)||shownYear-currentYear<1){
            document.getElementById("leftMonth").style=null;
            document.getElementById("leftMonth").style.cursor="pointer";
        }
        else{
            document.getElementById("rightMonth").style.backgroundColor="lightgray";
            document.getElementById("rightMonth").style.cursor="default";
        }
    }
    else{
        document.getElementById("rightMonth").style.backgroundColor="lightgray";
        document.getElementById("rightMonth").style.cursor="default";
    }

}
function downMonth(){
    if((shownYear-currentYear==0 && shownMonth>currentMonth)||shownYear-currentYear>0){
        shownMonth--;
        if(shownMonth==-1){
            shownYear--;
            shownMonth=11;
        }
        calendar();
        if((shownYear==currentYear && shownMonth>currentMonth)||shownYear>currentYear){
            document.getElementById("rightMonth").style=null;
            document.getElementById("rightMonth").style.cursor="pointer";
        }
        else{
            document.getElementById("leftMonth").style.backgroundColor="lightgray";
            document.getElementById("leftMonth").style.cursor="default";
        }
    }
    else{
        document.getElementById("leftMonth").style.backgroundColor="lightgray";
        document.getElementById("leftMonth").style.cursor="default";
    }
}



//document.getElementById("bookingSubmit").addEventListener("click",getResponse);
function resetForm(){//ONLY RESET IF FORM SUCCESSFUL
    document.getElementById("bookingForm").reset();
    if(document.getElementById("bookingInfo")){
        document.getElementById("bookingInfo").style.display="none";
    }
    document.getElementById("bookingResponse").style.display="block";
    resetHighlights();
}

let bookingResponse="Form failed to send, please try again";
if(document.getElementById("bookingForm")){
    let form=document.getElementById("bookingForm");
    form.addEventListener('submit',(event)=>{
        event.preventDefault();
        console.log("submitting form");
        fetch(event.target.action,{
            method:'POST',
            body:new URLSearchParams(new FormData(event.target))
        })
        .then((response)=>{
            if(!response.ok){
                console.log("Response wasn't good...");
            }
            //console.log(response.json());//.json() or .text() depending on if .send() or .json() in mail function
            response.json()
            .then(function(obj){
                bookingResponse=obj.message;
                console.log("response now "+bookingResponse);
                let messageDisplay=document.getElementById("bookingResponse");
                messageDisplay.innerHTML=bookingResponse;
                if(bookingResponse=="We have successfully sent your booking request"){
                    messageDisplay.style.color="hsl(149, 100%, 26%)";
                    resetForm();
                }
                messageDisplay.style.display="block";
                //TODO: clicking form again messageDisplay.style.display="none";
                let formInputs=document.getElementById("bookingForm").elements;
                for(let i=0;i<formInputs.length;i++){
                    formInputs[i].addEventListener("input",function(){
                        messageDisplay.style.display="none";
                        messageDisplay.style.color=null;
                    });
                }
            });
        })
        .then((body)=>{
        })
        .catch((error)=>{
            console.log("Error:",error);
            let messageDisplay=document.getElementById("bookingResponse");
            messageDisplay.style.display="block";
            messageDisplay.innerHTML=error;
            if(error=="TypeError: NetworkError when attempting to fetch resource."){
                messageDisplay.innerHTML="Cannot connect to internet, please retry"
            }
        });
    });
}



async function googleMap(){
    if(!document.getElementById("googleMap")){
        return;
    }
    const { Map } = await google.maps.importLibrary("maps");
    let mapInfo={
        center:{lat:39.877373, lng:20.007018},
        zoom:16,
    };
    let map=new Map(document.getElementById("googleMap"),mapInfo);
    let wallabyQuery={
        query:"Wallaby Hostel Saranda",
        fields:["name","geometry","rating"]
    };
    
    let service=new google.maps.places.PlacesService(map);
    service.findPlaceFromQuery(wallabyQuery,function(results,status){
        if(status===google.maps.places.PlacesServiceStatus.OK){
            const marker=new google.maps.Marker({
                map,
                position:results[0].geometry.location
            });
            console.log("rating:"+results[0].rating);
            let wallabyInfo=
"<div id='content' style='font-family: Arial, sans-serif;'>"+
    "<h2 style='font-family: Arial, sans-serif;'>The Wallaby Hostel</h2>"+
    "<a target='_blank' style='font-size:18px;outline:none;font-family: Arial, sans-serif;color:hsl(214, 82%, 51%);' href='https://www.google.com/maps/dir//Wallaby+Hostel,+AL,+Rruga+Pandeli+Bocari,+Sarand%C3%AB+9701,+Albania/@39.8772403,20.0015374,15.92z/data=!4m9!4m8!1m0!1m5!1m1!1s0x135b15bd7dc6afb7:0xd63fd6fcd14157ee!2m2!1d20.0070345!2d39.8773899!3e2?entry=ttu'>"+
        "<img src='directionsSymbol.png' style='width:18px;position:relative;top:5px;right:2px;background-color:hsl(214, 82%, 51%);border-radius:50%;padding:2px'>"+
        "Directions</a>"+
    "<div id='mapRating' style='font-size:16px;color:hsl(210, 4%, 44%);font-family: Arial, sans-serif;'>"+
        results[0].rating+"<img id='mapRatingStars' src='ratingStars.png' alt='rating' "+
        "style='background:linear-gradient(90deg,hsl(45, 98%, 47%) "+
        (results[0].rating*20)+
        "%,hsl(220, 7%, 83%) "+
        (100-results[0].rating*20)+
        "%);width:80px;position:relative;top:4px'></div>";
            let infoWindow=new google.maps.InfoWindow({
                ariaLabel:"The Wallaby Hostel",
                content:wallabyInfo
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


//+/- toggle
function toggleInfo(toggle){
    if(toggle.nextElementSibling.style.display!="none"){
        toggle.nextElementSibling.style.display="none";
        toggle.firstChild.src="plus.png";
    }
    else{
        toggle.nextElementSibling.style.display="block";
        toggle.firstChild.src="minus.png";
    }
}



//hostel.html
let imgIndex=0;
let hostelBedImg=[
    ["8-Bed Mixed Dorm","8BedDorm.jpg","8BedBalcony.jpg"],
    ["4-Bed Mixed Dorm","4BedDorm.jpg","placeholder.jpg"],
    ["4-Bed Female Dorm","placeholder.jpg"],
    ["Private Room","placeholder.jpg","placeholder.jpg","placeholder.jpg","placeholder.jpg","placeholder.jpg","placeholder.jpg","placeholder.jpg","placeholder.jpg","placeholder.jpg"]
];
function focusInfoImg(hostelInfoImg){
    document.getElementById("focusedHostelInfoImg").src=hostelInfoImg.src;
    let imgs=document.getElementsByClassName("hostelInfoImg");
    for(let i=0;i<imgs.length;i++){
        imgs[i].style.outline="none";
    }
    hostelInfoImg.style.outline="thick solid hsl(149, 100%, 26%)";
}
function toggleInfoImg(toggle){
    if(toggle.id=="hostelInfoLeftToggle"){
        imgIndex--;
        if(imgIndex<0){
            imgIndex=hostelBedImg.length-1;
        }
    }
    else if(toggle.id=="hostelInfoRightToggle"){
        imgIndex++;
        if(imgIndex>=hostelBedImg.length){
            imgIndex=0;
        }
    }
    document.getElementById("hostelInfoBedType").innerHTML=hostelBedImg[imgIndex][0];
    document.getElementById("focusedHostelInfoImg").src=hostelBedImg[imgIndex][1];
    let imgsList=document.getElementById("hostelInfoImgList");
    while(imgsList.firstChild){
        imgsList.removeChild(imgsList.firstChild);
    }
    for(let i=1;i<hostelBedImg[imgIndex].length;i++){
        let li=document.createElement("li");
        let img=document.createElement("img");
        img.src=hostelBedImg[imgIndex][i];
        img.classList.add("hostelInfoImg");
        img.setAttribute("onclick","focusInfoImg(this)");
        if(i==1){
            img.style.outline="thick solid hsl(149, 100%, 26%)"
        }
        li.appendChild(img);
        imgsList.appendChild(li);
    }
}
if(document.getElementById("hostelInfoImgList")){
    let scrollArea=document.getElementById("hostelInfoImgList");
    scrollArea.addEventListener("wheel",(event)=>{
        event.preventDefault();
        scrollArea.scrollLeft+=event.deltaY;
    })
}




//saranda map
function displayPlace(place){
    document.getElementById(place+"Place").style.display="block";
}
function hidePlaces(){
    let places=document.getElementsByClassName("place");
    for(let i=0;i<places.length;i++){
        places[i].style.display="none";
    }//4032 333 250
}

function placeClick(place,imgRatio,name,nameWid,dist){
    let mapImg=document.getElementById("placeImg");
    mapImg.setAttribute('href',place);
    mapImg.setAttribute('transform',"translate(0,-"+imgRatio*125+")");
    mapImg.style.display="block";
    let mapImgBG=document.getElementById("placeImgBG");
    mapImgBG.style.display="block";

    let mapTextBG=document.getElementById("placeTextBG");
    mapTextBG.setAttribute('transform',"translate(0,"+(imgRatio*125)+")");

    let mapImgName=document.getElementById("placeName");
    mapImgName.innerHTML=name;
    mapImgName.setAttribute('transform',"translate(-"+(nameWid/2)+","+(imgRatio*125+20)+")");
    
    let mapImgDist=document.getElementById("placeDistance");
    mapImgDist.innerHTML=dist+"m from Wallaby";
    mapImgDist.setAttribute('transform',"translate(0,"+(imgRatio*125+40)+")");
    if(dist==0){
        mapImgDist.innerHTML="Not far at all";
        mapImgDist.setAttribute('transform',"translate(19,"+(imgRatio*125+40)+")");
    }
    mapTextBG.style.display="block";
    mapImgDist.style.display="block";
    mapImgName.style.display="block";
}
function hidePlaceImg(){
    let mapImg=document.getElementById("placeImg");
    mapImg.style.display="none";
    let mapImgBG=document.getElementById("placeImgBG");
    mapImgBG.style.display="none";
    let mapImgDist=document.getElementById("placeDistance");
    mapImgDist.style.display="none";
    let mapImgName=document.getElementById("placeName");
    mapImgName.style.display="none";
    let mapTextBG=document.getElementById("placeTextBG");
    mapTextBG.style.display="none";
}