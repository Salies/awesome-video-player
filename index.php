<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta property="og:url" content="https://awesome-video-player.herokuapp.com/">
    <meta property="og:title" content="Awesome Video Player">
    <meta property="og:site_name" content="Salies Experiments">
    <meta property="og:description" content="An automatic, beautiful and pretty responsive YouTube player.">
    <meta property="og:image" content="https://i.imgur.com/GtsddVe.png">
    <link rel="shortcut icon" type="image/png" href="https://saliesbox.com/exp.png"/>
    <link rel="stylesheet" href="styles.css">
    <title>Awesome Video Player</title>
</head>
<body>
<div class="container"> <!-- external container for future embedding function -->
    <div class="wrapper">
            <div class="time"><span class="bar_num"></span><span class="timer">-</span> / <span class="duration">-</span></div>
            <div class="res">
                <aside class="hd1080" onclick="res(this)">1080p</aside>
                <aside class="hd720" onclick="res(this)">720p</aside>
                <aside class="large" onclick="res(this)">480p</aside>
                <aside class="medium" onclick="res(this)">360p</aside>
                <aside class="small" onclick="res(this)">240p</aside>
            </div>        
            
            <div id="player"></div>
            
            <div class="controls">
                <div class="button_player" onclick="control()">►</div>
                <input class="bar" type="range" min="0" max="100" value="0">
                <div style="width:13.409%;"><span class="v">🔊</span> <input class="volume" type="range" min="0" /></div>
                <span class="res_ct">&#9881;</span>
            </div>
    </div>
</div>

<div style="text-align:center;margin-bottom:5px;font-size:16.5px;margin-top:25px;">Provide a YouTube URL, shortened URL or Video ID</div>

<form enctype="multipart/form-data" action="" method="post" >
      <input type="text" name="video" class="video-input">
</form>

<?php
//=== Error Verifier ===//

//if first time loading page
    if($_POST['video']==null){
        $id = '4VIteJzGCr8';
    }
    else if (substr($_POST['video'],0, 4) === "http"){
//if copy-pasted from youtube
        if(strpos($_POST['video'],'watch?v=')!==false && preg_match('/^[a-zA-Z0-9_-]{11}$/', str_replace("https://www.youtube.com/watch?v=", "", $_POST['video']))==1){
            $id  = str_replace("https://www.youtube.com/watch?v=", "", $_POST['video']);
        }
//if copy-pasted from youtube's share section
        else if(strpos($_POST['video'],'youtu.be')!==false && preg_match('/^[a-zA-Z0-9_-]{11}$/', str_replace("https://youtu.be/", "", $_POST['video']))==1){
            $id  = str_replace("https://youtu.be/", "", $_POST['video']);
        }
        else{
            $id = '4VIteJzGCr8';
            echo "The provided entry is not a valid YouTube ID, URL or shortened URL";
        }
    }   
//if copy-pasted directly, valid id
    else if (preg_match('/^[a-zA-Z0-9_-]{11}$/', $_POST['video'])==1){
        $id = $_POST['video'];
    }
//if invalid (neither of the ones above)
    else{
        $id = '4VIteJzGCr8';
        echo "The provided entry is not a valid YouTube ID, URL or shortened URL";
    }

//=== Preapring image for JS ===//
    $img = 'https://img.youtube.com/vi/'.$id.'/0.jpg';
    $src = 'data:image;base64,'.base64_encode(file_get_contents($img));
//deploying image - JS will to the remaining work
    echo '<script>var vid="'.$src.'", id="'.$id.'";</script>';
?>

<script src="color-thief.js"></script>
<script src="scripts.js"></script>
</body>
</html>