// npm install watson-developer-cloud --save
// npm i --save csvtojson

var fs = require('fs');
const csvFilePath='training_set.csv'
const csv=require('csvtojson')
csv()
.fromFile(csvFilePath)
.on('json',(jsonObj)=>{
    // combine csv header row and csv line to a json object 
    // jsonObj.a ==> 1 or 4 
    console.log(jsonObj)
})
.on('done',(error)=>{
    console.log('end')
})

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
