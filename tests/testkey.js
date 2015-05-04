var json = { "key1" : "watevr1", "key2" : "watevr2", "key3" : "watevr3" };
console.log(GetObjectKeyIndex(json, "key2")); 
//Returns int(1) (or null if the key doesn't exist)

function GetObjectKeyIndex(obj, keyToFind) {
    var i = 0, key;
    for (key in obj) {
        if (key == keyToFind) {
            return i;
        }
        i++;
    }
    return null;
}