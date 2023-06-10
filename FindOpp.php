<?php

/*This php file searches the waiting table to see if there is more than one person. If it finds two people, it
  will send both of them into a new game
  author: Nathan Pokrandt, with help from W3schools
*/

//these are used in every php file. They are the credentials of the database
$servername = "localhost";
$username = "scraggle";
$password = "Scragg13";
$dbname = "scraggle";

//this is how the variable arrives from the JavaScript.
$Pusername = $_REQUEST['word'];

//from the search the game will give each user the name of each opponent
$username2 = "";

//another constant for all of the php. This initiates a connection to the database using the credentials given above
$conn = new mysqli($servername, $username, $password, $dbname);

//if the connection to the database is unsuccessful, return an error message
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

//the beginning of some complicated code, it first searches the waiting table
$query = "SELECT * FROM Waiting";

$result = mysqli_query($conn, $query);

//if two players are found, then give each player their opponent and ID number
if ($result->num_rows > 1){

    $query = "SELECT * FROM Waiting";

    $result = mysqli_query($conn, $query);
    
    //get the name of the user's opponent
    while ($row = $result->fetch_assoc()){
	 if ($row["Username"] !=  $Pusername){
             $username2 = $row["Username"];
         }
    }

    $query = "SELECT * FROM Waiting";

    $result = mysqli_query($conn, $query);

    //assign player IDs based on their wait number
    while ($row = $result->fetch_assoc()){ 
         //makes each row element an easier to use variable
         $u = $row["Username"];
	 $w = $row["WaitNumber"];
	 
         //if player 1, get opponent's username and your ID
	 if ($w == 1 and $u == $Pusername){ 
             echo $username2;
             echo "1";          
         } else if ($w == 2 and $u == $Pusername){
                //otherwise, the same as above and clear the waiting table
                $query = "DELETE FROM Waiting";

                 if ($conn->query($query) === TRUE) {
  	             echo $username2;
                     echo "2";
    	         } else {
		     echo "Error: " . $sql . "<br>" . $conn->error; 
                 }
           }
    }


} else {
    //otherwise, you are still waiting for an opponent
    echo "still waiting";
}

//close the database connection
$conn->close();

?>
