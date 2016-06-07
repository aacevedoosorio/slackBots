/**
 *
 * @param {http} httpClient
 * @param {RtmClient} slackRtmClient
 * @param {CronJob} CronJob
 *
 * @constructor
 */
function Scoreboard(httpClient, slackRtmClient, CronJob) {

    var self = this;
    var HOSTNAME = 'http://mlb.mlb.com';
    var PATH = '/gdcross/components/game/mlb/year_%yyyy/month_%mm/day_%dd/master_scoreboard.json';
    var IN_PROGRESS = 'I';
    var FINISHED = 'F';
    var MLB_CHANNEL = 'C1BQJK7DY';
    var LA_OFFSET = -7; // In hours

    this.lastGames = [];
    this.lastCompleteDate = null;

    this.start = function() {
        var job = new CronJob({
            cronTime: '0 */10 * * 3-9 *',
            onTick: function() {
                console.log('Should do shit every minute');
                var today = new Date();
                getScoreboard(today);
            },
            start: false,
            timeZone: 'America/Los_Angeles'
        });

        job.start();
    };

    /**
     * @private
     * @param {Date} localDate
     */
    getScoreboard = function(localDate) {
        var utc = localDate.getTime() + (localDate.getTimezoneOffset() * 60000);
        var laxDate = new Date(utc + (3600000 * LA_OFFSET));

        if (self.lastCompleteDate == laxDate && allGamesFinished()) {
            console.log('All games for: ' + laxDate + ' are already finished');
            return;
        }

        var path = PATH.replace('%yyyy', laxDate.getFullYear())
            .replace('%mm', ("0" + (laxDate.getMonth() + 1)).slice(-2)).replace('%dd', ("0" + (laxDate.getDate())).slice(-2));

        slackRtmClient.sendMessage('Fetching scoreboard at:' + laxDate + " --> " +  HOSTNAME + path, MLB_CHANNEL, function () {
            console.log('Error scoreboard notification sent', laxDate);
        });

        console.log('Fetching scoreboard at:', new Date(), HOSTNAME + path);
        var request = httpClient.get(HOSTNAME + path, function (response) {
            var responseBody = '';

            response.setEncoding('utf8');
            response.on('data', function(chunk) {
                responseBody += chunk;
            });

            response.on('end', function() {
                self.lastCompleteDate = laxDate;
                var scoreboard = JSON.parse(responseBody);
                searchPerfectGames(scoreboard);
            });
        });

        request.on('error', function (error) {
            console.error('ERROR', error);
            slackRtmClient.sendMessage('Errors while trying to get the scoreboard: '+ error, MLB_CHANNEL, function () {
                console.error('Error scoreboard notification sent', game);
            });
        });
    };

    /**
     * @private
     *
     * @param {Object} scoreboard
     */
    function searchPerfectGames(scoreboard) {
        if (!hasGamesData(scoreboard)) {
            console.log("scoreboard did not had any games", scoreboard);
            return;
        }

        var games = scoreboard.data.games.game;
        self.lastGames = games;
        for (var i = 0; i < games.length; i++) {
            var game = games[i];

            if (game.status.ind == IN_PROGRESS && isNoHitter(game)) {
                console.log('We have a no hitter');
                slackRtmClient.sendMessage("We have a no hitter in progress on the: " + game.inning + ' inning, '
                        + game.away_team_name + ' vs ' + game.home_team_name, MLB_CHANNEL, function () {
                    console.log('No hitter notification sent', game);
                });
            }
        }
    }

    /**
     * @private
     * @param {Object} game
     *
     * @returns {boolean}
     */
    function isNoHitter(game) {
        return (game.status.is_no_hitter == 'Y' || game.status.is_perfect_game == 'Y')
    }

    /**
     * @private
     * @param {Object} game
     *
     * @returns {boolean}
     */
    function isGameFinished(game) {
        return game.status.ind == FINISHED;
    }

    /**
     * @private
     * @param {Object} scoreboard
     *
     * @returns {boolean}
     */
    function hasGamesData(scoreboard) {
        return (scoreboard && scoreboard.data && scoreboard.data.games && scoreboard.data.games.game && scoreboard.data.games.game.length > 0)
    }

    /**
     * @private
     *
     * @returns {boolean}
     */
    function allGamesFinished() {
        var finishedGames = 0;
        for (var i = 0; i < self.lastGames.length; i++) {
            var game = self.lastGames[i];

            if (isGameFinished(game)) {
                finishedGames += 1;
            }
        }

        return finishedGames == self.lastGames.length;
    }

}

module.exports = Scoreboard;

