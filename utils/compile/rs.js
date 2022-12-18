const fs = require("fs")
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const compileRS = async (code, folderPath) => {
  try {
    fs.writeFileSync(`${folderPath}/code.rs`, code);
  }
  catch(err) {
    console.log(`Error while saving code to file: ${folderPath}/code.rs, Error: ${err}`);
    return {
      code,
      output: {
        error: `Error while saving code to file: ${folderPath}/code.rs, Error: ${err}`,
        stdout: "",
        stderr: ""
      }
    };
  }
  try {
    const {stdout, stderr} = await exec(`rustc ${folderPath}/code.rs -o ${folderPath}/code`);
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
    };
  }
};

module.exports = compileRS;