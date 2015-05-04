(function(){
    somestuff();
    setTimeout(arguments.callee, 2000);
})();



function somestuff(){

	var a = ["Date1", "Date2", "Date3","Date30"];
var b = ["Date1", "Date20","Date30","Date2"];

for (i = 0; i < a.length; i++) {
    var bl = false;
    for (j = 0; j < b.length; j++) {
        if (a[i] == b[j]) {
            bl = true;

        }

    }

    if (bl) console.log("find match for : " + a[i]);
    console.log("  ")
    else console.log("did not find match for:" + a[i]);
}
}