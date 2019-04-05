/**
 * Player
 */

var Player = function(game, position) {
	this.game = game
	
	this.name = 'théo'

	this.object
	this.position = position
	this.facing = 'down'
	this.rotation = 0
	this.label

	this.render()
}

Player.prototype.render = function() {
	this.object = this.game.resourcesManager.get('player').clone()
	this.object.position.set(this.position.x, this.position.y, this.position.z)
	this.object.scale.set(1/12, 1/12, 1/12)
	this.object.rotation.y = this.getRotation()
	this.game.scene.add(this.object)
	this.createLabel()
}

Player.prototype.update = function() {
	this.updateLabelPosition()
}

Player.prototype.getRotation = function() {
	if(this.rotation > Math.PI) {
		this.rotation = this.rotation - 2 * Math.PI
		this.object.rotation.y = this.rotation
	} else if(this.rotation == - Math.PI) {
		this.rotation = Math.PI
		this.object.rotation.y = this.rotation
	}

	if(this.facing == 'up') {
		if(this.rotation == Math.PI) {
			this.rotation = 3 * Math.PI / 2
		} else {
			this.rotation = -Math.PI / 2
		}
	} else if(this.facing == 'left') {
		this.rotation = 0
	} else if(this.facing == 'right') {
		if(this.rotation == - Math.PI / 2) {
			this.rotation = - Math.PI
		} else {
			this.rotation = Math.PI
		}
	} else if(this.facing == 'down') {
		this.rotation = Math.PI / 2
	}
	
	return this.rotation
}

Player.prototype.move = function(direction) {
	let newPosition = new Vector(this.position.x, this.position.y, this.position.z)
	if(direction == 'up') { newPosition.x += -1 }
	else if(direction == 'left') { newPosition.z += 1 }
	else if(direction == 'right') { newPosition.z += -1 }
	else if(direction == 'down') { newPosition.x += 1 }

	this.facing = direction
	this.game.animationsManager.start('playerRotateAnimation')

	let insideWorld = this.game.world.preventEscaping(newPosition)
	let notAlreadyRunning = this.game.animationsManager.isAnimating('playerMoveAnimation')
	let collision = this.collision(newPosition)
	if(insideWorld && !notAlreadyRunning && !collision) {
		this.position = newPosition
		this.game.animationsManager.start('playerMoveAnimation')
		this.game.animationsManager.start('cameraMoveAnimation')
	}
}

Player.prototype.collision = function(newPosition) {
	let collision = false
	let futurePlayer = this.object.clone()
	futurePlayer.position.set(newPosition.x, newPosition.y, newPosition.z)
	let playerBox = new THREE.Box3().setFromObject(futurePlayer)

	for(index in this.game.world.objects) {
		let block = this.game.world.objects[index]
		let blockBox = new THREE.Box3().setFromObject(block.object)
		if(playerBox.intersectsBox(blockBox)) {
			collision = true
		}
	}
	
	return collision
}

Player.prototype.createLabel = function() {
	var label = document.createElement('div')
	label.textContent = this.name
	label.style.background = 'rgba(255, 255, 255, 0.3)'
	label.style.position = 'absolute'
	label.style.fontSize = '14px'
	label.style.top = '0'
	label.style.left = '0'
	label.style.padding = '6px 10px'
	document.body.appendChild(label)
	this.label = label
}

Player.prototype.updateLabelPosition = function() {
	var width = window.innerWidth, height = window.innerHeight
	var widthHalf = width / 2, heightHalf = height / 2
	var pos = this.object.position.clone()
	pos.project(this.game.camera)
	pos.x = (pos.x * widthHalf) + widthHalf - this.label.offsetWidth / 2
	pos.y = - (pos.y * heightHalf) + heightHalf - 150
	this.label.style.top = pos.y + 'px'
	this.label.style.left = pos.x + 'px'
}