var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var SlackRouter = require('./slack-router');
var CronJob = require('cron').CronJob;

//Mine
var slackClient = require('@slack/client');
var RtmClient = slackClient.RtmClient;
var CLIENT_EVENTS = slackClient.CLIENT_EVENTS

var Scoreaboard = require('./modules/perfect_game/scoreboard');

var token = process.env.SLACK_API_TOKEN || 'xoxb-45174287958-cDTETRbyB2H6St2tnxIKOg3d';

var slackRtm = new RtmClient(token, {logLevel: 'error'});
slackRtm.start();

slackRtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
  console.log("Logged in as " + rtmStartData.self.name + " of team " + rtmStartData.team.name + " , but not yet connected to a channel");
});

slackRtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function (rtmStartData) {
  console.log('Ready to send messages');

  var scoreboard = new Scoreaboard(require('http'), slackRtm, CronJob);
  scoreboard.start();
});

slackRtm.on(slackClient.RTM_EVENTS.MESSAGE, function (message) {
  // Listens to all `message` events from the team
  console.log("This was a message", message);

  slackRtm.sendMessage("I'm really listening. Watch out: " + message.text, message.channel, function messageSent() {
    // optionally, you can supply a callback to execute once the message has been sent
    console.log("Message was sent");
  });
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*// load the application routes and register them in express
var slackRouter = new SlackRouter();
var slackRoutes = slackRouter.getRoutes();
for (var i = 0; i < slackRoutes.length; i++) {
  app.use(slackRoutes[i].path, slackRoutes[i].handler.call({}, express.Router(), slackRtm, slackClient));
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});*/


module.exports = app;
