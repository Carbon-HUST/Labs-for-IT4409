<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Output</title>
</head>
<body>
    <h3>Here is your input: </h3>
    <?php
        $name = $_POST['name'];
        $class = $_POST['class'];
        $university = $_POST['university'];
        echo "Hello, ".$name.'<br>';
        echo '<br>'."You are studying at ".$class.", ".$university.'<br>';
        echo '<br>'."Your hobby is :".'<br><br>';
        if(!empty($_POST['hobby'])) {
            foreach($_POST['hobby'] as $value){
                echo "<li> ".$value.'<br>';
            }
        }

    ?>
</body>
</html>