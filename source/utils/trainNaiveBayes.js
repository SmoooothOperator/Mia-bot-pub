const bayes = require("bayes");
const read_write = require("./read_write");

// Train the NB with sample data and save model
module.exports = async (data, type) => {
  try {
    // Load existing model if it exists
    let existing_model = await read_write("NB_training.json", 0);
    let NB;

    if (existing_model && existing_model.model) {
      // Load existing model
      NB = bayes.fromJson(existing_model.model);
    } else {
      // Create new model
      NB = bayes();
    }

    // Train with new data
    await NB.learn(data, type);

    // Save the updated model
    const jsonModel = NB.toJson();
    const modelData = {
      model: jsonModel,
      lastUpdated: new Date().toISOString(),
      trainingCount: (existing_model?.trainingCount || 0) + 1,
    };

    // Write data to json
    await read_write("NB_training.json", 1, modelData);

    return true;
  } catch (error) {
    console.error("Error training Naive Bayes:", error);
    return false;
  }
};
