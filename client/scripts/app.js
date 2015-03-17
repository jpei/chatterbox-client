var app = {
	
	lastUpdate : 0,

	fetch : function(query) {
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

	send : function(message, username) {
		$.ajax({
		  // This is the url you should use to communicate with the parse API server.
		  url: 'https://api.parse.com/1/classes/chatterbox',
		  type: 'POST',
		  data: function() { return username ? JSON.stringify({username:username, text:message, roomname:'lobby'}) : JSON.stringify({username:'anon', text:message, roomname:'lobby'}) }(),
		  contentType: 'application/json',
		  success: function (data) {
		    console.log('chatterbox: Message sent');
		  },
		  error: function (data) {
		    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
		    console.error('chatterbox: Failed to send message');
		  }
		});
	},

	init : function() {
		this.fetch('order=-createdAt');
		$( "#form" ).submit(function( event ) {
		  app.send($("input").val(), window.location.search.slice(10));
		  debugger;
		  setTimeout(fetch, 500);
		});
		//this.fetch('where={"createdAt":{"$gte":"2015-03-16"}}')
		//this.fetch('where={"roomname":"lobby"}')
		// setInterval(this.fetch .bind(this), 3000);
	},

	updatePage : function(data) {
		// has properties: createdAt, objectId, roomname, text, updatedAt, username

		// clear old messages
		// post new messages
		// data.results
		// username + text
		// roomname + timestamp

		this.lastUpdate = new Date().getTime();
		for (var i = 0; i < data.results.length; i++) {
			var message = data.results[i];
			if (message.text !== undefined && message.text.toLowerCase().indexOf('prompt')===-1 && message.text.toLowerCase().indexOf('alert')===-1) {
				$('#messages').prepend('<div class="chat">' + '<span class="username">' + message.username + '</span>' + ': ' + message.text + '</div>');
				// message.timestamp 
			}
		};
	}

};
$(document).ready(function() {
	app.init();
});
