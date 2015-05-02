var myarray = [];
var myJSON = "";

for (var i = 0; i < 10; i++) {

    var item = {
        "value": i
        
    };

    myarray.push(item);
}

myJSON = JSON.stringify({myarray: myarray});

console.log(myJSON);