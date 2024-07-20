import { readFileSync } from "fs";
import { NlpManager } from "node-nlp";
import path from "path";

export const modalFilePath = path.join(
  path.resolve(),
  "/training_models/model.nlp"
);

// Initializing the NlpManager
export const manager = new NlpManager({
  languages: ["en"],
  modelFileName: modalFilePath,
});

// Loading and saving the model
export const trainAndSaveModel = async () => {
  try {
    // Loading the training dataset
    const sampleData = JSON.parse(
      readFileSync(
        path.join(path.resolve(), "/training_models/training_data.json"),
        "utf-8"
      )
    );

    // Adding questions with intents
    sampleData.documents.forEach((data) => {
      manager.addDocument("en", data.text, data.intent);
    });

    // Adding answers for responding to particular intents
    sampleData.answers.forEach((data) => {
      manager.addAnswer("en", data.intent, data.answer);
    });

    // Training the model
    await manager.train();

    // Saving the model in above specified path
    await manager.save(modalFilePath);
  } catch (err) {
    // Handling the errors while training and saving the model
    console.log("Error occured while training the model!", err?.message);
  }
};
