module.exports = function (app, User) {
  // get all users
  app.get('/api/users/list', function (req, res) {
    User.find(function (err, users) {
      if (err) return res.status(500).send({error: 'database failure'});
      res.json(users);
    })
  });

  // get an user
  app.get('/api/users/list/:user_id', function (req, res) {
    User.findOne({_id: req.params.user_id}, function (err, user) {
      if (err) return res.status(500).json({error: err});
      if (!user) return res.status(404).json({error: 'user not found'});
      res.json(user);
    })
  });

  // login user by username and password
  app.post('/api/users/login', function (req, res) {
    User.findOne({user_name: req.body.user_name, password: req.body.password}, function (err, user) {
      if (_.isNull(user)) {
        return res.status(404).json({result: 0});
      }

      if (err) {
        return res.status(500).json({result: 0});
      }
      if (_.isUndefined(user)) {
        return res.status(404).json({result: 0});
      }

      var result = {result: 1, user_id: user._id};
      console.log(result, user);
      res.json(result);
    })
  });

  // add user
  app.post('/api/users/add', function (req, res) {
    var user = new User();
    user.user_name = req.body.user_name;
    user.password = req.body.password;
    user.phone_number = req.body.phone_number;
    user.city_name = req.body.city_name;
    user.town_name = req.body.town_name;
    user.photo_url = req.body.photo_url;
    user.welcome_message = req.body.welcome_message;
    if (!_.isUndefined(req.body.created_date)) {
      user.created_date = new Date(req.body.created_date);
    }
    User.findOne({user_name: user.user_name, password: user.password}, function (err, user_one) {
      if (!_.isNull(user_one)) {
        return res.json({result: 0, reason: 'user found'});
      }

      user.save(function (err, user) {
        if (err) {
          console.error(err);
          res.json({result: 0});
          return;
        }

        res.json({result: 1, user_id: user._id});
      });
    })
  });

  // update user by user id
  app.put('/api/users/update/:user_id', function (req, res) {
    var userId = req.params.user_id;
    User.update({_id: userId}, {$set: req.body}, function (err, output) {
      if (err) {
        res.status(500).json({result: 0, reason: 'database failure'});
      }

      if (!output.n) {
        return res.status(404).json({result: 0, reason: 'user not found'});
      }

      res.json({result: 1, user_id: userId}); // {message: 'user updated'};
    })
  });

  // reset(update) a password by user name and phone number
  app.post('/api/users/password_reset', function (req, res) {
    var user_name = req.body.user_name;
    var phone_number = req.body.phone_number;
    var password = req.body.password;

    User.findOne({user_name: user_name, phone_number: phone_number}, function (err, user) {
      if (_.isNull(user)) {
        return res.json({result: 0, reason: 'user not found'});
      }
      var userId = user._id;

      User.update({user_name: user_name}, {$set: {password: password}}, function (err, output) {
        if (err) {
          return res.json({result: 0, reason: err});
        }

        res.json({result: 1, user_id: userId});
      });
    })
  });

  // change(update) a password by username, current password and new password
  app.post('/api/users/password_change', function (req, res) {
    var user_name = req.body.user_name;
    var current_password = req.body.current_password;
    var new_password = req.body.new_password;

    User.findOne({user_name: user_name, password: current_password}, function (err, user) {
      if (_.isNull(user)) {
        return res.json({result: 0, reason: 'user not found'});
      }
      var userId = user._id;

      User.update({user_name: user_name}, {$set: {password: new_password}}, function (err, output) {
        if (err) {
          res.json({result: 0, reason: err});
          return;
        }

        res.json({result: 1, user_id: userId});
      });
    })
  });

  // delete an user by user_id
  app.delete('/api/users/delete/:user_id', function (req, res) {
    User.remove({_id: req.params.user_id}, function (err, output) {
      if (err) return res.status(500).json({error: "database failure"});

      res.status(204).end();
    })
  });
}
