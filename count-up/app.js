var now;

function countUp(date) {
	if(date.getTime() <= now.getTime()) {
		setValue('years', getElapsedYears(date, now));
		setValue('months', getElapsedMonths(date, now));
		setValue('days', getElapsedDays(date, now));
		setValue('hours', getElapsedHours(date, now));
		setValue('minutes', getElapsedMinutes(date, now));
		setValue('seconds', getElapsedSeconds(date, now));
	}

	setTimeout(function() {
		now = new Date(now.getTime() + 1000);
		countUp(date, now);
	}, 1000);
}

function setValue(element, value) {
	$('.' + element).children('.value').text(value);
}

function updateCurrentDate() {
	now = new Date();

	$.ajax({
		type: "GET",
		url: "/getservsertime.php",
		success: function (data) {
			now = new Date();
			if(data != '') {
				var partsArray = data.split('-');
				now = new Date();
				now.setYear(partsArray[0]);
				now.setMonth(partsArray[1] - 1);
				now.setDate(partsArray[2]);
				now.setHours(partsArray[3]);
				now.setMinutes(partsArray[4]);
				now.setSeconds(partsArray[5]);
				now.setMilliseconds('00');
			}
		}
	});
}

function daysInMonth(year, month) {
	if(month == 2) { return 31; }
	var monthStart = new Date(year, month, 1);
	var monthEnd = new Date(year, month + 1, 1);
	var monthLength = (monthEnd - monthStart) / (1000 * 60 * 60 * 24);
	return Math.floor(monthLength);
}

/**
 * YEARS
 */
function getElapsedYears(date, now) {
	if(now.getMonth() <= date.getMonth() && now.getDate() <= date.getDate() && now.getHours() <= date.getHours() && now.getMinutes() <= date.getMinutes() && now.getSeconds() < date.getSeconds()) {
		return now.getFullYear() - date.getFullYear() - 1;
	} else {
		return now.getFullYear() - date.getFullYear();
	}
}

/**
 * MONTHS
 */
function getElapsedMonths(date, now) {
	//Jan, Feb
	if(now.getMonth() < date.getMonth()) {
		if(now.getDate() >= date.getDate() && now.getMinutes() >= date.getMinutes()) {
			return 11 - date.getMonth() + now.getMonth() + 1;
		} else {
			return 11 - date.getMonth() + now.getMonth();
		}
	}
		
	//Mar
	else if(now.getMonth() == date.getMonth()){
		if(now.getDate() >= date.getDate() && now.getHours() >= date.getHours() && now.getMinutes() >= date.getMinutes()) {
			return '0';
		} else  {
			return '11';
		}
	}

	//April, May, June, July, September, October, November, December
	else if(now.getMonth() > date.getMonth()) {
		if(now.getDate() >= date.getDate() && now.getMinutes() >= date.getMinutes()) {
			return now.getMonth() - date.getMonth();
		} else {
			return now.getMonth() - date.getMonth() - 1;
		}
	}
}

/**
 * DAYS
 */
function getElapsedDays(date, now) {
	var daysinlastmonth = daysInMonth(now.getFullYear(), now.getMonth() - 1);

	if(now.getMonth() == date.getMonth() && now.getFullYear() == date.getFullYear()) {
		daysinlastmonth = daysInMonth(now.getFullYear(), now.getMonth());
	}

	//1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ... 25, 26
	if(now.getDate() < date.getDate()) {
		if(now.getHours() >= date.getHours() && now.getMinutes() >= date.getMinutes()) { //Si après/pendant 16h30 -> véritable date
			return now.getDate() + daysinlastmonth - date.getDate();
		} else { //Si avant 16h30 -> véritable date - 1
			return now.getDate() + daysinlastmonth - date.getDate() - 1;
		}
	}

	//27
	else if(now.getDate() == date.getDate()) {
		if(now.getHours() >= date.getHours() && now.getMinutes() >= date.getMinutes()) { //Si après/pendant 16h30 -> 0
			return '0';
		} else { //Si avant 16h30 -> véritable date
			return now.getDate() + daysinlastmonth - date.getDate() - 1;
		}
	}

	//28, 29, 30, 31
	else if(now.getDate() > date.getDate()) {
		if(now.getHours() >= date.getHours() && now.getMinutes() >= date.getMinutes()) {
			return now.getDate() - date.getDate();
		} else {
			return now.getDate() - date.getDate() - 1;
		}
	}
}

/**
 * HOURS
 */
function getElapsedHours(date, now) {
	//01, 02, 03, 04, 05, 06, 07 ... 14, 15
	if(now.getHours() < date.getHours()) {
		if(now.getMinutes() >= date.getMinutes()) {
			return now.getHours() + 24 - date.getHours();
		} else {
			return now.getHours() + 24 - date.getHours() - 1;
		}
	}

	//16
	else if(now.getHours() == date.getHours()){
		if(now.getMinutes() >= date.getMinutes()) {
			return '0';
		} else {
			return '23';
		}
	}

	//17, 18, 19 ... 23, 24
	else if(now.getHours() > date.getHours()) {
		if(now.getMinutes() >= date.getMinutes() && now.getSeconds() >= date.getSeconds()) {
			return now.getHours() - date.getHours();
		} else {
			return now.getHours() - date.getHours() - 1;
		}
	}
}

/**
 * MINUTES
 */
function getElapsedMinutes(date, now) {
	//01, 02, 03, 04, 05, 06, 07 ... 14, 29
	if(now.getMinutes() < date.getMinutes()) {
		return (60 - date.getMinutes()) + now.getMinutes();
	}

	//30
	else if(now.getMinutes() == date.getMinutes()){
		if(now.getSeconds() >= date.getSeconds()) {
			return date.getMinutes() - now.getMinutes();
		} else {
			return 59;
		}
	}

	//31, 59
	else if(now.getMinutes() > date.getMinutes()) {
		if(now.getSeconds() >= date.getSeconds()) {
			return now.getMinutes() - date.getMinutes();
		} else {
			return now.getMinutes() - date.getMinutes() - 1;
		}
	}
}

/**
 * SECONDS
 */
function getElapsedSeconds(date, now) {
	//01, 02, 03, 04, 05, 06, 07 ... 19
	if(now.getSeconds() < date.getSeconds()) {
		return (60 - date.getSeconds()) + now.getSeconds();
	}

	//20
	else if(now.getSeconds() == date.getSeconds()) {
		return 0;
	}

	//21, 18, 19 ... 23, 59
	else if(now.getSeconds() > date.getSeconds()) {
		return now.getSeconds() - date.getSeconds();
	}
}

$(document).ready(function() {
	var date = new Date();
	date.setYear('2019');
	date.setMonth('02'); //Jan : 00, Feb : 01, Mar : 02
	date.setDate('09');
	date.setHours('18');
	date.setMinutes('36');
	date.setSeconds('20');
	date.setMilliseconds('00'); //You can't change this value.

	$(window).focus(function() {
		updateCurrentDate();
	});

	updateCurrentDate();
	countUp(date)
});