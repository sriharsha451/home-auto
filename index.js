'use strict';
require('app-module-path').addPath(__dirname);

var express = require('express');
var kraken = require('kraken-js');
var http = require('http');
var lasso  = require('lasso');

var config = require("config/config.json");


var options, app, server;

/*
 * Create and configure application. Also exports application instance for use by tests.
 * See https://github.com/krakenjs/kraken-js#options for additional configuration options.
 */
options = {
    onconfig: function (config, next) {
        /*
         * Add any additional config setup or overrides here. `config` is an initialized
         * `confit` (https://github.com/krakenjs/confit/) configuration object.
         */
        next(null, config);
    }
};

app = module.exports = express();
app.use(kraken(options));
require('lasso').configure(config.lasso);


app.once('start', function () {
    require('marko/browser-refresh').enable();
    require('lasso/browser-refresh')
        .enable('*.marko *.css *.less *.styl *.scss *.sass *.png *.jpeg *.jpg *.gif *.webp *.svg');
    console.log('Application ready to serve requests.');
    console.log('Environment: %s', app.kraken.get('env:env'));
});



/*
 * Create and start HTTP server.
 */

server = http.createServer(app);
server.listen(process.env.PORT || 8000);
server.on('listening', function () {
    console.log('Server listening on http://localhost:%d', this.address().port);
});

var io = require('./src/services/socket-api.js').listen(server);
