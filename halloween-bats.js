(function ($) {
	"use strict";

	$.fn.halloweenBats = function (options) {
		var Bat,
			bats = [],
			$body= $('body'),
			innerWidth = $body.innerWidth(),
			innerHeight = $body.innerHeight(),
			counter,
			defaults = {
				image: 'bats.png', // Path to the image.
				zIndex: 10000, // The z-index you need.
				amount: 5, // Bat amount.
				width: 35, // Image width.
				height: 20, // Animation frame height.
				frames: 4, // Amount of animation frames.
				speed: 20, // Higher value = faster.
				flickering: 15 // Higher value = slower.
			};

		options = $.extend({}, defaults, options);

		Bat = function () {
			var self = this,
				$bat = $('<div class="halloweenBat"/>'),
				x,
				y,
				tx,
				ty,
				dx,
				dy,
				frame;

			/**
			 * @param {string} direction
			 * @returns {number}
			 */
			self.randomPosition = function (direction) {
				var screenLength,
					imageLength;

				if (direction === 'horizontal') {
					screenLength = innerWidth;
					imageLength = options.width;
				}
				else {
					screenLength = innerHeight;
					imageLength = options.height;
				}

				return Math.random() * (screenLength - imageLength);
			};

			self.applyPosition = function () {
				$bat.css({
					left: x + 'px',
					top: y + 'px'
				});
			};

			self.move = function () {
				var left,
					top,
					length,
					dLeft,
					dTop,
					ddLeft,
					ddTop;

				left = tx - x;
				top = ty - y;

				length = Math.sqrt(left * left + top * top);
				length = Math.max(1, length);

				dLeft = options.speed * (left / length);
				dTop = options.speed * (top / length);

				ddLeft = (dLeft - dx) / options.flickering;
				ddTop = (dTop - dy) / options.flickering;

				dx += ddLeft;
				dy += ddTop;

				x += dx;
				y += dy;

				x = Math.max(0, Math.min(x, innerWidth - options.width));
				y = Math.max(0, Math.min(y, innerHeight - options.height));

				self.applyPosition();

				if (Math.random() > 0.95 ) {
					tx = self.randomPosition('horizontal');
					ty = self.randomPosition('vertical');
				}
			};

			self.animate = function () {
				frame += 1;

				if (frame >= options.frames) {
					frame -= options.frames;
				}

				$bat.css(
					'backgroundPosition',
					'0 ' + (frame * -options.height) + 'px'
				);
			};


			x = self.randomPosition('horizontal');
			y = self.randomPosition('vertical');
			tx = self.randomPosition('horizontal');
			ty = self.randomPosition('vertical');
			dx = -5 + Math.random() * 10;
			dy = -5 + Math.random() * 10;

			frame = Math.random() * options.frames;
			frame = Math.round(frame);

			$body.append($bat);
			$bat.css({
				position: 'absolute',
				left: x + 'px',
				top: y + 'px',
				zIndex: options.zIndex,
				width: options.width + 'px',
				height: options.height + 'px',
				backgroundImage: 'url(' + options.image + ')',
				backgroundRepeat: 'no-repeat'
			});

			window.setInterval(self.move, 40);
			window.setInterval(self.animate, 200);
		};

		for (counter = 0; counter < options.amount; ++counter) {
			bats.push(new Bat());
		}

		$(window).resize(function() {
			innerWidth = $body.innerWidth();
			innerHeight = $body.innerHeight();
		});
	};
}(jQuery));