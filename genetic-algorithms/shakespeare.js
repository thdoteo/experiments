var Population = function(goal) {
	this.elements = []
	this.goal = goal
	this.bestElement
	this.maxFitness = 0
	this.generation = 0
	this.mutationRate = 0.01

	this.create = function(numberOfElements) {
		for(var i = 0; i < numberOfElements; i++) {
			this.elements[i] = new Element()
			this.elements[i].create(this.goal.length)
		}
	}

	this.getAnInterestingParent = function() {
		while(true) {
			var parentId = Math.floor(Math.random() * this.elements.length)
			var parent = this.elements[parentId]
			var r = Math.floor(Math.random() * this.maxFitness)
			if(r < parent.fitness) {
				return parent
			}
		}
	}

	// Calculate fitness for each element and get maxFitness
	this.selection = function() {
		this.bestElement = new Element()
		this.bestElement.fitness = 0

		for(var i = 0; i < this.elements.length; i++) {
			this.elements[i].selection(this.goal)
			if(this.elements[i].fitness > this.bestElement.fitness) {
				this.bestElement = this.elements[i]
			}
		}
		this.maxFitness = this.bestElement.fitness
		return this.bestElement
	}

	this.reproduction = function() {
		var newElements = []

		for(var i = 0; i < this.elements.length; i++) {
			// Pick the two best elements/parents
			var parentA = this.getAnInterestingParent()
			var parentB = this.getAnInterestingParent()
			var genesOfParentA = parentA.genes
			var genesOfParentB = parentB.genes

			// Create a child by combining genes of these two parents
			var child = new Element()
			child.crossover(genesOfParentA, genesOfParentB, Math.floor(this.goal.length / 2))

			// Mutate the child genes
			child.mutate(this.mutationRate)

			// Add the new child to the new population
			newElements.push(child)
		}

		// Replace the old population with the new population
		this.elements = newElements

		this.generation++
		console.log('generation: ' + this.generation + '. maxFitness: ' + this.maxFitness)
	}
}

var Element = function() {
	this.genes = []
	this.fitness = 0

	this.create = function(numberOfGenes) {
		for(var i = 0; i < numberOfGenes; i++) {
			this.genes[i] = this.getRandomGeneValue()
		}
	}

	this.crossover = function(genesOfParentA, genesOfParentB, middle) {
		for(var i = 0; i < genesOfParentA.length; i++) {
			if(i < middle) {
				this.genes[i] = genesOfParentA[i]
			} else {
				this.genes[i] = genesOfParentB[i]
			}
		}
	}

	this.mutate = function(probability) {
		for(var i = 0; i < this.genes.length; i++) {
			if(Math.random() < probability) {
				this.genes[i] = this.getRandomGeneValue()
			}
		}
	}

	this.selection = function(goal) {
		var score = 0
		for(var i = 0; i < this.genes.length; i++) {
			if(this.genes[i] == goal.charAt(i)) {
				score++
			}
		}
		this.fitness = Math.pow(score, 2) * 100 / Math.pow(this.genes.length, 2)
	}

	this.getGenesValues = function() {
		var string = ''
		for(var i = 0; i < this.genes.length; i++) {
			string += this.genes[i]
		}
		return string
	}

	this.getRandomGeneValue = function() {
		var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz .'
		return chars.charAt(Math.floor(Math.random() * chars.length))
	}
}

var goal = 'Je suis heureux.'

var population = new Population(goal)
population.create(500)
population.selection()
population.reproduction()

function find() {
	var bestElement = population.selection()
	
	document.getElementById('goal').innerHTML = bestElement.getGenesValues()
	if(bestElement.fitness == 100) {
		console.log('Found: ' + bestElement.getGenesValues())
	} else {
		population.reproduction()
		requestAnimationFrame(find)
	}
}

find()