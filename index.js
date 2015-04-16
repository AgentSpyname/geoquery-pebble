//Includes Express and Feedparser
//Tsting git...
var express = require('express');
var request = require('request');
var FeedParser = require('feedparser')
  , request = require('request');

//Configuration Variables
//var xml = "https://businfo.stopr.ca/rss/Transportation-en-CA.xml"; //Production Environment
var xml = "http://pebblestoprtest.net76.net/rss/samplerss.xml"; //Testing Environment

//var routeno = "1500"; //Production
var routeno = "0000"; //Testing

var app = express();
app.set('port', (process.env.PORT || 3000));
var pg = require('pg');
var conString = 'postgres://localhost:5432/stopr';

//Intializes Variables for Comparision Checks and Other Functions
var comparetitle;
var comparedate;
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

  //Checks the Server
  feedprocess();

  //With timeout of 5 Seconds process data
  setTimeout(function(){
    dataread();
  },delay)

  //converts dates to compatible formats
  setTimeout(function(){
  dateconvert();
  },delay2)
  
  //Sends Data
  setTimeout(function(){
  feedsend();
  },delay2)
    

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
    


      
      while (item = stream.read()) { //Checks each item from the RSS 
        if (item.title.indexOf(routeno) > -1) { //Checks if one matches the route number
            if (item.title.indexOf(routeno) > -1) //Filters again otherwise, the variables would be nil with the other entries.
                  //Title, Date and Summary are all set as well as the no updates var            
                  newtitle = item.title 
                  newdate = item.date;
                  newsummary = item.summary;
                  noupdates = "no" //There are updates so we make sure to set this var

                   
                }            
      }
});
}

//Begins to Process The Data
function dataread(){
    if (noupdates == "yes"){ //Checks if there are any updates to prcess
      console.log("There is no new updats. Refreshing...")
      refresh(); //If none, returns to the begining. this is why refresh is a function :)
    }

  //Queries the Database to get the current info stored
  var query = client.query("SELECT * FROM refresh");
  query.on('row', function(row) {
  
   comparetitle = row.title;


  });

      var query = client.query("SELECT * FROM refresh");
  query.on('row', function(row) {
  comparedate = row.date


  });


}

//Converts comparedate to a readable format by JS
function dateconvert(){

  //STOPR likes to leave delays from Friday for the weekend;awesome way to test on the weekend.
  //However, this sucks for production but by checking the current date, we can ensure that updates do not get pushed to the watch.
  //For testing just add a random string like Sayfafaf instead of Sat
  pchecknewdate = new Date() //Gets the current date
  p2checknewdate = String(pchecknewdate) //Converts Current Date into an Str()
  checknewdate = p2checknewdate.substr(0, p2checknewdate.length-36)//Removes all charchters but the day of the week
  
  if (checknewdate == "Sat"){ //The bus does not come on Satudays 
    console.log("No STOPR Updates on Saturday");
  }

  if (checknewdate == "Sun"){ //The bus also does not come on Sunday
    console.log("No STOPR Updates on Sunday");
  }

  else { //If its any other weekday
    var brandnewdate = String(newdate)//Converts item.date to a string
   
    newdate =  brandnewdate;
    newdate = brandnewdate.substr(4,brandnewdate.length-19)

    

  }

}

//Prepares to send data. To console in v0.0.1 and to pebble in any future versions.
function feedsend(){


  //If the entries from the DB are the same as the server, we dont have to do anything
  if (newtitle == comparetitle && newdate == comparedate){ //Triple Checks that there are actually updates

    console.log("The record in the databse matches the record on the server. Refreshing... No new updates.");
    }
    
    //If the entrie date and title from the DB do not match up,we know we have a new entry
    if (newdate != comparedate) { //If the titles are diffrent and dates are diffrent 
    console.log("Replacing Database Entry " + comparetitle + " with new record from server: " + newtitle);
    console.log("Replacing Database Date: " + comparedate + " with new record from server: " + newdate);
    console.log("Inserting New Records into Database " + conString + " Table:Refresh for backup");
 

    //Delates the existing records from the DB
       client.query({
      name: 'delete records',
      text: "DELETE FROM refresh;",
    
});
     //Inserts our records to DB
     client.query({
      name: 'insert refresh',
      text: "INSERT INTO refresh(title, date) values($1, $2)",
      values: [newtitle, newdate]
});
    console.log("Finished insering records. Refreshing...");
    console.log(newtitle)
    console.log(newdate)
    console.log(newsummary)
  }







  }









//Starts the webserver
var server = app.listen(app.get('port'), function () {
  console.log('Webserver started on port %s', app.get('port'));
});


