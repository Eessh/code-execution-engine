const fs = require("fs");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const compileAndRunC = async (code, input, folderPath) => {
  try {
    fs.writeFileSync(`${folderPath}/code.c`, code);
  }
  catch(err) {
    console.log(`Error while saving code to file: ${folderPath}/code.c, Error: ${err}`);
    return {
      code,
      input,
      output: {
        error: `Error while saving code to file: ${folderPath}/code.c, Error: ${err}`,
        stdout: "",
        stderr: ""
      }
    };
  }
  try {
    const {stdout, stderr} = await exec(`timeout 2 gcc ${folderPath}/code.c -o ${folderPath}/code && ${folderPath}/code < ${folderPath}/input.txt`);
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
  catch(err) {
    console.log("Error while compiling and executing: ", err);
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

module.exports = compileAndRunC;