/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';
require('dotenv').config();
var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res, next){
      MongoClient.connect(MONGODB_CONNECTION, function(err,db){
        if(err) return next(err);
        db.collection('project-library')
          .find({})
          .toArray((err,books)=>{
            if(err) return next(err);
            for (let index in books) {
              books[index]["commentcount"] = books[index]["comment"].length;
              delete books[index]["comment"];
            }
            res.json(books);
            db.close();
          })
      })
    })

    .post(function (req, res, next){
      var title = req.body.title;
      if (title === '') {
        return res.send('No book title provided')
      } else {
        const data = {
          _id : new ObjectId,
          title: title,
          comment: [],
        };
        MongoClient.connect(MONGODB_CONNECTION, function(err,db){
          if (err) return next(err);
          db.collection('project-library').insertOne(data, (err,doc)=>{
            if(err) return next(err);
            res.json(doc.ops[0]);
            db.close();
          })
        })
      }
      //response will contain new book object including atleast _id and title
    })

    .delete(function(req, res, next){
      MongoClient.connect(MONGODB_CONNECTION, function(err,db){
        if(err) return next(err);
        db.collection('project-library')
          .deleteMany({}, function(err, obj) {
            if(err) return next(err);
            res.send("complete delete successful");
            console.log("complete delete successful");
            db.close();
          })
      })
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res, next){
      var bookid = req.params.id;
      MongoClient.connect(MONGODB_CONNECTION, function(err,db){
        if(err) return next(err);
        db.collection('project-library')
          .find({_id: ObjectId(bookid)})
          .toArray((err,books)=>{
            if(err) return next(err);
            console.log(books)
            if (books.length === 0) {
              return res.send("no book exists");
            } else {
              res.json(books[0]);
            }
            db.close();
          })
      })
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(function(req, res, next){
      var bookid = req.params.id;
      var comment = req.body.comment;
      MongoClient.connect(MONGODB_CONNECTION, function(err,db){
        if(err) return next(err);
        db.collection('project-library')
          .findAndModify(
            {_id: ObjectId(bookid)}, //query
            {}, //sort
            {$push:{comment: comment}}, //update
            {new: true}, //option
            (err, doc) => {
              res.json(doc.value);
              db.close();
            }
          )
      })
      //json res format same as .get
    })

    .delete(function(req, res, next){
      var bookid = req.params.id;
      MongoClient.connect(MONGODB_CONNECTION, function(err,db){
        if(err) return next(err);
        db.collection('project-library')
          .deleteOne({_id: ObjectId(bookid)}, function(err, obj) {
            if(err) return next(err);
            res.send("delete successful");
            console.log("delete successful");
            db.close();
          })
      })
      //if successful response will be 'delete successful'
    });

};
