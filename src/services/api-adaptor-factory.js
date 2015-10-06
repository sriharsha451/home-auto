'use strict';

var LightsApiAdaptor = require('./lights/index.js');
var GaragesApiAdaptor = require('./garages/index.js');
var ThermostatsApiAdaptor = require('./thermostats/index.js');
var CurtainsApiAdaptor = require('./curtains/index.js');

var timerMap = {};

var ApiAdaptorFactory = function (req, res) {

    if (req.params.deviceType === "lights") {
        return new LightsApiAdaptor(req, res);
    } else if (req.params.deviceType === "garages") {
        return new GaragesApiAdaptor(req, res);
    } else if (req.params.deviceType === "thermostats") {
        return new ThermostatsApiAdaptor(req, res, timerMap);
    } else if (req.params.deviceType === "curtains") {
        return new CurtainsApiAdaptor(req, res);
    }

    return res.json({
    	"errorMessage" : "Invalid API Call"
    });
};

module.exports = ApiAdaptorFactory;