<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Date Time Validation</title>
</head>

<body>
    <p>Enter your name and select date and time for the appointment</p>
    <form method="POST">
        <label for="name">Your name: </label>
        <input type="text" name="name" id="name" required=""/>
        <br />
        <br />
        <label>Date (d/m/y): </label>
        <select id="day" name="day">
            <?php
                for ($i = 1; $i <= 31; $i++) {
                    echo "<option value=\"$i\">$i</option>";
                }
            ?>
        </select>
        <select id="month" name="month">
            <?php
                for ($i = 1; $i <= 12; $i++) {
                    echo "<option value=\"$i\">$i</option>";
                }
            ?>
        </select>
        <select id="year" name="year">
            <?php
                for ($i = 1850; $i <= 3000; $i++) {
                    echo "<option value=\"$i\">$i</option>";
                }
            ?>
        </select>
        <br />
        <br />
        <label>Time (s/m/h): </label>
        <select id="second" name="second">
            <?php
                for ($i = 0; $i <= 60; $i++) {
                    echo "<option value=\"$i\">$i</option>";
                }
            ?>
        </select>
        <select id="minute" name="minute">
            <?php
                for ($i = 0; $i <= 60; $i++) {
                    echo "<option value=\"$i\">$i</option>";
                }
            ?>
        </select>
        <select id="hour" name="hour">
            <?php
                for ($i = 0; $i <= 23; $i++) {
                    echo "<option value=\"$i\">$i</option>";
                }
            ?>
        </select>
        
        <br />
        <br />
        <input type="submit" value="Submit"/>
        <input type="reset" value="Reset"/>
    </form>
    
    <?php
    
        function isLeapYear($year) {
            if ($year % 400 == 0 && $year % 100 == 0) {
                return 1;
            } 
            elseif ($year % 4 == 0 && $year % 100 != 0) {
                return 1;
            }
            return 0;
        }
        
        function renderData() {
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                return;
            }
            
            if (empty($_POST["name"])) {
                echo "Name field is required";
                return;
            }
            
            $name = $_POST["name"];
            echo "<p>Hi $name!</p>";
                
            $day = $_POST["day"];
            $month = $_POST["month"];
            $year = $_POST["year"];
            $days_in_month = [
                1 => 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
            ];
            
            if (($month != 2 && $day > $days_in_month[$month]) || ($day > 28 + isLeapYear($year))) {
                echo "<p>You have choose an invalid date! Please choose another date</p>";
                return;
            }
                
            $second = $_POST["second"];
            $minute = $_POST["minute"];
            $hour = $_POST["hour"];
            
            echo "<p>You have choose to have an appointment on ". 
                    ($hour > 9 ? $hour : "0$hour").":".
                    ($minute > 9 ? $minute : "0$minute").":".
                    ($second > 9 ? $second : "0$second").
                    ", $day/$month/$year</p> <br />";
            
            echo "<p>More information</p>";
            echo "<p>In 12 hours, the time and date is ". date("h:i:s A", mktime($hour, $minute, $second)).", $day/$month/$year</p> <br />";
        }
        
        renderData();
    ?>
</body>

</html>