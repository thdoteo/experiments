function toggleHour(hour, am = true) {
	if (hour == 12 && am) {
		document.querySelectorAll('.clock-midnight').forEach(function (e) {
			e.classList.toggle('clock-letter_active')
		})
	} else if (hour == 12) {
		document.querySelectorAll('.clock-noon').forEach(function (e) {
			e.classList.toggle('clock-letter_active')
		})
	} else {
		document.querySelectorAll('.clock-' + hour).forEach(function (e) {
			e.classList.toggle('clock-letter_active')
		})
	}
}

function setMinutes(minutes) {
	let selector = ''

	if (minutes == 0) {
		selector = '.clock-oclock'
	} else if (minutes == 5) {
		selector = '.clock-five'
	} else if (minutes == 10) {
		selector = '.clock-ten'
	} else if (minutes == 15) {
		selector = '.clock-quarter'
	} else if (minutes == 20) {
		selector = '.clock-twenty'
	} else if (minutes == 25) {
		selector = '.clock-twenty, .clock-five'
	} else if (minutes == 30) {
		selector = '.clock-half'
	}

	if(selector != '') {
		document.querySelectorAll(selector).forEach(function (e) {
			e.classList.toggle('clock-letter_active')
		})
	}
}

function togglePastTo(past, minutes) {
	if (minutes != 0) {
		if(past) {
			document.querySelectorAll('.clock-past').forEach(function (e) {
				e.classList.toggle('clock-letter_active')
			})
		} else {
			document.querySelectorAll('.clock-to').forEach(function (e) {
				e.classList.toggle('clock-letter_active')
			})
		}
	}
}

function update() {
	document.querySelectorAll('.clock-letter').forEach(function (e) {
		e.classList.remove('clock-letter_active')
	})

	let date = new Date()
	let hours = date.getHours() % 12
	let minutes = Math.round(date.getMinutes() / 5) * 5
	let am = true
	let past = true

	// AM or PM ?
	if (date.getHours() >= 12) {
		am = false
	}
	if (hours == 0) { hours = 12 }

	// PAST or TO ?
	if (minutes >= 35) {
		past = false
	}
	if (!past) {
		hours++
		minutes = 60 - minutes
	}

	document.querySelectorAll('.clock-its').forEach(function (e) {
		e.classList.add('clock-letter_active')
	})
	toggleHour(hours, am)
	setMinutes(minutes)
	togglePastTo(past, minutes)

	window.setTimeout(function () {
		update()
	}, 10 * 1000)
}

update()