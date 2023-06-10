<?php

/*This php file lets the user leave the waiting list (unless they are the second player in. Then they have no choice)
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

//remove the user's name from the waiting table
$query = ("DELETE FROM Waiting WHERE Username LIKE '$Pusername'");

//Taken from W3schools
//if it is successful, you have left the wait room (in the JS, the response is commented out)
if ($conn->multi_query($query) === TRUE) {
    print("you left wait room");
} else {
    print("Error: " . $sql . "<br>" . $conn->error);
}

//close the database connection
$conn->close();

?>
