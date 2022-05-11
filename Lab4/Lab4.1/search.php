<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Search Products</title>
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
            die ("Cannot connect to $server using $user");
        } 
        else 
        {
            print '<h2 style="color:blue">Products Data</h2>';

            $description = $_POST["description"];
            $SQLcmd = "SELECT * FROM $table_name WHERE (Product_desc = '$description')";

            print "<p>The query is $SQLcmd</p>";

            $result = mysqli_query($connect, $SQLcmd);
            
            print "<table border='1'>
                    <tr>
                        <th>Num</th>
                        <th>Product</th>
                        <th>Cost</th>
                        <th>Weight</th>
                        <th>Count</th>
                    </tr>";

            if(mysqli_num_rows($result) > 0) {
                $index = 1;
                while($row = mysqli_fetch_assoc($result)) {
                    print "<tr>
                            <td>$index</td>
                            <td>".$row['Product_desc']."</td>
                            <td>".$row['Cost']."</td>
                            <td>".$row['Weight']."</td>
                            <td>".$row['Numb']."</td>
                           </tr>";
                    ++$index;
                }
            }

            print "</table>";
        }
    ?>
    </body>
</html>