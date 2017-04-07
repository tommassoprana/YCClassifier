// npm install watson-developer-cloud --save
// npm i --save csvtojson

/* VARIABLES **************************/

var fs = require('fs'),
    csv = require('csvtojson'),
    request = require('request'),
    archiver = require('archiver'),
    async = require('async'),
    watson = require('watson-developer-cloud'),
    counter = 0,
    counterLimit = 5;

const csvFilePath = "training_set.csv",
      baseUrlImg = "http://ypic.yoox.biz/ypic/yoox/-resize/180/f/";

var visual_recognition = watson.visual_recognition({
  api_key: '{api_key}',
  version: 'v3',
  version_date: '2016-05-19'
});


/* METHODS ****************************/

var download = function(counter, uri, filename, callback){
  request.head(uri, function(err, res, body){
    //console.log(counter, filename+' ('+res.headers['content-type']+') ' + res.headers['content-length']);
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

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

  console.log(sourcePath);
  
	output.on('close', function () {
	    console.log("Zip done. " + archive.pointer() + ' bytes');
	});
  
	archive.on('error', function(err) { throw err; });
	archive.pipe(output);
	//archive.directory(sourcePath);
  archive.bulk([{expand: true, cwd: sourcePath, src: ['**']}]);
	archive.finalize();
};


/* CODE *******************************/

// Inizializzazione con pulizia della pool dei dati
//rmDir("./pool/");
rmDir("./zip/");
var rawData = {};

// Retrieve initial csv file
csv()
.fromFile(csvFilePath)
.on('csv',(csvRow, rowIndex)=>{
  var classification = csvRow[1];
  var image = csvRow[0]+'.jpg';

  // riorganizzo i i dati in base alla classificazione
  if (typeof rawData[classification] == "undefined") rawData[classification] = [];
  rawData[classification].push(image);

  //console.log(classification, image);
  //rawData[classification].push(image);
  /*
  counter ++;
	if (counter <= counterLimit) {
		var imageName = csvRow[0]+'.jpg';
		download(baseUrlImg+imageName, "./pool/"+imageName, function(){
  			//console.log(rowIndex, imageName+' ..done');
		});
	}
  */
})
.on('done',(error)=>{

  //zipIt('zip/final.zip');
  //console.log(rawData);

  for (var k in rawData) {
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
          writeStream = fs.createWriteStream(fileName);
          request(uri).pipe(writeStream);
        }
        cb();
    }

    let requests = rawData[k].map((item) => {
        return new Promise((resolve) => {
          asyncFunction(item, resolve);
        });
    })

    Promise.all(requests).then(() => {
      console.log("Zipping:..." + k);
      //zipIt('pool/'+k, 'zip/'+k+'_positive_examples.zip');
    });
  }


    /*
    async.each(rawData[k], function(file, callback) {
        var uri = baseUrlImg+file,
            fileName = "./pool/"+k+"/"+file;

        counter ++;
        if (counter <= counterLimit) {
          writeStream = fs.createWriteStream(fileName);
          request(uri).pipe(writeStream); 
          writeStream.on('close', function() {
              if (counter <= counterLimit) {
                console.log('finished');
              }
          });
        }
       
       
    }, function(err){
        if( err ) {
          console.log(err);
        } else {
          console.log('end');
        }
    }); 
    */
    /*
    async.each(rawData[k], function (file, callback) {
      counter ++;
      if (counter <= counterLimit) {
          var uri = baseUrlImg+file,
              fileName = "./pool/"+k+"/"+file;
          fs.writeFile("./pool/"+k+"/"+file, baseUrlImg+file, function (err) {
              if (err) { console.log(err); }
              else { console.log(file + '.json was updated.'); }
              callback();
          });
          
      }
    }, function (err) {
        if (err) { console.log('A file failed to process'); }
        else {
          //zipIt('pool/'+k, 'zip/'+k+'_positive_examples.zip');
          console.log(k+': ('+k.length+') files processed successfully');
        }
    });
    */
    /*
    counter = 0;
    for (var kk in rawData[k]){
      var imageName = rawData[k][kk];
      counter ++;
      if (counter <= counterLimit) {
        //console.log(kk, baseUrlImg+imageName, "./pool/"+k+"/"+imageName);
        download(counter, baseUrlImg+imageName, "./pool/"+k+"/"+imageName, function(){
          console.log(counter, counterLimit, "./pool/"+k+" ..done");
        });
      }
    }
    */
    //zipIt('pool/'+k, 'zip/'+k+'_positive_examples.zip');
})


/*

var params = {
	name: 'fruit',
	apple_positive_examples: fs.createReadStream('./apples.zip'),
  banana_positive_examples: fs.createReadStream('./yellow.zip'),
  orange_positive_examples: fs.createReadStream('./pos_ex.zip'),
	negative_examples: fs.createReadStream('./vegetables.zip')
};

visual_recognition.createClassifier(params,
	function(err, response) {
   	 if (err)
      		console.log(err);
    	 else
   		console.log(JSON.stringify(response, null, 2));
});
*/
