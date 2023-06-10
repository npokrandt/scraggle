/*This php file takes the new user's username and password and puts them into the "users" table in the database
  author: Nathan Pokrandt, with help from W3schools
*/

<?php

//these are used in every php file. They are the credentials of the database
$servername = "localhost";
$username = "scraggle";
$password = "Scragg13";
$dbname = "scraggle";

//this is how the variables arrive from the JavaScript. They are 1 line, so they must be separated.
$word = $_REQUEST['word'];
$words = explode(";", $word);

//when separated, the variables are the username and the password that the user sent
$Pusername = $words[0];
$Ppassword = $words[1];

//encrypting the password
$Ppassword = crypt($Ppassword, "salutations");
//this indicates that the user will be seen as logged in. If the status is zero, then the user is logged out
$status = 1;

//another constant for all of the php. This initiates a connection to the database using the credentials given above
$conn = new mysqli($servername, $username, $password, $dbname);

//if the connection to the database is unsuccessful, return an error message
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

//this is a simple query that does automatic numbering for the table. The user's ID is the number of current entries 
//plus one.
$query = "SELECT * FROM Users";

$result = mysqli_query($conn, $query);

$userID = mysqli_num_rows($result) + 1;

//this query does the last error check, to make sure the name is not duplicated
$query = "SELECT * FROM Users WHERE Username LIKE '$Pusername'";

$result = mysqli_query($conn, $query);

//if the name exists in the table, then the number of rows found will be more than zero
if ($result->num_rows > 0){
    echo "User already exists"; 
} else {

    //the main code. This adds the user's ID, their username and password, and their status of "logged in" to the table 
    $sql = "INSERT INTO Users (UserID, Username, Password, Status)
            VALUES ($userID, '$Pusername', '$Ppassword', $status);";

    //Taken from W3schools
    //the multi query line is probably unnecessary but it worked, so I stuck with it
    //if the items were added successfully, return success; else send an error message
    if ($conn->multi_query($sql) === TRUE) {
        echo "user added";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

}

//close the database connection
$conn->close();

?>
