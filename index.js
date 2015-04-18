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
var comparetitle;
var comparedate;
var comparesummary;

//Decreped Vars
var newdate = "nil2";
var newsummary = "nil2";
var newtitle;
var convertdate;
var toconvertdate;
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
                  title = [item.title]
                  route = [item.title] //Gets the title twice; we will need this for subscription
                  date = [item.date]
                  summary = [item.summary]

                  for (var i = 0; i < route.length; i++) { //For each of the routes
                     route[i] = route[i].substr(7);//Subtracts the first 7 Charchters 
                     route[i] = route[i].slice(0,-39)//And the last 39 to create a route
            
                     console.log("Title: " + title)
                     console.log("Route: " + route)
                  }


                    for (var i = 0; i < date.length; i++) { 
                    console.log("Date:" + date)
                  }

                  for (var i = 0; i < summary.length; i++) {
                    console.log("Summary: " + summary)
                  }

                  console.log("      ");//Even more whitespace

                  
                    var query = client.query("SELECT * FROM delay");
                    query.on('row', function(row) {
                    comparetitle = [row.delay_title];
                    comparedate = [row.delay_date];
                    comparesummary = [row.delay_summary];
                    console.log(comparetitle)
                    console.log(comparesummary)
                    console.log(comparedate)

                    });
                  

                  for (var i = 0; i < title.length; i++) {//For each item again

                  if (title == comparetitle && date == comparedate){
                      console.log("No new updates.");

                    }

                  if (comparedate != date){
                    console.log("Send this to DB.");
                  }

                  noupdates = "no" //There are updates so we make sure to set this var

                  }
                  }
               }
             );
      

}




//Starts the webserver
var server = app.listen(app.get('port'), function () {
  console.log('Webserver started on port %s', app.get('port'));
});


