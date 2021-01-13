/* eslint-disable no-trailing-spaces */
/* eslint-disable indent */
'use strict';

module.exports = function(Auth) {
    Auth.sum = function(num1, num2, cb) {
        let sum = num1 + num2;
        cb(null, sum);
      }
  
      Auth.remoteMethod('sum', {
            accepts: [{arg: 'num1', type: 'number'}, {arg: 'num2', type: 'number'}],
            returns: {arg: 'sum', type: 'number'},
            http: {verb: 'post', path: '/sum'}
      });
};
