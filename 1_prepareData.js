"use strict";

/* INCLUDES ***************************/
require('./_configuration.js');


/* VARIABLES **************************/
var fs = require('fs'),
    csv = require('csvtojson'),
    request = require('request'),
    archiver = require('archiver'),
    async = require('async'),
    counter = 0,
    counterLimit = categoryMaxElements;


/* METHODS ****************************/
var rmDir = function(dirPath) {
  try { var files = fs.readdirSync(dirPath); }
  catch(e) { return; }
  if (files.length > 0)
    for (var i = 0; i < files.length; i++) {
      var filePath = dirPath + '/' + files[i];
      if (fs.statSync(filePath).isFile())
        fs.unlinkSync(filePath);
      else
        rmDir(filePath);
        //fs.rmdirSync(filePath);
    }
  };

var zipIt = function(sourcePath, savePath) {
	var output = fs.createWriteStream(savePath);
	var archive = archiver('zip');
	output.on('close', function () {
	    console.log("Zip done. " + archive.pointer() + ' bytes');
	});
  
	archive.on('error', function(err) { throw err; });
	archive.pipe(output);
	archive.bulk([{expand: true, cwd: sourcePath, src: ['**']}]);
	archive.finalize();
};

var shuffleArray = function(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
};


/* CODE *******************************/
// Inizializzazione con pulizia della pool dei dati
rmDir("./pool/");
rmDir("./zip/");
var rawData = {};

// Retrieve initial csv file
csv()
.fromFile(csvFilePath)
.on('csv',(csvRow, rowIndex)=>{
  var classification = csvRow[1].replace(/[^a-zA-Z ]/g, "");
  var image = csvRow[0]+'.jpg';

  // riorganizzo i dati in base alla classificazione
  if (typeof rawData[classification] == "undefined") rawData[classification] = [];
  rawData[classification].push(image);
})
.on('done',(error)=>{
  for (var k in rawData) {
    
    var shuffledData = shuffleArray(rawData[k]);

    var dir = './pool/'+k;

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    counter = 0;

    function asyncFunction (item, cb) {
      var uri = baseUrlImg+item,
            fileName = "./pool/"+k+"/"+item;

        counter ++;
        if (counter <= counterLimit) {
        	var writeStream = fs.createWriteStream(fileName);
	 	request(uri).pipe(writeStream);
        }
        cb(k);
    }

    let requests = shuffledData.map((item) => {
        return new Promise((resolve) => {
          asyncFunction(item, resolve);
        });
    })

    Promise.all(requests).then(res => {
      var category = res[0];
      zipIt('pool/'+category, 'zip/'+category+'.zip');
    });
  }
})
