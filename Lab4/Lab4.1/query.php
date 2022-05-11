<html>
    <head>
        <title>Table Output</title>
    </head>
<body>
    <?php
        $server = 'localhost';
        $user = 'root';
        $pass = '';
        $mydb = 'Lab4';
        $table_name = 'Products';
        $connect = mysqli_connect($server, $user, $pass, $mydb);

        if(!$connect) 
        {
            die("Cannot connect to $server using $user");
        } else 
        {
            echo '<div style="color:blue; font-size:24px">Products Data</div>';
            $SQLcmd = "SELECT * from $table_name";
            echo "<div>The Query is $SQLcmd</div>";
            $result = mysqli_query($connect, $SQLcmd);
            echo "<table border='1'>";
            echo "<tr>
                    <th>Num</th>
                    <th>Product</th>
                    <th>Cost</th>
                    <th>Weight</th>
                    <th>Count</th>
                    </tr>";
                    
            if(mysqli_num_rows($result) > 0) {
                while($row = mysqli_fetch_assoc($result)) {
                    echo "<tr>
                            <td>".$row['ProductID']."</td>
                            <td>".$row['Product_desc']."</td>
                            <td>".$row['Cost']."</td>
                            <td>".$row['Weight']."</td>
                            <td>".$row['Numb']."</td>
                           </tr>";
                }
            }
            echo "</table>";
            mysqli_close($connect);
        }
    ?>
    </body>
</html>