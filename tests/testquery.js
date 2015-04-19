//Testing for JS Query
var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var conString = 'postgres://localhost:5432/stopr';
var test2;
var comparedate;
var results = []
//Initiliazes PG Database Connection
var client = new pg.Client(conString);
client.connect();


var query = client.query("SELECT * FROM DELAY");
query.on('row', function(row){
    test2 = row.delay_title;
    results.push(row);


 });

   // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end();
            console.log(results);
        });


console.log(test2)


    var query = client.query("SELECT * FROM refresh");
  query.on('row', function(row) {
  comparedate = row.date



  });

  console.log(comparedate)

