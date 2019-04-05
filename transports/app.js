function getHttpRequest() {var httpRequest = false; if (window.XMLHttpRequest) {httpRequest = new XMLHttpRequest(); if (httpRequest.overrideMimeType) {httpRequest.overrideMimeType('text/xml'); } } else if (window.ActiveXObject) {try {httpRequest = new ActiveXObject("Msxml2.XMLHTTP"); } catch (e) {try {httpRequest = new ActiveXObject("Microsoft.XMLHTTP"); } catch (e) {} } } if (!httpRequest) { return false; } return httpRequest }

function toTitleCase(str) { return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}); }

function getSchedules() {

	document.querySelectorAll('.transport').forEach(function(element) {
		element.querySelector('.transport-code').innerHTML = element.dataset.code
		element.querySelector('.transport-station').innerHTML = toTitleCase(element.dataset.station.split('+').join(' '))
		element.querySelector('.transport-code').style.color = element.dataset.color

		let url = 'getSchedules.php?type=' + element.dataset.type + '&code=' + element.dataset.code + '&station=' + element.dataset.station + '+&way=' + element.dataset.way
		let xhr = getHttpRequest()
		xhr.open('GET', url, true)
		xhr.timeout = 1000
		xhr.setRequestHeader('X-Requested-With', 'xmlhttprequest')
		xhr.send()

		xhr.onreadystatechange = function () {
			if(xhr.readyState === 4) {
				if(xhr.status === 200) {
		    		let reponse = JSON.parse(xhr.responseText)
		    		reponse.result.schedules.forEach(function(schedule, index) {
		    			let time = element.querySelector('.transport-schedule-' + (index + 1) + ' .transport-schedule-time')
		    			let newTime = element.querySelector('.transport-schedule-' + (index + 1) + ' .transport-schedule-newTime')
		    			let minutes = parseInt(schedule.message.replace(' mn', ''))
		    			let content = (minutes < 10) ? '0' + minutes.toString() : minutes.toString()
		    			if(!minutes) {
		    				content = '<span style="color: #f7a3a3">?</span>'
		    			}
			    		element.querySelector('.transport-direction').innerHTML = schedule.destination

			    		let oldValue = time.innerHTML
			    		if(oldValue != content) {
				    		newTime.innerHTML = content
				    		time.style.transform = 'translateY(-51px)'
				    		newTime.style.transform = 'translateY(0px)'
				    		window.setTimeout(function() {
					    		time.classList.remove('transport-schedule-time')
					    		time.classList.add('transport-schedule-newTime')
					    		time.style.transform = ''
					    		newTime.classList.remove('transport-schedule-newTime')
					    		newTime.classList.add('transport-schedule-time')
					    		newTime.style.transform = ''
				    		}, 500)
			    		}
		    		})
		    	}
		    }
		}
	})

	window.setTimeout(function() {
		getSchedules()
	}, 15 * 1000)
}

getSchedules()