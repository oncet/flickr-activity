Date.prototype.getMonthName = function() {
	var m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	return m[this.getMonth()];
}
function renderData() {
	var min = 0;
	if(localStorage.getItem('notifications') != null)
		min++;
	if(localStorage.getItem('lastModified') != null)
		min++;
	if(localStorage.length > min) {
		console.log('Rendering local storage');
		var ul = document.createElement('ul');
		ul.setAttribute('id', 'entries');
		for(var i = 0; i < localStorage.length - min; i++) {
			var storedEntry = JSON.parse(localStorage.getItem(i));
			var li = document.createElement('li');
			var divTitle = document.createElement('div');
			var anchor = document.createElement('a');
			var span = document.createElement('span');
			var divContent = document.createElement('div');
			var text = document.createTextNode(' ' + storedEntry[0]);
			var today = new Date();
			var updated = new Date(storedEntry[2]);
			var maxDiff = 1000 * 60 * 60 * 24;
			var diff = today - updated.getTime();
			if(updated.getHours() < 12) {
				var mid = 'AM';
				var hours = updated.getHours();
			} else {
				var mid = 'PM';
				var hours = updated.getHours() - 12;
			}
			if(updated.getMinutes() < 10)
				minutes = '0' + updated.getMinutes();
			else
				minutes = updated.getMinutes();
			if(diff < maxDiff)
				dateText = document.createTextNode(hours + ':' + minutes + ' ' + mid);
			else
				dateText = document.createTextNode(updated.getMonthName() + ' ' + updated.getDate());
			var html = document.createTextNode(storedEntry[1]);
			divTitle.setAttribute('class', 'title');
			anchor.setAttribute('href', '#');
			divContent.setAttribute('class', 'content');
			span.appendChild(dateText);
			anchor.appendChild(span);
			anchor.appendChild(text);
			divTitle.appendChild(anchor);
			divContent.innerHTML = html.nodeValue;
			li.appendChild(divTitle);
			li.appendChild(divContent);
			ul.appendChild(li);
		}
		document.body.innerHTML = null;
		document.body.appendChild(ul);
		var bannerText = document.createTextNode(chrome.i18n.getMessage("flickrLink"));
		var bannerA = document.createElement('a');
		var bannerP = document.createElement('p');
		bannerA.appendChild(bannerText);
		bannerA.setAttribute('href', 'http://www.flickr.com/');
		bannerP.appendChild(bannerA);
		bannerP.setAttribute('id', 'banner');
		document.body.appendChild(bannerP);
		chrome.browserAction.setBadgeText({text:''});
		window.addEventListener('mousewheel', wheel);
		window.addEventListener('keydown', keyboard);
		var aElements = document.getElementsByTagName('a');
		for(var i = 0; i < aElements.length; i++) {
			aElements[i].addEventListener('click', click);
			if(aElements[i].getAttribute('href') != '#')
				aElements[i].setAttribute('onclick', 'return false');
		}
	} else {
		console.log('Local storage empty');
		var p = document.createElement('p');
		var a = document.createElement('a');
		var loginText = document.createTextNode(chrome.i18n.getMessage("offlineLink"));
		p.setAttribute('id', 'login');
		a.setAttribute('href', 'http://www.flickr.com/');
		a.appendChild(loginText);
		p.appendChild(a);
		document.body.innerHTML = null;
		document.body.appendChild(p);
		var aElements = document.getElementsByTagName('a');
		for(var i = 0; i < aElements.length; i++) {
			aElements[i].addEventListener('click', click);
			aElements[i].setAttribute('onclick', 'return false');
		}
	}
}