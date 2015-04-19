//Includes Express and Feedparser
var express = require('express');
var request = require('request');
var FeedParser = require('feedparser')
  , request = require('request');
  var Timeline = require('pebble-api');


//Configuration Variables
//var xml = "https://businfo.stopr.ca/rss/Transportation-en-CA.xml"; //Production Environment
var xml = "http://pebblestoprtest.net76.net/rss/samplerss.xml"; //Testing Environment

// create a new Timeline object with our API key keys passed as an enviornment variable
var timeline = new Timeline({
  apiKey: process.env.PEBBLE_TIMELINE_API_KEY
});

//var routeno = "1500"; //Production
var routeno = "0000"; //Testing

var app = express();
app.set('port', (process.env.PORT || 3000));
var pg = require('pg');
var conString = 'postgres://localhost:5432/stopr';

//Intializes Variables for Comparision Checks and Other Functions
//These Variables Compare DB Entries with the Server
var comparetitle = [];
var comparedate = [];
var comparesummary = [];
var results = [];

//Defines Title, Route, Date and Summary for Later
var title = [];
var route = [];
var date = [];
var summary = [];
var toconvertdate = []; 

//test
var test = [];
var test2;
var test3;

//Decreped Vars
var newdate = "nil2";
var newsummary = "nil2";
var newtitle;
var convertdate;

var checknewdate;
var pchecknewdate;
var p2checknewdate;
var noupdates = "yes";
var newcomparedate;


//Initiliazes PG Database Connection
var client = new pg.Client(conString);
client.connect();

//Executes Main Functions
console.log("My Route:" + routeno);
refresh();


//Excutes all other functions with a delay every 20 Seconds, used to make sure we can go back here if there is an error.
function refresh(){
(function(){
  //Sets two delay variabls
  var delay = 5000;
  var delay2 = 7000;


  feedprocess();

setTimeout(function(){
    dataread();
  },delay)

    setTimeout(arguments.callee, 20000); //Timeout of 20 Seconds
})();
}





//Funtion to Proces Data from Server
function feedprocess(){

  console.log("Requesting XML File from: " + xml)
    //Loads Feedparser
    var req = request(xml)
   ,feedparser = new FeedParser();

    console.log("Got XML File from: " + xml)
    req.on('error', function (error){
      //handles any request errors
    });

    req.on('response', function (res){
 
      var stream = this;
      if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));
      stream.pipe(feedparser)
    })

    feedparser.on('error', function (error) {
    // always handle errors
    });
    feedparser.on('readable', function() {
    // This is where the action is!
    var stream = this
    , meta = this.meta // **NOTE** the "meta" is always available in the context of the feedparser instance
    , item;
    


      console.log("   ")//Just creates some blank space before each item...

      
      while (item = stream.read()) {
       //Checks each item from the RSS 
                  //Assigns each item to an array.
                  toconverttitle = [item.title]
                  toconvertroute = [item.title] //Gets the title twice; we will need this for subscription
                  toconvertdate = [item.date]
                  toconvertsummary = [item.summary]
                 
<<<<<<< HEAD

               
                  for (var i = 0; i < toconverttitle.length; i++) { //For each of the routes
                     toconvertroute[i] = toconvertroute[i].substr(7);//Subtracts the first 7 Charchters 
                     toconvertroute[i] = toconvertroute[i].slice(0,-39)//And the last 39 to create a route
                     date = String(toconvertdate);
                     title = String(toconverttitle);
                     summary = String(toconvertsummary);
                     route = String(toconvertroute);

               }


                  client.query({
                      name: 'insert to server check DB',
                      text: "INSERT INTO server(delay_title, delay_date, delay_summary, route) values($1, $2, $3, $4)",
=======
                  for (var i = 0; i < route.length; i++) { //For each of the routes
                     route[i] = route[i].substr(7);//Subtracts the first 7 Charchters 
                     route[i] = route[i].slice(0,-39)//And the last 39 to create a route
                     date = String(toconvertdate)
                     console.log(route)
                      //Inserts our records to DB

                      var query = client.query("SELECT * FROM DELAY");

                      query.on('row', function(row){
                         
                        test2 = row.delay_title;

                       
                    });
                      console.log(test3)
                      console.log(test2)

                      client.query({
                      name: 'insert delay',
                      text: "INSERT INTO delay(delay_title, delay_date, delay_summary, route) values($1, $2, $3, $4)",
>>>>>>> 04114d1dac2612d9657ec02c4a1f213c6d4b9bf4
                      values: [title, date, summary, route]
});


                      
            
                     console.log("Title: " + title)
                     console.log("Date:" + date)
                     console.log("Route: " + route)
  
                    console.log("Summary: " + summary)
               

                  console.log("      ");//Even more whitespace


                  
                    
                  }
               }
             );
      
  
}



function dataread(){
         //Inserts our records to DB

<<<<<<< HEAD
                      var query = client.query("SELECT * FROM delay ");
                      query.on("row", function (row, result) {
                      result.addRow(row);
                      });

                      query.on("end", function (result) {
                      console.log("From DB")
                      console.log(JSON.stringify(result.rows, null, "    "));
                      comparetitle = [result.delay_title]
                      console.log(comparetitle)
=======
var query = client.query("SELECT * FROM delay");
                    query.on('row', function(row) {
                    var test = [row.delay_title];

                    for (var i = 0; i < test.length; i++){
                      if (date -= row.delay_date)
                        console.log(row.delay_date)
                        console.log("No new updates")
                              
                    }

>>>>>>> 04114d1dac2612d9657ec02c4a1f213c6d4b9bf4

                      });

                      var query2 = client.query("SELECT delay_title, delay_date FROM server ");
                      title = []
                     query2.on('row', function(row) {

                          
                          title.push(row.delay_title);

                        
                        
                        });

                      query2.on("end", function (result) {
                      
                      console.log("From server:")
                      
                      for (var i = 0; i < title.length; i++) {
                       console.log(title[i]);
                        }

                      });


                      console.log(test)
                   

                
}

//Starts the webserver
var server = app.listen(app.get('port'), function () {
  console.log('Webserver started on port %s', app.get('port'));
});


