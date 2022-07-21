<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Appointment</title>
</head>
<body>
    <form method="POST">
        <p>Enter your name and set date and time for the appointment</p>
        <label for="name">Your name:<input type="text" name="name" required></label>
        <br/>
        <label>Date:&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</label>
        <select name="day" id="day">
            <?php
                for ($i = 1; $i <= 31; $i++) {
                    echo "<option> $i </option>";
                }
            ?>
        </select>
        <select name="month" id="month">
            <?php
                for($i = 1; $i <= 12; $i++) {
                    echo "<option> $i </option>";
                }
            ?>
        </select>
        <select name="year" id="year">
            <?php
                for($i = 1899; $i < 2500; $i++) {
                    echo "<option> $i </option>";
                }
            ?>
        </select>

        <br/>
        <label>Time:&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</label>
        <select name="hour" id="hour" >
            <?php
                for ($i = 0; $i <= 23; $i++) {
                    echo "<option> $i </option>";
                }
            ?>
        </select>
        <select name="minute" id="minute" required>
            <?php
                for ($i = 0; $i < 60; $i++) {
                    echo "<option> $i </option>";
                }
            ?>
        </select>
        <select name="second" id="second" required>
            <?php
                for ($i = 0; $i < 60; $i++) {
                    echo "<option> $i </option>";
                }
            ?>
        </select>
        <br/>
        <input type="submit" value="Submit">
        <input type="reset" value="Reset">
    </form>

    <?php

        function Leap($year) {
            if($year % 4 == 0 && $year % 100 != 0)
                return true;
            if($year % 400 == 0)
                return true;
            
            return false;
        }
           
        function confirmation($name, $hour, $minute, $second, $day, $month, $year) {
            echo "<p>Hi $name<p>";
            echo "<p>You have chosen to have an appointment at "."$hour".":$minute".":$second"." on $day/$month/$year."; 
            echo "<p>More information<p>";
            echo "<p>In 12h format, the time and date is ".date("h:i:s A", mktime($hour, $minute, $second)).", $day/$month/$year</p>";
        }

        function validate() {
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                return;
            }
            
            $name = $_POST["name"];
            $day = $_POST["day"];
            $month = $_POST["month"];
            $year = $_POST["year"];
            $second = $_POST["second"];
            $minute = $_POST["minute"];
            $hour = $_POST["hour"];
            
            if($month == 2) {
                if(Leap($year)) {
                    if($day > 29) {
                        echo "<p>Invalid date, try again </p>";
                        return;
                    }
                } else {
                    if($day > 28) {
                        echo "<p>Invalid date, try again </p>";
                        return;
                    }
                }
            } else {
                if($month == 1 || $month == 3 || $month == 5 || $month == 7 || $month == 8 || $month == 10 || $month == 12) {
                    if($day > 31) {
                        echo "<p>Invalid date, try again </p>";
                        return;
                    }
                } else {
                    if($day > 31) {
                        echo "<p>Invalid date, try again </p>";
                        return;
                    }
                }
            }
            confirmation($name, $hour, $minute, $second, $day, $month, $year);
        }

        validate();
    ?>
</body>
</html>