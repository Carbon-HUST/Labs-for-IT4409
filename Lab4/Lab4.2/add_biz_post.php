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
    <h6>Record inserted as shown below</h6>
    <br>
    <div class="container">
        <div class="row">
                <div class="col1">
                    <p>Selected category values are hightlighted</p>
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
                            $name = $_POST["business_name"];
		                    $address = $_POST["address"];
		                    $city = $_POST["city"];
		                    $telephone = $_POST["telephone"];
		                    $url = $_POST["url"];
                            $table_name = "Businesses";
                            $categories = $_POST["categories"];

                            $SQLcmd = "insert into businesses(Name, Address, City, Telephone, URL)
		                    			value (
		                    			'$name', '$address' , '$city', '$telephone', '$url'	
		                    		)";
		                    mysqli_query($connect, $SQLcmd);

                            $SQLcmd = "select max(Business_ID) from $table_name";
                            $result = mysqli_query($connect, $SQLcmd);
                            $max_id = mysqli_fetch_assoc($result)["max(Business_ID)"];

                            if (count($categories) > 0)
                            {
                                $SQLcmd = "insert into Biz_categories(Business_ID, Category_ID) values";
                                foreach ($categories as $category) 
                                {
                                    $SQLcmd .= "($max_id, '$category'), ";
                                }
                                $SQLcmd = rtrim($SQLcmd, ", ");
                                mysqli_query($connect, $SQLcmd);
                            }

                            $table_name = "Categories";
                            $SQLcmd = "select * from $table_name";
				            $result = mysqli_query($connect, $SQLcmd);
                            echo '<select name="categories" multiple disabled>';
                                if(mysqli_num_rows($result) > 0) {
                                    while($row = mysqli_fetch_assoc($result)) {
                                        if (in_array($row['Category_ID'], $categories))
                                            echo '<option name="categories[]" value="'.$row['Title'].'" id="'.$row['Category_ID'].'" selected>'.$row['Title'].'</option>';
                                        else
                                            echo '<option name="categories[]" value="'.$row['Title'].'" id="'.$row['Category_ID'].'">'.$row['Title'].'</option>';
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
                                <td>
                                    <?php
                                        echo '<input type="text" name="business_name" value="'.$_POST['business_name'].'" size="50" disabled>';
                                    ?>
                                </td>
                            </tr>
                            <tr>
                                <td>Address: </td>
                                <td>
                                    <?php
                                        echo '<input type="text" name="address" value="'.$_POST['address'].'" size="50" disabled>';
                                    ?>
                                </td>
                            </tr>
                            <tr>
                                <td>City: </td>
                                <td>
                                    <?php
                                        echo '<input type="text" name="city" value="'.$_POST['city'].'" size="50" disabled>'
                                    ?>
                                </td>
                            </tr>
                            <tr>
                                <td>Telephone: </td>
                                <td>
                                    <?php
                                        echo '<input type="tel" name="telephone" value="'.$_POST['telephone'].'" size="50" disabled>'
                                    ?>    
                                </td>
                            </tr>
                            <tr>
                                <td>URL: </td>
                                <td>
                                    <?php
                                        echo '<input type="url" name="url" value="'.$_POST['url'].'" size="50" disabled>'
                                    ?>
                                </td>
                            </tr>
                        </table>
                </div>
        </div>
        <div class="row">
            <a href="add_biz.php">Add another business</a>
        </div>
    </div>
</body>
</html>