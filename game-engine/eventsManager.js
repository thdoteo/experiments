/**
 * EventsManager
 */

var EventsManager = function(events) {
	this.events = []

	this.load(events)
}

EventsManager.prototype.load = function(events) {
	console.log(events)
}