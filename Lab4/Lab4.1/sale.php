<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Update Results</title>
</head>
<body>
    <h2 style="color:blue">Update Results for Table Products</h2>
    <?php
    $server = 'localhost';
    $user = 'root';
    $pass = '';
    $mydb = 'lab4';
    $table_name = 'Products';
    $connect = mysqli_connect($server, $user, $pass, $mydb);

    if(!$connect) 
    {
        die ("Cannot connect to $server using $user");
    } 
    else 
    {
        $description = $_POST['description'];
        $SQLcmd = "UPDATE $table_name SET Numb = Numb-1 WHERE Product_desc = '$description'";
        print "<p>The query is $SQLcmd</p><br/>";

        mysqli_query($connect, $SQLcmd);

        $SQLcmd = "SELECT * from $table_name";
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
            while($row = mysqli_fetch_assoc($result)) {
                print "<tr>
                        <td>".$row['ProductID']."</td>
                        <td>".$row['Product_desc']."</td>
                        <td>".$row['Cost']."</td>
                        <td>".$row['Weight']."</td>
                        <td>".$row['Numb']."</td>
                       </tr>";
            }
        }
        print "</table>";
        mysqli_close($connect);
    }
    ?>
</body>
</html>