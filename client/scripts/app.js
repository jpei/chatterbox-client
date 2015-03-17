var app = {
	
	lastUpdate : 0,

	getMessages : function(query) {
		$.ajax({
		  // This is the url you should use to communicate with the parse API server.
		  url: 'https://api.parse.com/1/classes/chatterbox',
		  type: 'GET',
		  data: query,
		  contentType: 'application/json',
		  success: this.updatePage,
		  error: function (data) {
		    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
		    console.error('chatterbox: Failed to send message');
		  }
		});
	},

	postMessage : function(message) {

	},

	init : function() {
		//this.getMessages('$all');
		this.getMessages('where={"createdAt":{"$gte":"2015-03-16"}}')
		//this.getMessages('where={"roomname":"lobby"}')
		// setInterval(this.getMessages .bind(this), 3000);
	},

	updatePage : function(data) {
		// has properties: createdAt, objectId, roomname, text, updatedAt, username

		// clear old messages
		// post new messages
		// data.results
		// username + text
		// roomname + timestamp

		this.lastUpdate = new Date().getTime();
		debugger;
		for (var i = 0; i < data.results.length; i++) {
			var message = data.results[i];
			if (message.text !== undefined) {
				$('#messages').prepend('<div class="chat">' + '<span class="username">' + message.username + '</span>' + ': ' + message.text + '</div>');
				// message.timestamp 
			}
		};
	}

};

app.init();