/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  var id;
  var title = "FCC Test";
  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {

    suite('POST /api/books with title => create book object/expect book object', function() {

      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({title: title})
          .end(function(err,res){
            id = res.body._id;
            assert.equal(res.status, 200);
            assert.equal(res.body.title, title);
            done();
          })
      });

      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({title:""})
          .end(function(err,res){
            assert.equal(res.status, 200);
            assert.equal(res.text, 'No book title provided');
            done();
          })
      });

    });


    suite('GET /api/books => array of books', function(){

      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end(function(err,res){
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], '_id');
            assert.property(res.body[0], 'title');
            assert.property(res.body[0], 'commentcount');
            done();
          })
      });
    });


    suite('GET /api/books/[id] => book object with [id]', function(){

      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get('/api/books/5eb90d213b0a802080440126')
          .end(function(err,res){
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });

      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get('/api/books/5eb90cb7e0ea4a1feea90e66')
          .end(function(err,res){
            assert.equal(res.status, 200);
            assert.equal(res.body.title, 'harry potter');
            assert.equal(res.body._id, '5eb90cb7e0ea4a1feea90e66');
            assert.equal(res.body.comment[0], 'comment test');
            assert.isArray(res.body.comment);
            done();
          });
      });

    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){

      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post('/api/books/' + id)
          .send({comment: 'comment test'})
          .end(function(err,res){
            assert.equal(res.status, 200);
            assert.equal(res.body._id, id);
            assert.equal(res.body.title, title);
            assert.equal(res.body.comment, 'comment test');
            done();
          })
      });

    });

  });

});
