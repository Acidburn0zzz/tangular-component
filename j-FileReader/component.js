COMPONENT('filereader', function() {
	var self = this;
	var input;
	self.readonly();
	self.make = function() {
		self.classes('hidden');
		self.append('<input type="file" />');
		input = self.find('input');
		input.on('change', function(e) {
			self.process(e.target.files);
		});
	};

	self.open = function(accept, callback, multiple) {

		if (typeof(accept) === 'function') {
			callback = accept;
			accept = undefined;
		}

		self.callback = callback;

		if (multiple)
			input.attr('multiple', multiple);
		else
			input.removeAttr('multiple');

		if (accept)
			input.attr('accept', accept);
		else
			input.removeAttr('accept');

		input.trigger('click');
	};

	self.process = function(files) {
		var el = this;
		SETTER('loading', 'show');
		(files.length - 1).async(function(index, next) {
			var file = files[index];
			var reader = new FileReader();
			reader.onload = function() {
				self.set({ body: reader.result, filename: file.name, type: file.type, size: file.size });
				reader = null;
				setTimeout(next, 500);
			};
			reader.readAsText(file);
		}, function() {
			SETTER('loading', 'hide', 1000);
			el.value = '';
		});
	};
});