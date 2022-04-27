<html>
    <head>
        <title>Chess club Application</title>
    </head>
    <body>
        <h1>Thank you for applying to our club. Below is your application</h1>
        <?php 
            $name = $_POST["name"];
            echo "<p>Your name: $name</p>";
            
            if($_POST["school"]) {
                $school = $_POST["school"];
            echo "<p>Your school: $school</p>";
            }
            
            
            if ($_POST["age"]) {
                $age = $_POST["age"];
                echo "<p>Your age: $age</p>";
            }
            
            if($_POST['items']) {
                $items = $_POST["items"];
                echo "<p>Your chess skill: $items</p>";
            }
            
            
            if (isset($_POST["improvement"])) {
                $improvements = $_POST["improvement"];
                echo "<p>You would like to improve: </p>";
                echo "<ul>";
                foreach ($improvements as $index => $improvement){
                    echo "<li>"." $improvement</li>";
                }
                echo "</ul>";
            }
            
            if ($_POST["suggestions"]) {
                $suggestion = $_POST["suggestions"];
                echo "<p>Your suggestions: $suggestion</p>";
            }
        ?>

    </body>
</html>
