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

Canvas.prototype.line = function(x, y, length, heading, color, thickness) {
	this.context.save()
	this.context.beginPath()
	this.context.translate(x, y)
	this.context.rotate(heading)

	this.context.moveTo(0, 0)
	this.context.lineTo(length, 0)

	this.context.strokeStyle = color
	this.context.lineWidth = thickness
	this.context.stroke()
	this.context.restore()
}

/**
 * Scene
 */

var Scene = function() {
	this.debug = true
	this.numberOfVehicles = 80
	this.numberOfParticles = 50
	this.border = 60

	this.vehicle = []
	this.food = []
	this.poison = []

	this.setup()
	this.addObjects()
	this.update()
}

Scene.prototype.setup = function() {
	this.canvas = new Canvas(1300, 900)
}

Scene.prototype.addObjects = function() {
	for(var i = 0; i < this.numberOfVehicles; i++) {
		var location = this.pickRandomLocation()
		this.vehicle.push(new Vehicle(this, location.x, location.y))
	}
	for(var i = 0; i < this.numberOfParticles; i++) {
		this.food.push(new Particle(this, 'food'))
	}
	for(var i = 0; i < this.numberOfParticles; i++) {
		this.poison.push(new Particle(this, 'poison'))
	}
}

Scene.prototype.update = function() {
	this.canvas.clear()
	for(var i = this.vehicle.length - 1; i >= 0; i--) {
		this.vehicle[i].update(this.food, this.poison)
		var newVehicle = this.vehicle[i].clone()
		if(newVehicle != null) {
			this.vehicle.push(newVehicle)
		}
		if(this.vehicle[i].health < 0) {
			console.log('dead')
			this.vehicle.splice(i, 1)
		}
	}
	for(var i = 0; i < this.food.length; i++) { this.food[i].draw() }
	for(var i = 0; i < this.poison.length; i++) { this.poison[i].draw() }
	requestAnimationFrame(this.update.bind(this))
}

Scene.prototype.pickRandomLocation = function() {
	var maxX = this.canvas.element.width - this.border
	var maxY = this.canvas.element.height - this.border
	return new Vector(Math.random() * (maxX - this.border) + this.border, Math.random() * (maxY - this.border) + this.border)
}

/**
 * Particle
 */

var Particle = function(scene, type) {
	this.scene = scene
	this.position = this.scene.pickRandomLocation()
	this.type = type

	if(this.type == 'food') {
		this.color = '#aee87f'
	} else if(this.type == 'poison') {
		this.color = '#e27261'
	}

	this.draw()
}

Particle.prototype.draw = function() {
	this.scene.canvas.circle(this.position.x, this.position.y, 5, this.color, null)
}

Particle.prototype.reset = function() {
	this.position = this.scene.pickRandomLocation()
}

/**
 * Vehicle
 */

var Vehicle = function(scene, x, y, dna) {
	this.scene = scene
	
	this.config = {
		maxSpeed: 6,
		maxForce: 0.2,
		cloneRate: 0.0004,
		mutationRate: 0.4,
		attractionMutationScale: 0.1,
		perceptionMutationScale: 10,
		healthGainedWithFood: 0.2,
		healthGainedWithPoison: -0.6,
		healthGainedEachFrame: -0.003,
		defaultColor: '#aee87f',
		size: 12
	}

	this.position = new Vector(x, y)
	this.velocity = new Vector(0, 0)
	this.acceleration = new Vector(0, 0)
	this.destination = null
	this.color = this.config.defaultColor
	this.health = 1

	if(dna != null) {
		this.dna = dna
		this.mutate()
	} else {
		this.dna = {}
		this.dna.foodAttraction = Math.random() * 3 - 1.5
		this.dna.poisonAttraction = Math.random() * 3 - 1.5
		this.dna.foodPerception = Math.random() * (200 - 10) + 10
		this.dna.poisonPerception = Math.random() * (200 - 10) + 10
	}
}

Vehicle.prototype.getSteeringForce = function(particle) {
	var direction = particle.position.copy().sub(this.position)
	direction.setMag(this.config.maxSpeed)
	var steer = direction.sub(this.velocity)
	steer.limitMag(this.config.maxForce)
	return steer
}

Vehicle.prototype.find = function(particles, perception) {
	var record = Infinity
	var nearestParticle = null
	for(var i = 0; i < particles.length; i++) {
		var distance = this.position.getDistanceTo(particles[i].position)
		if(distance < record && distance < perception) {
			record = distance
			nearestParticle = particles[i]
		}
		if(distance < this.config.size) {
			this.eat(particles[i])
		}
	}
	if(nearestParticle != null) {
		return this.getSteeringForce(nearestParticle)
	} else {
		return new Vector(0, 0)
	}
}

Vehicle.prototype.eat = function(particle) {
	if(particle.type == 'food') {
		this.health += this.config.healthGainedWithFood
	} else if(particle.type == 'poison') {
		this.health += this.config.healthGainedWithPoison
	}
	particle.reset()
}

Vehicle.prototype.update = function(food, poison) {
	var foodSteer = this.find(food, this.dna.foodPerception)
	var poisonSteer = this.find(poison, this.dna.poisonPerception)
	foodSteer.mult(this.dna.foodAttraction)
	poisonSteer.mult(this.dna.poisonAttraction)
	this.acceleration.add(foodSteer)
	this.acceleration.add(poisonSteer)

	this.health += this.config.healthGainedEachFrame

	this.checkForBorders()
	this.move()
	this.draw()
}

Vehicle.prototype.clone = function() {
	if(Math.random() < this.config.cloneRate) {
		console.log('clone')
		return new Vehicle(this.scene, this.position.x, this.position.y, Object.assign({}, this.dna))
	}
}

Vehicle.prototype.mutate = function() {
	if(Math.random() < this.config.mutationRate) {
		console.log('mutation')
		this.dna.foodAttraction += (Math.random() * 2 - 1) * this.config.attractionMutationScale
	}
	if(Math.random() < this.config.mutationRate) {
		console.log('mutation')
		this.dna.poisonAttraction += (Math.random() * 2 - 1) * this.config.attractionMutationScale
	}
	if(Math.random() < this.config.mutationRate) {
		console.log('mutation')
		this.dna.foodPerception += (Math.random() * 2 - 1) * this.config.perceptionMutationScale
		if(this.dna.foodPerception < 0) { this.dna.foodPerception = 0 }
	}
	if(Math.random() < this.config.mutationRate) {
		console.log('mutation')
		this.dna.poisonPerception += (Math.random() * 2 - 1) * this.config.perceptionMutationScale
		if(this.dna.poisonPerception < 0) { this.dna.poisonPerception = 0 }
	}
}

Vehicle.prototype.move = function() {
	this.velocity.add(this.acceleration)
	this.velocity.limitMag(this.config.maxSpeed)
	this.position.add(this.velocity)
	this.acceleration = new Vector(0, 0)
}

Vehicle.prototype.draw = function() {
	if(this.scene.debug) {
		this.scene.canvas.line(this.position.x, this.position.y, 80 * this.dna.foodAttraction, this.velocity.getHeading(), '#aee87f', 4)
		this.scene.canvas.line(this.position.x, this.position.y, 80 * this.dna.poisonAttraction, this.velocity.getHeading(), '#e27261', 4)
		this.scene.canvas.circle(this.position.x, this.position.y, this.dna.foodPerception, null, '#aee87f')
		this.scene.canvas.circle(this.position.x, this.position.y, this.dna.poisonPerception, null, '#e27261')
	}
	this.color = lerpColor('#e27261', this.config.defaultColor, this.health)
	this.scene.canvas.triangle(this.position.x, this.position.y, this.config.size, this.velocity.getHeading(), this.color, null)
}

Vehicle.prototype.checkForBorders = function() {
	var border = 10
	var direction = null

	if (this.position.x < border) {
		direction = new Vector(this.config.maxSpeed, this.velocity.y)
	} else if (this.position.x > this.scene.canvas.element.width - border) {
		direction = new Vector(-this.config.maxSpeed, this.velocity.y)
	}
	if (this.position.y < border) {
		direction = new Vector(this.velocity.x, this.config.maxSpeed)
	} else if (this.position.y > this.scene.canvas.element.height - border) {
		direction = new Vector(this.velocity.x, -this.config.maxSpeed)
	}

	if (direction != null) {
		direction.setMag(this.config.maxSpeed)
		var steer = direction.sub(this.velocity)
		steer.limitMag(this.config.maxForce)
		this.acceleration.add(steer)
	}
}

function lerpColor(a, b, amount) {
	if(amount > 1) { amount = 1 }
	var ah = parseInt(a.replace(/#/g, ''), 16),
		ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
		bh = parseInt(b.replace(/#/g, ''), 16),
		br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
		rr = ar + amount * (br - ar),
		rg = ag + amount * (bg - ag),
		rb = ab + amount * (bb - ab)
	return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1)
}

var scene = new Scene()

function summon() {
	scene.vehicle.push(new Vehicle(scene, 0, 0, {foodAttraction: 2, poisonAttraction: -1.9, foodPerception: 200, poisonPerception: 50}))
}