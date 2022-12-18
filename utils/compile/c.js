const fs = require("fs")
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const compileC = async (code, folderPath) => {
  try {
    fs.writeFileSync(`${folderPath}/code.c`, code);
  }
  catch(err) {
    console.log(`Error while saving code to file: ${folderPath}/code.c, Error: ${err}`);
    return {
      code,
      output: {
        error: `Error while saving code to file: ${folderPath}/code.c, Error: ${err}`,
        stdout: "",
        stderr: ""
      }
    };
  }
  try {
    const {stdout, stderr} = await exec(`gcc ${folderPath}/code.c -o ${folderPath}/code`);
    return {
      code,
      output: {
        error: "",
        stdout: stdout,
        stderr: stderr
      }
    };
  }
  catch(err) {
    console.log("Error while compiling: ", err);
    return {
      code,
      output: {
        error: err,
        stdout: "",
        stderr: ""
      }
    };
  }
};

module.exports = compileC;