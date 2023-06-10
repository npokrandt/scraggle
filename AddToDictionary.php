<?php

/* This is the php file that I used to upload the dictionary words to the database, and is not used at all in gameplay
   Author: Nathan Pokrandt with a lot of help from W3schools c2019
*/

//these are used in every php file. They are the credentials of the database
$servername = "localhost";
$username = "scraggle";
$password = "Scragg13";
$dbname = "scraggle";

//this is a variable that had to be constantly modified to add another block of 10000 words. 
//It would be the word's ID.
$n = 370001;

//my only usage of arrays in php. It held the words as they were pulled from the dictionary word file
$array = array();
$array = array_map('strval', $array);

//my only usage of file IO in the whole project! It just opened the file, put the words in the array,
//and then closed itself. (Yes, it added all of the words each time it ran, a bit inconvenient when I 
//could only add 10000 at a time to the database!)
$f = fopen("dictionary.txt", "r") or die ("Unable to open file!");

for ($x = 0; $x < 370104; $x++){
	$newWord = fgets($f);
	array_push($array, $newWord);
}
fclose($f);

//another constant for all of the php. This initiates a connection to the database using the credentials given above
$conn = new mysqli($servername, $username, $password, $dbname);

//if the connection to the database is unsuccessful, return an error message
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

//for some reason I always added the first word separately
$temp = $array[370000];
//the mysql used to add the word and ID to the dictionary
$sql = "INSERT INTO Dictionary (WordID, Word)
VALUES($n, '$temp');";

//now do the same for all the other words
for ($i = 370001; $i < 370103; $i++){	
	$n += 1;
	$sql .= "INSERT INTO Dictionary (WordID, Word)
	VALUES($n, '$array[$i]');";	
}

//Taken from W3schools
//the multi query line is probably unnecessary but it worked, so I stuck with it
//if the words were uploaded successfully, return success; else send an error message
if ($conn->multi_query($sql) === TRUE) {
    echo "dictionary complete";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
} 

//close the database connection
$conn->close();

?>