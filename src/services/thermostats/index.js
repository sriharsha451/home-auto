'use strict';

module.exports = function ThermostatsApiAdaptor(req, res, timerMap) {
	var increment = 1;

	function handleRequest(req, res) {
		if (req.method === "POST") {			
			postHandler(req,res);
		}
	}

	function simulateThermostat(thermostatObj) {
		if (thermostatObj.state === "ON") {

			if (!timerMap[thermostatObj.id]) {
				timerMap[thermostatObj.id] = {};
			} else {
				clearInterval(timerMap[thermostatObj.id]);
			}

			thermostatObj.setTemperature = parseInt(thermostatObj.setTemperature);
			thermostatObj.currentTemperature = parseInt(thermostatObj.currentTemperature);
			if ((thermostatObj.setTemperature) < (thermostatObj.currentTemperature)) {
				increment = -1;
			}

			timerMap[thermostatObj.id] = setInterval(function() {
				thermostatObj.currentTemperature += increment;
				if (thermostatObj.setTemperature === thermostatObj.currentTemperature) {
					clearInterval(timerMap[thermostatObj.id]);
				}
				if (thermostatObj.state === "ON") {
					io.emit('thermostat.update', thermostatObj);
				}
			},2000);							
		} else {
			clearInterval(timerMap[thermostatObj.id]);
		}		
	}
	function postHandler(req, res) {
		res.json({
			responseMeta : {
				responseCode : 200
			},
			model : req.body
		});
		simulateThermostat(req.body);
	};

	handleRequest(req,res);

};
