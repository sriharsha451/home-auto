'use strict';

var template = require('marko').load(require.resolve('./template.marko'));

var deviceState = require('src/services/mock-data.json');

function handleRequest(req, res) {
	template.render(deviceState,res);
}

module.exports = handleRequest;
