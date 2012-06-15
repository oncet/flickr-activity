function getCurrent() {
	liElements = document.getElementsByTagName('li');
	for(i = 0; i < liElements.length; i++) if(liElements[i].getAttribute('id') == 'current') return i;
}
function cursor() {
	var getNext = function() {
		if(typeof current != 'number' || current == liElements.length - 1) return 0;
		else return current + 1;
	}
	var getPrev = function() {
		if(typeof current != 'number' || current == 0) return liElements.length - 1;
		else return current - 1;
	}
	this.moveForward = function() {
		current = getCurrent();
		next = getNext();
		if(typeof current == 'number') liElements[current].removeAttribute('id');
		liElements[next].setAttribute('id', 'current');
	}
	this.moveBackward = function() {
		current = getCurrent();
		prev = getPrev();
		if(typeof current == 'number') liElements[current].removeAttribute('id');
		liElements[prev].setAttribute('id', 'current');
	}
	this.first = function() {
		current = getCurrent();
		if(typeof current == 'number') liElements[current].removeAttribute('id');
		liElements[0].setAttribute('id', 'current');
	}
	this.last = function() {
		current = getCurrent();
		if(typeof current == 'number') liElements[current].removeAttribute('id');
		liElements[liElements.length - 1].setAttribute('id', 'current');
	}
}
function click(e) {
	console.log('Mouse click (button ' + e.button + ')');
	href = this.getAttribute('href');
	if(href == '#') {
		current = getCurrent();
		if(this.parentElement.parentElement.getAttribute('id') == 'current') this.parentElement.parentElement.removeAttribute('id');
		else this.parentElement.parentElement.setAttribute('id', 'current');
		if(typeof current == 'number') liElements[current].removeAttribute('id');
	}
	else {
		if(e.button == 0 && e.ctrlKey == false) chrome.tabs.create({url: href});
		else chrome.tabs.create({url: href, "selected": false});
	}
}
function wheel(e) {
	if(e.wheelDelta < 0) cursor.moveForward();
	if(e.wheelDelta > 0) cursor.moveBackward();
}
function keyboard(e) {
	if(e.keyCode == 40 || e.keyCode == 34) cursor.moveForward();
	if(e.keyCode == 38 || e.keyCode == 33) cursor.moveBackward();
	if(e.keyCode == 36) cursor.first();
	if(e.keyCode == 35) cursor.last();
	href = this.getAttribute('href');
	if(e.keyCode == 13 && e.ctrlKey != false) chrome.tabs.create({url: href, "selected": false});
}