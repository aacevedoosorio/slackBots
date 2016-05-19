/**
 * @param {Router} router
 * @returns {Router}
 * @constructor
 */
function UsersController(router) {
  var self = this;
  self.router = router;

  /* GET users listing. */
  self.router.get('/', function(req, res, next) {
    res.send('respond with a resource 1');
  });

  return self.router;
}

module.exports = UsersController;
