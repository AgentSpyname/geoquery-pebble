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

//Initiliazes PG Database Connection
var client = new pg.Client(conString);
client.connect();

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
                  toconverttitle = [item.title]
                  toconvertroute = [item.title] //Gets the title twice; we will need this for subscription
                  toconvertdate = [item.date]
                  toconvertsummary = [item.summary]
                 

               
                  for (var i = 0; i < toconverttitle.length; i++) { //For each of the routes
                     toconvertroute[i] = toconvertroute[i].substr(7);//Subtracts the first 7 Charchters 
                     toconvertroute[i] = toconvertroute[i].slice(0,-39)//And the last 39 to create a route
                     //Convert eveything into a string. This is so the Databse does record each entries as an array with one item.
                     date = String(toconvertdate); 
                     title = String(toconverttitle);
                     summary = String(toconvertsummary);
                     route = String(toconvertroute);

               }

                  //Creates a query and sends the values to a special DB for later comparison
                  //This is to elimate an issue with global variables
                  client.query({
                      name: 'insert to server check DB',
                      text: "INSERT INTO server(delay_title, delay_date, delay_summary, route) values($1, $2, $3, $4)",
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

//New function to check the data
function dataread(){ 

                      var query = client.query("SELECT delay_id, delay_title, delay_date FROM delay "); //starts a query to grab the info from a database to make sure we are not double commiting.
                      //Clears the arrays from above; 
                      id = []
                      title = []
                      date = []
                      summary = []
                      route = []
                      query.on('row', function(row) {

                          //Pushes each item to a Array
                          title.push(row.delay_title);
                          date.push(row.delay_date)
                          summary.push(row.delay_summary)
                          route.push(row.route)
                          id.push(row.delay_id)
                        });

                      query.on("end", function (result) { //Ends our query but...
                        //Starts the second query to check the info above
                     var query2 = client.query("SELECT id, delay_title, delay_date FROM server ");
                     query2.on('row', function(row) {
                          //Pushes the second set of data
                          comparetitle.push(row.delay_title);
                          comparedate.push(row.delay_date)
                          comparesummary.push(row.delay_summary)
                          compareroute.push(row.route)
                          compareid.push(row.id)
                        });

                      query2.on("end", function (result) {

                        //Now its time to sort the information.
                        for (i = 0; i < comparedate.length; i++) {
                          var bl = false;
                          for (j = 0; j < date.length; j++) {
                            if (date[i] != date[j]) {
                              bl = true;

    if (bl) {


      console.log(" find match for : " 
        + compareid[i] 
        + " " 
        + comparetitle[i]
        + " "
        + comparedate[i]);
      console.log("   ")


  }

                              }

    }

}
                      });
                      });
             
}

//Starts the webserver
var server = app.listen(app.get('port'), function () {
  console.log('Webserver started on port %s', app.get('port'));
});


