var App = function() {
	this.rotation = 0;
	this.here = true;
	this.treeLevel = 1;
	this.lastAddedTrunk;
	this.timerId;

	var self = this;
	this.initResources(function() {
		self.initRenderer();
		self.initScene();
		self.bindEvents();
		self.update();
		self.timer();
	});
}

App.prototype.initResources = function(callback) {
	this.blopSound = new Audio('ressources/blop.mp3'); this.blopSound.volume = 1;
	this.sawSound = new Audio('ressources/saw.mp3'); this.sawSound.volume = 0.9;

	this.floor = new THREE.Mesh(new THREE.CubeGeometry(6, 0.65, 6), new THREE.MeshLambertMaterial({color: 0x79a257}));

	var jsonLoader = new THREE.JSONLoader();
	var self = this;
   	jsonLoader.load('ressources/leaves.js', function(geometry, materials) {
   		self.leaves = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));
   		callback();
   	});
}

App.prototype.initRenderer = function() {
	this.scene = new THREE.Scene();

	this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
	this.camera.position.set(0, 5, 15);
	this.camera.lookAt(new THREE.Vector3(0, 0, 0));

	this.firstLight = new THREE.DirectionalLight(0xffffff, 0.3);
    this.firstLight.position.set(-200, 100, 0);
    this.secondLight = new THREE.AmbientLight(0x404040, 3.5);

	this.renderer = new THREE.WebGLRenderer({ alpha: true });
	this.renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(this.renderer.domElement);
}

App.prototype.initScene = function() {
	//this.scene.add(this.floor);
	this.floor.position.set(0, -0.75, 0);

	this.lastAddedTrunk = new THREE.Mesh(new THREE.CubeGeometry(1, 1, 1), new THREE.MeshLambertMaterial({color: 0x3d2e1a}));
	this.scene.add(this.lastAddedTrunk);
	this.lastAddedTrunk.position.set(0, 0, 0);

	this.scene.add(this.leaves);
	this.leaves.position.set(0, 0, 0);

	this.scene.add(this.firstLight);
	this.scene.add(this.secondLight);
	this.scene.add(this.camera);
}

App.prototype.update = function() {
	this.camera.position.x = (15 + this.treeLevel) * Math.sin(0.002 * (-this.rotation));
	this.camera.position.z = (15 + this.treeLevel) * Math.cos(0.002 * (-this.rotation));
	this.camera.lookAt(new THREE.Vector3(0, this.treeLevel / 2, 0));
	this.rotation++;

	this.renderer.render(this.scene, this.camera);
	requestAnimationFrame(this.update.bind(this));
}

App.prototype.timer = function() {
	var self = this;
	this.timerId = setTimeout(function() {
	    	self.blopSound.play();
	    	self.leaves.position.y += 1;
	    	self.lastAddedTrunk = new THREE.Mesh(new THREE.CubeGeometry(1, 1, 1), new THREE.MeshLambertMaterial({color: 0x3d2e1a}));
			self.scene.add(self.lastAddedTrunk);
			self.treeLevel++;
			self.lastAddedTrunk.position.set(0, self.treeLevel - 1, 0);
			self.camera.position.y += 1;
			self.timer();
			console.log('treeLevel: ' + self.treeLevel);
	}, 10 * 1000);
}

App.prototype.bindEvents = function() {
	window.addEventListener('resize', this, false);
	document.addEventListener('mouseout', this, false);
	document.addEventListener('mousemove', this, false);
}

App.prototype.handleEvent = function(event) {
	if(event.type == 'resize') {
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
	}
	else if (event.type == 'mouseout') {
		event = event ? event : window.event;
	    var from = event.relatedTarget || event.toElement;
	    if (!from || from.nodeName == "HTML") {
	    	clearTimeout(this.timerId);
	        if(this.treeLevel > 0) {
		        this.sawSound.play();
		        var self = this;
		        setTimeout(function() {
			        self.here = false;
			        self.scene.remove(self.lastAddedTrunk);
			        self.leaves.position.y -= 1;
			        self.treeLevel -= 1;
			        self.camera.position.y -= 1;
			        console.log('treeLevel: ' + self.treeLevel);
		        }, 3000);
	        }
	    }
	}
	else if(event.type == 'mousemove') {
		if(this.here == false) {
			this.timer();
		}
		this.here = true;
	}
}