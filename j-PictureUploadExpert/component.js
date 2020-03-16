COMPONENT('pictureuploadexpert', 'width:200;height:100;background:#FFFFFF;quality:90;customize:1;class:over;multiple:true;schema:{file\\:base64,name\\:filename}', function(self, config, cls) {

	var empty, canvas, name, input, queuefiles, queue;
	var ecounter = 0;
	var tempresponse = [];

	self.readonly();
	self.nocompile && self.nocompile();

	self.configure = function(key, value, init) {

		if (init)
			return;

		switch (key) {
			case 'width':
			case 'height':
			case 'background':
				setTimeout2(self.id + 'reinit', self.reinit, 50);
				break;
			case 'disabled':
				self.tclass(cls + '-disabled', value);
				break;
		}
	};

	self.reinit = function() {
		canvas = document.createElement('canvas');
		canvas.width = config.width;
		canvas.height = config.height;
		var ctx = canvas.getContext('2d');
		ctx.fillStyle = config.background;
		ctx.fillRect(0, 0, config.width, config.height);
		empty = canvas.toDataURL('image/png');
		canvas = null;
	};

	var resizewidth = function(w, h, size) {
		return Math.ceil(w * (size / h));
	};

	var resizeheight = function(w, h, size) {
		return Math.ceil(h * (size / w));
	};

	self.resizeforce = function(image) {

		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		canvas.width = config.width;
		canvas.height = config.height;
		ctx.fillStyle = config.background;
		ctx.fillRect(0, 0, config.width, config.height);

		var w = 0;
		var h = 0;
		var x = 0;
		var y = 0;
		var is = false;
		var diff = 0;

		if (config.customize) {
			if (image.width > config.width || image.height > config.height) {
				if (image.width > image.height) {

					w = resizewidth(image.width, image.height, config.height);
					h = config.height;

					if (w < config.width) {
						w = config.width;
						h = resizeheight(image.width, image.height, config.width);
					}

					if (w > config.width) {
						diff = w - config.width;
						x -= (diff / 2) >> 0;
					}

					is = true;
				} else if (image.height > image.width) {

					w = config.width;
					h = resizeheight(image.width, image.height, config.width);

					if (h < config.height) {
						h = config.height;
						w = resizewidth(image.width, image.height, config.height);
					}

					if (h > config.height) {
						diff = h - config.height;
						y -= (diff / 2) >> 0;
					}

					is = true;
				}
			}
		}

		if (!is) {
			if (image.width < config.width && image.height < config.height) {
				w = image.width;
				h = image.height;
				x = (config.width / 2) - (image.width / 2);
				y = (config.height / 2) - (image.height / 2);
			} else if (image.width >= image.height) {
				w = config.width;
				h = image.height * (config.width / image.width);
				y = (config.height / 2) - (h / 2);
			} else {
				h = config.height;
				w = (image.width * (config.height / image.height)) >> 0;
				x = (config.width / 2) - (w / 2);
			}

		}

		ctx.drawImage(image, x, y, w, h);
		var base64 = canvas.toDataURL('image/jpeg', config.quality * 0.01);
		self.upload(base64);
	};

	self.make = function() {

		self.append('<input type="file" accept="image/*" class="{0}-input" {1}/>'.format(cls, config.multiple ? 'multiple' : ''));
		input = self.find('input');

		self.reinit();

		if (config.class.charAt(0) === '.')
			config.class = config.class.substr(1);

		if (config.clickselector)
			$(document).on('click', config.clickselector, self.click);
		else
			self.event('click', self.click);


		self.event('change', 'input', function() {

			if (queue)
				return;

			SETTER('loading', 'show');
			queuefiles = this.files;
			queue = this.files.length;
			self.wait();
			this.value = '';
		});

		$(document).on('dragenter dragover dragexit drop dragleave', config.dropselector, self.drop);
	};

	self.click = function(e) {
		e.stopPropagation();

		if ($(e.target).hclass(cls + '-input'))
			return;

		!config.disabled && input.click();
	};

	self.drop = function(e) {
		e.stopPropagation();
		e.preventDefault();

		var types = e.originalEvent.dataTransfer.types.join(' ').toLowerCase();
		if (types.indexOf('files') === -1 || config.disabled)
			return;


		var temp = config.dropselector.substr(1);
		switch (e.type) {
			case 'drop':
				$(config.dropselector).rclass(config.class);
				break;
			case 'dragenter':
				if (!ecounter)
					$(config.dropselector).aclass(config.class);
				ecounter++;
				return;
			case 'dragleave':
				ecounter--;
				if (ecounter <= 0) {
					$(config.dropselector).rclass(config.class);
					ecounter = 0;
				}
				return;
			default:
				return;
		}

		var dt = e.originalEvent.dataTransfer;
		if (dt && dt.files.length) {
			if (queue)
				return;

			SETTER('loading', 'show');
			queuefiles = e.originalEvent.dataTransfer.files;
			queue = e.originalEvent.dataTransfer.files.length;
			if (!config.multiple) {
				queuefiles = [queuefiles[0]];
				queue = 1;
			}
			self.wait(queue);
			ecounter = 0;
		}
	};

	self.wait = function() {
		queue = queue - 1;

		if (queue < 0) {
			self.change(true);
			self.push(tempresponse);
			tempresponse = [];
			queue = null;
			SETTER('loading', 'hide', 300);
			return;
		}

		self.load(queuefiles[queue]);
	};

	self.load = function(file) {
		name = file.name;
		self.getOrientation(file, function(orient) {
			var reader = new FileReader();
			reader.onload = function () {
				var img = new Image();
				img.onload = function() {
					self.resizeforce(img);
					self.change(true);
				};
				img.crossOrigin = 'anonymous';
				if (orient < 2) {
					img.src = reader.result;
				} else {
					self.resetOrientation(reader.result, orient, function(url) {
						img.src = url;
					});
				}
			};
			reader.readAsDataURL(file);
		});
	};

	self.upload = function(base64) {
		if (base64) {
			var data = (new Function('base64', 'filename', 'return ' + config.schema))(base64, name);
			AJAX('POST ' + config.url.env(true), data, function(response, err) {
				if (err) {
					SETTER('snackbar', 'warning', err.toString());
					self.wait();
				} else {
					var temp = response instanceof Array ? response[0] : response;
					tempresponse.push(temp);
					self.wait();
				}
			});
		}
	};

	// http://stackoverflow.com/a/32490603
	self.getOrientation = function(file, callback) {
		var reader = new FileReader();
		reader.onload = function(e) {
			var view = new DataView(e.target.result);
			if (view.getUint16(0, false) != 0xFFD8)
				return callback(-2);
			var length = view.byteLength;
			var offset = 2;
			while (offset < length) {
				var marker = view.getUint16(offset, false);
				offset += 2;
				if (marker == 0xFFE1) {
					if (view.getUint32(offset += 2, false) != 0x45786966)
						return callback(-1);
					var little = view.getUint16(offset += 6, false) == 0x4949;
					offset += view.getUint32(offset + 4, little);
					var tags = view.getUint16(offset, little);
					offset += 2;
					for (var i = 0; i < tags; i++)
						if (view.getUint16(offset + (i * 12), little) == 0x0112)
							return callback(view.getUint16(offset + (i * 12) + 8, little));
				} else if ((marker & 0xFF00) != 0xFF00)
					break;
				else
					offset += view.getUint16(offset, false);
			}
			return callback(-1);
		};
		reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
	};

	self.resetOrientation = function(src, srcOrientation, callback) {
		var img = new Image();
		img.onload = function() {
			var width = img.width;
			var height = img.height;
			var canvas = document.createElement('canvas');
			var ctx = canvas.getContext('2d');

			// set proper canvas dimensions before transform & export
			if (4 < srcOrientation && srcOrientation < 9) {
				canvas.width = height;
				canvas.height = width;
			} else {
				canvas.width = width;
				canvas.height = height;
			}
			switch (srcOrientation) {
				case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
				case 3: ctx.transform(-1, 0, 0, -1, width, height); break;
				case 4: ctx.transform(1, 0, 0, -1, 0, height); break;
				case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
				case 6: ctx.transform(0, 1, -1, 0, height, 0); break;
				case 7: ctx.transform(0, -1, -1, 0, height, width); break;
				case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
			}
			ctx.drawImage(img, 0, 0);
			callback(canvas.toDataURL());
		};
		img.src = src;
	};
});
