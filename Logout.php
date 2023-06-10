<?php

/*This php file lets the user log out. Is used in any case of leaving the game page (except guest mode) and
  leaving the choose gamemode page
  author: Nathan Pokrandt, with help from W3schools
*/

//these are used in every php file. They are the credentials of the database
$servername = "localhost";
$username = "scraggle";
$password = "Scragg13";
$dbname = "scraggle";

//this is how the variable arrives from the JavaScript.
$Pusername = $_REQUEST['word'];

//another constant for all of the php. This initiates a connection to the database using the credentials given above
$conn = new mysqli($servername, $username, $password, $dbname);

//if the connection to the database is unsuccessful, return an error message
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

//simply update the status to 0 (logged out)
$query = ("UPDATE Users SET Status = 0 WHERE Username LIKE '$Pusername'");

//Taken from W3schools
//if logout is successful, return as much. This is commented out in the JS
if ($conn->multi_query($query) === TRUE) {
    print("logout successful");
} else {
    print("Error: " . $sql . "<br>" . $conn->error);
}

//close the database connection
$conn->close();

?>
