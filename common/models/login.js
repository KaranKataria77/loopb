/* eslint-disable no-redeclare */
/* eslint-disable space-before-function-paren */
/* eslint-disable space-infix-ops */
/* eslint-disable max-len */
/* eslint-disable comma-dangle */
/* eslint-disable quotes */
/* eslint-disable object-curly-spacing */
/* eslint-disable camelcase */
/* eslint-disable semi */
/* eslint-disable no-undef */
/* eslint-disable indent */
'use strict';
var txtlocal = require('../../server/textlocal-config.json');
var request = require('request');

module.exports = function(Login) {
    Login.signup = function(data, cb) {
        Login.create({email: data.email, password: data.password, phone: data.phone}, function(error, user) {
            if (error) {
                console.log(error)
            }
            var otp = Math.floor(100000 + Math.random() * 900000);
            var apiKey = encodeURIComponent(txtlocal.apiKey);
              var username = encodeURIComponent(txtlocal.username);
              var hash = encodeURIComponent(txtlocal.hash);
              var number = encodeURIComponent(user.mobile);
              var message = encodeURIComponent(txtlocal.sendOTP.replace("@@@OTP@@@", otp));
              var sender = encodeURIComponent(txtlocal.senderId);
              var uri = "username="+username+"&hash="+hash+"&numbers="+number+"&message="+message+"&sender="+sender;
              var uri = "apikey=" + apiKey + "&numbers=" + number + "&sender=" + sender + "&message=" + message;

              request("http://api.textlocal.in/send/?" + uri, function (error, response, body) {
                if (error) {
                  console.log(error);
                } else {
                  console.log(body);
                }
              });
              var password = Login.hashPassword(otp.toString());

              Login.updateAll({ "email": user.username, "mobile": user.mobile }, { "password": password }, function (err, data) {
                if (err) {
                  console.log("Error on updating the otp as password !", err);
                  cb(null, err);
                } else {
                  console.log(data.count + " User password updated successfully !");

                  var response = {};
                  response.statusCode = 200;
                  response.code = "OK";
                  response.role = "collaborator";
                  response.otp = otp.toString();

                  cb(null, response);
                }
              });
              user.save();
        })
          cb(null, response);
    }
    Login.remoteMethod('signup', {
          description: "Send otp to given number",
          accepts: { arg: "data", type: "object", required: true, http: {source: "body"}},
          returns: { arg: "response", type: "object", root: "true", http: {source: "body"}},
          http: {verb: 'post', path: '/signup'}
    });

    Login.login = function(data, cb) {
          Login.findOne({"where": {email: data.email}}, function(error, user) {
                if (error) {
                      console.log(error)
                }
                const secret = console.log(user)
                cb(null, secret)
          })
    };
    Login.remoteMethod('login', {
          description: "login route",
          accepts: { arg: "data", type: "object", required: true, http: {source: "body"}},
          returns: {arg: "response", type: "object", root: "true", http: {source: "body"}},
          http: {verb: 'post', path: '/login'}
    })
};
