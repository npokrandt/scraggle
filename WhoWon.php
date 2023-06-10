<?php

/*This php file gets both players' scores, uploads them to the game table, gives each player the other player's 
  score, and updates their status to "scored"
  author: Nathan Pokrandt, with help from W3schools
*/


//these are used in every php file. They are the credentials of the database
$servername = "localhost";
$username = "scraggle";
$password = "Scragg13";
$dbname = "scraggle";

//this is how the variables arrive from the JavaScript. They are then separated. This brings in both players'
//scores and the game ID. When I have 3 variables I use goofy variable names
$Stuff = $_REQUEST['word'];
$Stuffs = explode(";", $Stuff);
$GameID = intval($Stuffs[0]);
$Pusername = $Stuffs[1];
$Score = intval($Stuffs[2]);

//another constant for all of the php. This initiates a connection to the database using the credentials given above
$conn = new mysqli($servername, $username, $password, $dbname);

//if the connection to the database is unsuccessful, return an error message
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

//separate queries that update each player's status to "scored" and uploads their score
$query = ("UPDATE Game SET Score1 = $Score, Status1 = 'scored' WHERE P1Username LIKE '$Pusername' and GameId LIKE $GameID");

//Taken from W3schools
if ($conn->multi_query($query) === TRUE) {
    echo "";
} else {
    print("Error: " . $sql . "<br>" . $conn->error);
}

$query = ("UPDATE Game SET Score2 = $Score, Status2 = 'scored' WHERE P2Username LIKE '$Pusername' and GameId LIKE $GameID");
 
if ($conn->multi_query($query) === TRUE) {
    echo "";
} else {
    print("Error: " . $sql . "<br>" . $conn->error);
}

$query = ("SELECT * FROM Game WHERE GameID LIKE $GameID");

//a slight delay because without it the first player to finish the game would receive nothing!
sleep(1);

$result = mysqli_query($conn, $query);

//return to each player their opponent's score after we know both scores are uploaded
while ($row = $result->fetch_assoc()){
    if ($row["Status1"] == 'scored' and $row["Status2"] == "scored"){
        if ($row["P1Username"] == $Pusername){           
           echo $row["Score2"];
        } else {
           echo $row["Score1"];
        }
    } else {
        //otherwise, return "no"
	echo "no";
    }
}

//close the database connection
$conn->close();

?>

