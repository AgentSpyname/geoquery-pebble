function HTTPGET(url) {
	var req = new XMLHttpRequest();
	req.open("GET", url, false);
	req.send(null);
	return req.responseText;
}





var sendPackages = function() {
  var items = ["array1", "item1", "item2", "It will pass"];
  var hash = pkgArrayToPebbleHash(items);
  Pebble.sendAppMessage(hash);
  console.log(hash)

};


Pebble.addEventListener("ready",
  function(e) {
	//App is ready to receive JS messages
	sendPackages();
  }
);

Pebble.addEventListener("appmessage",
  function(e) {
	//Watch wants new data!
	sendPackages();
  }
);

var pkgArrayToPebbleHash = function(array) {
  hash = {};
  for(var i = 0; i < array.length; i++) {
      var key = 'pkg_' + (i+1);
      hash[key] = array[i];
  }
  hash['pkg_count'] = array.length;
  return hash;
};

