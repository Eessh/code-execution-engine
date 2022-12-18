const fs = require("fs");
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const runPY = async (code, input, folderPath) => {
  try {
    fs.writeFileSync(`${folderPath}/code.py`, code);
  }
  catch(err) {
    console.log(`Error while saving code to file: ${folderPath}/code.py, Error: ${err}`);
    return {
      code,
      input,
      output: {
        error: `Error while saving code to file: ${folderPath}/code.py, Error: ${err}`,
        stdout: "",
        stderr: ""
      }
    };
  }
  try {
    const {stdout, stderr} = await exec(`timeout 2 python3 ${folderPath}/code.py < ${folderPath}/input.txt`);
    return {
      code,
      input,
      output: {
        error: "",
        stdout: stdout,
        stderr: stderr
      }
    };
  }
  catch (err) {
    console.log("Error while running: ", err);
    return {
      code,
      input,
      output: {
        error: err,
        stdout: "",
        stderr: ""
      }
    };
  }
};

module.exports = runPY;