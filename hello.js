var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var mongoose = require('mongoose');
mongoose.connect('mongodb://192.168.2.10:27017/student');

var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  create_date : {type:Date}
});

var User = mongoose.model('User', userSchema);


app.get('/users', function (req, res) {
    User.find({}, null, function (err, users) {
      res.send( users );
    });
})

app.post('/user', function (req, res) {       
    var newUser = User({
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
      create_date:req.body.create_date
    });
   
    newUser.save(function(err) {
      if (err) res.send(err);  
      res.send({
        'msg': 'User created!'
      });
  });
});

app.get('/users/:id', function (req, res) {
    var userid = req.params.id;
    User.findById(userid, null, function (err, user) {
      res.send( user );
    });
});

app.put('/users/:id', function (req, res) {
    var userId = req.params.id;
    User.findById(userId, null, function (err, user) {
      user.name     = req.body.name,
      user.username = req.body.username,
      user.password = req.body.password    
   
      user.save(function(err) {
        if (err) res.send(err);   
          res.send({
            'msg': 'User updated!'
          });
      });
    });
});

app.delete('/users/:id', function (req, res) {
  var userId = req.params.id;
  User.findByIdAndRemove(userId, function(err) {
    if (err) res.send(err);   
      res.send({
       'msg': 'User deleted!'
      });
  });
});

var server = app.listen(8081, function () {
  console.log("Example app listening on port: 8081")
});
