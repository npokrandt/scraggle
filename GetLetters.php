<?php

/*This php file simply gives player 2 the letter distribution that player 1 created
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

//find the game where player 2's status is waiting
$query = ("SELECT * FROM Game WHERE Status2 LIKE 'waiting' AND P2Username LIKE '$Pusername'");

$result = mysqli_query($conn, $query);

//if this exists, change their status to ready and return the letter distribution and the game ID
if ($result->num_rows > 0){

    while ($row = $result->fetch_assoc()){
        $Letters = $row["Letters"];
        $GameID = $row["GameID"];

        $query = ("UPDATE Game SET Status2 = 'ready' WHERE GameID LIKE $GameID");

        //this returns the letter distribution and the Game ID
    	if ($conn->query($query) === TRUE){
            echo $Letters;
            echo $GameID;
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error; 
        }

    }

//otherwise, the letter distribution is not yet ready
} else {
    echo "no";
}

//close the database connection
$conn->close();

?>
