var _ = require('underscore')
var $ = require('jquery')
var sendpebbleid = ["0002"]
var title = ["Route 0000", "Route 0002"]

 for (sp = 0; sp < sendpebbleid.length; sp++){
     for (tt = 0; tt < title.length; tt++){
      if (title[tt].indexOf(sendpebbleid[sp]) > -1){
    console.log(title[tt])
  }
  }

 }
 var randomarray = ["string", "string2", "string3"]
 var total = 1;
$.each(randomarray,function() {
    total += this;
});

