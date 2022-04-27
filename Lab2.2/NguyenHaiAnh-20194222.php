<!DOCTYPE html>


<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Appointment</title>
</head>

<body>
    <p>Enter your name and select date and time for the appointment</p>
    <form method="POST">
        <label>Your name: </label>
        <input type="text" name="name" required=""/>
        <br />
        <br />
        <label>Date (d/m/y): </label>
        <select name="day">
            <?php
                for ($i = 1; $i <= 31; $i++) 
                    echo "<option>$i</option>";
                
            ?>
        </select>
        <select  name="month">
            <?php
                for ($i = 1; $i <= 12; $i++) 
                    echo "<option >$i</option>";
                
            ?>
        </select>
        <select name="year">
            <?php
                for ($i = 1990; $i <= 2100; $i++) 
                    echo "<option>$i</option>";
                
            ?>
        </select>
        <br />
        <br />
        <label>Time (s/m/h): </label>
        <select name="second">
            <?php
                for ($i = 0; $i <= 60; $i++) 
                    echo "<option value=\"$i\">$i</option>";
                
            ?>
        </select>
        <select name="minute">
            <?php
                for ($i = 0; $i <= 60; $i++) 
                    echo "<option value=\"$i\">$i</option>";
            ?>
        </select>
        <select name="hour">
            <?php
                for ($i = 0; $i <= 23; $i++) 
                    echo "<option>$i</option>";
                
            ?>
        </select>
        
        <br />
        <br />
        <input type="submit" value="Submit"/>
        <input type="reset" value="Reset"/>
    </form>
    
    <?php
    
        function Leap($year) {
            if($year % 400 == 0) 
                return true;
            
            if($year % 4 == 0 && $year % 100 != 0)
                return true;

            return false ;
        }
        
        
        $name = $_POST["name"];
        echo "<p>Hi $name!</p>";
            
        $day = $_POST["day"];
        $month = $_POST["month"];
        $year = $_POST["year"];
        $second = $_POST["second"];
        $minute = $_POST["minute"];
        $hour = $_POST["hour"];

        $numday = [-100, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        
        if ($month != 2 && $day > $numday[$month]) {
            echo "<p>You have choose an invalid date! Please choose another date</p>";
            return;
        }
        if($month == 2 && Leap($year)) {
            if($day > 29)
                echo "<p>You have choose an invalid date! Please choose another date</p>";
            return;
        }
        if($month == 2 && Leap($year) == false) {
            if($day > 28)
                echo "<p>You have choose an invalid date! Please choose another date</p>";
            return;
        }
      
        
        echo "<p>You have choose to have an appointment on ". 
                ($hour > 9 ? $hour : "0$hour").":".
                ($minute > 9 ? $minute : "0$minute").":".
                ($second > 9 ? $second : "0$second").
                ", $day/$month/$year</p> <br />";
        
        echo "<p>More information</p>";
        echo "<p>In 12 hours, the time and date is ". date("h:i:s A", mktime($hour, $minute, $second)).", $day/$month/$year</p> <br />";
    
        
    ?>
</body>

</html>