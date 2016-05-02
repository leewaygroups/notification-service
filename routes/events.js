var eventManager = require('../lib/db');
var eventTypes = require('../lib/eventTypes');

/** ****************************************
 * All routes return a promise.
 * 
event object:
{
"_id": "353dfg34334bbnm34545345",
"eventName": "CUSTOMER.SERVICE.New_Tecket",
"eventType": "EventTypes.SYSTEM_NOTIFICATION"
"eventSource": ['App.CustomerService']
}

sample subscription objects:
{
    "endpointType": "EMAIL",
    "endpoints": [addr1, addr2, ...];
},
{
    "endpointType": "API",
    "endpoints": [api1, api2, ...];
}
********************************************/
exports.registerEvent = function (req, res) {
    var event = req.body;
    eventManager.register(event).then(function(result){
        res.send(result);
    });
};

exports.updateEvent = function (req, res) {
    var id = req.params.id;
    var event = req.body;
    eventManager.update(event, id).then(function(result){
        res.send(result);
    });
};

exports.deleteEvent = function (req, res) {
    var id = req.params.id;
    eventManager.delete(id).then(function(result){
        res.send(result);
    });
};

exports.findById = function (req, res) {
    var id = req.params.id;
    eventManager.findById(id).then(function(result){
        res.send(result);
    });
};

exports.findAll = function (req, res) {
    eventManager.findAll().then(function(result){
        res.send(result);
    });
};

exports.findByName = function (req, res) {
    var name = req.params.name;
    eventManager.findByName(name).then(function(result){
        res.send(result);
    });
};

exports.eventSubscriptions = function(req, res){
    var name = req.params.name;
    eventManager.subsriptions(name).then(function(result){
        res.send(result);
    });
}

exports.subscribe = function (req, res) {
    var name = req.params.name;
    var subcr = req.body.subcr;
    eventManager.subscribe(name, subcr).then(function(result){
        res.send(result);
    });
};

exports.unsubscribe = function(req, res){
    var name = req.params.name;
    var subcr = req.body.subcr;
    eventManager.subscribe(name, subcr).then(function(result){
        res.send(result);
    });
};