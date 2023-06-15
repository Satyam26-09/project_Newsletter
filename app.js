const express = require("express");
const request = require("request");
const bodyParesr = require("body-parser");
const https = require("https");
require("dotenv").config();

const app = express();
app.use(express.static("public"));
app.use(bodyParesr.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/",function(req,res){
    const fName = req.body.FirstName;
    const lName = req.body.LastName;
    const email = req.body.Email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName,
                }
            }
        ]
    }

    app.post("/fail",function(req,res){
        res.redirect("/")
    });

    const api = process.env.API_KEY;
    const id = process.env.LIST_ID;
    const jsonData = JSON.stringify(data);
    const url = "https://us13.api.mailchimp.com/3.0/lists/"+id;
    const options = {
        method: "POST",
        auth: "Satyam_888:"+api
    }
    const request = https.request(url,options,function(response){
        response.on("data",function(data){
            console.log(response.statusCode);
            if(response.statusCode===200)
                res.sendFile(__dirname + "/success.html");
            else
            res.sendFile(__dirname + "/failure.html");
            const da = JSON.parse(jsonData);
            console.log(da);
        
        })
    })
    request.write(jsonData);
    request.end();
});

app.listen(process.env.PORT || 3000,function(){
    console.log("listening");
});