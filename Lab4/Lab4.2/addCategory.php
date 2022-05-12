<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Category Administration</title>
</head>
<body>
    <h2>Category Administration</h2>

    <?php
    $server = 'localhost';
    $user = 'root';
    $pass = '';
    $db = 'business_service';
    $table_name = 'Categories';

    $connect = mysqli_connect($server, $user, $pass, $db);
    if(!$connect) 
    {
        die ("Cannot connect to $server using $user");
    }
    else 
    {
        $category_id = $_POST['Category_ID'];
        $title = $_POST['Title'];
        $description = $_POST['Description'];

        $SQLcmd = "INSERT INTO $table_name (Category_ID, Title, Description) VALUES('$category_id', '$title', '$description')";
        echo "The Query is ".$SQLcmd;

        if(mysqli_query($connect, $SQLcmd)) 
        {
            echo "<p>Insert into $table_name was succesful!</p>";
        } 
        else 
        {
            echo "<p>Insert into $table_name failed</p>";
        }
        mysqli_close($connect);
    }
    ?>
    
</body>
</html>