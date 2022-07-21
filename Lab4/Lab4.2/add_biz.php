<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Business Registration</title>
    <style>
        .row {
          display: flex; 
          flex-direction: row; 
          margin-bottom: 20px;
        }
        .col1 {
            width: 30%;
            max-width: 600px;
        }
        .col2 {
            width: 100%;
        }
        p {
            max-width: 200px;
            margin: 0;
        }
        
    </style>
</head>
<body>
    <h2>Business Registration</h2>
    <div class="container">
        <form name="business_form" action="add_biz_post.php" method="post">
        <div class="row">
                <div class="col1">
                    <p>Click on one, or control-click on multiple categories</p>
                    <br>    

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
                            $SQLcmd = "select * from $table_name";
				            $result = mysqli_query($connect, $SQLcmd);
                            echo '<select name="categories[]" multiple>';
                                if(mysqli_num_rows($result) > 0) {
                                    while($row = mysqli_fetch_assoc($result)) {
                                        echo '<option name="categories[]" value="'.$row['Category_ID'].'" id="'.$row['Category_ID'].'">'.$row['Title'].'</option>';
                                    }
                                }
                            echo "</select>";
                        }
                    ?>

                </div>
                <div class="col2">
                        <table>
                            <tr>
                                <td>Business Name: </td>
                                <td><input type="text" name="business_name" size="50" required></td>
                            </tr>
                            <tr>
                                <td>Address: </td>
                                <td><input type="text" name="address" size="50" required></td>
                            </tr>
                            <tr>
                                <td>City: </td>
                                <td><input type="text" name="city" size="50" required></td>
                            </tr>
                            <tr>
                                <td>Telephone: </td>
                                <td><input type="tel" name="telephone" size="50" required></td>
                            </tr>
                            <tr>
                                <td>URL: </td>
                                <td><input type="url" name="url" size="50" required></td>
                            </tr>
                        </table>
                </div>
        </div>
        <div class="row">
            <input type="submit" value="Add Business">
        </div>
        </form>
    </div>
</body>
</html>