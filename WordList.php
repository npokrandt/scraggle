<?php

/*This php file gets both players' lists, uploads them to the game table, gives each player the other player's 
  word list, and updates their status to "finished"
  author: Nathan Pokrandt, with help from W3schools
*/


//these are used in every php file. They are the credentials of the database
$servername = "localhost";
$username = "scraggle";
$password = "Scragg13";
$dbname = "scraggle";

//this is how the variables arrive from the JavaScript. They are then separated. This brings in both players'
//wordlists and the game ID. When I have 3 variables I use goofy variable names
$Stuff = $_REQUEST['word'];
$Stuffs = explode(";", $Stuff);
$GameID = intval($Stuffs[0]);
$Pusername = $Stuffs[1];
$WordList = $Stuffs[2];

//a boolean that sees if the player has already submitted their list, to avoid redundancy
$ListSubmitted = false;

//another constant for all of the php. This initiates a connection to the database using the credentials given above
$conn = new mysqli($servername, $username, $password, $dbname);

//if the connection to the database is unsuccessful, return an error message
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$query = ("SELECT * FROM Game WHERE GameID LIKE $GameID");

$result = mysqli_query($conn, $query);

//for each player, update their status to "finished"
while ($row = $result->fetch_assoc()){
    if ($row["P1Username"] == $Pusername and $row["Status1"] == "finished"){
        $ListSubmitted = true;
    } else if ($row["P2Username"] == $Pusername and $row["Status2"] == "finished"){
	$ListSubmitted = true;
    }
}

//this should only run if your list hasn't been submitted
if ($ListSubmitted == false){
    
    //separate queries for each player to use to update the wordlist in the database
    $query = ("UPDATE Game SET Words1 = '$WordList', Status1 = 'finished' WHERE P1Username LIKE '$Pusername' and GameId LIKE $GameID");

    //Taken from W3schools
    if ($conn->multi_query($query) === TRUE) {
        echo "";
    } else {
        print("Error: " . $sql . "<br>" . $conn->error);
    }


    $query = ("UPDATE Game SET Words2 = '$WordList', Status2 = 'finished' WHERE P2Username LIKE '$Pusername' and GameId LIKE $GameID");
 
    if ($conn->multi_query($query) === TRUE) {
        echo "";
    } else {
        print("Error: " . $sql . "<br>" . $conn->error);
    }

}

//now we return to each player the other player's list
$query = ("SELECT * FROM Game WHERE GameID LIKE $GameID");

$result = mysqli_query($conn, $query);

while ($row = $result->fetch_assoc()){
    //return the wordlists only when we know both are in the table
    if ($row["Status1"] == 'finished' and $row["Status2"] == "finished"){
        //the $Pusername variable did not need single quotations; it took me multiple days to discover that error!
        if ($row["P1Username"] == $Pusername){           
           echo $row["Words2"];
        } else {
           echo $row["Words1"];
        }
    } else {
        //otherwise, return "no"
	echo "no";
    }
}

//close the database connection
$conn->close();

?>
