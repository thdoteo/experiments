/**
 * AnimationsManager
 */

var AnimationsManager = function(game, animations) {
	this.game = game

	this.animations = []

	this.load(animations)
}

AnimationsManager.prototype.load = function(animations) {
	for(let animation in animations) {
		this.animations[animation] = {
			property: eval(animations[animation].property),
			to: animations[animation].to,
			duration: animations[animation].duration,
			easing: animations[animation].easing
		}
	}
}

AnimationsManager.prototype.start = function(id) {
	let animation = this.animations[id]
	let tempToProperties = {}
	if(animation.to instanceof Object) {
		for(key in animation.to) {
			tempToProperties[key] = eval(animation.to[key])
		}
	}

	this.animations[id].animating = true
	var self = this
	new TWEEN.Tween(animation.property).to(tempToProperties, animation.duration).easing(animation.easing).start().onComplete(function() {
		self.animations[id].animating = false
	})
}

AnimationsManager.prototype.isAnimating = function(id) {
	return this.animations[id].animating
}