var app = {
	server: 'https://api.parse.com/1/classes/chatterbox',
	newestTimestamp: null,
	currentRoom: 'lobby',
	friends: {},

	init : function() {
		app.update();
		setInterval(app.update.bind(app),1000);
		$('body').on('click','.username',function() {
			app.friends[$(this).text()] = !app.friends[$(this).text()];
			var usernames = $('.username');
			for (var i=0; i<usernames.length; i++) {
				if ($(usernames[i]).text() === $(this).text()) {
					$(usernames[i]).toggleClass('friend');
				}
			}
		});
	},

	fetch : function(query) {
		$.ajax({
		  url: app.server,
		  type: 'GET',
		  data: query,
		  contentType: 'application/json',
		  success: this.displayMessages,
		  error: function (data) {
		    console.error('chatterbox: Failed to send message');
		  }
		});
	},

	send : function(message) {
		$.ajax({
		  url: app.server,
		  type: 'POST',
		  data: JSON.stringify(message),
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
		app.send({
			username: window.location.search.slice(10),
			text: $('input.postfield').val(),
			roomname: app.currentRoom
		});
		$('.postfield').val('');
		setTimeout(app.update.bind(app),50);
	},

	// data.results[i] has properties: createdAt, objectId, roomname, text, updatedAt, username
	displayMessages : function(data) {
		for (var i = data.results.length-1; i >= 0; i--) {
			var message = data.results[i];
			if ((!app.newestTimestamp || message.createdAt > app.newestTimestamp) && message.text !== undefined) {
				var spanClass = '<span class="username">'
				if( app.friends[message.username] ) {
					spanClass = '<span class="username friend">'
				}
				$('#chats').prepend('<div class="chat">' + spanClass + html_sanitize(message.username) + '</span>' + ': ' + html_sanitize(message.text) + '</div>');
			}
		}
		if (data.results.length>0) {
			app.newestTimestamp = data.results[0].createdAt;
		}
	},

	update : function() {
		if (this.newestTimestamp !== null) {
			this.fetch({order:'-createdAt', where:{createdAt:{"$gt":this.newestTimestamp}, roomname:app.currentRoom}});
		}
		else this.fetch({order:'-createdAt', where:{roomname: app.currentRoom}, limit:100})
	},

	clearMessages : function() {
		$('#chats').empty();
	},

	join : function() {
		app.currentRoom = html_sanitize($('input.roomfield').val());
		$('.roomfield').val('');
		app.newestTimestamp = null;
		app.clearMessages();
		app.update();
	}

};
$(document).ready(function() {
	app.init();
});
