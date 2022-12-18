const fs = require("fs");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const compileAndRunCPP = async (code, input, folderPath) => {
  try {
    fs.writeFileSync(`${folderPath}/code.cpp`, code);
  }
  catch(err) {
    console.log(`Error while saving code to file: ${folderPath}/code.cpp, Error: ${err}`);
    return {
      code,
      input,
      output: {
        error: `Error while saving code to file: ${folderPath}/code.cpp, Error: ${err}`,
        stdout: "",
        stderr: ""
      }
    };
  }
  try {
    const {stdout, stderr} = await exec(`timeout 2 g++ ${folderPath}/code.cpp -o ${folderPath}/code && ${folderPath}/code < ${folderPath}/input.txt`);
    return {
      code,
      input,
      output: {
        erorr: "",
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

module.exports = compileAndRunCPP;