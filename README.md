# YCClassifier
YNAP Custom Classifier

For this test my choice is NODE.JS 

# Preparation
Please install theese modules: fs, request, csvtojson, archiver, async and watson-developer-cloud

You can find all the variables related to the test in _configuration.js

WHAT CAN YOU DO?

1) PREPARE DATA
To run the test  you should first prepare the data
# from terminal, launch: "node 1_prpareData.js"
This code will:
  - open the csv file
  - check for all categories inside content
  - create a list of directories based on categories
  - check for all codes divided by each category
  - randomize and trunkate (based on a variable) list on items on each category
  - download all images related to codes
  - create a zip file for each category

2) CREATE AND TRAIN MY CLASSIFIER
After creating a list on valuable zip files, i can train mi classifier
# from terminal, launch: "node 2_createAndTrainClassifier.js"
This code will create and train my classifier.


3) (optional) CHECK IF MY CLASSIFIER EXISTS
After the classifier is created it's always possible to check if it exists by launching the above command line:
# from terminal, launch: "node 3_getClassifiersList.js"
This code will show a list of all classifiers created with my apiKey.

4) TRY TO CLASSIFY SOMETHING WITH MY TRAINED CLASSIFIER
After the classifier is trained (2) it's always possible to ask it to try to classifiy a specific image
# from terminal, launch: "node 4_classifyImage.js"
This code will show a JSON with a list of categories which the Classifier thinks the image is related to. 
