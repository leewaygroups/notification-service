var should = require('should');
var assert = require('assert');
var request = require('supertest');
var dbutils = require('../lib/db');
var newsFlash6id;

describe('Routing', function () {
    var url = 'http://localhost:3000';

    before(function (done) {
        dbutils.cleardb(function () {
            done();
        });
    });

    //Create tests
    //eventName: String,
    //eventType: String,
    //subscriptions: [] 
    
    describe('Event', function () {
        it('should successfully create a new event', function (done) {
            var event = {
                eventName: 'May Day',
                eventType: 'Emergency'
            };
            request(url)
                .post('/events')
                .send(event)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.status(200);
                    done();
                });
        });

         it('should successfully create another new event', function(done) {
             var event = {
                eventName: 'ID10T',
                eventType: 'NoBrainer'
            };
          request(url)
          .post('/events')
          .send(event)
          .end(function(err, res) {
                if (err) {
                  throw err;
                }
                res.should.have.status(200);
                done();
              });
          });
      
           it('should successfully create even another new event', function(done) {
             var event = {
                eventName: 'StackOverflow',
                eventType: 'OutOfSpace'
            };
          request(url)
          .post('/events')
          .send(event)
          .end(function(err, res) {
                if (err) {
                  throw err;
                }
                res.should.have.status(200);
                done();
              });
          });
      
          //Read tests
          //
         it('should return three events', function(done) {
          request(url)
          .get('/events')
          .end(function(err, res) {
                if (err) {
                  throw err;
                }
                res.should.have.status(200);
                res.body.should.have.lengthOf(3);
                var eventsArray = JSON.parse(res.text);
                assert.equal(eventsArray[0].eventName, 'May Day');
                assert.equal(eventsArray[1].eventName, 'ID10T');
                assert.equal(eventsArray[2].eventName, 'StackOverflow');
                done();
              });
          });
      
          it('should return ID10T event', function(done) {
          request(url)
          .get('/events/'+ 'ID10T')
          .end(function(err, res) {
                if (err) {
                  throw err;
                }
                res.should.have.status(200);
                res.body.should.have.property('eventName');
                res.body.eventName.should.equal('ID10T');
                done();
              });
          });
      
          //Update Tests
          //
      
           it('should successfully update a specific event', function(done) {
             var event = {
                eventName: 'Classic ID10T',
                eventType: 'NoBrainer'
            };
          request(url)
          .put('/events/'+ 'ID10T')
          .send(event)
          .end(function(err, res) {
                if (err) {
                  throw err;
                }
                res.should.have.status(200);
                res.body.eventName.should.equal('Classic ID10T')
                done();
              });
          });
      
          it('should verify updated event', function(done) {
          request(url)
          .get('/events/'+ 'Classic ID10T')
          .end(function(err, res) {
                if (err) {
                  throw err;
                }
                res.should.have.status(200);
                res.body.should.have.property('eventName');
                res.body.eventName.should.equal('Classic ID10T');
                done();
              });
          });
      
          //Delete tests
          //
          it('should delete Classic ID10T event', function(done) {
          request(url)
          .del('/events/'+ 'Classic ID10T')
          .end(function(err, res) {
                if (err) {
                  throw err;
                }
                res.should.have.status(200);
                done();
              });
          });
      
         it('should now return two events', function(done) {
          request(url)
          .get('/events')
          .end(function(err, res) {
                if (err) {
                  throw err;
                }
                res.should.have.status(200);
                res.body.should.have.lengthOf(2);
                eventsArray = JSON.parse(res.text);
                assert.equal(eventsArray[0].eventName, 'May Day');
                assert.equal(eventsArray[1].eventName, 'StackOverflow');
                done();
              });
          });


    });
});