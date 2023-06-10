<?php

/*This php file takes a completed word and looks for it in the dictionary table. It returns true if the word 
  is found, and false if it is not found
  author: Nathan Pokrandt, with help from W3schools
*/

//these are used in every php file. They are the credentials of the database
$servername = "localhost";
$username = "scraggle";
$password = "Scragg13";
$dbname = "scraggle";

//this is a boolean that presumes that the word is invalid
$isFound = false;

//this is how the word arrives from the JavaScript. Because of the way the words are formatted in the table,
//the two underscores are added on (the SQL uses "_" as a single wildcard character)
$word = $_REQUEST['word'];
$word .= "__";

//another constant for all of the php. This initiates a connection to the database using the credentials given above
$conn = new mysqli($servername, $username, $password, $dbname);

//if the connection to the database is unsuccessful, return an error message

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

//A simple query to search for the word in the dictionary. 
$sql = "SELECT * FROM `Dictionary` WHERE Word LIKE '$word'";
$result = $conn->query($sql);

//There is only one instance of the word in the table, so if anything shows up, then the word is valid
if ($result->num_rows > 0){
	$isFound = true;
} 

//close the database connection
$conn->close();

//return text for whatever the boolean is after the dictionary check
if ($isFound == true){
	print("true");
} else {
	print("false");
}

?>
