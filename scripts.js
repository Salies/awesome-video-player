//getting things from html
const rng = document.querySelector(".volume"); //volume scroll
const bt = document.querySelector(".button_player"); //playback controller button
const qlt = document.querySelector(".res_ct"); //resolution options
const qlt_opt = document.querySelector(".res"); //resolution options
const dpt = document.querySelector(".timer"); //time stuff
const dr = document.querySelector(".duration");
const bar = document.querySelector(".bar"); //main (time/progress) bar stuff
const bar_num = document.querySelector(".bar_num");

//==== NEW CODE ====
//rgtToHsl function by https://github.com/mjackson
function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}

//create image element
var img = document.createElement('img');
img.setAttribute('src', vid);

//watch out for when the image loads, then push info from it
img.addEventListener('load', function() {
//initialize the api
    var colorThief = new ColorThief();
    var c = colorThief.getPalette(img, 8);

    var lights = []; //prepare the array for the hsl convertion
    for(i=0;i<7;i++){
        lights.push(rgbToHsl((c[i])[0], (c[i])[1], (c[i])[2]));
    }
    lights.sort(function(a, b){return b[2]-a[2]});
    var colors = []; // prepare the numbers and write them in CSS format
    for(i=0;i<7;i++){
        var x = (lights[i])[0], y = (lights[i])[1], z = (lights[i])[2];
        colors.push(`${x*360},${y*100}%,${z*100}%`);
    }

//attach the colors
    document.querySelector("html").style.setProperty("--player_color", 'hsl('+colors[5])+')';
    document.querySelector("html").style.setProperty("--button_color", 'hsl('+colors[2])+')';
    document.querySelector("html").style.setProperty("--res_color", 'hsl('+colors[0])+')';
    document.querySelector("html").style.setProperty("--res_b_color", 'hsl('+colors[6])+')';
    document.querySelector("body").style.setProperty("background", 'hsl('+colors[4])+')';
});


//get and update the container's values
var width = document.querySelector(".wrapper").offsetWidth;
//proportional value to 16:9
var height = (9 * width) / 16;

//inserting the youtube api
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

//starting the video
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: height,
    width: width,
    videoId: id,
    playerVars: {'controls': 0,'rel':0},
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

//DEFAULT OPTIONS
function onPlayerReady(event) {
    event.target.pauseVideo();
    event.target.setVolume(50);
    event.target.setPlaybackQuality('small');
    //displaying time
    var d = event.target.getDuration() - 1; // youtube cookie-monster-like eats 1 second
    var duration = round(d);
    dr.innerHTML = duration;
    dpt.innerHTML = "00:00";
    bar.setAttribute("max", d);
}

//rounding seconds to mm:ss function - will be used further
function round(x){
    x = Number(x);
    var m = Math.floor(x / 60);
    var s = Math.floor(x - m * 60);
    return ('0' + m).slice(-2) + ':' + ('0' + s).slice(-2);
}

//PLAYBACK CONTROL - BUTTONS AND TIMER
var v;
var z;

/*
    on the function below, v will return an object - v.data will return a number that tells us the state of the video player
    according to my tests (z beign v.data):
    z = 0 - Video done playing
    z = 1 - Video is playing
    z = 2 - Video is paused
    z = 3 - Video is loading
*/

function onPlayerStateChange(v){
//buttons
    z = v.data;
    if(z===undefined || z==2){
      bt.innerHTML = '►';
    }
    else if(z==0){
    	bt.innerHTML = '<b>&#10227;</b>';
    }
    else{
        bt.innerHTML = '❚❚';
//time setting
        setInterval(function(){ 
            var t = player.getCurrentTime();
            dpt.innerHTML = round(t);
        }, 100);
  } 
}

function control(){
	if(z===undefined || z==2){
  	player.playVideo();
  }
  else if(z==0){
  	player.playVideo();
  }
  else{
  	player.pauseVideo();
  }
}

//VOLUME CONTROL
react("mousemove");
react("mousedown");

function react(e) {
  rng.addEventListener(e, function() {
  	player.setVolume(rng.value);
  });
}

//RESOLUTION CONTROL
function res(btt){
    //getting things fancy
    var a = btt.className;
    //get current time - because when the video stops it returns to 0
    var currentTime = player.getCurrentTime();
    //stopping video for quality change
    player.stopVideo();
    //setting quality, playing the video and setting the correct time (back)
    player.setPlaybackQuality(a);
    player.playVideo();
    player.seekTo(currentTime, false);
}


//displaying resolution controls
var c = false;

qlt.onclick = function() {
    if(c===false){
        qlt_opt.style.display="block";
        c=true;
    }
    else{
        qlt_opt.style.display="none";
        c=false;
    }
}

//controlling the bar
var isPaused = false;

setInterval(function(){ 
    if(!isPaused){
        var t = player.getCurrentTime();
        bar.value = t;
    }
}, 100);

bar.addEventListener("change",function(){
    player.seekTo(bar.value);
    player.playVideo();
});

bar.addEventListener("mousedown",function(){
    isPaused = true;
    player.pauseVideo();
    dpt.style.display="none";
    bar_num.style.display="inline-block";
});

bar.addEventListener("mouseup", function(){
    isPaused = false;
    player.playVideo();
    dpt.style.display="inline-block";
    bar_num.style.display="none";
});

barra("mousedown")
barra("mousemove")
function barra(e){
    bar.addEventListener(e, function(){
        bar_num.innerHTML = round(bar.value);
    });
}