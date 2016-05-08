var should = require('should');
var assert = require('assert');
var request = require('supertest');
var dbutils = require('../lib/db.js');

/*
Signals look like this:
  {
     "eventName": "Large meteor strikes the moon",
     "instancedata": "This one weighed more than 16 megatons!!"
  }
*/

module.exports = function () {
    describe('Signal tests', function () {
        var url = 'http://localhost:3000';

        //Create events
        describe('Signals', function () {

            //Subscribe to events first.
            it('should successfully create new subscription', function (done) {
                var subscr = {
                    eventName: "MayDay",
                    endpointType: "EMAIL",
                    endpointName: "",
                    endpoint: 'leewaygroups@gmail.com'
                };

                request(url)
                    .post('/events/subscribe/')
                    .send(subscr)
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        res.should.have.status(200);
                        done();
                    });
            });

            it('should successfully create another new subscription', function (done) {
                var subscr = {
                    eventName: "StackOverflow",
                    endpointType: "EMAIL",
                    endpointName: "",
                    endpoint: 'leewaygroups@gmail.com'
                };

                request(url)
                    .post('/events/subscribe/')
                    .send(subscr)
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        res.should.have.status(200);
                        done();
                    });
            });
        
            //Signal tests
            //
            it('should signal one event', function (done) {
                var signal = {
                    eventName: 'MayDay',
                    instancedata: 'MayDay MayDay! Please call 911'
                };

                request(url)
                    .post('/signal')
                    .send(signal)
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        res.should.have.status(200);
                        eventsArray = JSON.parse(res.text);
                        assert.equal(eventsArray.processed, true);
                        assert.equal(eventsArray.signal.eventName, 'MayDay');
                        assert.equal(eventsArray.signal.instancedata, signal.instancedata);

                        done();
                    });
            });

            //Event signal log tests
            //
            it('should retreive an array of log entry', function (done) {
                request(url)
                    .get('/signals/logs')
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        res.should.have.status(200);
                        done();
                    });
            });


        });
    });
}