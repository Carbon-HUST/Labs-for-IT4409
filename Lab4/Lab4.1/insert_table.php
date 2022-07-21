<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Insert data to Products</title>
    </head>
    <body>
    <?php
        // database information
        $server = 'localhost';
        $user = 'root';
        $pass = '';
        $mydb = 'Lab4';
        $table_name = 'Products';
        $connect = mysqli_connect($server, $user, $pass, $mydb);

        if(!$connect) 
        {
            die("Cannot connect to $server using $user");
        } 
        else 
        {
            $description = $_POST["description"];
            $weight = $_POST["weight"];
            $cost = $_POST["cost"];
            $number = $_POST["number"];
            $SQLcmd = "INSERT INTO $table_name 
                        (Product_desc, Cost, Weight, Numb) 
                        VALUES('$description', $cost, $weight, $number)";

            print "<p>The Query is $SQLcmd</p>";
            if(mysqli_query($connect, $SQLcmd)) 
            {
                print "<p>Insert into $table_name was succesful!</p>";
            } 
            else 
            {
                die("Insert into $table_name failed");
            }
            mysqli_close($connect);
        }
    ?>
    </body>
</html>