/**
 * @param {Router} router
 * @returns {Router}
 * @constructor
 */
function HomeController(router) {
  var self = this;
  self.router = router;

  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.send("This is my index");
  });

  return self.router;
}

module.exports = HomeController;
