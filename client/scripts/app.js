var app = {
	
	newestTimestamp:null,

	fetch : function(query) {
		$.ajax({
		  // This is the url you should use to communicate with the parse API server.
		  url: 'https://api.parse.com/1/classes/chatterbox',
		  type: 'GET',
		  data: query,
		  contentType: 'application/json',
		  success: this.postMessages,
		  error: function (data) {
		    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
		    console.error('chatterbox: Failed to send message');
		  }
		});
	},

	send : function(message, username) {
		$.ajax({
		  url: 'https://api.parse.com/1/classes/chatterbox',
		  type: 'POST',
		  data: JSON.stringify({username:username, text:message, roomname:'lobby'}),
		  contentType: 'application/json',
		  success: function (data) {
		    console.log('chatterbox: Message sent');
		  },
		  error: function (data) {
		    console.error('chatterbox: Failed to send message');
		  }
		});
	},

	submit : function() {
		app.send($('input').val(), window.location.search.slice(10));
		$('.text').val('');
		app.fetch();
		app.update();
	},

	init : function() {
		this.fetch('order=-createdAt');

		//this.fetch('where={"createdAt":{"$gte":"2015-03-16"}}')
		//this.fetch('where={"roomname":"lobby"}')
		// setInterval(this.fetch .bind(this), 3000);
		setInterval(this.update.bind(this),1000);
	},

	postMessages : function(data) {
		// data.results[i] has properties: createdAt, objectId, roomname, text, updatedAt, username

		// clear old messages
		// post new messages
		// username + text
		// roomname + timestamp

		this.lastUpdate = new Date().getTime();
		if (data.results.length>0) {
			this.newestTimestamp = data.results[0].createdAt;
		}
		for (var i = 0; i < data.results.length; i++) {
			var message = data.results[i];
			if (message.text !== undefined && message.text.toLowerCase().indexOf('prompt')===-1 && message.text.toLowerCase().indexOf('alert')===-1) {
				$('#messages').append('<div class="chat">' + '<span class="username">' + message.username + '</span>' + ': ' + message.text + '</div>');
				// message.timestamp 
			}
		};
	},

	update : function() {
		if (this.newestTimestamp !== null) {
			this.fetch('where={"createdAt":{"$gte":'+newestTimestamp+'}}')
		}
	}

};
$(document).ready(function() {
	app.init();
});
