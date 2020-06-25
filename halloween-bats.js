(function ($) {

	'use strict';
	var innerWidth,
		innerHeight;

	function Bat($body, options) {
		this._options = options;

		this._initialize($body);
	}

	Bat.prototype._initialize = function ($body) {
		this._$bat = $('<div class="halloween-bat"/>');

		this._x = this.randomPosition('horizontal');
		this._y = this.randomPosition('vertical');
		this._tx = this.randomPosition('horizontal');
		this._ty = this.randomPosition('vertical');
		this._dx = -5 + Math.random() * 10;
		this._dy = -5 + Math.random() * 10;
		this._positionUpdateTimer = this._getPositionUpdateTime();

		this._frame = Math.random() * this._options.frames;
		this._frame = Math.round(this._frame);
		this._$bat.css({
			position: 'absolute',
			left: this._x + 'px',
			top: this._y + 'px',
			zIndex: this._options.zIndex,
			width: this._options.width + 'px',
			height: this._options.height + 'px',
			backgroundImage: 'url(' + this._options.image + ')',
			backgroundRepeat: 'no-repeat'
		});

		$body.append(this._$bat);
	};

	/**
	 * @returns {number}
	 * @private
	 */
	Bat.prototype._getPositionUpdateTime = function () {
		return 0.5 + Math.random();
	};

	/**
	 * @param {string} direction
	 * @returns {number}
	 */
	Bat.prototype.randomPosition = function (direction) {
		var screenLength,
			imageLength;

		if (direction === 'horizontal') {
			screenLength = innerWidth;
			imageLength = this._options.width;
		}
		else {
			screenLength = innerHeight;
			imageLength = this._options.height;
		}

		return Math.random() * (screenLength - imageLength);
	};

	Bat.prototype.move = function (deltaTime) {
		var left,
			top,
			length,
			dLeft,
			dTop,
			ddLeft,
			ddTop;

		left = this._tx - this._x;
		top = this._ty - this._y;

		length = Math.sqrt(left * left + top * top);
		length = Math.max(1, length);

		dLeft = this._options.speed * (left / length);
		dTop = this._options.speed * (top / length);

		ddLeft = (dLeft - this._dx) / this._options.flickering;
		ddTop = (dTop - this._dy) / this._options.flickering;

		this._dx += ddLeft * deltaTime * 25;
		this._dy += ddTop * deltaTime * 25;

		this._x += this._dx * deltaTime * 25;
		this._y += this._dy * deltaTime * 25;

		this._x = Math.max(0, Math.min(this._x, innerWidth - this._options.width));
		this._y = Math.max(0, Math.min(this._y, innerHeight - this._options.height));

		this.applyPosition();

		this._positionUpdateTimer -= deltaTime;
		if (this._positionUpdateTimer < 0) {
			this._tx = this.randomPosition('horizontal');
			this._ty = this.randomPosition('vertical');

			this._positionUpdateTimer = this._getPositionUpdateTime();
		}
	};

	Bat.prototype.applyPosition = function () {
		this._$bat.css({
			left: this._x + 'px',
			top: this._y + 'px'
		});
	};

	Bat.prototype.animate = function (deltaTime) {
		var frame;

		this._frame += 5 * deltaTime;

		if (this._frame >= this._options.frames) {
			this._frame -= this._options.frames;
		}

		frame = Math.floor(this._frame);

		this._$bat.css(
			'backgroundPosition',
			'0 ' + (frame * -this._options.height) + 'px'
		);
	};

	$.halloweenBats = function (options) {
		var $window = $(window),
			$target,
			plugin,
			isRunning = false,
			isActiveWindow = true,
			bats = [],
			defaults = {
				image: 'bats.png', // Path to the image.
				zIndex: 10000, // The z-index you need.
				amount: 5, // Bat amount.
				width: 35, // Image width.
				height: 20, // Animation frame height.
				frames: 4, // Amount of animation frames.
				speed: 20, // Higher value = faster.
				flickering: 15, // Higher value = slower.
				target: 'body' // Target element
			};

		options = $.extend({}, defaults, options);

		$target = $(options.target);

		innerWidth = $target.innerWidth();
		innerHeight = $target.innerHeight();

		plugin = {
			isRunning: false,
			start: function() {
				var lastTime = Date.now();

				isRunning = true;

				function animate() {
					var time = Date.now(),
						deltaTime = (time - lastTime) / 1000;

					lastTime = time;

					if (isActiveWindow) {
						$.each(bats, function (index, bat) {
							bat.move(deltaTime);
							bat.animate(deltaTime);
						});
					}

					if (isRunning) {
						requestAnimationFrame(animate);
					}
				}

				animate();
			},
			stop: function() {
				isRunning = false;
			}
		};

		while (bats.length < options.amount) {
			bats.push(new Bat($target, options));
		}

		plugin.start();

		$window.resize(function () {
			innerWidth = $target.innerWidth();
			innerHeight = $target.innerHeight();
		});

		$window.focus(function() {
			isActiveWindow = true;
		});

		$window.blur(function() {
			isActiveWindow = false;
		});

		return plugin;
	};
}(jQuery));
