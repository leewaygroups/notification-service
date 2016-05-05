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

console.log('registering event routes with express');
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/events', event.findAll);
app.post('/events', event.registerEvent);
app.get('/events/:name', event.findByName);
app.put('/events/:name', event.updateEvent);
app.delete('/events/:name', event.deleteEvent);

console.log('registering subscription routes with express');
app.get('/events/:name/subscriptions/', event.eventSubscriptions);
app.get('/events/:name/subscribe/', event.subscribe);
app.get('/events/:name/unsubscribe/', event.subscribe);

console.log('registering signal routes with express');
app.post('/signals', signal.processSignal);
app.get('/signals', signal.getAllSignalLogs);
app.get('/signals/:eventName', signal.getEventSignalLogs)

console.log('About to start listening');
app.listen(port);
console.log('Listening on port: ', port);