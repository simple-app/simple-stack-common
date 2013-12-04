/**
 * Module dependencies
 */
var app = require('./app');
var should = require('should');
var supertest = require('supertest');

describe('simple-stack-common', function() {

  it('should start a server', function(done) {
    supertest(app)
      .get('/')
      .end(function(err, res) {
        if (err) return done(err);
        if (!res.ok) return done(new Error(res.text));
        res.text.should.eql('it works');
        done();
      });
  });

  it('should handle errors', function(done) {
    supertest(app)
      .get('/error')
      .expect(501, done);
  });

});
