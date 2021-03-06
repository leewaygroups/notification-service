var should = require('should');
var assert = require('assert');
var request = require('supertest');
var dbutils = require('../lib/db.js');
 
/*
sample subscription objects:

{
    "_id": "521a5af259b05b8099000002"
    "eventName": "Mew"
    "endpointType": "EMAIL",
    "endpointName": "",
    "endpoint": addr1;
},
{
    "_id": "521a5af259b05b8099000002"
    "eventName": "BlaBla"
    "endpointType": "API",
    "endpointName": "slack",
    "endpoint": api;
}

*/

module.exports = function () {
    describe('Subscription tests', function () {
        var url = 'http://localhost:3000';

        //Subscribe test
        //
        describe('Subscription', function () {
            it('should successfully create a new subscription in "MayDay" event', function (done) {
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

            it('should successfully create even another new subscription', function (done) {
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

            //Get event subscriptions tests
            //
            it('should return one subscription', function (done) {
                request(url)
                    .get('/events/' + 'MayDay' + '/subscriptions/')
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        res.should.have.status(200);
                        res.body.should.have.lengthOf(1);
                        subsArray = JSON.parse(res.text);
                        assert.equal(subsArray[0].eventName, 'MayDay');
                        assert.equal(subsArray[0].endpoint, 'leewaygroups@gmail.com');
                        assert.equal(subsArray[0].endpointType, 'EMAIL');
                        done();
                    });
            });

            it('should return one subscription', function (done) {
                request(url)
                    .get('/events/' + 'StackOverflow' + '/subscriptions/')
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        res.should.have.status(200);
                        res.body.should.have.lengthOf(1);
                        subsArray = JSON.parse(res.text);
                        assert.equal(subsArray[0].eventName, 'StackOverflow');
                        assert.equal(subsArray[0].endpoint, 'leewaygroups@gmail.com');
                        assert.equal(subsArray[0].endpointType, 'EMAIL');
                        done();
                    });
            });


            //Unsubscribe test
            //

            it('should successfully unsubscribe from "MayDay" event', function (done) {
                var subscr = {
                    eventName: "MayDay",
                    endpointType: "EMAIL",
                    endpoint: 'leewaygroups@gmail.com'
                };
                request(url)
                    .post('/events/' + 'MayDay' + '/unsubscribe/')
                    .send(subscr)
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        res.should.have.status(200);
                        done();
                    });
            });

            it('should return one subscriptions', function (done) {
                request(url)
                    .get('/events/' + 'MayDay' + '/subscriptions/')
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        res.should.have.status(200);
                        res.body.should.have.lengthOf(0);
                        done();
                    });
            });
        });
    });
}