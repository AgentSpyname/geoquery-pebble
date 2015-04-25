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
var compareroute = [];
var compareid = [];

//Defines Title, Route, Date and Summary for Later
var title = [];
var route = [];
var date = [];
var summary = [];
var toconvertdate = []; 

//Prevents Duplicate COmmits
var dontcommit = [];

//More comparisions 
var newconvertdate = [];
var newconverttitle= [];
var newconvertsummary = [];
var newconvertrotue = [];
//Executes Main Functions
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
  done = false;
  //Initiliazes PG Database Connection
 client = new pg.Client(conString);
client.connect();
  console.log("Cleaning up...")
      client.query({
                      name: 'clean up the server db',
                      text: "DELETE FROM server"
});


dontcommit = [];

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
    


      console.log("   ")//Just creates some blank space for easy to read entries for testing.

      
      while (item = stream.read()) {
       //Checks each item from the RSS 
                  //Assigns each item to an array.

                  title.push(item.title)
                  date.push(item.date)
                  summary.push(item.summary)
                  route.push(item.title)
                 

              

                
                  }
               }
             );
}

//New function to check the data
function dataread(){ 
 
                     var query = client.query("SELECT delay_id, delay_title, delay_date, delay_summary, route FROM delay ");
                     query.on('row', function(row) {
                          //Pushes the second set of data
                          comparetitle.push(row.delay_title);
                          comparedate.push(row.delay_date)
                          comparesummary.push(row.delay_summary)
                          compareroute.push(row.route)
                          compareid.push(row.compare_id)
                        });

                      query.on("end", function (result) {

                      for (var i = 0; i < title.length; ++i) {
                      console.log(title[i])
                    
                      console.log(date[i])
                      console.log(summary[i])
                      console.log(route[i])
                      console.log("  ")
                    }

                      });
}

//Starts the webserver
var server = app.listen(app.get('port'), function () {
  console.log('Webserver started on port %s', app.get('port'));
});


