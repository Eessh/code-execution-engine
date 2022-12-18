const fs = require("fs")
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const compileCPP = async (code, folderPath) => {
  try {
    fs.writeFileSync(`${folderPath}/code.cpp`, code);
  }
  catch(err) {
    console.log(`Error while saving code to file: ${folderPath}/code.cpp, Error: ${err}`);
    return null;
  }
  try {
    const {stdout, stderr} = await exec(`g++ ${folderPath}/code.cpp -o ${folderPath}/code`);
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
    console.log("Error while compiling code: ", err);
    return {
      code,
      output: {
        error: err,
        stdout: "",
        stderr: ""
      }
    }
  }
};

module.exports = compileCPP;