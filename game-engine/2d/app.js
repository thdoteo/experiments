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

var Canvas = function() {
	this.element = document.createElement('canvas')
	this.element.width = window.innerWidth
	this.element.height = window.innerHeight
	document.body.appendChild(this.element)
	this.context = this.element.getContext('2d')

	var self = this
	window.addEventListener('resize', function() {
		self.element.width = window.innerWidth
		self.element.height = window.innerHeight
	})
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

	if(background != null) {
		this.context.fillStyle = background
		this.context.fill()
	}
	if(border != null) {
		this.context.strokeStyle = border
		this.context.stroke()
	}

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

Canvas.prototype.image = function(image, x, y, width, height) {
	this.context.drawImage(image, x, y, width, height)
}

/**
 * ResourcesManager
 */

var ResourcesManager = function() {
	this.resources = []

	this.resourcesContainer = document.createElement('div')
	this.resourcesContainer.id = 'resources'
	this.resourcesContainer.style.display = 'none'
	document.body.appendChild(this.resourcesContainer)
}

ResourcesManager.prototype.add = function(id, url) {
	let resource = document.createElement('img')
	resource.id = id
	resource.src = url
	this.resources[id] = this.resourcesContainer.appendChild(resource)
}

ResourcesManager.prototype.load = function(resources) {
	for(let resource in resources) {
		this.add(resource, resources[resource])
	}
}

ResourcesManager.prototype.get = function(id) {
	return this.resources[id]
}

/**
 * Game
 */

document.addEventListener('click', function(e) {
	console.log(Math.floor(e.clientX / 64), Math.floor(e.clientY / 64))
})

var Game = function() {
	this.debug = true

	this.map = [
		{object: 'tree', x: 1, y: 1},
		{object: 'tree', x: 1, y: 0},
		{object: 'tree', x: 2, y: 0},
		{object: 'tree', x: 3, y: 0},
		{object: 'tree', x: 5, y: 0},
		{object: 'tree', x: 0, y: 1},
		{object: 'tree', x: 0, y: 2},
		{object: 'house', x: 4, y: 2},
		{object: 'rock', x: 5, y: 5}
	]
	this.config = {
		'tileSize': 80,
		'worldWidth': 10,
		'worldHeight': 10,
	}
	this.resources = {
		'grass': 'resources/Tile/medievalTile_57.png',
		'dirt': 'resources/Tile/medievalTile_13.png',
		'sand': 'resources/Tile/medievalTile_01.png',
		'stone': 'resources/Tile/medievalTile_15.png',
		'tree': 'resources/Environment/medievalEnvironment_02.png',
		'rock': 'resources/Environment/medievalEnvironment_09.png',
		'house': 'resources/Structure/medievalStructure_17.png',
		'player': 'resources/Unit/medievalUnit_24.png'
	}

	this.resourcesManager
	this.canvas
	this.world
	this.player

	this.setup()
	this.update()
}

Game.prototype.setup = function() {
	this.resourcesManager = new ResourcesManager()
	this.resourcesManager.load(this.resources)
	this.canvas = new Canvas()
	this.world = new World(this, this.config.worldWidth, this.config.worldHeight, this.config.tileSize, this.map)
	this.player = new Player(this, 3 * this.world.tileSize, 3 * this.world.tileSize)
}

Game.prototype.update = function() {
	this.canvas.clear()
	this.world.update()
	this.player.update()
	requestAnimationFrame(this.update.bind(this))
}

/**
 * World
 */

var World = function(game, width, height, tileSize, map) {
	this.game = game
	this.width = width
	this.height = height
	this.tileSize = tileSize
	this.map = map

	this.objects = []
}

World.prototype.update = function() {
	this.render()
}

World.prototype.render = function() {
	// Draw background
	let maxWidth = Math.ceil(this.game.canvas.element.width / this.tileSize)
	let maxHeight = Math.ceil(this.game.canvas.element.height / this.tileSize)
	for(let x = 0; x < maxWidth; x++) {
		for(let y = 0; y < maxHeight; y++) {
			this.game.canvas.image(this.game.resourcesManager.get('sand'), x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize)
		}
	}

	// Draw objects
	for(let x = 0; x < this.width; x++) {
		for(let y = 0; y < this.height; y++) {
			this.game.canvas.image(this.game.resourcesManager.get('grass'), x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize)
			for(let object in this.map) {
				if(x == this.map[object].x && y == this.map[object].y) {
					let newObject = new Object(this.game, this.map[object].object, x, y)
					this.objects.push(newObject)
				}
			}
		}
	}
}

/**
 * Object
 */

var Object = function(game, type, x, y) {
	this.game = game
	this.type = type
	this.position = new Vector(x, y)

	this.draw()
}

Object.prototype.draw = function() {
	this.game.canvas.image(
		this.game.resourcesManager.get(this.type),
		this.position.x * this.game.world.tileSize,
		this.position.y * this.game.world.tileSize,
		this.game.world.tileSize,
		this.game.world.tileSize
	)
}

/**
 * Player
 */

var Player = function(game, x , y) {
	this.game = game

	this.maxSpeed = 2
	
	this.position = new Vector(x, y)
	this.velocity = new Vector(0, 0)
	this.acceleration = new Vector(0, 0)
	this.destination = null

	this.initEvents()
}

// Player.prototype.getSteeringForce = function(particle) {
// 	var direction = particle.position.copy().sub(this.position)
// 	direction.setMag(this.config.maxSpeed)
// 	var steer = direction.sub(this.velocity)
// 	steer.limitMag(this.config.maxForce)
// 	return steer
// }

// Player.prototype.find = function(particles, perception) {
// 	return this.getSteeringForce(nearestParticle)
// }

Player.prototype.initEvents = function() {
	var self = this
	document.addEventListener('keypress', function(e) {
		if(e.key == 'z') {
			self.acceleration.add(new Vector(0, -100))
		} else if(e.key == 'q') {
			self.acceleration.add(new Vector(-100, 0))
		} else if(e.key == 'd') {
			self.acceleration.add(new Vector(100, 0))
		} else if(e.key == 's') {
			self.acceleration.add(new Vector(0, 100))
		}
	})
}

Player.prototype.update = function(food, poison) {
	this.move()
	this.draw()
}

Player.prototype.move = function() {
	this.velocity.add(this.acceleration)
	this.velocity.limitMag(this.maxSpeed)
	if(this.velocity.getMag() > 0) {
		this.velocity.div(1.18)
	}
	this.position.add(this.velocity)
	this.acceleration = new Vector(0, 0)
}

Player.prototype.draw = function() {
	this.game.canvas.image(this.game.resourcesManager.get('player') , this.position.x, this.position.y, this.game.world.tileSize, this.game.world.tileSize)
}