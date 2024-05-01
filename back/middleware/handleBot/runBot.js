const axios = require("axios");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { exec } = require("child_process");
const uuid = require("uuid");

// Function to download a file
const downloadFile = async (url, filename) => {
  const response = await axios({
    method: "GET",
    url: url,
    responseType: "stream",
  });

  const writer = fs.createWriteStream(filename);

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};

function runBot(scriptUrl, configFileUrl) {
  return new Promise(async (resolve, reject) => {
    // Paths to the temporary files
    const uniqueId = uuid.v4();
    const scriptPath = path.join(os.tmpdir(), `script_${uniqueId}.py`);
    const configFilePath = path.join(os.tmpdir(), `config_${uniqueId}.ini`);

    try {
      // Download the Python script and the config file
      await Promise.all([
        downloadFile(scriptUrl, scriptPath),
        downloadFile(configFileUrl, configFilePath),
      ]);

      // Run the Python script with the config file as a command-line argument
      exec(
        `python ${scriptPath} ${configFilePath}`,
        (error, stdout, stderr) => {
          // Delete the temporary files
          fs.unlinkSync(scriptPath);
          fs.unlinkSync(configFilePath);

          if (error) {
            console.error(`Error executing script: ${error}`);
            reject(error);
            return;
          }

          console.log(`Script output: ${stdout}`);
          resolve(stdout);
        }
      );
    } catch (error) {
      console.error(`Error downloading files: ${error}`);
      reject(error);
    }
  });
}

module.exports = runBot;
