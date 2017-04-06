// npm install watson-developer-cloud --save
// npm i --save csvtojson

/* VARIABLES **************************/

var fs = require('fs'),
    csv = require('csvtojson'),
    request = require('request'),
    archiver = require('archiver'),
    watson = require('watson-developer-cloud'),
    counter = 0,
    counterLimit = 25;

const csvFilePath = "training_set.csv",
      baseUrlImg = "http://ypic.yoox.biz/ypic/yoox/-resize/180/f/";

var visual_recognition = watson.visual_recognition({
  api_key: '{api_key}',
  version: 'v3',
  version_date: '2016-05-19'
});


/* METHODS ****************************/

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log(filename+' ('+res.headers['content-type']+') ' + res.headers['content-length']);
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
	}
};

var zipIt = function() {
	var output = fs.createWriteStream('final.zip');
	var archive = archiver('zip');

	output.on('close', function () {
	    console.log("Zip done. " + archive.pointer() + ' bytes');
	});

	archive.on('error', function(err){
	    throw err;
	});

	archive.pipe(output);
	archive.bulk([
	    { expand: true, cwd: 'pool', src: ['**'], dest: ''}
	]);
	archive.finalize();
};


/* CODE *******************************/

rmDir("./pool/");

csv()
.fromFile(csvFilePath)
.on('csv',(csvRow, rowIndex)=>{
    	counter ++;
	if (counter <= counterLimit) {
		var imageName = csvRow[0]+'.jpg';
		download(baseUrlImg+imageName, "./pool/"+imageName, function(){
  			//console.log(rowIndex, imageName+' ..done');
		});
	}
    	//else console.log(jsonObj)
})
.on('done',(error)=>{
	zipIt();
    	console.log('end')
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
