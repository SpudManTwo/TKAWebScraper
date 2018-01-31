var request = require('request');
var fs = require('fs');

var startingChapter = 779;
var baseURL = "http://gravitytales.com/novel/the-kings-avatar/tka-chapter-"
var endingChapter = 892;

getChapters(startingChapter,startingChapter,endingChapter,"");

function getChapters(startingChapter,currentChapter,endingChapter,volumeContent) {
  var currentURL = baseURL + currentChapter;
  request(currentURL, function(error, response, body) {
     if(error) {
       console.log("Error: " + error);
     }
     // Check status code (200 is HTTP OK
     if(response.statusCode === 200) {
       // Parse the document
       console.log("200 Recieved: Processing Page "+currentChapter);
       var substringIndexStart = body.indexOf("<div id=\"chapterContent\" class=\"innerContent fr-view\">")+55;
       body = body.substring(substringIndexStart);
       var substringIndexEnd = body.indexOf("</div>");
       body = body.substring(0,substringIndexEnd);
       body = body.replace(/<p dir="ltr">/g,"");
       body = body.replace(/<strong>/g,"");
       body = body.replace(/<\/strong>/g,"");
       body = body.replace(/<u>/g,"");
       body = body.replace(/<\/u>/g,"");
       body = body.replace(/<\/p>/g,"\n\n");
       body = body.replace(/<hr>/g,"\n\n");
       body = body.replace(/&nbsp/g," ");
       body = body.replace(/<p>/g,"");
       body = body.replace(/<span>/g,"");
       body = body.replace(/<\/span>/g,"");
       body = body.replace(/<span>/g,"");
       body = body.replace(/<br>/g,"\n");
       body = body.replace(/<em>/g,"");
       body = body.replace(/<\/em>/g,"");
       body = body.replace(/<span style="background-color: initial; text-align: initial">/g,"")

       if(currentChapter!=endingChapter) {
        getChapters(startingChapter,currentChapter+1,endingChapter,volumeContent+body);
       }
       else {
         fs.writeFile("VolumeOutput.txt", volumeContent+body, (err) =>
           {
             if (err) throw err;
               console.log('Volume saved!');
             });
       }
     }
  });
}
