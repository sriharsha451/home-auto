module.exports.listen = function(app) {

  	io = require('socket.io').listen(app);

	io.on('connection', function (socket) {
	  console.log('New client connected!');	  
	});

  return io;
};