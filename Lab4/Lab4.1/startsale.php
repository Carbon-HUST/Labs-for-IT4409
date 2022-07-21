<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Start Sale</title>
    </head>

    <body>
    	<h2 style="color:blue">Select Product We Just Sold</h2>

        <?php
            $server = 'localhost';
            $user = 'root';
            $pass = '';
            $mydb = 'lab4';
            $table_name = 'Products';
            $connect = mysqli_connect($server, $user, $pass, $mydb);
            if(!$connect) {
                die ("Cannot connect to $server using $user");
            }
            else
            {
                $SQLcmd = "SELECT Product_desc from $table_name";
                $result = mysqli_query($connect, $SQLcmd);

                // form start
                print '<form action="sale.php" method="post">';
                print '<div>';
    		    if(mysqli_num_rows($result) > 0) {
                    while($row = mysqli_fetch_assoc($result)) {
                        print '<input type="radio" style="margin-right: 10px" name="description" value="'.$row['Product_desc'].'">'.$row['Product_desc'].'<br/>';
                    }
                }
    		    print '</div><br/>';
                print '<input type="submit" style="margin-right: 5px" value="Click To Submit">';
                print '<input type="reset" value="Reset">';
                print '</form>';

                // start products table
                $SQLcmd = "SELECT * from $table_name";
                $result = mysqli_query($connect, $SQLcmd);
                print "<p>The query is $SQLcmd</p>";

                print "<table border='1'>";
                print "<tr>
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