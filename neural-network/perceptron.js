var NeuralNetwork = function(numberOfInputs, numberOfNeurons, numberOfOutputs) {
	this.inputsNodeNumber = numberOfInputs
	this.neuronsNodeNumber = numberOfNeurons
	this.outputsNodeNumber = numberOfOutputs
}

var Matrix = function(rows, cols) {
	this.rows = rows
	this.cols = cols
	this.matrix = []
}

Matrix.prototype.show = function() {
	console.table(this.matrix)
}

Matrix.prototype.iterate = function(callback) {
	for(var row = 0; row < this.rows; row++) {
		for(var col = 0; col < this.cols; col++) {
			callback(this.matrix, row, col)
		}
	}
}

Matrix.prototype.init = function(random) {
	this.iterate(function(matrix, row, col) {
		if(typeof matrix[row] != 'object') {
			matrix[row] = []
		}
		if(random) matrix[row][col] = Math.floor(Math.random() * 10)
		else matrix[row][col] = 0
	})
}

Matrix.prototype.add = function(n) {
	this.iterate(function(matrix, row, col) {
		if(n instanceof Matrix) matrix[row][col] += n.matrix[row][col]
		else matrix[row][col] += n
	})
}

Matrix.prototype.multiply = function(n) {
	this.iterate(function(matrix, row, col) {
		if(n instanceof Matrix) matrix[row][col] *= n.matrix[row][col]
		else matrix[row][col] *= n
	})
}

var m1 = new Matrix(3, 2)
var m2 = new Matrix(3, 2)
m1.init(true)
m2.init(true)
m1.show()
m2.show()

var Perceptron = function(inputsNumber, learningRate) {
	this.inputsNumber = inputsNumber
	this.learningRate = learningRate
	this.weights = []

	this.setup()
}

Perceptron.prototype.setup = function() {
	// Choose random weights
	for(var i = 0; i < this.inputsNumber; i++) {
		this.weights[i] = Math.random() * 2 - 1
	}
}

Perceptron.prototype.getWeights = function() {
	return this.weights
}

Perceptron.prototype.activate = function(sum) {
	if (sum >= 0) { return 1 }
	return -1
}

Perceptron.prototype.guess = function(inputs) {
	var sum = 0
	for(var i = 0; i < this.weights.length; i++) {
		sum += inputs[i] * this.weights[i]
	}
	return this.activate(sum)
}

Perceptron.prototype.train = function(inputs, target) {
	var guess = this.guess(inputs)
	var error = target - guess

	// Tune all weights
	for(var i = 0; i < this.weights.length; i++) {
		this.weights[i] += error * inputs[i] * this.learningRate
	}
}