/**
 * Block
 */

var Block = function(game, type, position, rotation, scale = 1) {
	this.game = game

	this.type = type
	this.position = position
	this.rotation = rotation
	this.scale = scale

	this.create()
}

Block.prototype.create = function() {
	this.object = this.game.resourcesManager.get(this.type).clone()

	if(this.type != 'grass') {
		this.object.scale.set(this.scale, this.scale, this.scale)
		this.setPosition(this.position)
		if(this.rotation != null) {
			this.object.rotation.y = this.rotation * Math.PI / 180
		}
	} else {
		this.object.scale.set(1/3, 1, 1/3)
		this.object.position.set(this.position.x - 0.5, -0.31 , this.position.z + 0.5)
	}
	this.game.scene.add(this.object)
}

Block.prototype.setPosition = function(position) {
	this.object.position.set(
		position.x,
		position.y,
		position.z
	)
}