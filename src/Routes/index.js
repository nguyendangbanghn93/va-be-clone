const express = require('express');
const authRoute = require('./auth.routes');
const projectRoutes = require('./project.routes');
const stringeeRoutes = require('./stringee.routes');
const usersRoute = require('./users.routes');
const docsRoute = require('./docs.routes');
const messageRoute = require('./message.route');
const vaConfigRoute = require('./vaConfig.route');
const conversationRoute = require('./conversation.routes');
const router = express.Router();

const defaultRoutes = [
    {
        path: '/auth',
        route: authRoute,
    },
    {
        path: '/projects',
        route: projectRoutes,
    },
    {
        path: '/users',
        route: usersRoute,
    },
    {
        path: '/message',
        route: messageRoute,
    },
    {
        path: '/conversations',
        route: conversationRoute,
    },
    {
        path: '/va_config',
        route: vaConfigRoute,
    },
    {
        path: '/stringee',
        route: stringeeRoutes,
    },
];

const devRoutes = [
    // routes available only in development mode
    {
        path: '/docs',
        route: docsRoute,
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

const env = 'development'

/* istanbul ignore next */
if (env === 'development') {
    devRoutes.forEach((route) => {
        router.use(route.path, route.route);
    });
}

module.exports = router;