'use strict';

var utils = require('../utils/writer.js');
var Default = require('../service/DefaultService');

module.exports.webhookPOST = function webhookPOST (req, res, next) {
  var transaction = req.swagger.params['transaction'].value;
  Default.webhookPOST(transaction)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
