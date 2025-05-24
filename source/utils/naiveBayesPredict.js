const bayes = require("bayes");
const read_write = require("./read_write");

// Load trained model and predict if message is spam
module.exports = async (message) => {
  try {
    // Load the trained model
    const modelData = await read_write("NB_training.json", 0);

    if (!modelData || !modelData.model) {
      console.log("No trained model found");
      return { prediction: "unknown", confidence: 0 };
    }

    // Create classifier from saved model
    const NB = bayes.fromJson(modelData.model);

    // Get prediction
    const prediction = await NB.categorize(message);

    return { prediction, confidence: 1 }; // bayes doesn't provide confidence scores
  } catch (error) {
    console.error("Error in spam detection:", error);
    return { prediction: "error", confidence: 0 };
  }
};
