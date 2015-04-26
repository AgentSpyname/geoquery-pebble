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
var id = [];
var tag = [];
var assignid = 0;
var toconvertdate = []; 


//Prevents Duplicate COmmits
var dontcommit = [];

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


  feedprocess();

setTimeout(function(){
    dataread();
  },delay)

 
   



    setTimeout(arguments.callee, 20000); //Timeout of 20 Seconds
})();
}





//Funtion to Proces Data from Server
function feedprocess(){
  cleanlist = [];
  //Initiliazes PG Database Connection
 client = new pg.Client(conString);
client.connect();
  console.log("Cleaning up...")
      client.query({
                      name: 'clean up the server db',
                      text: "DELETE FROM server"
});


dontcommit = [];
 title =[];
                  date = [];
                  summary = [];
                  route = [];


                          comparetitle = []
                          comparedate = []
                          comparesummary = []
                          compareroute = []
                          compareid = []
                          pebbleid = []
                          tag = [];

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

                  


                  id.push(assignid = assignid + 1)

                
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
             
// newArray: ["Ri", "La"]
  
  

// newArray: ["Ri", "La"]
 
                     var query = client.query("SELECT delay_id, delay_title, delay_date, delay_summary, route, pebbleid FROM delay ");
                     query.on('row', function(row) {
                          //Pushes the second set of data
                          comparetitle.push(row.delay_title);
                          comparedate.push(row.delay_date)
                          comparesummary.push(row.delay_summary)
                          compareroute.push(row.route)
                          compareid.push(row.delay_id)
                          pebbleid.push(row.pebbleid)
                        });

                      query.on("end", function (result) {

                      for (var i = 0; i < title.length; ++i) {
                      console.log(title[i])
                    
                      console.log(date[i])
                      console.log(summary[i])
                      console.log(route[i])

                      
                      console.log("  ")
                    }

                    //Now its time to sort the information.
                    
                    var largest= 0;

                    for (l=0; l<=largest;l++){
                    if (compareid[l] >largest) {
                    var largest=compareid[l];
    }
}






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


                    for (x = 0; x < title.length; x++) {
                      var random = Math.random();
                      var newend = largest + 1
                       newpebbleid = "geoquery-" + timegreeting + route[x];
                       console.log(newpebbleid)

                      
                      for(y = 0; y < pebbleid.length; y++ ){
                        if (pebbleid[y] == newpebbleid){
                        console.log("An entry found within the database matches this ID:" + pebbleid[y])
                        id.push(newpebbleid)
                        tag.push("w")
                        
                        

    }

    else{
                
                        id.push(newpebbleid)
                        tag.push("c")
                        }

  }

 


  }

console.log(" ")
for (z = 0; z < title.length; z++ ){


  if (tag[z] == "w"){
    console.log("Whitelisted")
    console.log(title[z])
    console.log(date[z])
    console.log(summary[z])
  }
  console.log(" ")
   if (tag[z] == "c"){
    console.log("Cleanlisted")
    console.log(title[z])
    console.log(date[z])
    console.log(summary[z])
  }
}

}


                      );


}



  



//Starts the webserver
var server = app.listen(app.get('port'), function () {
  console.log('Webserver started on port %s', app.get('port'));
});


