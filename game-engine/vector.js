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