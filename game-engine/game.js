/**
 * Game
**/

var Game = function() {
	this.config = {
		debug: true
	}
	this.resources = {
		'grass': {type: '3D', url: 'resources/nature/naturePack_001', castShadow: false},
		'tree': {type: '3D', url: 'resources/nature/naturePack_094', castShadow: true},
		'camp': {type: '3D', url: 'resources/nature/naturePack_095', castShadow: true},
		'player': {type: '3D', url: 'resources/player', castShadow: true},
		'world1': {type: 'world', url: 'resources/world1'}
	}
	this.animations = {
		playerRotateAnimation: {
			'property': 'this.game.player.object.rotation',
			'to': {y: 'this.game.player.getRotation()'},
			'duration': 150,
			'easing': TWEEN.Easing.Linear.None
		},
		playerMoveAnimation: {
			'property': 'this.game.player.object.position',
			'to': {x: 'this.game.player.position.x', z: 'this.game.player.position.z'},
			'duration': 200,
			'easing': TWEEN.Easing.Linear.None
		},
		cameraMoveAnimation: {
			'property': 'this.game.camera.position',
			'to': {x: '4 + this.game.player.position.x', z: 'this.game.player.position.z'},
			'duration': 200,
			'easing': TWEEN.Easing.Linear.None
		}
	}
	this.events = {

	}

	this.ressourcesManager
	this.animationsManager
	this.eventsManager
	this.world
	this.player
	this.mouse
	this.raycaster
	this.moveIndicator

	this.setup()
}

Game.prototype.setup = function() {
	if(this.config.debug) { this.stats = new Stats(); this.stats.setMode(0); this.stats.domElement.style.position = 'absolute'; this.stats.domElement.style.left = '0px'; this.stats.domElement.style.bottom = '0px'; document.body.appendChild(this.stats.domElement); }

	var self = this
	this.resourcesManager = new ResourcesManager(this.resources)
	this.resourcesManager.onComplete(function() {
		self.initScene()
		self.bindEvents()
		self.world = new World(self, 'world1')
		self.player = new Player(self, new Vector(0, 0, 0))
		self.animationsManager = new AnimationsManager(self, self.animations)
		self.eventsManager = new EventsManager(self.events)
		self.update()
	})
}

Game.prototype.initScene = function() {
	// Scene
	this.scene = new THREE.Scene()

	this.raycaster = new THREE.Raycaster()
	this.mouse = new THREE.Vector2()
	var cubeGeometry = new THREE.CubeGeometry(1, 0, 1)
	var cubeMaterial = new THREE.MeshBasicMaterial({color: '#fff', transparent: true, opacity: 0.2})
	this.moveIndicator = new THREE.Mesh(cubeGeometry, cubeMaterial)
	this.moveIndicator.position.set(0, 0, 0)
	this.scene.add(this.moveIndicator)

	// Camera
	this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000)
	this.camera.position.set(4, 6, 0)
	this.camera.lookAt(this.scene.position)

	// Light
	var ambientLight = new THREE.AmbientLight(0xf4e8ab, 1.1)
	this.scene.add(ambientLight)
	var light = new THREE.PointLight(0xf4e8ab, 0.4, 0)
	light.position.set(60, 80, -60)
	light.castShadow = true
	this.scene.add(light)

	// Renderer
	this.renderer = new THREE.WebGLRenderer({ alpha: true })
	this.renderer.shadowMap.enabled = true
	this.renderer.shadowMap.type = THREE.BasicShadowMap
	this.renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(this.renderer.domElement)
}

Game.prototype.bindEvents = function() {
	var self = this
	window.addEventListener('resize', this, false)
	document.addEventListener('mousemove', this, false)
	document.addEventListener('click', this, false)
	keyboardJS.bind('up', function() { self.player.move('up') })
	keyboardJS.bind('down', function() { self.player.move('down') })
	keyboardJS.bind('left', function() { self.player.move('left') })
	keyboardJS.bind('right', function() { self.player.move('right') })
}

Game.prototype.handleEvent = function(event) {
	if(event.type == 'resize') {
		this.renderer.setSize(window.innerWidth, window.innerHeight)
		this.camera.aspect = window.innerWidth / window.innerHeight
		this.camera.updateProjectionMatrix()
	} else if(event.type == 'mousemove') {
		this.updateMoveIndicator(event.clientX, event.clientY)
	} else if(event.type == 'click') {
		console.log(this.moveIndicator.position)
	}
}

Game.prototype.updateMoveIndicator = function(x, y) {
	this.mouse.set((x / window.innerWidth) * 2 - 1, - (y / window.innerHeight) * 2 + 1)
	this.raycaster.setFromCamera(this.mouse, this.camera)
	var intersects = this.raycaster.intersectObjects(this.world.floor, true)
	if(intersects.length > 0) {
		this.scene.add(this.moveIndicator)
		let position = intersects[0].object.parent.position
		this.moveIndicator.position.set(Math.ceil(position.x), Math.ceil(position.y), Math.floor(position.z))
	} else {
		this.scene.remove(this.moveIndicator)
	}
}

Game.prototype.changeWorld = function(id) {
	while(this.scene.children.length > 0) {
		this.scene.remove(this.scene.children[0])
	}
	this.world = new World(this, id)
}

Game.prototype.update = function() {
	if(this.config.debug) { this.stats.begin() }

	// this.scene.rotation.y += 0.002
	this.player.update()
	TWEEN.update()

	this.renderer.render(this.scene, this.camera)
	if(this.config.debug) { this.stats.end() }
	requestAnimationFrame(this.update.bind(this))
}