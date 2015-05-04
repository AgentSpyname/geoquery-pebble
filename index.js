//Includes All node_modules
var express = require('express');
var request = require('request');
var FeedParser = require('feedparser')
  , request = require('request');
  var Timeline = require('pebble-api');
  var $ = require('jquery');
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

//Starts an Express Server
var app = express();
app.set('port', (process.env.PORT || 3000));


//For Time Checking
var yesterday = "nil";
var yesHr = "nil";
var yesD = "nil";
var issue = false;

//Store data from server before JSON Array Creation
var title = [];
var route = [];
var date = [];
var summary = [];
var pebbleid = [];

//Stores main JSON arrays
var myarray = [];
var myJSON = "";
var whitelist = [];


//Executes Main Functions
refresh();




//Excutes all other functions with a delay every 20 Seconds. This function is called on on line 49.
function refresh(){
(function(){
  //Sets two delay variabls
  var delay = 5000;
  var delay2 = 7000;

  feedprocess(); //Executes feedprocess

setTimeout(function(){ //sets a 5 sec timeout then loads the dataread function
    dataread();
  },delay)

    setTimeout(arguments.callee, 20000); //Timeout of 20 Seconds
})();
}





//Funtion to Proces Data from Server
function feedprocess(){
//Resests all variables, just so there is nothing left over to cause an err.

console.log("Cleaning up...")

issue = false;
title = [];
route = [];
date = [];
summary = [];
pebbleid = [];
var myarray = [];
var myJSON = "";
var whitelist = [];



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
                  //Assigns each item to an array. This will be converted into JSON eventually.
             
                  title.push(item.title)
                  date.push(String(item.date)) //Converts Date into String.
                  summary.push(item.summary)
                  route.push(item.title) //Gets the title twice. Eventually we will convert this into a Route Number.
                
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

                summary = summary //Restates Summary. This solved a weird bug, where summary = undefined. Test later.
             
                    //Now its time to sort the information.
    
                    var today = new Date() //GEts todays dates
                    var curHr = today.getHours(); //Gets the time
                    var curD = today.getDate(); //Gets the date(e.g 3 in May 3 2015)
             

                    if (yesD == "nil"){ //If the previous date is not assigned anything.
                      yesterday = today; //Assign them the current day values
                      yesHr = curHr; 
                      yesD = curD;
                    }
                   
                   //Make sure that at the end of every day, geoquery-morning0000 would count as a new update.

                    if (curD != yesD){ 
                      //Erases everything from the previous day.
                      var file = "data.json"
  issue = true; //Marks that the day has been switched over
jf.writeFile(file, " ", function(err) {
    console.log(err)
})
}

//Otherwise we don't need to do anything. Mark it is false; no issue
if (curD == yesD){
  issue = false;
}


//Remarks the current date
yesterday = today
yesHr = curHr
yesD = curD

//Generates morning, noon and night for unique ids
                    if(curHr<12){
                  
                       timegreeting = "morning";
                      } 
                    else if(curHr<18){
                  
                    timegreeting = "afternoon";
                      }

                    else{
                     
                      timegreeting = "evening";
                      }



//Creates a JSON array based on the values from above
for (var i = 0; i < route.length; i++) {

    var item = {
        "title": title[i],
        "date": date[i],
        "summary": summary[i],
        "route": route[i],
        "pebbleid": "geoquery-" + timegreeting + route[i]
        
    };

    myarray.push(item); //Pushes each item to an array

 

}



  myJSON = ({delays: myarray}); //Converts the array into JSON

  if (issue){ //If it is a new day, rewriting the file to prevent conflict.
  jf.writeFile(file, myJSON, function(err) {
  console.log("Rewriting file, as today is a brand new day, and all delays must be overwritten")
    console.log(err)
    refresh();  //The code below is irrelvant now and becomes full of errors. refresh() takes us back to the start.
})

  
} 
  
whitelist = [];
var file = 'data.json'
jf.readFile(file, function(err, obj) { //Reads our JSON File

 
  
  console.log("FROM JSON");
//Creates a list of IDS we don't want to send to the pebble
  for (p = 0; p < obj.delays.length; p++){

      if (obj.delays[p].pebbleid == myJSON.delays[p].pebbleid){
   
        whitelist.push(myJSON.delays[p].pebbleid)
        
      }

  }
  
console.log(whitelist)//REMOVE AFTER DEBUG
for (y = 0; y < myJSON.delays.length; y++){//For each item that was on server
  if (whitelist[y] == myJSON.delays[y].pebbleid ){ //Check if it was already sent
    console.log("Already sent.")
  }

  if(whitelist[y] != myJSON.delays[y].pebbleid){ //If it was not send
    console.log("Sending...") //Send now to watch
    //SEND CODE HERE
    //Sends all new changes to the JSON File
    var file = 'data.json'

jf.writeFile(file, myJSON, function(err) {
  console.log("to json")
    console.log(err)
 
})
  }

}
 
})

}//Ending Bracket for Dataread BTW

//Has the webserver running all the time
var server = app.listen(app.get('port'), function () {
  console.log('Webserver started on port %s', app.get('port'));
});


