const verifyNaiveBayes = require("../../utils/verifyNaiveBayes");

/* This file attaches the verifyNaiveBayes function to the reaction watcher*/
module.exports = async (client, reaction, user) => {
  await verifyNaiveBayes(client, reaction, user);
};
