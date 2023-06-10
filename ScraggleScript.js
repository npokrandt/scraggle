/* This JavaScript file contains the majority of the game mechanics*/
/* Nathan Pokrandt c2020*/

//The letter distribution the game uses. Credit is given below
//One of each of the letters will be picked from each grouping, and each will be placed at random in the 4x4 grid
letterDistribution = [
     "RIFOBX", "IFEHEY", "DENOWS", "UTOKND", 
     "HMSRAO", "LUPETS", "ACITOA", "YLGKUE",
     "QBMJOA", "EHISPN", "VETIGN", "BALIYT",
     "EZAVND", "RALESC", "UWILRG", "PACEMD"   
    ];
    
    
     //The global variables. 

     //RA holds the game's letters after random selection
     RA = [];
     //this array takes the letters form the selected cubes
     word = [];
     //an array of the IDs of the letters. Used to check if a cube is entered twice
     cubesInWord  = [];
     //Holds the point values of letters in case of reforming word
     temp1Numbers = [];
     //Holds all the scores of the words in case of invalid words
     scoreArray = [];
     //Various booleans whose purpose should be obvious
     mouseIsDown = false;
     repeat = false;
     duplicate = false;
     isInGrid = true;
     //Multiplayer booleans
     isMultiplayer = false;
     lettersUpdated = true;
     //for when the timer is running, to use the click events
     timerOn = false;
     //the usernames of the 2 players in multiplayer
     username = "";
     username2 = "";
     //Letter distribution variables for multiplayer
     //LD1 is used for the second player to connect to transfer the letters over
     LD1 = "";
     LD = "";
     //a string to send via AJAX of the user's words
     stringWordListArray = "";
     //A string for the letters in the word array
     wordFormed = "";
     //keeps a count of the invalid words!
     invalidWordString = "";
     //A string that is the value of the textarea
     wordListString = "";
     //Variables for typing, which is still in the works
     letterTyped = "";
     keyId = "";
     //Variables for the timer; t is the timer; ts indicates a second has passed;
     //t10s means 10 seconds have passed; tm means a minute has passed
     t = 0;
     ts = 0 ;
     t10s = 6;
     tm = 3;
     tw = 1;
     //Scoring variables
     tempScore = 0;
     //Note: reset if duplicate happens
     tempScore1 = 0;
     tempScoreIndivid = 0;
     tempScore2 = 0;
     score = 0;
     //used for the other player's score in multiplayer
     score2 = 0;
     //For identity
     //You are either the first or second player to connect. This denotes which, and is used to ensure 
     //that both players get the same letter distribution and such
     playerID = 0;
     gameID = 0;
     //These help make the code less cumbersome with modifying the main html items
     TypeBox = document.getElementById("typeWord");
     wordList = document.getElementById("wordlist");
     timer = document.getElementById("timer");
     runningScore = document.getElementById("scoreLabel");
     //for the "pages" of the game
     openingScreen = document.getElementById("openingScreen");
     createUserScreen = document.getElementById("createUser");
     loginScreen = document.getElementById("login");
     gamemodeScreen = document.getElementById("chooseGamemode");
     waitingRoom = document.getElementById("waitingRoom");
     gamePage = document.getElementById("gamePage");
     //for the input boxes
     title = document.getElementById("title");
     newUsernameInputBox = document.getElementById("newUsernameInputBox");
     newPasswordInputBox = document.getElementById("newPasswordInputBox");
     confirmPasswordInputBox = document.getElementById("confirmPasswordInputBox");
     //Keep track of what's in the wordlist to find duplicates
     wordListArray = [];
     //in multiplayer, the opponent's words to compare the lists for words in common
     wordList2Array = [];
     //holds the words in common in both players' lists in multiplayer, to display for them to see
     commonWords = [];
     //Keep track of ajax responses to dictionary check; try resetting to fix issues
     validWordChecker = [];
     //arrays for typing, which is still in the works.
     //holds all instances of letters up through the improbable case we roll 9 e's
     RepeatedLetters = [];
     typedWord = [];
     OccurrenceArray = [];
     Occurrence1 = [];
     Occurrence2 = [];
     Occurrence3 = [];
     Occurrence4 = [];
     Occurrence5 = [];
     Occurrence6 = [];
     Occurrence7 = [];
     Occurrence8 = [];
     Occurrence9 = [];

     //sets these values so the two fields are blank
     wordList.value = "";
     document.getElementById("invalidWords").value = "";

     //makes sure the other "pages" are invisible
     gamePage.style.display = "none";
     createUserScreen.style.display = "none";
     loginScreen.style.display = "none";
     gamemodeScreen.style.display = "none";
     waitingRoom.style.display = "none";


     //For guest mode, where you can play without logging in
     function guestMode(){
          //switches the "pages" and changes the title
	  openingScreen.style.display = "none";
          gamePage.style.display = "block";
          title.innerHTML = "Playing as Guest"
     }

     //Takes you to the login screen
     function goToLogin(){
          //switches the "pages" and changes the title
	  openingScreen.style.display = "none";
          loginScreen.style.display = "block";
          title.innerHTML = "Login Below";
     }

     //Takes you to the create new user screen from the intro page
     function newUserFromIntro(){
          //switches the "pages" and changes the title
	  openingScreen.style.display = "none";
	  createUserScreen.style.display = "block";
          title.innerHTML = "Create New User";
          //clears the input boxes
          document.getElementById("usernameInputBox").value = "";
          document.getElementById("passwordInputBox").value = "";
     }

     //Takes you to the create new user screen from the login page 
     function newUserFromLogin(){
          //switches the "pages" and changes the title
          loginScreen.style.display = "none";
	  createUserScreen.style.display = "block";
          title.innerHTML = "Create New User";
          //clears the input boxes
          document.getElementById("usernameInputBox").value = "";
          document.getElementById("passwordInputBox").value = "";
     }

     //this function is used to create users
     function createUser(username, password, confirmPassword){
          //series of checks to prevent errors
	  if (username == "" || password == "" || confirmPassword == ""){
               //ensures none of the input boxes is blank
	       document.getElementById("passwordsDontMatch").innerHTML = "One or more fields is empty";
          } else if (username.length > 32){
               //makes sure the password or username isn't too long
	       document.getElementById("passwordsDontMatch").innerHTML = "Username is too long";	
          } else if (password.length > 32){
	       document.getElementById("passwordsDontMatch").innerHTML = "Password is too long";	
          } else if (password != confirmPassword){
               //sees that the confirmed password matches the original
	       document.getElementById("passwordsDontMatch").innerHTML = "Passwords do not match";	
          } else {
               //passing all these, username and password are sent to the AJAX method
               document.getElementById("passwordsDontMatch").innerHTML = "";
               addUserToUsers(username, password);
	  }
          
          //after all this, clear input boxes
          document.getElementById("usernameInputBox").value = "";
          document.getElementById("passwordInputBox").value = "";
          document.getElementById("confirmPasswordInputBox").value = "";     
     }

     //the AJAX that sends the username and password to the database
     function addUserToUsers(usname, pwd){
    //creates the XML request
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
        //ensures connectivity to the database
        if (this.readyState == 4 && this.status == 200){
	     if (this.responseText != "User already exists"){
                 //the same actions seen in functions above
	         createUserScreen.style.display = "none";
	         gamemodeScreen.style.display = "block";
	         title.innerHTML = "Welcome, " + usname + " ! Choose gamemode below!";
                 //the JS now knows your username
                 username = usname;
             } else {
                 //this runs if the username already exists in the database
		 document.getElementById("passwordsDontMatch").innerHTML = "User already exists";
             }
             }
         }
         //sends the request to the database, with the variables provided above
         ajax.open("GET", "AddUserToUsers.php?word=" + usname + ";" + pwd);
         ajax.send();
    }

     //go to the choose gamemode page from the login page (the create user page does that by default
     function goToGamemode(username, password){
          //makes sure none of the input boxes is empty
	  if (username == "" || password == ""){
	      document.getElementById("passwordError").innerHTML = "One or more fields was empty";
          } else {
              //again, an AJAX function to log the user in
              loginUser(username, password);
          }
          //clears the input boxes afte user has logged in
          document.getElementById("usernameInputBox").value = "";
          document.getElementById("passwordInputBox").value = "";

     }

     //the AJAX function to log the user in.
     function loginUser(usname, pwd){
     //creates the XML request
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
        //ensures connectivity to the database
        if (this.readyState == 4 && this.status == 200){
	     if (this.responseText == "username not found"){
 	 	 document.getElementById("passwordError").innerHTML = "User does not exist";	         
             } else if (this.responseText == "Password is incorrect"){
		 document.getElementById("passwordError").innerHTML = "Password is incorrect";
 	     } else {
                 //the same actions seen in functions above
		 loginScreen.style.display = "none";
	         gamemodeScreen.style.display = "block";
	         title.innerHTML = "Welcome, " + usname + "! Choose gamemode below!";
                 //the JS now knows your username
                 username = usname;
             }
             }
         }
         //sends the request to the database, with the variables provided above
         ajax.open("GET", "Login.php?word=" + usname + ";" + pwd);
         ajax.send();
    }

     //Takes you to single player mode. The difference between that and guest mode is 
     //that in single player mode you are logged in
     function goToSinglePlayer(){
          //switches the "pages" and changes the title. Your username is used in the title
          gamemodeScreen.style.display = "none";
          gamePage.style.display = "block";
          title.innerHTML = "Welcome " + username + ", have fun!";
     }

     //where the real fun begins. This takes you to a multiplayer waiting room
     function goToMultiplayer(){
          //switches the "pages" and changes the title. 
          gamemodeScreen.style.display = "none";
          waitingRoom.style.display = "block";
          title.innerHTML = "Wait for others to join";
          //an AJAX function to add you to the waiting list 
	  addToWaitingList(username);
          //starts a clock as you wait for an opponent
          waitClock = setInterval(waitForOpponent, 1000);
     }

     //among the simplest of the AJAX functions
     function addToWaitingList(usname){
          //creates the XML request
	  var ajax = new XMLHttpRequest();
	 ajax.onreadystatechange = function() {
              //ensures connectivity to the database
              if (this.readyState == 4 && this.status == 200){
                   //all this function responds with is to add your name to the 
                   //waiting list on the screen
	           document.getElementById("playerList").value = this.response;
	      }
         }
         //sends the request to the database, with the variable provided above
         ajax.open("GET", "WaitingList.php?word=" + usname);
         ajax.send();
     }

      //the timed waiting function
      function waitForOpponent(){
         //each cycle searches for an opponent
         findOpponent(username);
         //these numbers are merely used to modify a label to inform you that you are still waiting
         tw += 1;
         if (tw > 3){
              tw = 1;
         }
     }

     //among the most complicated AJAX functions. It runs each cycle of the waiting clock
     function findOpponent(usname){
          //creates the XML request 
          var ajax = new XMLHttpRequest();
	 ajax.onreadystatechange = function() {
              //ensures connectivity to the database 
              if (this.readyState == 4 && this.status == 200){
                   //if you are still waiting, it just modifies the label based on the numbers seen above
	           if (this.response == "still waiting"){
                        if (tw == 1){
                              document.getElementById("waitingLabel").innerHTML = "Waiting for players to join.";
                        } else if (tw == 2){
			      document.getElementById("waitingLabel").innerHTML = "Waiting for players to join..";
			} else {
			      document.getElementById("waitingLabel").innerHTML = "Waiting for players to join...";	
                        }  

	           } else {
                        //you found an opponent! Again the "pages" change
			waitingRoom.style.display = "none";
        	        gamePage.style.display = "block";
                        //the response sends two separate variables in one string and they must be separated
                        username2 = this.response;
                        //this tells which order you came in. Important for letter distribution
			playerID = Number(username2.slice(-1));
                        //you also have your opponent's username
                        username2 = username2.replace(String(playerID), "");
                        //the title shows both of your names
	                title.innerHTML = username + " vs. " + username2;
                        //hides the link to leave multiplayer; you don't cut out mid-game!
                        document.getElementById("leaveGame").innerHTML = "Leave Multiplayer"; 
                        document.getElementById("leaveGame").style.visibility = "hidden";
                        document.getElementById("startGame").style.visibility = "visible";
                        //the clock stops
	     		clearInterval(waitClock);
                        //clear the playerlist; both players are in!
			document.getElementById("playerList").value = "";
                        //multiplayer is switched on
                        isMultiplayer = true;
                        //both players are directed here
                        startMPGame();
                   }
	      }
         }
         //sends the request to the database, with the variable provided above
         ajax.open("GET", "FindOpp.php?word=" + usname);
         ajax.send();

     }

     //and now, a series of functions for leaving!
     function backToChooseGamemode(){
          //this just takes you back to the choose gamemode page
          gamemodeScreen.style.display = "block";
          waitingRoom.style.display = "none";
          title.innerHTML = "Choose Gamemode";
          //removes your name from the waiting list
          leaveWaitlist(username);
     }

     //the most simple AJAX function
     function leaveWaitlist(usname){
         //creates the XML request 
         var ajax = new XMLHttpRequest();
	 ajax.onreadystatechange = function() {
              //ensures connectivity to the database. This function returns nothing
              if (this.readyState == 4 && this.status == 200){
	          //alert(this.responseText);
	      }
         }
         //sends the request to the database, with the variable provided above
         ajax.open("GET", "LeaveWaitRoom.php?word=" + usname);
         ajax.send();
     }

     //most "leave" functions return you to the intro page
     function logOut(){
          //This removes you from the choose game screen
          gamemodeScreen.style.display = "none";
          openingScreen.style.display = "block";
          title.innerHTML = "You Logged Out";
          //another simple AJAX function that changes your login status. Is used in several places
	  logOutReq(username);
     }

     //another very simple AJAX function
     function logOutReq(usname){
         //creates the XML request 
         var ajax = new XMLHttpRequest();
	 ajax.onreadystatechange = function() {
              //ensures connectivity to the database. This function returns nothing
              if (this.readyState == 4 && this.status == 200){
	          //alert(this.responseText);
	      }
         }
         //sends the request to the database, with the variable provided above
         ajax.open("GET", "Logout.php?word=" + usname);
         ajax.send();
     }

     //since you're not logged in at this point, you just return to the main screen
     function leaveLoginPage(){
	  login.style.display = "none";
          openingScreen.style.display = "block";
          title.innerHTML = "Welcome to Scraggle";
          document.getElementById("usernameInputBox").value = "";
          document.getElementById("passwordInputBox").value = "";
     }

     //again, this just takes you back to the intro screen
     function leaveCreateUserPage(){
          createUserScreen.style.display = "none";
          openingScreen.style.display = "block";
          title.innerHTML = "Welcome to Scraggle";
	  document.getElementById("newUsernameInputBox").value = "";
          document.getElementById("newPasswordInputBox").value = "";
          document.getElementById("confirmPasswordInputBox").value = ""; 
     }

     //a bit more complicated, but will always return you to the intro screen
     function leaveGamePage(){
          //in any case you are returned to the main screen
	  gamePage.style.display = "none";
          openingScreen.style.display = "block";
          //reset timer output
          timer.style.color = "black";
          timer.innerHTML = "3:00";
          for (i = 1; i < 17; i++){
	       document.getElementById("box" + String(i)).innerHTML = "";
          }
          document.getElementById("restartGame").style.visibility = "hidden";
          //reset score
          score = 0;
	  runningScore.innerHTML = "Score: " + String(score);
          //reset wordlist
          wordListArray = [];
          wordListString = "";
          wordList.value = wordListString;
          //clear end of game message
          document.getElementById("invalidWord").innerHTML = null;
          document.getElementById("invalidWord").style.color = "black";
          //clear the invalid word box;
          invalidWordString = "";
          document.getElementById("invalidWords").value = "";
          //reset both related arrays
          scoreArray = [];
          validWordChecker = [];
          document.getElementById("startGame").style.visibility = "visible";
          document.getElementById("restartGame").style.visibility = "hidden";
          if (isMultiplayer == false){
               title.innerHTML = "Welcome to Scraggle";
          } else {
               //resets the multiplayer variables. Add common word list here
               score2 = 0;
               LD = "";
               wordList2Array = [];
               commonWords = [];
               wordList2String = "";
               stringWordListArray = "";
               //also hiding the "leave game" button again
	       document.getElementById("leaveGame").style.visibility = "hidden";
               //if multiplayer, turn multiplayer off, log out, and indicate that you left multiplayer
               isMultiplayer = false;
               logOutReq(username);
               title.innerHTML = "You left Multiplayer";
          }
     }


     //the next several functions detail setting the multiplayer game once both players are in

     //both players are in the game at this point. One will have entered slightly before the other
     function startMPGame(){
          //the first player in generates the letter distribution
          if (playerID == 1){
               //this is akin to the single player function below
               randomRoll(RA);
               for(i = 0; i < 16; i++){
                    randNum = Math.floor(Math.random() * RA.length);
                    randLetter = RA[randNum];
                    LD += randLetter;
                    RA.splice(randNum, 1);
               }
               //the change is that the second player in is still waiting for their letters!
	  sendLetters(LD, username, username2);
          }
          //I tried to set this to only run for player 2, but that didn't work for whatever reason
          //this starts a timer waiting to get the letter distribution
          if (LD == ""){
	       waitClock2 = setInterval(waitForLetters, 100); 
          }
     }

     //the first player in sends this info in. They get the ID of the game they initiated in return
     function sendLetters(lettersString, usname, usname2){
        //creates the XML request 
	var ajax = new XMLHttpRequest();
	 ajax.onreadystatechange = function() {
              //ensures connectivity to the database.
              if (this.readyState == 4 && this.status == 200){
                  GameID = this.responseText;                                 
	      }
         }
         //sends the request to the database, with the variables provided above
         ajax.open("GET", "LetterDistribution.php?word=" + lettersString + ";" + usname + ";" + usname2);
         ajax.send();
     }

     //simply enough, all the timer does is continually run this function until player 2 gets their letters
     function waitForLetters(){
         //only player 2 needs the letters. Player 1 created them
         if (playerID == 2){
	     getLetters(username);
         }
     }

     //more AJAX! this one brings player 2 their letters and the game ID
     function getLetters(usname){
         //creates the XML request 
	var ajax = new XMLHttpRequest();
      	 ajax.onreadystatechange = function() {
              //ensures connectivity to the database.
              if (this.readyState == 4 && this.status == 200){
                  //the PHP either responds "no" or something else
                  if (this.response != "no"){
                      //again, both the letters and the Game ID are sent in the same string
                      //they are then split into their own variables
                      LD1 = this.responseText;
		      LD = LD1.slice(0, 16);
                      LD1 = LD1.replace(LD, "");
                      GameID = Number(LD1);
                      //when the function returns successful, the timer stops
                      clearInterval(waitClock2);
		  }
      	      }
         }
         //sends the request to the database, with the variable provided above
         ajax.open("GET", "GetLetters.php?word=" + usname);
         ajax.send();
     }
     //At this point the letter distribution is in place for both players. The next function runs once they 
     //each individually push the start button. This means that they aren't quite playing at the same time

     function placeLetters(letters) {
         //This is essentially the same code seen below
	 RA = letters.split("");
         for (i = 1; i < 17; i++){
         randLetter = RA[0];
         subb = 9;
         //Q shows up as "QU"
         if (randLetter == "Q"){
               subb = String(subb).fontsize(5);
               document.getElementById("box" + String(i)).innerHTML = "Qu".concat(subb.sub());
         } else {
               //each letter has its own value
                    if (randLetter == "A" || randLetter == "E" || randLetter == "I"
                     || randLetter == "N" || randLetter == "O" || randLetter == "R" 
                     || randLetter == "S" || randLetter == "T"){
                         subb = 1;
                    } else if (randLetter == "D" || randLetter == "G" || randLetter == "L"
                            || randLetter == "U"){
                         subb = 2;
                    } else if (randLetter == "B" || randLetter == "H" || randLetter == "M"
                            || randLetter == "P"){
                         subb = 3;
                    } else if (randLetter == "C" || randLetter == "F" || randLetter == "W"
                            || randLetter == "Y"){
                         subb = 4;
                    } else if (randLetter == "V"){
                         subb = 5;
                    } else if (randLetter == "K"){
                         subb = 6;
                    } else if (randLetter == "X"){
                         subb = 8;
                    } else if (randLetter == "J"){
                         subb = 9;
                    }  else if (randLetter == "Z"){
                         subb = 10;
                    }  
                    //the point value shows up on the cube
                    subb = String(subb).fontsize(5);
                    randLetter = randLetter.concat(subb.sub());
                    //The cube is assigned
                    document.getElementById("box" + String(i)).innerHTML = randLetter;
               }
               //That cube is removed from the array
               RA.splice(0, 1);
               }

     }


     //This function randomizes the letters for each of the cubes
     function randomRoll( letters ){
          for(i = 0; i < 16; i++){
               cube = letterDistribution[i];
               //chooses a random number
               rand = Math.random() * cube.length;
               letter = cube.charAt(Math.floor(rand));
               //adds the random letter to an array
               letters[i] = letter;
          }
          //return the array
          return letters;
     }
     
     //This function randomly places each cube in a spot on the grid
     function randomPlacement( letters ){
          for (i = 1; i < 17;i++){
               randNum = Math.floor(Math.random() * letters.length);
               randLetter = letters[randNum];
               //this is used for the point value. Default is 9 for "QU"
               subb = 9;
               //Q shows up as "QU"
               if (randLetter == "Q"){
                    subb = String(subb).fontsize(5);
                    document.getElementById("box" + String(i)).innerHTML = "Qu".concat(subb.sub());
               } else {
                    //each letter has its own value
                    if (randLetter == "A" || randLetter == "E" || randLetter == "I"
                     || randLetter == "N" || randLetter == "O" || randLetter == "R" 
                     || randLetter == "S" || randLetter == "T"){
                         subb = 1;
                    } else if (randLetter == "D" || randLetter == "G" || randLetter == "L"
                            || randLetter == "U"){
                         subb = 2;
                    } else if (randLetter == "B" || randLetter == "H" || randLetter == "M"
                            || randLetter == "P"){
                         subb = 3;
                    } else if (randLetter == "C" || randLetter == "F" || randLetter == "W"
                            || randLetter == "Y"){
                         subb = 4;
                    } else if (randLetter == "V"){
                         subb = 5;
                    } else if (randLetter == "K"){
                         subb = 6;
                    } else if (randLetter == "X"){
                         subb = 8;
                    } else if (randLetter == "J"){
                         subb = 9;
                    }  else if (randLetter == "Z"){
                         subb = 10;
                    }  
                    //the point value shows up on the cube
                    subb = String(subb).fontsize(5);
                    randLetter = randLetter.concat(subb.sub());
                    //The cube is assigned
                    document.getElementById("box" + String(i)).innerHTML = randLetter;
               }
               //That cube is removed from the array
               letters.splice(randNum, 1);
          }
     }

     //Intiates the timer. Will be connected to a button
     function startTimer(){
	  //The two functions will happen when the game starts
          if (isMultiplayer == false){
     	       randomRoll(RA);
               randomPlacement(RA);  
	  } else {
               //unless it's multiplayer, where the letter distribution is already known
	       placeLetters(LD);
               //if both players start a new game, this interval, set at the end of the game, is cleared
               clearInterval(opponentLeft);
          }   
          clock = setInterval(changeTimer, 1000);
          //these are for restarting the game
          timer.style.color = "black";
          timer.innerHTML = "3:00";
          //and the button disappears
          document.getElementById("startGame").style.visibility = "hidden";
     }

     //A lot goes on here. This resets both single player and multiplayer games!
     function restartTimer(){
          //reset timer output
          timer.style.color = "black";
          timer.innerHTML = "3:00";
          for (i = 1; i < 17; i++){
	       document.getElementById("box" + String(i)).innerHTML = "";
          }
          document.getElementById("restartGame").style.visibility = "hidden";
          //reset score
          score = 0;
	  runningScore.innerHTML = "Score: " + String(score);
          //reset wordlist
          wordListArray = [];
          wordListString = "";
          wordList.value = wordListString;
          //clear end of game message
          document.getElementById("invalidWord").innerHTML = null;
          document.getElementById("invalidWord").style.color = "black";
          //clear the invalid word box;
          invalidWordString = "";
          document.getElementById("invalidWords").value = "";
          //reset both related arrays
          scoreArray = [];
          validWordChecker = [];
          if (isMultiplayer == false){
               //for single player mode the game instantly restarts. Might change that
               clock = setInterval(changeTimer, 1000);
               randomRoll(RA);
               randomPlacement(RA);
          } else {
               //resets the multiplayer variables. Add common word list here
               score2 = 0;
               LD = "";
               wordList2Array = [];
               commonWords = [];
               wordList2String = "";
               stringWordListArray = "";
               startMPGame();
               //and, of course, the original start button actually starts the game!
               document.getElementById("startGame").style.visibility = "visible";
               document.getElementById("restartGame").style.visibility = "hidden";
               //also hiding the "leave game" button again
	       document.getElementById("leaveGame").style.visibility = "hidden";
          }
     }

     //don't question the weird variable names. They work! This is a function that is for 
     //changing a second. The next 2 functions use basically the same code 
     function changeSecond(teim, num){
          //temp. array to hold the innerhtml
          tetArray = [];
          for(i=0; i < teim.length; i++){
               tetArray.push(teim[i]);
          }
          //modifying the array to change the output. 
          //The left number changes for 10second and minute changes
          tetArray.splice(3, 1, num);
          tet2 = "";
          //putting the string back together and returning it
          for(i = 0; i < tetArray.length; i++){
               tet2 = tet2.concat(tetArray[i]);
          }
          return tet2;
     }

     //See above
     function changeTenSecond(teim, num){
          tetArray = [];
          for(i=0; i < teim.length; i++){
               tetArray.push(teim[i]);
          }
          tetArray.splice(2, 1, num);
          tet2 = "";
          for(i = 0; i < tetArray.length; i++){
               tet2 = tet2.concat(tetArray[i]);
          }
          return tet2
     }

     //See above
     function changeMinute(teim, num){
          tetArray = [];
          for(i=0; i < teim.length; i++){
               tetArray.push(teim[i]);
          }
          tetArray.splice(0, 1, num);
          tet2 = "";
          for(i = 0; i < tetArray.length; i++){
               tet2 = tet2.concat(tetArray[i]);
          }
          return tet2;
     }

     //The main timer function. This runs until 3 minutes ar past
     function changeTimer(){
          timerOn = true;
          //for each second t increases
          t+=1; 
          //and ts decreases                 
          ts -= 1;
          
          //will recycle when the second's place hits zero 
          if (ts == -1){
               ts = 9;
          }
          
          //Every 10 second it will decrease the 10second's place by 1
          if (t == 1 || (t - 1) % 10 == 0){
               t10s -= 1;
               //Also to recycle when it hits zero
               if (t10s == -1){
                    t10s = 5;
               }
               //the modification happens
               timer.innerHTML = changeTenSecond(timer.innerHTML, t10s);
          }

          //Same as above, but with minutes. This one doesn't need to recycle at zero!
          if (t == 1 || (t - 1) % 60 == 0){
               tm -= 1;
               timer.innerHTML = changeMinute(timer.innerHTML, tm);
          }

          timer.innerHTML = changeSecond(timer.innerHTML, ts);

          //Indicates that time is low
          if(t > 169){
               timer.style.color = "red";
          }

          //Timer stops!
          if (t == 180){
               clearInterval(clock);
               //things get fun when multiplayer ends!
               if (isMultiplayer == true){
                    //convert your word list to a string
                    for (i = 0; i < wordListArray.length; i++){
			 stringWordListArray += wordListArray[i] + ",";
                    }
		    //send it to the other player to find common words
                    sendList(GameID, username, stringWordListArray);		    
               }
               //reset the timer for next time
               timerOn = false;
               t = 0;
               ts = 0;
               t10s = 6;
               tm = 3;
	       
               //might change this message
               if (isMultiplayer == false){	
                    document.getElementById("invalidWord").innerHTML = "TIME'S UP! Your Score: " + score + " points!";
                    document.getElementById("restartGame").style.visibility = "visible";
               }
          }
          
     }

     //this AJAX transfers your wordlist so that your opponent has it to compare lists and find words in common
     function sendList(GID, usname, words){
         //creates the XML request 
	 var ajax = new XMLHttpRequest();
         ajax.onreadystatechange = function() {
               //ensures connectivity to the database.
               if (this.readyState == 4 && this.status == 200){
                     //again, the response is either "no" or something else
		     if (this.response != "no"){
                           //you get the other player's words, and then a function looks for common words
		           stringWordList2 = this.response;
                           findCommonWords();
                     } else {
                           //otherwise it will start a loop (I tried a timer here, but it didn't work)
			   goAgain();
		     }
               }
          }   
          //sends the request to the database, with the variables provided above
          ajax.open("GET", "WordList.php?word=" + GID + ";"+ usname + ";" + words);
          ajax.send();
     }

     //will keep running until the PHP returns something other than "no"
     function goAgain(){
	  sendList(GameID, username, stringWordListArray);
     }

     //the next step in the word list searching process
     function findCommonWords(){
          //reset the word list box and the score for modification
          wordListString = "";
          score = 0;
          //some nested for loops to separate out your unique words, the words both players found,
          //and the unique words your opponent found
	  wordList2Array = stringWordList2.split(",");
	  for (i = 0; i < wordList2Array.length; i++){
	       for (j = 0; j < wordListArray.length; j++){
		    if (wordList2Array[i] == wordListArray[j]){
	                  commonWords.push(wordListArray[j]);
			  wordListArray.splice(j, 1);
                          scoreArray.splice(j, 1);
                          wordList2Array.splice(i, 1);
                    }
               }
          }
          //change the wordlist box to display its new message 
          wordListString += "Your Words: " + "\r\n";
          //in each case if it finds no words it will say so, and if it does it adds them all to the list
          if (wordListArray.length == 0){
               wordListString += "NO WORDS FOUND!" + "\r\n";
          }
          for (i = 0; i < wordListArray.length; i++){
	       wordListString += wordListArray[i] + "\r\n";
          }
          wordListString += "\r\n";
          wordListString += "Opponent's words: " + "\r\n";
          wordList2Array.splice(-1, 1);
          if (wordList2Array.length == 0){
               wordListString += "NO WORDS FOUND!" + "\r\n";
          }
          for (i = 0; i < wordList2Array.length; i++){
	       wordListString += wordList2Array[i] + "\r\n";
          }
          wordListString += "\r\n";
          wordListString += "Words in Common: " + "\r\n";
          if (commonWords.length == 0){
               wordListString += "NO WORDS FOUND!" + "\r\n";
          }
          for (i = 0; i <commonWords.length; i++){
	       wordListString += commonWords[i] + "\r\n";
          }
          for (i = 0; i <scoreArray.length; i++){
	       score += scoreArray[i];
          }
          //the updated score is shown
          runningScore.innerHTML = "Score: " + String(score);
          wordList.value = wordListString;
          //the final step in the process starts: getting both scores and figuring out which is higher
          calculateFinalScore(GameID, username, score);
     }

     //the function for getting both scores and comparing them to find the winner
     function calculateFinalScore(GID, usname, scor){
         //creates the XML request
         var ajax = new XMLHttpRequest();
         ajax.onreadystatechange = function() {
               //ensures connectivity to the database.
               if (this.readyState == 4 && this.status == 200){
                    //the response from the PHP is either "no" or the other score
		    if (this.response != "no"){
                         score2 = Number(this.response);
                         //an assortment of conditionals to find out whether you won, lost or tied
                         if (score > score2){
                              document.getElementById("invalidWord").style.color = "green";
			      document.getElementById("invalidWord").innerHTML = 
                              "Congratulations! You beat " + username2 + " " + String(score) + " to " + String(score2);
                              //alert(wordList2Array);
                         } else if (score2 > score){
                              document.getElementById("invalidWord").style.color = "red";
			      document.getElementById("invalidWord").innerHTML = 
                              username2 + " beat you " + String(score2) + " to " + String(score) + "! Better luck next time!";
                              //alert(wordList2Array);
                         } else {
                              document.getElementById("invalidWord").innerHTML = 
                              "You and " + username2 + " tied with a score of " + String(score) + " to " + String(score2);
                              //alert(wordList2Array);
			 }
                         //the game is officially over and the scores are in! Now the leave game button is available,
                         //both players can start again, and the timer starts to see if a player leaves
                         document.getElementById("restartGame").style.visibility = "visible";
                         document.getElementById("leaveGame").style.visibility = "visible";
                         playerLeft = setInterval(opponentLeft, 100);
                    } else {
                         //again, if otherwise the function repeats itself
                         goAgain2();
                    }
               }
          }  
          //sends the request to the database, with the variables provided above 
          ajax.open("GET", "WhoWon.php?word=" + GID + ";"+ usname + ";" + scor);
          ajax.send();

     }

     //again, the function repeats itself until it gets a response other than no
     function goAgain2(){
	  calculateFinalScore(GameID, username, score);
     }

     //the function called by the timer, required so that the AJAX can have a parameter passed to it
     function opponentLeft(){
          opponentLeft2(username2);
     }

     //in testing yet; should check the login status of the opponent and if it is 0, then multiplayer ends
     function opponentLeft2(usname2){
         //creates the XML request
         var ajax = new XMLHttpRequest();
         ajax.onreadystatechange = function() {
              //ensures connectivity to the database.
              if (this.readyState == 4 && this.status == 200){
		   if (this.response == "playerLeft"){
                         title.innerHTML = username2 + " left!";
			 document.getElementById("restartGame").style.visibility = "hidden";
                         document.getElementById("startGame").style.visibility = "hidden";
                         clearInterval(playerLeft);
                    } 
               }
          }  
          //sends the request to the database, with the variable provided above  
          ajax.open("GET", "PlayerLeft.php?word=" + usname2);
          ajax.send();

     }

     //occurs when the mouse clicks on a cube
     function startWord(id) {
          if (timerOn == true){
               document.getElementById("invalidWord").innerHTML  = null;
               mouseIsDown = true;
               box = document.getElementById(id);
               //changes the cube's background so you know it's selected
               box.style.backgroundColor = "yellow";
               po = box.innerHTML;
               //the letter is added to the word array, making sure the QU shows up properly
               if(po[0] == "Q"){               
                    word.push("QU");
                    tempScoreIndivid = 9;
                    tempScore1 += tempScoreIndivid;
                    temp1Numbers.push(tempScoreIndivid);
                    cubesInWord.push(id);
               } else if (po[0] == "Z"){
                    word.push("Z");
                    tempScoreIndivid = 10;
                    tempScore1 += tempScoreIndivid;
                    temp1Numbers.push(tempScoreIndivid);
                    cubesInWord.push(id);
               } else {
                    word.push(po[0]);
                    tempScoreIndivid = Number(po[21]);
                    tempScore1 += tempScoreIndivid;
                    temp1Numbers.push(tempScoreIndivid);
                    cubesInWord.push(id);
               } 
          }
     }

     //Occurs when the mouse button is released
	
     function endWord() {
          mouseIsDown = false;
          //all highlighted cubes are unhighlighted
          for (i = 1; i < 17; i++){
              document.getElementById("box" + String(i)).style.backgroundColor = null;
          }
          //The letters in the word array become the word string
          for (i = 0; i < word.length; i++){
               wordFormed = wordFormed.concat(word[i]);
          }

          //Eventual wordchecks against the dictionary and wordlist will come later
          if (wordFormed.length < 3){
               if (wordFormed.length == 0){

               } else {
                    document.getElementById("invalidWord").innerHTML = 
                    "INVALID WORD: word too short. Needs 3 or more letters.";
               }
          } else {
               for (i = 0; i < wordListArray.length; i++){
                    if (wordFormed == wordListArray[i]){
                         duplicate = true;
                    }
               }
               if (duplicate == true){
                    document.getElementById("invalidWord").innerHTML = 
                    "INVALID WORD: Word is already in word list.";
		    
               } else {
                    //The final test
		    wordFormed2 = wordFormed.toLowerCase();
		    testValidity(wordFormed2);
                    //validWordChecker.push(document.getElementById("switch").innerHTML);
                        //Scoring stuff
                        tempScore2 = wordLength(wordFormed);
                    	tempScore = tempScore1 + tempScore2;
			scoreArray.push(tempScore);
                    	score += tempScore;
			runningScore.innerHTML = "Score: " + String(score);

                    	//Add the word to the array
                    	wordListArray.push(wordFormed);

                    	//Add to the string that is the value of the textarea. 
                    	//This will be a single string containing the full word list
                    	wordListString = wordListString.concat(wordFormed + "(" + String(tempScore) + ")" + "\n");

                    	//the word is added to the wordlist
                    	wordList.value = wordListString;
               }
          }
          //the array is cleared for the next word. Other temporary variables reset as well
          word = [];
          cubesInWord = [];
          wordFormed = "";
          duplicate = false;
          tempScore = 0;
          tempScore1 = 0;
          tempScore2 = 0;         
          temp1Numbers = [];
     }

    //the original AJAX function, to check the validity of the word you just made
    function testValidity(str){
    //creates the XML request
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
        //ensures connectivity to the database.
        if (this.readyState == 4 && this.status == 200){
             validWordChecker.push(this.responseText);
             //cycle through the true-false array to find invalid words
		    for (i = 0; i < validWordChecker.length; i++){
		    	if (validWordChecker[i] == 'false'){
		    	    //at this point we know that the matching word is invalid
			    //now we must remove that word from the list, the "false" from that array,
			    //and subtract that score from the overall score
			    invalidWordString = invalidWordString.concat(wordListArray[i] + " ")
			    document.getElementById("invalidWords").value = invalidWordString;
			    wordListArray.splice(i, 1);
			    validWordChecker.splice(i, 1);
			    score -= scoreArray[i];
			    runningScore.innerHTML = "Score: " + String(score);
			    scoreArray.splice(i, 1);
			    wordListString = "";
			    for (j = 0; j < wordListArray.length; j++){
			        wordListString = wordListString.concat(wordListArray[j] + "(" + String(scoreArray[j]) + ")" + "\n");
			    }
			    wordList.value = wordListString;
		        }
	            }
               }

         }
         //sends the request to the database, with the variable provided above
         ajax.open("GET", "DictionaryCheck.php?word=" + str);
         ajax.send();
    }


     //This function is used when the mouse is dragged into other cubes
     function makeWord(id) {
          if (mouseIsDown == true){
               //New movement rules that prevent cheating
               oldId = cubesInWord[cubesInWord.length - 1];
               //Turn the id's of the current and previous cubes into their numbers
               num1 = Number(oldId.substring(3));          
               num2 = Number(id.substring(3));
               //Turn them into row and column ids (see rowcol())
               num1 = RowCol(num1);
               num2 = RowCol(num2);
               //Test the 8 positions that are legal moves
               if(((num1[0] == num2[0]) && (num1[1] == num2[1] - 1)) || ((num1[0] == num2[0]) && (num1[1] - 1 == num2[1])) ||
                    ((num1[0] == num2[0] - 1) && (num1[1] == num2[1])) || ((num1[0] - 1 == num2[0]) && (num1[1] == num2[1])) ||
                    ((num1[0] == num2[0] - 1) && (num1[1] == num2[1] - 1)) || ((num1[0] == num2[0] - 1) && (num1[1] - 1 == num2[1])) || 
                    ((num1[0] - 1 == num2[0]) && (num1[1] - 1 == num2[1])) || ((num1[0] - 1 == num2[0]) && (num1[1] == num2[1] - 1))){
                         //Only then continue
                         for(i = 0; i < cubesInWord.length;i++){
                              temp = cubesInWord[i];
                              //this will run if the same cube is highlighted twice
                              if (id == temp){
                                   //for loop to dehighlight the most recent squares
                                   for(j = (i + 1); j < cubesInWord.length; j++){
                                        temp2 = cubesInWord[j];
                                        temp3 = document.getElementById(temp2);
                                        temp3.style.backgroundColor = null;
                                   }
                                   //remove the unused elements from the arrays
                                   cubesInWord.splice(i+1, cubesInWord.length - i);
                                   word.splice(i+1, word.length - i);
                                   temp1Numbers.splice(i+1, temp1Numbers.length - i);
                                   tempScore1 = 0;
                                   for(k = 0; k < temp1Numbers.length; k++){
                                        tempScore1 += temp1Numbers[k];
                                   }
                                   //indicate that a repeat has occured
                                   repeat = true;
                              }
                         }
                         box = document.getElementById(id);
                         //each new cube is highlighted
                         box.style.backgroundColor = "yellow" ;
                         po = box.innerHTML;
    
                     //this exists to make sure a letter isn't entered twice after a repeat
                         if (repeat == false){
                              //add each letter to the array
                              if(po[0] == "Q"){
                                   word.push("QU");
                                   tempScoreIndivid = 9;
                                   tempScore1 += tempScoreIndivid;
                                   temp1Numbers.push(tempScoreIndivid);
                                   cubesInWord.push(id);                                   
                              } else if (po[0] == "Z"){
                                   word.push("Z");
                                   tempScoreIndivid = 10;
                                   tempScore1 += tempScoreIndivid;
                                   temp1Numbers.push(tempScoreIndivid);
                                   cubesInWord.push(id);
                              } else {
                                   word.push(po[0]);
                                   tempScoreIndivid = Number(po[21]);
                                   tempScore1 += tempScoreIndivid;
                                   temp1Numbers.push(tempScoreIndivid);
                                   cubesInWord.push(id);
                              }     
                         }
                         repeat = false;
                    } else {
                         
               }   
          }
     }

     //this function determines the score from the length of the word
     function wordLength(word){
          sc0re = 0;        
          if ((word.length == 3) || (word.length == 4)){              
               sc0re = 1;
          } else if (word.length == 5){
               sc0re = 2;
          } else if (word.length == 6){
               sc0re = 3;
          } else if (word.length == 7){
               sc0re = 5;
          } else if (word.length >= 8){
               sc0re = 11;
          }
          return sc0re;
     }

     //Takes a boxID number and converts it into a row and column id
     //The left number is row, and the right one is column
     function RowCol(num){
          switch(num){
               case 1:
                    num = "00";
                    break;
               case 2:
                    num = "01";
                    break;
               case 3:
                    num = "02";                                       
                    break;
               case 4:
                    num = "03";                                        
                    break; 
               case 5:
                    num = "10";
                    break;
               case 6:
                    num = "11";
                    break;
               case 7:
                    num = "12";                                        
                    break;
               case 8:
                    num = "13";                                        
                    break;
               case 9:
                    num = "20";
                    break;
               case 10:
                    num = "21";
                    break;
               case 11:
                    num = "22";                                        
                    break;
               case 12:
                    num = "23";                                       
                    break; 
               case 13:
                    num = "30";
                    break;
               case 14:
                    num = "31";
                    break;
               case 15:
                    num = "32";                                        
                    break;
               case 16:
                    num = "33";                                        
                    break;                   

          }
          return num;
     }


     //This is all code for typing, which is still in the works
     //Waits for a key to be pressed in the input box
     document.getElementById("typeWord").addEventListener("keydown", KeyAction);

     //this is the function that detects whether or not a key has been pressed
     function KeyAction(e){
 
	  //The event listener gets the key code of the key. This returns the identity of the key.
	  //letters just return their letters, while other necessary keys e.g. enter return null.
	  //defaults to null (Other nonnecessary keys you might tap e.g. { or ;)
          switch(e.keyCode) {
               case 8: letterTyped = ""; break;
               case 13: letterTyped = ""; break;
               case 65: letterTyped = "A"; break;
               case 66: letterTyped = "B"; break;
               case 67: letterTyped = "C"; break;
               case 68: letterTyped = "D"; break;
               case 69: letterTyped = "E"; break;
               case 70: letterTyped = "F"; break;
               case 71: letterTyped = "G"; break;
               case 72: letterTyped = "H"; break;
               case 73: letterTyped = "I"; break;
               case 74: letterTyped = "J"; break;
               case 75: letterTyped = "K"; break;
               case 76: letterTyped = "L"; break;
               case 77: letterTyped = "M"; break;
               case 78: letterTyped = "N"; break;
               case 79: letterTyped = "O"; break;
               case 80: letterTyped = "P"; break;
               case 81: letterTyped = "Q"; break;
               case 82: letterTyped = "R"; break;
               case 83: letterTyped = "S"; break;
               case 84: letterTyped = "T"; break;
               case 85: letterTyped = "U"; break;
               case 86: letterTyped = "V"; break;
               case 87: letterTyped = "W"; break;
               case 88: letterTyped = "X"; break;
               case 89: letterTyped = "Y"; break;
               case 90: letterTyped = "Z"; break;
	       default: letterTyped = "";

          }
          
          for(i = 1; i < 17; i++){
               if(letterTyped == document.getElementById("box" + String(i)).innerHTML[0]){
                    RepeatedLetters.push("box" + String(i));                                             
               }
          }
          
          if (RepeatedLetters.length >= 1){
               switch (RepeatedLetters.length) {
                    case 2:                                               
                         Occurrence1.push(RepeatedLetters[0]);                       
                         OccurrenceArray.push(Occurrence1); 
                         Occurrence2.push(RepeatedLetters[1]); 
                         OccurrenceArray.push(Occurrence2);                                                      
                         break; 
                    case 3:
                         Occurrence1.push(RepeatedLetters[0]);
                         OccurrenceArray.push(Occurrence1);
                         Occurrence2.push(RepeatedLetters[1]);
                         OccurrenceArray.push(Occurrence2);
                         Occurrence3.push(RepeatedLetters[2]);  
                         OccurrenceArray.push(Occurrence3);
                         break;
                    case 4:
                         Occurrence1.push(RepeatedLetters[0]);
                         OccurrenceArray.push(Occurrence1);
                         Occurrence2.push(RepeatedLetters[1]);
                         OccurrenceArray.push(Occurrence2);
                         Occurrence3.push(RepeatedLetters[2]);
                         OccurrenceArray.push(Occurrence3);
                         Occurrence4.push(RepeatedLetters[3]);
                         OccurrenceArray.push(Occurrence4); 
                         break; 
                    //The likelihood of 5+ of any one letter in a grid is very rare, 
                    //but it is a possibility and all that code must be included     
                    case 5:
			 Occurrence1.push(RepeatedLetters[0]);
                         OccurrenceArray.push(Occurrence1);
                         Occurrence2.push(RepeatedLetters[1]);
                         OccurrenceArray.push(Occurrence2);
                         Occurrence3.push(RepeatedLetters[2]);
                         OccurrenceArray.push(Occurrence3);
                         Occurrence4.push(RepeatedLetters[3]);
                         OccurrenceArray.push(Occurrence4);
			 Occurrence5.push(RepeatedLetters[4]);
                         OccurrenceArray.push(Occurrence5);
                         break; 
                    case 6:
			 Occurrence1.push(RepeatedLetters[0]);
                         OccurrenceArray.push(Occurrence1);
                         Occurrence2.push(RepeatedLetters[1]);
                         OccurrenceArray.push(Occurrence2);
                         Occurrence3.push(RepeatedLetters[2]);
                         OccurrenceArray.push(Occurrence3);
                         Occurrence4.push(RepeatedLetters[3]);
                         OccurrenceArray.push(Occurrence4);
			 Occurrence5.push(RepeatedLetters[4]);
                         OccurrenceArray.push(Occurrence5);
			 Occurrence6.push(RepeatedLetters[5]);
                         OccurrenceArray.push(Occurrence6);
                         break;
                    case 7:
			 Occurrence1.push(RepeatedLetters[0]);
                         OccurrenceArray.push(Occurrence1);
                         Occurrence2.push(RepeatedLetters[1]);
                         OccurrenceArray.push(Occurrence2);
                         Occurrence3.push(RepeatedLetters[2]);
                         OccurrenceArray.push(Occurrence3);
                         Occurrence4.push(RepeatedLetters[3]);
                         OccurrenceArray.push(Occurrence4);
			 Occurrence5.push(RepeatedLetters[4]);
                         OccurrenceArray.push(Occurrence5);
			 Occurrence6.push(RepeatedLetters[5]);
                         OccurrenceArray.push(Occurrence6);
			 Occurrence7.push(RepeatedLetters[6]);
                         OccurrenceArray.push(Occurrence7);
                         break;
                    case 8:
			 Occurrence1.push(RepeatedLetters[0]);
                         OccurrenceArray.push(Occurrence1);
                         Occurrence2.push(RepeatedLetters[1]);
                         OccurrenceArray.push(Occurrence2);
                         Occurrence3.push(RepeatedLetters[2]);
                         OccurrenceArray.push(Occurrence3);
                         Occurrence4.push(RepeatedLetters[3]);
                         OccurrenceArray.push(Occurrence4);
			 Occurrence5.push(RepeatedLetters[4]);
                         OccurrenceArray.push(Occurrence5);
			 Occurrence6.push(RepeatedLetters[5]);
                         OccurrenceArray.push(Occurrence6);
			 Occurrence7.push(RepeatedLetters[6]);
                         OccurrenceArray.push(Occurrence7);
			 Occurrence8.push(RepeatedLetters[7]);
                         OccurrenceArray.push(Occurrence8);
                         break;
                    case 9:
                         //Yes, there is an astronomically small chance of rolling 9 Es! 
			 Occurrence1.push(RepeatedLetters[0]);
                         OccurrenceArray.push(Occurrence1);
                         Occurrence2.push(RepeatedLetters[1]);
                         OccurrenceArray.push(Occurrence2);
                         Occurrence3.push(RepeatedLetters[2]);
                         OccurrenceArray.push(Occurrence3);
                         Occurrence4.push(RepeatedLetters[3]);
                         OccurrenceArray.push(Occurrence4);
			 Occurrence5.push(RepeatedLetters[4]);
                         OccurrenceArray.push(Occurrence5);
			 Occurrence6.push(RepeatedLetters[5]);
                         OccurrenceArray.push(Occurrence6);
			 Occurrence7.push(RepeatedLetters[6]);
                         OccurrenceArray.push(Occurrence7);
			 Occurrence8.push(RepeatedLetters[7]);
                         OccurrenceArray.push(Occurrence8);
			 Occurrence9.push(RepeatedLetters[8]);
                         OccurrenceArray.push(Occurrence9);
                         break;                                 
                    default:
                         Occurrence1.push(RepeatedLetters[0]);
                         OccurrenceArray.push(Occurrence1);                         
               }
               //should always highlight the first occurance of a word path if multiple exist
	       for (i = 0; i < Occurence1.length; i++){
                    cubesInWord.push(Occurrence1[i]);
                    RepeatedLetters = []; 
               }
          } else {
	       //should no case be true, then the letter wasn't in the grid and therefore the word is invalid
	       isInGrid = false;
          }

               Occurrence1.push(RepeatedLetters[0]);
               if(Occurrence1.length > 1){
                    box1 = Occurrence1[Occurrence1.length - 1];
                    box2 = Occurrence1[Occurrence1.length - 2];
                    num1 = Number(box1.substring(3));
                    num2 = Number(box2.substring(3));
                    num1 = RowCol(num1);
                    num2 = RowCol(num2);
                    //alert(num1)
                    //alert(num2)
                    if(((num1[0] == num2[0]) && (num1[1] == num2[1] - 1)) || ((num1[0] == num2[0]) && (num1[1] - 1 == num2[1])) ||
                         ((num1[0] == num2[0] - 1) && (num1[1] == num2[1])) || ((num1[0] - 1 == num2[0]) && (num1[1] == num2[1])) ||
                         ((num1[0] == num2[0] - 1) && (num1[1] == num2[1] - 1)) || ((num1[0] == num2[0] - 1) && (num1[1] - 1 == num2[1])) || 
                         ((num1[0] - 1 == num2[0]) && (num1[1] - 1 == num2[1])) || ((num1[0] - 1 == num2[0]) && (num1[1] == num2[1] - 1))){
                              //alert("connected")
                    } else {
                         //alert("not connected")
                    }
               }     
               OccurrenceArray.push(Occurrence1);
               cubesInWord.push(Occurrence1[0]);
               RepeatedLetters = [];   
          //alert(Occurrence1)
                      

          /*if(num == j+1 || num == j+3 || num == j+4 || num == j+5 ||
               num == j-1 || num == j-3 || num == j-4 || num == j-5){  
            } else {
                 for (i = 0; i < cubesInWord.length; i++){
                      document.getElementById(cubesInWord[i]).style.backgroundColor = null
                 }
                 cubesInWord = []
                 word = []
                 
            }*/
          if(cubesInWord.length == 1){
               keyId = cubesInWord[0];
               document.getElementById(keyId).style.backgroundColor = "yellow";
               po = document.getElementById(keyId).innerHTML;
               word.push(po[0]);
          } else if(cubesInWord.length > 1){
               for (i = 0; i < cubesInWord.length; i++){
                    document.getElementById(keyId).style.backgroundColor = "yellow";
               }
                po = document.getElementById(keyId).innerHTML;
               word.push(po[0]);
          }
                    //alert(word)
               
          
          
          if(e.keyCode == 8 && cubesInWord.length > 0){
               //alert(cubesInWord[cubesInWord.length - 1])
               document.getElementById(cubesInWord[cubesInWord.length - 1]).style.backgroundColor = null
               cubesInWord.splice(cubesInWord.length - 1, 1);
               word.splice(word.length - 1, 1);
          }

          if(e.keyCode == 13){
	       if (isInGrid == true){
                    for(i = 0; i < word.length; i++){
                         wordFormed = wordFormed.concat(word[i]);
                    }
                    wordListArray.push(wordFormed);
                    wordListString = wordListString.concat(wordFormed);
                    wordListString = wordListString.concat("\n");
                    wordList.value = wordListString;
                    TypeBox.value = "";
                    for(i = 0; i < cubesInWord.length; i++){
                         document.getElementById(cubesInWord[i]).style.backgroundColor = null;
                    }
                    word = [];
                    cubesInWord = [];
                    RepeatedLetters = [];
                    wordFormed = "";
	       } else {
                    document.getElementById("invalidWord").innerHTML = 
                    "INVALID WORD: Word does not exist in grid"
                    for(i = 0; i < cubesInWord.length; i++){
                         document.getElementById(cubesInWord[i]).style.backgroundColor = null;
                    }
                    word = [];
                    cubesInWord = [];
                    RepeatedLetters = [];
                    wordFormed = "";
                    isInGrid = true;
               }
          }

          
          //"a-z" == 65-90
          //Enter == 13; backspace == 8     
     }
     //relics of old attempts at word formation

      /*
      document.getElementById("box1").onmouseup = function() {
          document.getElementById("box1").style.backgroundColor = null
     }
          
     document.getElementById("box1").onmouseenter= function() {
          document.getElementById("box1").style.backgroundColor = "yellow"
     }    */


   

    
 
     //Credits:
     
     // Letter distribution source: https://boardgames.stackexchange.com/questions/29264/boggle-what-is-the-dice-configuration-for-boggle-in-various-languages 
     // Potential Dictionary: https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt 
     // Many thanks to w3schools for providing much help for html, CSS and javascript info
     //https://www.tutorialspoint.com/flask/index.htm
     //https://mail.python.org/pipermail/tutor/2002-May/014665.html

  

