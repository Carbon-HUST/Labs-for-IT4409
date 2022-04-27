<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Date Time</title>
</head>

<body>
    <h2>Enter your name and select date and time for the appointment</h2>
    <form action="DateTime.php" method="get">
        <table>
            <tr>
                <td>Your name:</td>
                <td><input type="text" name="name" value=""></td>
            </tr>
            <tr>
                <td>Date:</td>
                <td>
                    <select name="day" id="day">
                        <?php
                        for($i = 1; $i < 32; $i++){
                            print("<option>$i</option>");
                        }
                    ?>
                    </select>
                    <select name="month" id="month">
                        <?php
                        for($i = 1; $i < 13; $i++){
                            print("<option>$i</option>");
                        }
                    ?>
                    </select>
                    <select name="year" id="year">
                        <?php
                            for($i = 1000; $i <= 3000; $i++){
                                print("<option>$i</option>");
                            }
                        ?>
                    </select>
                    <label for="">(Day - Month - Year)</label>
                </td>
            </tr>
            <tr>
                <td>Time:</td>
                <td>
                    <select name="hour" id="hour">
                        <?php
                            for($i = 0; $i < 24; $i++){
                                print("<option>$i</option>");
                            }
                        ?>
                    </select>
                    <label for="">h</label>

                    <select name="minus" id="minus">
                        <?php
                            for($i = 0; $i < 60; $i++){
                                print("<option>$i</option>");
                            }
                        ?>
                    </select>
                    <label for="">m</label>
                    <select name="second" id="second">
                        <?php
                            for($i = 0; $i < 60; $i++){
                                print("<option>$i</option>");
                            }
                        ?>
                    </select>
                    <label for="">s</label>
                </td>
            </tr>
            <tr>
                <td align="right"><input type="submit" value="Submit"></td>
                <td align="left"><input type="reset" value="Reset"></td>
            </tr>
        </table>
    </form>
    <?php
        if(array_key_exists("name", $_GET)){
            $name = $_GET['name'];
            $day = $_GET['day'];
            $month = $_GET['month'];
            $year = $_GET['year'];
            $second = $_GET['second'];
            $minus = $_GET['minus'];
            $hour = $_GET['hour'];
            
            print("Hi $name!<br/>");
            printf('You have choose to have an appointment on %02d:%02d:%02d, %02d/%02d/%02d <br/>', $hour, $minus, $second, $day, $month, $year);


            $datetime = $hour.':'.$minus.':'.$second.' '.$day.'/'.$month.'/'.$year;
            printf("More information<br/>");
            echo "In 12 hours, the time and date is ".date('h:i:s A, m/d/Y', strtotime($datetime)).'<br/>';

            if($month == 1 || $month == 3 || $month == 5 || $month == 7 || $month == 8 || $month == 10 || $month == 12){
                print("This month has 31 days");
            } else if($month != 2){
                print("This month has 30 days");
                if($day == 31){
                    print('<b style="color: red">Invalid date</b>');
                }
            } else {
                if($year % 100 == 0 && $year % 400 == 0){
                    print("This month has 29 days");
                    if($day > 29){
                        print('<b style="color: red">Invalid date</b>');
                    }
                } else if($year % 4 == 0 && $year % 100 == 0){
                    print("This month has 29 days");
                    if($day > 29){
                        print('<b style="color: red">Invalid date</b>');
                    }
                } else{
                    print("This month has 28 days");
                    if($day > 28){
                        print('<b style="color: red">Invalid date</b>');
                    }
                }
            }

            
        }
    ?>
</body>

</html>