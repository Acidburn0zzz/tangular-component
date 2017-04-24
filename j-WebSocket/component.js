COMPONENT('websocket', function() {

	var reconnect_timeout;
	var self = this;
	var ws;
	var url;

	self.online = false;
	self.readonly();

	self.make = function() {
		reconnect_timeout = (self.attr('data-reconnect') || '2000').parseInt();
		url = self.attr('data-url');
		if (!url.match(/^(ws|wss)\:\/\//))
			url = (location.protocol.length === 6 ? 'wss' : 'ws') + '://' + location.host + (url.substring(0, 1) !== '/' ? '/' : '') + url;
		setTimeout(self.connect, 500);
		self.destroy = self.close;
	};

	self.send = function(obj) {
		ws && ws.send(encodeURIComponent(JSON.stringify(obj)));
		return self;
	};

	self.close = function(isClosed) {
		if (!ws)
			return self;
		self.online = false;
		ws.onopen = ws.onclose = ws.onmessage = null;
		!isClosed && ws.close();
		ws = null;
		EMIT('online', false);
		return self;
	};

	function onClose() {
		self.close(true);
		setTimeout(function() {
			self.connect();
		}, reconnect_timeout);
	}

	function onMessage(e) {
		var data;
		try {
			data = JSON.parse(decodeURIComponent(e.data));
			self.attr('data-jc-path') && self.set(data);
		} catch (e) {
			window.console && console.warn('WebSocket "{0}": {1}'.format(url, e.toString()));
		}
		data && EMIT('message', data);
	}

	function onOpen() {
		self.online = true;
		EMIT('online', true);
	}

	self.connect = function() {
		ws && self.close();
		setTimeout2(self.id, function() {
			ws = new WebSocket(url);
			ws.onopen = onOpen;
			ws.onclose = onClose;
			ws.onmessage = onMessage;
		}, 100);
		return self;
	};
});