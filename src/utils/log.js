class Log {
  info(msg) {
    console.log(msg);
  }
  success(msg) {
    console.log(`[success] ${msg}`);
  }
  error(msg) {
    console.log(`[error] ${msg}`);
  }
}
module.exports = {
  log: new Log()
};
