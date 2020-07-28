var express = require('express');
var router = express.Router();

//dotenv import
const dotenv = require('dotenv');
dotenv.config();

//mongodb imports
let mongodb = require('mongodb');
let MongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectID;
let dbURL = process.env.dbURL;

//middleware imports
let authenticate = require('../../middlewares/authentication.js');
let accessVerification = require('../../middlewares/accessVerification.js');

// deletecontact route.
router.delete('/', [authenticate, accessVerification("delete")], async(req, res) => {
    let { contactId } = req.body;
    if (contactId === undefined) {
        res.status(400).json({
            message: 'Required Fields missing'
        });
    } else {
        let client = await mongodb.connect(dbURL).catch(err => { throw err });
        let db = client.db('crm');
        contactId = new ObjectId(contactId);
        delete req.body.contactId;
        await db.collection('contacts').deleteOne({ "_id": contactId }).catch(err => { throw err });
        client.close();
        res.status(200).json({
            message: 'Contact deleted'
        });
    }
});

module.exports = router;