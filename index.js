var express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
app.use(bodyParser.json());

const uri = `mongodb+srv://vivekuser:vivekadmin@cluster0-mfrcr.mongodb.net/shorturl02?retryWrites=true&w=majority`;

app.post("/register",function(req,res) {
    var email = req.body.email;
    var fname = req.body.fname;
    var lname = req.body.lname;
    var pass = req.body.pass;
    var type = req.body.type;

    console.log(req.body);

    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(function(err,db){
        if(err) throw err;
        var dbObject = db.db("crmdb");
       

    });


});

