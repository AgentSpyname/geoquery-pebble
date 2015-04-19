var pg = require('pg');
var connectionString = 'postgres://localhost:5432/stopr';
var faketitle = "Route: 0000&nbsp;(473.004)  Status: Delayed 0 minutes";
var fakedate = "Jan 1 1970 00:00:00";

var client = new pg.Client(connectionString);
client.connect();

  //Inserts our records to DB
     client.query({
      name: 'insert refresh',
      text: "INSERT INTO refresh(title, date) values($1, $2)",
      values: [faketitle, fakedate]
});

console.log("Finsihed Inserting Fake Data.... Please End The Script by pressing Control-C")