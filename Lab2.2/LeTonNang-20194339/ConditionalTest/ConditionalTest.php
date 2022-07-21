<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Conditional Test</title>
</head>

<body>
    <?php
        $first = $_GET['firstName'];
        $middle = $_GET['middleName'];
        $last = $_GET['lastName'];

        print ("Hi $first! Your full name is $last $middle $first. <br/>");
        
        if($first == $last){
            print ("$first and $last are equal");
        }
        if($first < $last){
            print ("$first is less than $last");
        }
        if($first > $last){
            print ("$first is greater than $last");
        }
        print ("<br/>");

        $grade1 = $_GET['grade1'];
        $grade2 = $_GET['grade2'];
        $rate = 'A';
        $final = (2 * $grade1 + 3 * $grade2) / 5;

        if($final > 89){
			print "Your final grade is $final. You got an A. Congratulation!";
			$rate = "A";
		} elseif ($final > 79) {
			print "Your final grade is $final. You got an B";
			$rate = "B";
		} elseif ($final > 69) {
			print "Your final grade is $final. You got an C";
			$rate = "C";
		} elseif ($final > 59) {
			print "Your final grade is $final. You got an D";
			$rate = "D";
		} else if($final > 39){
            print "Your final grade is $final. You got an E";
            $rate = "E";
        }elseif ($final >= 0) {
			print "Your grade final is $final. You got an F";
			$rate = "F";
		} else {
			print "Iillegal grade less than 0. Final grade = $final";
			$rate = "Iillegal";
		}
		
		print "<br /><br />";

		switch ($rate) {
			case "A":
				print "Excellent! <br />";
				break;
			case "B":
				print "Good! <br />";
				break;
			case "C":
				print "Not bad! <br />";
				break;
			case "D":
				print "Normal! <br />";
				break;
            case "E":
			case "F":
				print "You have a try again! <br />";
				break;

			default:
				print "Iillegal grage! <br />";
            }
    ?>
</body>

</html>