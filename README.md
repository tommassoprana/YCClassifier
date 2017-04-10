# YCClassifier
YNAP Custom Classifier

For this test my choice is NODE.JS 

# Preparation
If missing from git-clone please add the following directories from repo root:
  - pool
  - zip
In order to run the code, theese npm modules are required:
  - fs
  - request
  - csvtojson
  - archiver
  - async
  - watson-developer-cloud

You can find all the variables related to the test in _configuration.js

WHAT CAN YOU DO?

# 0) SET THE CORRECT API-KEY
Before starting, you need to apply the correct api-key in _configuration.js
I've sent my personal api-key to my HR relator for this test. 
Please ask her for the correct code.

# 1) PREPARE DATA
To run the test  you should first prepare the data
  - From terminal, launch: "node 1_prepareData.js"
  
This code will:
  - open the csv file
  - check for all categories inside content
  - create a list of directories based on categories
  - check for all codes divided by each category
  - randomize and trunkate (based on a variable) list on items on each category
  - download all images related to codes
  - create a zip file for each category

# 2) CREATE AND TRAIN MY CLASSIFIER
After creating a list on valuable zip files, i can train mi classifier
  - From terminal, launch: "node 2_createAndTrainClassifier.js"
  - This code will create and train my classifier.

# 3) CHECK IF MY CLASSIFIER EXISTS
(optional) After the classifier is created it's always possible to check if it exists by launching the above command line:
  - From terminal, launch: "node 3_getClassifiersList.js"
  - This code will show a list of all classifiers created with my apiKey.

# 4) TRY TO CLASSIFY SOMETHING WITH MY TRAINED CLASSIFIER
After the classifier is trained (2) it's always possible to ask it to try to classifiy a specific image
  - From terminal, launch: "node 4_classifyImage.js"
  - This code will show a JSON with a list of categories which the Classifier thinks the image is related to. 
