//password
let cookie=document.cookie;
if(cookie!="isLoch=true"){
    let password=prompt("Enter the Wallaby wifi password","");
    if(password=="11223344"){
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
            toggle.style.backgroundColor="white";
            for(i=0;i<3;i++){
                lines[i].style.backgroundColor="var(--blue)";
            }
        }
        else{
            menu.style.display="flex";
            toggle.style.backgroundColor="var(--blue)";
            for(i=0;i<3;i++){
                lines[i].style.backgroundColor="white";
            }
        }
    }
}
menuToggle();

async function googleMap(){
    if(!document.getElementById("googleMap")){
        return;
    }
    const { Map } = await google.maps.importLibrary("maps");
    let mapInfo={
        center:{lat:36.853311, lng:138.290890},
        zoom:16
    };
    let map=new Map(document.getElementById("googleMap"),mapInfo);
    let wallabyQuery={
        query:"Yamadasan Ski Hotel",
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
    "<h2 style='font-family: Arial, sans-serif;'>Yamadasan Ski Hotel</h2>"+
    "<a target='_blank' style='font-size:18px;outline:none;font-family: Arial, sans-serif;color:hsl(214, 82%, 51%);' href='https://www.google.com/maps/dir//Yamadasan+Ski+Hotel,+%E5%85%AB%E5%9D%8A%E5%A1%9A%E6%96%91%E5%B0%BE11492+304+Iiyama,+Nagano+389-2253,+Japan/@36.8534518,138.2878951,16z/data=!4m21!1m11!3m10!1s0x5ff6190a595a5c01:0x5ed736149b0e26e4!2sYamadasan+Ski+Hotel!5m3!1s2023-12-19!4m1!1i2!8m2!3d36.849177!4d138.293066!16s%2Fg%2F11h1n_sycm!4m8!1m0!1m5!1m1!1s0x5ff6190a595a5c01:0x5ed736149b0e26e4!2m2!1d138.2931425!2d36.8492102!3e3?entry=ttu'>"+
        "<img src='../assets/directionsSymbol.png' style='width:18px;position:relative;top:5px;right:2px;background-color:hsl(214, 82%, 51%);border-radius:50%;padding:2px'>"+
        "Directions</a>"+
    "<div id='mapRating' style='font-size:16px;color:hsl(210, 4%, 44%);font-family: Arial, sans-serif;'>"+
        results[0].rating+"<img id='mapRatingStars' src='../assets/ratingStars.png' alt='rating' "+
        "style='background:linear-gradient(90deg,hsl(45, 98%, 47%) "+
        (results[0].rating*20)+
        "%,hsl(220, 7%, 83%) "+
        (100-results[0].rating*20)+
        "%);width:80px;position:relative;top:4px'></div>";
            let infoWindow=new google.maps.InfoWindow({
                ariaLabel:"Yamadasan Ski Hotel",
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