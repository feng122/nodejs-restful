// serverjs

// [LOAD PACKAGES]
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');

require('./config/globals');

// [ CONFIGURE mongoose ]

// CONNECT TO MONGODB SERVER
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function () {
  // CONNECTED TO MONGODB SERVER
  console.log("Connected to mongod server");
});

mongoose.connect('mongodb://localhost/soopin');

// DEFINE MODEL
var User = require('./models/user');
var Story = require('./models/story');

// [CONFIGURE APP TO USE bodyParser]
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// [CONFIGURE SERVER PORT]

var port = process.env.PORT || 8080;

// [CONFIGURE ROUTER]
var routerUser = require('./routes/user')(app, User);
var routerStory = require('./routes/story')(app, Story, User);
var routerFileUpload = require('./routes/upload')(app);

// [RUN SERVER]
var server = app.listen(port, function () {
  console.log("Express server has started on port " + port)
});