'use strict';
/**
 * @typedef {Object} SlackRoute
 * @property {String} SlackRoute.path
 * @property {Function} SlackRoute.handler
 */

/**
 /**
 * @typedef {Object} SlackRouter
 * @property {Function} SlackRouter.getRoutes
 */

/**
 *
 * @returns {SlackRouter}
 * @constructor
 */
function SlackRouter() {

    /**
     * @public
     * @typedef {SlackRoute[]}
     */
    this.getRoutes = function () {
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
