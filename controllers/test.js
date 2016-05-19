/**
 * @param {Router} router
 * @returns {Router}
 * @constructor
 */
function TestController(router) {
  var self = this;
  self.router = router;

  /* GET test listing. */
  self.router.get('/', function(req, res, next) {
    res.send('respond with a test');
  });

  return self.router;
}

module.exports = TestController;
