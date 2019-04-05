/**
 * JS Framework (Vectors, Canvas, Scene)
 * by thdoteo
 * (Useful to start making interactive apps)
 */

numberScale = function(value, beforeMin, beforeMax, afterMin, afterMax) {
	return ((value-beforeMin) / (beforeMax-beforeMin)) * (afterMax-afterMin) + afterMin
}

/**
 * Vector
 */

var Vector = function(x, y, z = 0) {
	this.x = x
	this.y = y
	this.z = z
}

Vector.prototype.copy = function() {
	return new Vector(this.x, this.y, this.z)
}

Vector.prototype.getMag = function() {
	return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
}

Vector.prototype.add = function(vector) {
	if(vector instanceof Vector) {
		this.x += vector.x
		this.y += vector.y
		this.z += vector.z
	} else  {
		this.x += vector
		this.y += vector
		this.z += vector
	}
	return this
}

Vector.prototype.sub = function(vector) {
	if(vector instanceof Vector) {
		this.x -= vector.x
		this.y -= vector.y
		this.z -= vector.z
	} else {
		this.x -= vector
		this.y -= vector
		this.z -= vector
	}
	return this
}

Vector.prototype.mult = function(vector) {
	if(vector instanceof Vector) {
		this.x *= vector.x
		this.y *= vector.y
		this.z *= vector.z
	} else {
		this.x *= vector
		this.y *= vector
		this.z *= vector
	}
	return this
}

Vector.prototype.div = function(vector) {
	if(vector instanceof Vector) {
		this.x /= vector.x
		this.y /= vector.y
		this.z /= vector.z
	} else {
		this.x /= vector
		this.y /= vector
		this.z /= vector
	}
	return this
}

Vector.prototype.normalize = function() {
	return this.getMag() === 0 ? this : this.div(this.getMag())
}

Vector.prototype.setMag = function(n) {
	return this.normalize().mult(n)
}

Vector.prototype.limitMag = function(max) {
	if(this.getMag() > max) { this.setMag(max) }
	return this
}

Vector.prototype.getDistanceTo = function(vector) {
	return Math.sqrt(Math.pow(this.x - vector.x, 2) + Math.pow(this.y - vector.y, 2) + Math.pow(this.z - vector.z, 2))
}

Vector.prototype.getHeading = function() {
	return Math.atan2(this.y, this.x)
}

/**
 * Canvas
 */

var Canvas = function(width, height) {
	this.element = document.createElement('canvas')
	this.element.width = width
	this.element.height = height
	this.element.style.background = 'rgb(240, 240, 240)'
	document.body.appendChild(this.element)
	this.context = this.element.getContext('2d')
}

Canvas.prototype.clear = function() {
	this.context.clearRect(0, 0, this.element.width, this.element.height)
}

Canvas.prototype.circle = function(x, y, radius, background, border) {
	this.context.beginPath()
	this.context.arc(x, y, radius, 0, 2 * Math.PI)
	if(background != null) {
		this.context.fillStyle = background
		this.context.fill()
	}
	if(border != null) {
		this.context.strokeStyle = border
		this.context.stroke()
	}
}

Canvas.prototype.triangle = function(x, y, size, heading, background, border) {
	this.context.save()
	this.context.beginPath()
	this.context.translate(x, y)
	this.context.rotate(heading)

	var x0 = -size
	var y0 = -size
	this.context.moveTo(x0, y0)
	this.context.lineTo(x0 + 2 * size, y0 + size)
	this.context.lineTo(x0, y0 + 2 * size)

	this.context.fillStyle = background
	this.context.fill()
	this.context.restore()
}

Canvas.prototype.line = function(x, y, xEnd, yEnd, color, thickness) {
	this.context.beginPath()

	this.context.moveTo(x, y)
	this.context.lineTo(xEnd, yEnd)

	this.context.strokeStyle = color
	this.context.lineWidth = thickness
	this.context.stroke()
}

/**
 * App
 */

var App = function() {
	this.debug = true

	this.updateCallback = null
}

App.prototype.setup = function(callback) {
	this.canvas = new Canvas(600, 600)
	callback(this)
}

App.prototype.update = function(callback) {
	this.canvas.clear()
	if(typeof callback == 'function') {
		this.updateCallback = callback
	}
	this.updateCallback(this)
	requestAnimationFrame(this.update.bind(this))
}