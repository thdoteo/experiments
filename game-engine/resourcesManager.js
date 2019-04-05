/**
 * ResourcesManager
 */

var ResourcesManager = function(resources) {
	this.resources = []
	this.loadingManager = new THREE.LoadingManager()
	this.callback
	this.numberOfTotalResources = 0
	this.numberOfResourcesLoaded = 0

	this.load(resources)
}

ResourcesManager.prototype.add3D = function(id, url, castShadow) {
	var self = this
	this.mtlLoader.load(url + '.mtl', function(materials) {
		materials.preload()
		var objLoader = new THREE.OBJLoader(this.loadingManager)
		objLoader.setMaterials(materials)
		objLoader.load(url + '.obj', function(mesh) {
			mesh.traverse(function(node) {
				if(node instanceof THREE.Mesh) {
					node.castShadow = castShadow
					node.receiveShadow = true
				}
			})
			self.resources[id] = mesh
			self.numberOfResourcesLoaded++
			if(self.numberOfResourcesLoaded == self.numberOfTotalResources) {
				self.callback()
			}
		})
	})
}

ResourcesManager.prototype.addWorld = function(resource, url) {
	let request = new XMLHttpRequest()
	request.open('GET', url + '.json', true)
	request.send(null)
	var self = this
	request.onreadystatechange = function(event) {
		if(this.readyState === XMLHttpRequest.DONE) {
			if(this.status === 200) {
				self.resources[resource] = JSON.parse(request.responseText)
				self.numberOfResourcesLoaded++
			}
		}
	}
}

ResourcesManager.prototype.load = function(resources) {
	this.mtlLoader = new THREE.MTLLoader(this.loadingManager)
	this.numberOfTotalResources = Object.keys(resources).length
	for(let resource in resources) {
		if(resources[resource].type == '3D') {
			this.add3D(resource, resources[resource].url, resources[resource].castShadow)
		} else if(resources[resource].type == 'world') {
			this.addWorld(resource, resources[resource].url)
		}
	}
}

ResourcesManager.prototype.get = function(id) {
	return this.resources[id]
}

ResourcesManager.prototype.onComplete = function(callback) {
	this.callback = callback
}