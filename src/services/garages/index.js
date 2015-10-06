'use strict';


module.exports = function GaragesApiAdaptor(req, res) {

	function handleRequest(req, res) {
		if (req.method === "POST") {
			postHandler(req,res);
		}
	}
	function postHandler(req, res) {
		res.json({
			responseMeta : {
				responseCode : 200
			},
			model : req.body
		})
	};

	handleRequest(req,res);

};
