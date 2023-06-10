<?php

/*This php file lets the user log in. Add encryption for better security
  author: Nathan Pokrandt, with help from W3schools
*/

//these are used in every php file. They are the credentials of the database
$servername = "localhost";
$username = "scraggle";
$password = "Scragg13";
$dbname = "scraggle";

//this is how the variables arrive from the JavaScript. They are in one string, so they have to be split
$word = $_REQUEST['word'];
$words = explode(";", $word);

//the two parts are the input username and password. 
$Pusername = $words[0];
$Ppassword = $words[1];

$Ppassword = crypt($Ppassword, "salutations");
//another constant for all of the php. This initiates a connection to the database using the credentials given above
$conn = new mysqli($servername, $username, $password, $dbname);

//if the connection to the database is unsuccessful, return an error message
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

//a simple query to check if the username exists
$query = ("SELECT * FROM Users WHERE Username LIKE '$Pusername'");

$result = mysqli_query($conn, $query);

//if not, login fails and notifies the user
if ($result->num_rows == 0){
    print("username not found");
} else {
    //passing that check, now check the password
    $query = ("SELECT * FROM Users WHERE Username LIKE '$Pusername' 
               AND Password LIKE '$Ppassword'");

    $result = mysqli_query($conn, $query);

    if ($result->num_rows == 0){
        //if the password is incorrect, login fails
	print("Password is incorrect");
    } else {	
        //otherwise login is successful and the user is logged in. Their status changes to 1 (logged in)
	$query = ("UPDATE Users SET Status = 1 WHERE Username LIKE '$Pusername'");
        if (mysqli_query($conn, $query)){
	    print("sucessful login!");
        } else {
	    print("Error: something went wrong: " . mysqli_error($conn));
        }
        
    }
    
}     

//close the database connection
$conn->close();

?>
