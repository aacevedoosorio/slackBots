'use strict';
/**
 * @typedef {Object} SlackRoute
 * @property {String} SlackRoute.path
 * @property {Function} SlackRoute.handler
 */

/**
 * @returns {{getRoutes: getRoutes}}
 * @constructor
 */
function SlackRouter() {

    return {
        getRoutes: getRoutes
    };

    /**
     * @public
     * @typedef {SlackRoute[]}

     */
    function getRoutes() {
        return [
            {
                path: '/',
                handler: require('./controllers/index')
            },
            {
                path: '/test',
                handler: require('./controllers/test')
            },
            {
                path: '/users',
                handler: require('./controllers/users')
            }
        ];
    }
}

module.exports = SlackRouter;
