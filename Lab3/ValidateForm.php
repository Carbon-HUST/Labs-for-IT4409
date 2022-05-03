<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <from name="myform" onsubmit="return checkForm();">
        Username: <input type="text" name="name" id="name"><br>
        Email: <input type="text" name="email" id="email"><br>
        Phone: <input type="text" name="phone" id="phone"><br>
        <input type="submit" name="submit" value="Submit">
    </from>
</body>
<script type="text/javascript">
    function checkForm() {
        var username = document.getElementById('username').value;
        var email = document.getElementById('email').value;
        var phone = document.getElementById('phone').value;
        var filterEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        var filterPhone = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
        var text = "";
        if(!username){
            text += "Please enter a valid name!\n";
        }
        if(!filterEmail.test(email)) {
            text += "Please enter a valid email!\n";
        }
        if(!filterPhone.test(phone)) {
            text += "Please enter a valid phone number!\n";
        }
        if(text == ""){
            alert("Success");
            return true;
        }
        else{
            alert(text);
            return false;
        }
    }
</script>
</html>