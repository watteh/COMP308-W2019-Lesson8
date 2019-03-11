let express = require('express');
let router = express.Router();

let jwt = require('jsonwebtoken');


// create a reference to the db schema
let contactModel = require('../models/contact');

module.exports.displayContactList = (req, res, next) => {
    contactModel.find((err, contactList) => {
        if (err) {
            return console.error(err);
        } else {
            return res.json({
                success: true,
                msg: 'Contact List Displayed Successfully',
                contactList: contactList,
                user: req.user
            });
        }
    });
}

module.exports.displayAddPage = (req, res, next) => {
    res.json({
        success: true,
        msg: 'Successfully displayed Add Page'
    });
}

module.exports.addContact = (req, res, next) => {
    let newContact = contactModel({
        "firstName": req.body.firstName,
        "lastName": req.body.lastName,
        "age": req.body.age
    });

    contactModel.create(newContact, (err, contactModel) => {
        if (err) {
            console.log(err);
            res.end(err);
        } else {
            // Refresh contact list
            res.json({
                success: true,
                msg: 'Successfully added new contact!'
            });
        }
    });
}

module.exports.displayContact = (req, res, next) => {
    let id = req.params.id;
    contactModel.findById(id, (err, contactObject) => {
        if (err) {
            console.log(err);
            res.end(err);
        } else {
            // show the edit view
            res.json({
                success: true,
                msg: 'Successfully displayed contact to edit',
                contact: contactObject
            });
        }
    });
}

module.exports.updateContact = (req, res, next) => {
    let id = req.params.id;

    let updatedContact = contactModel({
        "_id": id,
        "firstName": req.body.firstName,
        "lastName": req.body.lastName,
        "age": req.body.age
    });

    contactModel.update({ _id: id }, updatedContact, (err) => {
        if (err) {
            console.log(err);
            res.end(err);
        } else {
            // Refresh contact list
            res.json({
                success: true,
                msg: 'Successfully edited contact',
                contact: updatedContact
            });
        }
    });
}

module.exports.deleteContact = (req, res, next) => {
    let id = req.params.id;

    contactModel.remove({ _id: id }, (err) => {
        if (err) {
            console.log(err);
            res.end(err);
        } else {
            return res.json({
                success: true,
                msg: 'Successfully deleted contact'
            });
        }
    });
}