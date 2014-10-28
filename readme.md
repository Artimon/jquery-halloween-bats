jQuery Halloween Bats
=====================

Adds a swarm of bats flying around your website.

Usage:
--------------
Look at the index.html file for an implementation example.
To use another image, just replace the bats.png file.


Configuration options:
--------------
```
$.fn.halloweenBats({
	image: 'http://www.mydomain.com/images/bats.png', // Path to the image.
	zIndex: 10000, // The z-index you need.
	amount: 5, // Bat amount.
	width: 35, // Image width.
	height: 20, // Animation frame height.
	frames: 4, // Amount of animation frames.
	speed: 20, // Higher value = faster.
	flickering: 15 // Higher value = slower.
});
```
