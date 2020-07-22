var express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
let http = require('http').Server(app);
app.use(bodyParser.json());

const uri = `mongodb+srv://vivekuser:vivekadmin@cluster0-mfrcr.mongodb.net/shorturl02?retryWrites=true&w=majority`;

const port = process.env.PORT || 3000;


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

app.post("/login", function (req, res) {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    if (req.body.email == undefined || req.body.pass == undefined) {
        res.status(400).json({
            message: "E-mail or password missing"
        })
    }
    else{
        client.connect(function(err,client){
            if (err) throw err;
            var dbObject = db.db("crmdb");
            db.collection("users").findOne({ email: req.body.email }, (err, data) => {
                if (err) throw err;
                if(data){
                    bcrypt.compare(req.body.password, data.password, function(err, result){ 
                        if (result) {
                            client.close();
                            res.status(200).json({
                                message: "login successfull"
                            })
                        } else {
                            client.close();
                            res.status(401).json({
                                message: "password incorrect"
                            })
                        }

                    });
                }else {
                    client.close();
                    res.status(400).json({
                        "message": "user not found"
                    })
                }
            })
        })
    }    
});

app.post('/create', function (req, res, next) {
    client.connect(err => {
      const customers = client.db("crmdb").collection("customers");
      
      let customer = { name: req.body.name, address: req.body.address, telephone: req.body.telephone, note: req.body.note };
      customers.insertOne(customer, function(err, res) {
        if (err) throw err;
        console.log("1 customer inserted");
      });
    })
    res.send('Customer created');
  })

  app.get('/get-client', function (req, res) {
    client.connect(err => {
        client.db("crmdb").collection("customers").findOne({name: req.query.name}, function(err, result) {
          if (err) throw err;
          res.render('update', {oldname: result.name, oldaddress: result.address, oldtelephone: result.telephone, oldnote: result.note, name: result.name, address: result.address, telephone: result.telephone, note: result.note});
        });
      });
});


app.post('/update', function(req, res) {
    client.connect(err => {
      if (err) throw err;
      let query = { name: req.body.oldname, address: req.body.oldaddress, telephone: req.body.oldtelephone, note: req.body.oldnote };
      let newvalues = { $set: {name: req.body.name, address: req.body.address, telephone: req.body.telephone, note: req.body.note } };
      client.db("crmdb").collection("customers").updateOne(query, newvalues, function(err, result) {
          if (err) throw err;
          console.log("1 document updated");
          res.render('update', {message: 'Customer updated!', oldname: req.body.name, oldaddress: req.body.address, oldtelephone: req.body.telephone, oldnote: req.body.note, name: req.body.name, address: req.body.address, telephone: req.body.telephone, note: req.body.note});
        });
    });
  })
  
  app.post('/delete', function(req, res) {
    client.connect(err => {
      if (err) throw err;
      let query = { name: req.body.name, address: req.body.address ? req.body.address : null, telephone: req.body.telephone ? req.body.telephone : null, note: req.body.note ? req.body.note : null };
      client.db("crmdb").collection("customers").deleteOne(query, function(err, obj) {
        if (err) throw err;
        console.log("1 document deleted");
        res.send(`Customer ${req.body.name} deleted`);
      });
    });
  })

app.listen(port, () => {
    console.log("app listing in port " + port);
  });