<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Category Administration</title>
    <style>
        th {
            background-color: #D3D3D3;
        }
    </style>
</head>
<body>
    <h2>Category administration</h2>
    
    <form action="addCategory.php" method="post">
        <?php
            /*------php code------- */
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
                echo "<table>";
                echo "<tr>
                        <th>CatID</th>
                        <th>Title</th>
                        <th>Description</th>
                      </tr>";
                $SQLcmd = "SELECT * from $table_name";
                $result = mysqli_query($connect, $SQLcmd);
                if(mysqli_num_rows($result) > 0) {
                    while($row = mysqli_fetch_assoc($result)) {
                        echo "<tr>
                                <td>".$row['Category_ID']."</td>
                                <td>".$row['Title']."</td>
                                <td>".$row['Description']."</td>
                               </tr>";
                    }
                }
                mysqli_close($connect);
            }

            
            echo '<td><input type="text" name="Category_ID"></td>';
            echo '<td><input type="text" style="width: 95%" name="Title"></td>';
            echo '<td><input type="text" name="Description"></td>';
            echo "</table>";
            echo '<input type="submit" value="Add Category">';
        ?>
    </form>
</body>
</html>