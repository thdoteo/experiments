var count = 0
var numberOfPoints = 200
var width = 600
var height = 600
var xmin = -1
var ymin = -1
var xmax = 1
var ymax = 1

// The function to describe a line
function f(x) { return 2 * x + 0.9 }

// Create a random set of training points and calculate the "known" answer
var training = []
for (var i = 0; i < numberOfPoints; i++) {
	var x = Math.random() * 2 - 1
	var y = Math.random() * 2 - 1
	if(y > f(x)) { var answer = 1 }
	else { var answer = -1 }
	training[i] = {input: [x, y, 1], output: answer}
}

var app = new App()

app.setup(function(app) {
	app.perceptron = new Perceptron(3, 0.001)
})

app.update(function(app) {
	// Draw the line
	var x1 = numberScale(xmin, xmin, xmax, 0, width)
	var y1 = numberScale(f(xmin), ymin, ymax, height, 0)
	var x2 = numberScale(xmax, xmin, xmax, 0, width)
	var y2 = numberScale(f(xmax), ymin, ymax, height, 0)
	app.canvas.line(x1, y1, x2, y2, 'blue', 2)

	// Draw the line based on the current weights
	// Formula is weights[0]*x + weights[1]*y + weights[2] = 0
	var weights = app.perceptron.getWeights()
	var x1 = -1
	var y1 = (-weights[2] - weights[0] * x1) / weights[1]
	var x2 = 1
	var y2 = (-weights[2] - weights[0] * x2) / weights[1]
	var x1 = numberScale(x1, xmin, xmax, 0, width)
	var y1 = numberScale(y1, ymin, ymax, height, 0)
	var x2 = numberScale(x2, xmin, xmax, 0, width)
	var y2 = numberScale(y2, ymin, ymax, height, 0)
	app.canvas.line(x1, y1, x2, y2, 'green', 2)

	var m = -weights[0] / weights[1]
	var b = -weights[2] / weights[1]
	document.getElementById('currentFormula').innerHTML = 'y=' + m + 'x + ' + b

	// Train the Perceptron with one "training" point at a time
	app.perceptron.train(training[count].input, training[count].output)
	count = (count + 1) % training.length

	// Draw all the points based on what the Perceptron would "guess"
	for (var i = 0; i < numberOfPoints; i++) {
		var guess = app.perceptron.guess(training[i].input)
		var x = numberScale(training[i].input[0], xmin, xmax, 0, width)
		var y = numberScale(training[i].input[1], ymin, ymax, height, 0)
		if (training[i].output == guess) {
			app.canvas.circle(x, y, 3, 'green')
		} else {
			app.canvas.circle(x, y, 3, 'red')
		}
	}
})