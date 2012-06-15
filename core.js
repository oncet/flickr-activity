function storeData(newData, lastModified) {
	var notifications = localStorage.getItem('notifications');
	localStorage.clear();
	for(var i = 0; i < 10; i++) {
		var entry = newData.item(i);
		var title = entry.getElementsByTagName('title')[0].childNodes[0].nodeValue;
		var htmlContent = entry.getElementsByTagName('content')[0].childNodes[0].nodeValue;
		var updated = entry.getElementsByTagName('updated')[0].childNodes[0].nodeValue;
		var item = new Array();
		item[0] = title;
		item[1] = htmlContent;
		item[2] = updated;
		localStorage.setItem(i, JSON.stringify(item));
	}
	localStorage.setItem('lastModified', lastModified);
	if(notifications != null)
		localStorage.setItem('notifications', notifications);
}
function loop() {
	var reloadTime = 1000 * 40;
	var req = new XMLHttpRequest();
	function request() {
		if(document.URL.indexOf('background') > -1 && chrome.extension.getViews({type:'popup'}).length > 0)
			console.log('Request skipped');
		else {
			req.open('GET', 'http://api.flickr.com/services/feeds/activity/all?user_id=me', true);
			if(localStorage.getItem('lastModified') != null)
				req.setRequestHeader('If-Modified-Since', localStorage.getItem('lastModified'));
			req.onload = function() {
				if(req.status > 399 && req.status < 600) {
					chrome.browserAction.setBadgeText({text:'Off'});
					chrome.browserAction.setBadgeBackgroundColor({color:[255, 255, 255, 255]});
					notifications = localStorage.getItem('notifications');
					localStorage.clear();
					if(notifications != null)
						localStorage.setItem('notifications', notifications);
					if(document.URL.indexOf('popup') > -1)
						renderData();
				} else if(req.status == 200) {
					console.log('Server response contains new data (200)');
					var newData = req.responseXML.getElementsByTagName('entry');
					var lastModified = req.getResponseHeader('Last-Modified');
					storeData(newData, lastModified);
					if(document.URL.indexOf('background') > -1) { // ... y no es el primer request
						chrome.browserAction.setBadgeText({text:'+'})
						chrome.browserAction.setBadgeBackgroundColor({color:[255, 0, 0, 255]});
						if(localStorage.getItem('notifications') > 0) {
							var notification = webkitNotifications.createNotification('logo.png', 'Flickr notification', 'There\'s new content on your recent activity.');
							notification.show();
							setTimeout(function() {notification.cancel()}, 10000);
						}
					}
					if(document.URL.indexOf('popup') > -1)
						renderData();
				}
			}
			req.send();
		}
		window.setTimeout(request, reloadTime);
	}
	request();
}