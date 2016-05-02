var express = require('express');
var event = require('./routes/events');
var signal = require('./routes/signals');

//var port = (process.env.PORT || 3000);
var port = (process.env.VCAP_APP_PORT || 3000);

var app = express();
 
app.configure(function () {
    app.use(express.logger('dev')); 
    app.use(express.bodyParser());
});
 
console.log ('registering event routes with express');
app.get('/events', event.findAll);
app.get('/events/:id', event.findById);
app.get('/events/:name', event.findByName);
app.post('/events', event.registerEvent);
app.put('/events/:id', event.updateEvent);
app.delete('/events/:id', event.deleteEvent);

console.log ('registering subscription routes with express');
app.get('/events/:name/subscriptions/', event.eventSubscriptions);
app.get('/events/:name/subscribe/', event.subscribe);
app.get('/events/:name/unsubscribe/', event.subscribe);
 
console.log ('registering signal routes with express');
app.post('/signals', signal.processSignal);
app.get('/signals', signal.getAllSignalLogs);
app.get('/signals/:eventName', signal.getEventSignalLogs)

console.log ('About to start listening');
app.listen(port);
console.log('Listening on port: ', port);