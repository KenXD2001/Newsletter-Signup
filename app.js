// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https"); // Include the 'https' module
const request = require("request");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;

    console.log(firstName, lastName, email);
    
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/41431e6035";

    const options = {
        method: "POST",
        auth: "ashwin:58657dc852f1e0ee48d27a0c00f2e1b8-us21"
    };

    // Use the 'https' module to make the request
    const request = https.request(url, options, function(response) {

        if (response.statusCode == 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        
        response.on("data", function(data) {
            console.log(JSON.parse(data));
        });
    });

    // Write the JSON data to the request
    request.write(jsonData);

    // End the request
    request.end();
});

app.post("/failure", function(req, res) {
    res.redirect("/")
})

app.listen(3000, function() {
    console.log("Server is running on port 3000");
});


//API Key
// 58657dc852f1e0ee48d27a0c00f2e1b8-us21

// List Id
// 41431e6035