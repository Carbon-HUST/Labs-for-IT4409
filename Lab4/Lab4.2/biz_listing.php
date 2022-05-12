<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Business Listings</title>
</head>
<body>
    <style>
        .row {
          display: flex;  
        }
        .col1 {
           margin-right: 50px;
        }
        .category:hover {
            background-color: greenyellow;
        }
        
    </style>
    <h2>Business Listings</h2>
    <div class="container">
        <div class="row">
            <div class="col1">
                <table border="2">
                    <tr>
                        <th><b>Click on a category to find business listings: </b></th>
                    </tr>
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
                        $request_category = "";
                        if (isset($_GET["category_id"]))
                            $request_category = $_GET["category_id"];

                        $SQLcmd = "SELECT * from $table_name";
                        $result = mysqli_query($connect, $SQLcmd);
                        if(mysqli_num_rows($result) > 0) 
                        {
                            while($row = mysqli_fetch_assoc($result)) 
                            {
                                if ($row['Category_ID'] == $request_category)
                                {
                                    echo '<tr>
                                    <td class="category" style="background-color: aqua"><a href="biz_listing.php?category_id='.$row['Category_ID'].'">'.$row['Title'].'</a></td>
                                    </tr>';
                                }
                                else
                                {
                                    echo '<tr>
                                    <td class="category"><a href="biz_listing.php?category_id='.$row['Category_ID'].'">'.$row['Title'].'</a></td>
                                    </tr>';
                                }
                            }
                        }
                    }
                    ?>
                </table>
            </div>
            <div class="col2">
                <table border="1">
                    <?php
                    if ($connect)
                    {
                        if ($request_category === "")
                        {
                            $SQLcmd = "select * from Businesses";
                        }
                        else
                        {
                            $SQLcmd = "select Businesses.* from Businesses, Biz_categories 
                                        where Biz_categories.Category_ID = '$request_category' and 
                                        Biz_categories.Business_ID = Businesses.Business_ID";
                        }
                        $result = mysqli_query($connect, $SQLcmd);
                        if(mysqli_num_rows($result) > 0) 
                        {
                            while($row = mysqli_fetch_assoc($result)) 
                            {
                                echo '<tr>
                                    <td>'.$row['Business_ID'].'</td>
                                    <td>'.$row['Name'].'</td>
                                    <td>'.$row['Address'].'</td>
                                    <td>'.$row['City'].'</td>
                                    <td>'.$row['Telephone'].'</td>
                                    <td>'.$row['URL'].'</td>
                                    <td>'.$row['Business_ID'].'</td>
                                    <td>'.$request_category.'</td>
                                    </tr>';
                            }
                        }
                        mysqli_close($connect);
                    }
                    ?>
                </table>
            </div>
        </div>
        
    </div>
</body>
</body>
</html>