//Includes Express and Feedparser
var express = require('express');
var request = require('request');
var FeedParser = require('feedparser')
  , request = require('request');
  var Timeline = require('pebble-api');
  var _ = require('underscore');
var jf = require('jsonfile')
var util = require('util')




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
//var pg = require('pg');
//var conString = 'postgres://localhost:5432/stopr';

var myJSON = ""


var server_items = [];
///ALL DEPRECTATED NOW
//Intializes Variables for Comparision Checks and Other Functions
//These Variables Compare DB Entries with the Server
var comparetitle = [];
var comparedate = [];
var comparesummary = [];
var compareroute = [];
var compareid = [];
var brandnewpebbleid = [];
brandnewid = [];
//Defines Title, Route, Date and Summary for Later
var title = [];
var route = [];
var date = [];
var summary = [];
var id = [];
var tag = [];
var assignid = 0;
var toconvertdate = []; 


//Prevents Duplicate COmmits
var dontcommit = [];
var end;

//More comparisions 
var newconvertdate = [];
var newconverttitle= [];
var newconvertsummary = [];
var newconvertrotue = [];
var pebbleid = [];
whitelist = [];
var cleanlist = [];
var oldroute = [];
//Executes Main Functions
refresh();

//Excutes all other functions with a delay every 20 Seconds, used to make sure we can go back here if there is an error.
function refresh(){
(function(){
  //Sets two delay variabls
  var delay = 5000;
  var delay2 = 7000;
  var text='';


  feedprocess();

setTimeout(function(){
    dataread();
  },delay)

 
   



    setTimeout(arguments.callee, 20000); //Timeout of 20 Seconds
})();
}





//Funtion to Proces Data from Server
function feedprocess(){
 route = [];

  cleanlist = [];
  //Initiliazes PG Database Connection
 //client = new pg.Client(conString);
//client.connect();
  console.log("Cleaning up...")
  date = [];
  title = [];
  summary = [];

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
                  date.push(String(item.date))
                  summary.push(item.summary)
                  route.push(item.title)
                
                  }
               }
             );
}

//New function to check the data
function dataread(){ 


                //Generate the Route Number

                for (var r=0; r< route.length; r++){
                     route[r] = route[r].substr(7,4);
                }

                summary = summary 
             
                    //Now its time to sort the information.
    

                    var today = new Date()
                    var curHr = today.getHours();

                    if(curHr<12){
                  
                       timegreeting = "morning";
                      } 
                    else if(curHr<18){
                  
                    timegreeting = "afternoon";
                      }

                    else{
                     
                      timegreeting = "evening";
                      }

             
                    console.log("debug variables")
                    console.log(route)
                    console.log(date)

                 
var myarray = [];
var myJSON = "";

for (var i = 0; i < route.length; i++) {

    var item = {
        "title": title[i],
        "date": date[i],
        "summary": summary[i],
        "route": route[i],
        "pebbleid": "geoquery-" + timegreeting + route[i] + "(" + date[i] + ")"
        
    };

    myarray.push(item);

 

}



  myJSON = ({delays: myarray});


whitelist = [];
var file = 'data.json'
jf.readFile(file, function(err, obj) {
  console.log("FROM JSON");
  for (p = 0; p < obj.delays.length; p++){

      if (obj.delays[p].pebbleid == myJSON.delays[p].pebbleid){
   
        whitelist.push(myJSON.delays[p].pebbleid)
        
      }

  }

      app.get('/', function (req, res) {
     
  res.send(obj);
});
     
console.log(whitelist)
for (y = 0; y < myJSON.delays.length; y++){
  if (whitelist[y] == myJSON.delays[y].pebbleid){
    console.log("Already sent.")
  }

  if(whitelist[y] != myJSON.delays[y].pebbleid){
    console.log("Sending...")
    var file = 'data.json'

jf.writeFile(file, myJSON, function(err) {
  console.log("to json")
    console.log(err)

  
})

  }

}
 
})




}
//Starts the webserver
var server = app.listen(app.get('port'), function () {
  console.log('Webserver started on port %s', app.get('port'));
});

var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname)).listen(2987);

