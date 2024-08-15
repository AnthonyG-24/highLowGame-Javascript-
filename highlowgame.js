const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");
require("dotenv").config();

const accountID = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = new twilio(accountID, authToken);
const MessagingResponse = require("twilio").twiml.MessagingResponse;

// Variables:
function random() {
  return Math.floor(Math.random() * 10 + 1);
}

var myNum = random();
var attempts = 0;
let gameData = {};
//

let app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.post("/sms", function (request, response) {
  const twiml = new MessagingResponse();
  const incomingMsg = request.body.Body.toLowerCase();

  gameData[request.body.From] = {
    myNum: 0,
    attempts: 0,
  };

  const start = () => twiml.message("Guess a number between 1 to 10");

  const checkGuessedCorrect = () => {
    if (incomingMsg == myNum) {
      return "correct";
    }

    if (incomingMsg > myNum) {
      return "to high";
    }

    if (incomingMsg < myNum) {
      return "to low";
    }

    if (incomingMsg < 1) {
      return "Way too low";
    }

    if (incomingMsg > 10) {
      return "Way too high";
    }
  };

  const numOfAttempts = () => {
    attempts++;
    twiml.message("Number of attempts: " + attempts);
  };

  const userInput = checkGuessedCorrect();

  start();
  if (userInput === "correct") {
    twiml.message("Correct!!");
    numOfAttempts();
  } else if (userInput === "to high") {
    twiml.message("Too high, try again!");
    numOfAttempts();
  } else if (userInput === "to low") {
    twiml.message("Too low, try again!");
    numOfAttempts();
  } else {
    twiml.message("Try again.");
    numOfAttempts();
  }

  response.writeHead(200, { "Content-Type": "text/xml" });
  response.end(twiml.toString());
});

app.listen(7000, () => {
  console.log("Server is running on port 7000");
});
