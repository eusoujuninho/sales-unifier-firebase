'use strict';


/**
 * Create a transaction via webhook
 * Create a new transaction based on the data received from a webhook call.
 *
 * transaction Transaction Transaction data received from the webhook.
 * no response value expected for this operation
 **/
exports.webhookPOST = function(transaction) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

