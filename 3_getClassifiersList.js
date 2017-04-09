/* INCLUDES ***************************/
require('./_configuration.js');


/* VARIABLES **************************/
var fs = require('fs'),
    watson = require('watson-developer-cloud'),
    visual_recognition = watson.visual_recognition({
	  api_key: myApiKey,
	  version: 'v3',
	  version_date: '2016-05-19'});


/* CODE *******************************/

visual_recognition.listClassifiers({},
	function(err, response) {
	 if (err)
		console.log(err);
	 else
		console.log(JSON.stringify(response, null, 2));
	}
);
