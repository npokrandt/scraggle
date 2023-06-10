<?php

/*This php file adds the user to the waiting list
  author: Nathan Pokrandt, with help from W3schools
*/

//these are used in every php file. They are the credentials of the database
$servername = "localhost";
$username = "scraggle";
$password = "Scragg13";
$dbname = "scraggle";

//this is how the variable arrives from the JavaScript.
$Pusername = $_REQUEST['word'];

//like the wordListString variable from the game, this string holds all of the players. It should never hold
//more than two
$waiters = "";

//another constant for all of the php. This initiates a connection to the database using the credentials given above
$conn = new mysqli($servername, $username, $password, $dbname);

//if the connection to the database is unsuccessful, return an error message
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

//like other code I've used, this searches the list and returns your wait number
$query = "SELECT * FROM Waiting";

$result = mysqli_query($conn, $query);

$wn = mysqli_num_rows($result) + 1;

//it then puts those values in the table
$sql = "INSERT INTO Waiting (Username, WaitNumber)
            VALUES ('$Pusername', $wn);";

//Taken from W3schools
if ($conn->multi_query($sql) === TRUE) {
    //add the players username to the waiting list
    $query = "SELECT Username FROM Waiting";
    
    $result = mysqli_query($conn, $query);

    while ($row = $result->fetch_assoc()){
	echo $row["Username"] . "\r\n";
    }

} else {
    echo "Error: " . $sql . "<br>" . $conn->error;  
}

//close the database connection
$conn->close();

?>
