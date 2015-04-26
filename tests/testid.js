var a = [1,2,3]
var b = ["Route 0000", "Route 0001", "Route 0002"]
var db = ["myapp-3"]

for (i = 0; i < b.length; i++) {
	var random = Math.random();
	var id = "myapp-" + a[i];
	

	for(k = 0; k < db.length; k++ ){
		if (db[k] == id){
			console.log("An entry found within the database matches this ID:" + id)
		}

	else{
		console.log(b[i])
		console.log(id)
	}
	}


	}
