// npm install watson-developer-cloud --save
// npm install fast-csv

var fs = require('fast-csv');
var stream = fs.createReadStream("training_set.csv");
 
var csvStream = csv()
    .on("data", function(data){
         console.log(data);
    })
    .on("end", function(){
         console.log("done");
    });
 
stream.pipe(csvStream);

/*
var watson = require('watson-developer-cloud');
var fs = require('fs');

var visual_recognition = watson.visual_recognition({
  api_key: '{api_key}',
  version: 'v3',
  version_date: '2016-05-19'
});

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