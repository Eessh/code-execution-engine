const {
  compileC,
  compileCPP,
  compileRS
} = require("./compile");
const {
  compileAndRunC,
  compileAndRunCPP,
  runPY,
  compileAndRunRS
} = require("./compile_n_run");
const genUUID = require("./uuid");

module.exports = {
  compileC,
  compileCPP,
  compileRS,
  compileAndRunC,
  compileAndRunCPP,
  runPY,
  compileAndRunRS,
  genUUID
};