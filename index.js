var express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
app.use(bodyParser.json());

const uri = `mongodb+srv://vivekuser:vivekadmin@cluster0-mfrcr.mongodb.net/shorturl02?retryWrites=true&w=majority`;




app.post("/register", function (req, res) {
    var email = req.body.email;
    var fname = req.body.fname;
    var lname = req.body.lname;
    var pass = req.body.pass;
    var type = req.body.type;

    console.log(req.body);

    const client = new MongoClient(uri, { useNewUrlParser: true });

    client.connect(function (err, db) {
        if (err) throw err;

        var dbObject = db.db("crmdb");

        dbObject.collection("register").find({ email: email }).toArray(function (err, data) {
            if (err) throw err;
            if (data.length > 0) {
                console.log("Present");
                res.status(400).send("Email already Registered !");
            }
            else {
                console.log("Not Present");
                bcrypt.hash(pass, 10, function (err, hash) {
                    var testObj = { email: email, pass: hash, fname:fname,lname:lname,type:type ,role: "User" };
                    console.log(testObj);
                    dbObject.collection("register").insertOne(testObj, function (err, resp) {
                        if (err) throw err;
                        db.close();
                    });
                });
            }
        })
    });
});

