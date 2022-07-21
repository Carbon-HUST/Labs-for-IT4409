<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Square and Cube</title>
</head>

<body>
    <font size="5" color="blude">Generate Square and Cube Values</font>
    <br>
    <form action="" method="get">
        <?php
            if(array_key_exists("start", $_GET)){
                $start = $_GET["start"];
                $end = $_GET["end"];
            } else{
                $start = 0;
                $end = 0;
            }
        ?>
        <table>
            <tr>
                <td>Select Start Number: </td>
                <td>
                    <select name="start" id="">
                        <?php
                        for($i = 0; $i <= 10; $i++){
                            if($i == $start){
                                print("<option selected>$i</option>"); 
                            } else
                                print("<option>$i</option>");
                        }
                    ?>
                    </select>
                </td>
            </tr>
            <tr>
                <td>Select End Number: </td>
                <td>
                    <select name="end" id="">
                        <?php
                        for($i = 0; $i <= 20; $i++){
                            if($i == $end){
                                print("<option selected>$i</option>");
                            } else
                                print("<option>$i</option>");
                        }
                    ?>
                    </select>
                </td>
            </tr>
            <tr>
                <td align="right">
                    <input type="submit" value="submit">
                </td>
                <td align="left">
                    <input type="reset" value="reset">
                </td>
            </tr>
        </table>
        <table>
            <tr>
                <th>Number</th>
                <th>Square</th>
                <th>Cube</th>
            </tr>
            <?php
            if(array_key_exists("start", $_GET)){
                
                $i = $start;
                while($i <= $end){
                    $sqr =  $i * $i;
                    $cubed = $i * $i * $i;
                    print("<tr><td>$i</td><td>$sqr</td><td>$cubed</td></tr>");
                    $i = $i + 1;
                }
            }
            ?>
        </table>
    </form>
</body>

</html>