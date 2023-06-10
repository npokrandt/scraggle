<?php

/*This php file detects if one of the players in multiplayer left the game and lets the other player know
  author: Nathan Pokrandt, with help from W3schools
*/

//these are used in every php file. They are the credentials of the database
$servername = "localhost";
$username = "scraggle";
$password = "Scragg13";
$dbname = "scraggle";

//this is how the variable arrives from the JavaScript. It is the other player's name because that is what
//we are checking in the user table
$username2 = $_REQUEST['word'];

//another constant for all of the php. This initiates a connection to the database using the credentials given above
$conn = new mysqli($servername, $username, $password, $dbname);

//if the connection to the database is unsuccessful, return an error message
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

//look in the users table for the opponent's username
$query = ("SELECT * FROM Users WHERE Username LIKE '$username2'");

$result = mysqli_query($conn, $query);

//if the status is 0 (logged out), tell that to the other player
while ($row = $result->fetch_assoc()){
    if ($row["Status"] == '0'){
        echo "playerLeft";
    }
}

//close the database connection
$conn->close();

?>
