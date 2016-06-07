/**
 * @param {Router} router
 * @param {RtmClient} RtmClient
 * @param {slackClient} slackClient
 *
 * @returns {Router}
 * @constructor
 */
function TestController(router, RtmClient, slackClient) {
  var self = this;
  self.router = router;

  /* GET test listing. */
  self.router.get('/', function(req, res, next) {

    RtmClient.on(slackClient.RTM_EVENTS.MESSAGE, function (message) {
      // Listens to all `message` events from the team
      console.log("This was a message", message);

      slackRtm.sendMessage("I'm really listening. Watch out", message, function messageSent() {
        // optionally, you can supply a callback to execute once the message has been sent
        console.log("Message was sent");
      });
    });


    res.send('respond with a test');
  });

  return self.router;
}

module.exports = TestController;
