<?php

/*This php file essentially initiates the new multiplayer game. Only player 1 runs this code. It returns the Game ID
  for player 1
  author: Nathan Pokrandt, with help from W3schools
*/

//these are used in every php file. They are the credentials of the database
$servername = "localhost";
$username = "scraggle";
$password = "Scragg13";
$dbname = "scraggle";

//this is how the variables arrive from the JavaScript. They are then separated. This brings in both players'
//usernames and the letter distribution. When I have 3 variables I use goofy variable names
$Stuff = $_REQUEST['word'];
$Stuffs = explode(";", $Stuff);
$Letters = $Stuffs[0];
$Pusername = $Stuffs[1];
$Username2 = $Stuffs[2];

    //another constant for all of the php. This initiates a connection to the database using the credentials given above
    $conn = new mysqli($servername, $username, $password, $dbname);
    
    //if the connection to the database is unsuccessful, return an error message
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    //take all the rows from the game table
    $query = "SELECT * FROM Game";

    $result = mysqli_query($conn, $query);

    //the game ID is that many rows plus 1
    $GameID = mysqli_num_rows($result) + 1;

    //formatting the date for the table's preference
    $date = date('Y-m-d H:i:s');
         
    //create the new game. Some fields will receive their actual data after the game
    $query = "INSERT INTO Game (GameID, StartTime, P1Username, P2Username, Letters, 
    Status1, Status2, Words1, Words2, Score1, Score2) 
    VALUES ($GameID, '$date', '$Pusername', '$Username2', '$Letters', 'ready', 'waiting',
    'waiting', 'waiting', 0, 0)";
         
    //if it worked, give player 1 the game ID
    if ($conn->query($query) === TRUE){
        echo $GameID;
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error; 
    }

    //close the database connection
    $conn->close();

?>
