<html>
    <head>
        <title>My Survey Form</title>
    </head>
    <body>
        <h1>Thank you! Below is your result:</h1>
        <?php 
            $name = $_POST["name"];
            echo "<p>Your name: $name</p>";
            
            $email = $_POST["email"];
            echo "<p>Your email: $email</p>";
            
            if ($_POST["age"]) {
                $age = $_POST["age"];
                echo "<p>Your age: $age</p>";
            }
            
            $role = $_POST["role"];
            echo "<p>Your role: $role</p>";
            
            $items = $_POST["items"];
            echo "<p>Your recommendation to your friends: $items</p>";
            
            if (isset($_POST["improvement"])) {
                $improvements = $_POST["improvement"];
                echo "<p>What you want to see improved: </p>";
                echo "<ul>";
                foreach ($improvements as $index => $improvement){
                    echo "<li>".($index+1).". $improvement</li>";
                }
                echo "</ul>";
            }
            
            if ($_POST["comment"]) {
                $comment = $_POST["comment"];
                echo "<p>Your comment: $comment</p>";
            }
        ?>

    </body>
</html>
