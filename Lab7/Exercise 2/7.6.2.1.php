<?php
    $file = "pet.xml"; 
        $xml = simplexml_load_file($file) or die ("Unable to load XMLfile!");
        echo "Name: ".$xml->name."</br>"; 
        echo "Age: ".$xml->age."</br>"; 
        echo "Species: ".$xml->species."</br>";  
        echo "Parents: ".$xml->parents->mother." and ".$xml->parents->father."</br>"; 
?>