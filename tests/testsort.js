a = ["test", "test23", "test42"]
b = ["test", "test1", "test99"] 
a.sort()
b.sort();

left = []; both = []; right = []; 
i = 0; j = 0;
while (i < a.length && j < b.length) {
    if (a[i] < b[j]) {
        left.push(a[i]);
        ++i;
    } else if (b[j] < a[i]) {
        right.push(b[j]);
        ++j;
    } else {
        both.push(a[i]);
        ++i; ++j;
    }
}
while (i < a.length) {
    left.push(a[i]);
    ++i;
}
while (j < b.length) {
    right.push(b[j]);
    ++j;
}

console.log(left)
console.log(right)
console.log(both)

