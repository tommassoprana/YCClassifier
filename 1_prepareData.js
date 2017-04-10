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
// in this section you can find all methods i've used for the code below

// this method remove all files and subdirectories inside a specific directory
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

// this method create a zip file containing all files inside a directory
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

// this method reshuffle randomly an array
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
// Before starting we need to clean all the previously data (if not empty)
rmDir("./pool/");
rmDir("./zip/");
var rawData = {};

// Retrieve initial csv file
csv()
.fromFile(csvFilePath)
.on('csv',(csvRow, rowIndex)=>{
  // watson need the classification not to have special chars so i will remove them 
  var classification = csvRow[1].replace(/[^a-zA-Z ]/g, "");
  var image = csvRow[0]+'.jpg';

  // populate the rawData array with all the information in the csv but rearranged
  // based on classification
  if (typeof rawData[classification] == "undefined") rawData[classification] = [];
  rawData[classification].push(image);
})
.on('done',(error)=>{
  // when the rawData array is populated we walk on it
  for (var k in rawData) {
    // the specific classification is randomly reordered
    var shuffledData = shuffleArray(rawData[k]);
    // then il prepare its directory (to save inside all images)
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
    // i use the promises to download each imagge in its directory
    // when all images are done, for every classification (category) i generate a zip file.
    Promise.all(requests).then(res => {
      var category = res[0];
      zipIt('pool/'+category, 'zip/'+category+'.zip');
    });
  }
})
