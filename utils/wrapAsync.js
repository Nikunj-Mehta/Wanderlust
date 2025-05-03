function wrapAsync(fn) {
  return function(req, res, next) {
    fn(req, res, next).catch(next); // catch(next) = agar koi error occur krta hai to uss error liyea next call ho jye. next(err) will call error handling middleware. 
  }
}

module.exports = wrapAsync;
