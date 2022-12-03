const express = require("express");
//const bodyParser = require("body-parser"); //body-parser is depricated https://www.folkstalk.com/2022/09/body-parser-deprecated-bodyparser-with-code-examples.html
const request = require("request");
const https = require("https");
require("dotenv").config();

const app = express();

app.use(express.static(__dirname));
app.use(express.urlencoded({extended: true})); //instead of app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json());

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const eMail = req.body.eMail;

  const data = {
    members: [
      {
        email_address: eMail,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);
  const listId = process.env.LIST_ID;
  const apiKey = process.env.API_KEY;

  const url = "https://us21.api.mailchimp.com/3.0/lists/" + listId;

  const options = {
    method: "POST",
    auth: "mairi:" + apiKey
  };

  const request = https.request(url, options, function(response){

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    }else{
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();

});

app.post("/failure.html", function(req, res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
  console.log("I'm listening, my darling.");
});
