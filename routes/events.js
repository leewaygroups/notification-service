var mongo = require('mongodb');
var BSON = mongo.BSONPure;

var dbutils = require('../lib/dbutils');
var mongoUri = dbutils.mongoUri;
var eventTypes = require('../lib/eventTypes');

/*
Events look like this in JSON

  {
    "_id": "353dfg34334bbnm34545345",
    "eventName": "CUSTOMER.SERVICE.New_Tecket",
    "eventType": "EventTypes.SYSTEM_NOTIFICATION"
    "eventSource": ['App.CustomerService']
  }

*/

exports.addEvent = function(req, res) {
  var event = req.body;

  mongo.Db.connect(mongoUri, function (err, db) {
    db.collection('events', function(er, collection) {
      collection.insert(event, {safe:true}, function(err, result) {
        res.send(result[0]);
        db.close();
      });
    });
  });
}

exports.updateEvent = function(req, res) {
  var id = req.params.id;
  var event = req.body;

  mongo.Db.connect(mongoUri, function (err, db) {
    db.collection('events', function(err, collection) {
      collection.update({'_id':new BSON.ObjectID(id)}, event, {safe:true}, function(err, result) {
        res.send(event);
        db.close();
      });
    });
  });
}
 
exports.deleteEvent = function(req, res) {
  var id = req.params.id;

  mongo.Db.connect(mongoUri, function (err, db) {
    db.collection('events', function(err, collection) {
      collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
        res.send(req.body);
        db.close();
      });
    });
  });
}

exports.findById = function(req, res) {
  var id = req.params.id;

  mongo.Db.connect(mongoUri, function (err, db) {
    db.collection('events', function(err, collection) {
      collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
        res.send(item);
        db.close();
      });
    });
  });
}

 
exports.findAll = function(req, res) {

  mongo.Db.connect(mongoUri, function (err, db) {
    db.collection('events', function(er, collection) {
      collection.find().toArray(function(err, items) {
        res.send(items);
        db.close();
      });
    });
  });
}
 