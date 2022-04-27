<?php
    $namehobby = array(
        'cat',
        'reading',
        'cooking',
        'coding'
    );
    $hobby = array();
    if(isset($_POST['submit'])){
        $your_name = isset($_POST['yourname']) ? $_POST['yourname'] : '';
        $class = isset($_POST['class']) ? $_POST['class'] : '';
        $university = isset($_POST['university']) ? $_POST['university'] : '';
        
        foreach($namehobby as $value){
            if(isset($_POST[$value])){
                if($_POST[$value] == 'yes'){
                    array_push($hobby, $value);
                }
            }
        }
        if($your_name){
            echo 'Hello, '.$your_name.'<br/>';
        }
        if($class && $university){
            echo 'You are studying at '.$class.', '.$university.'<br/>';
        }
        echo 'Your hobby is '.'<br/>';
        foreach($hobby as $index => $value){
            echo ($index + 1).'. '.ucfirst($value).'<br/>';  
        }
    }

?>