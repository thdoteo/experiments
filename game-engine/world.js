/**
 * World
 */

var World = function(game, map) {
	this.game = game

	this.map = map
	this.size

	this.floor = []
	this.environment = []
	this.objects = []

	this.render()
}

World.prototype.render = function() {
	var map = this.game.resourcesManager.get(this.map)
	this.size = map.size

	// Show grid
	let grid = new THREE.GridHelper(map.size, map.size, '#698e6c', '#698e6c')
	// this.game.scene.add(grid)

	// Render environment
	for(let i = 0; i < map.environment.length; i++) {
		let block = new Block(this.game, map.environment[i].resource, new Vector(map.environment[i].x, map.environment[i].y, map.environment[i].z))
		this.environment.push(block)
		this.floor.push(block.object)
	}

	// Render objects
	for(let i = 0; i < map.objects.length; i++) {
		let block = new Block(this.game, map.objects[i].resource, new Vector(map.objects[i].x, map.objects[i].y, map.objects[i].z), map.objects[i].rotation, map.objects[i].scale)
		this.objects.push(block)
	}
}

World.prototype.preventEscaping = function(position) {
	var floor = false
	let size = this.size / 2
	this.environment.forEach(function(block) {
		if(block.position.x == position.x && block.position.z == position.z) {
			floor = true
		}
	})
	if(floor && -size < position.x && position.x < size && -size < position.z && position.z < size) {
		return true
	}
}