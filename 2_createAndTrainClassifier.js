/* INCLUDES ***************************/
require('./_configuration.js');


/* VARIABLES **************************/
var fs = require('fs'),
    watson = require('watson-developer-cloud'),
    visual_recognition = watson.visual_recognition({
	  api_key: myApiKey,
	  version: 'v3',
	  version_date: '2016-05-19'}),
    params = { name: myClassifierName };


/* CODE *******************************/
// to launch the Classifier we need to populate the correct "params" object
var files = fs.readdirSync('./zip');
if (files.length > 0) {
	// walk on each zip file
	for (var i = 0; i < files.length; i++) {
		var filePath = './zip/' + files[i];
		if (fs.statSync(filePath).isFile()) {
			var category = files[i].slice(0, -4),
			    positiveName = category + "_positive_examples";
			// adding the correct params
			params[positiveName] = fs.createReadStream(filePath);
		}
	}
}

//console.log(params);

visual_recognition.createClassifier(params,
	function(err, response) {
   	 if (err)
      		console.log(err);
    	 else
   		console.log(JSON.stringify(response, null, 2));
});
