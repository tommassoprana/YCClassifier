<?php
//"url": "https://gateway-a.watsonplatform.net/visual-recognition/api",
//"note": "It may take up to 5 minutes for this key to become active",
//"api_key": "0f289cb41f07a65d013d6e9acd53b356ea01079b"

// curl -X POST --header 'Content-Type: multipart/form-data' --header 'Accept: application/json' -F name=test  'https://watson-api-explorer.mybluemix.net/visual-recognition/api/v3/classifiers?api_key=0f289cb41f07a65d013d6e9acd53b356ea01079b&version=2016-05-20'


class myClassifier {

	private $urlBase;
	private $urlApi;

	function __construct () {
		$this->_urlBase = "https://watson-api-explorer.mybluemix.net/visual-recognition";
		$this->_urlApi = "0f289cb41f07a65d013d6e9acd53b356ea01079b";
	}

	function callWatson ($url, $data) {
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
	    curl_setopt($ch, CURLOPT_HEADER, false);
	    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
	    curl_setopt($ch, CURLOPT_URL,$this->_urlBase.$url);
		curl_setopt($ch, CURLOPT_REFERER, $url);
	    curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
		$out = curl_exec ($ch);
		curl_close ($ch);
		$this->log($this->_urlBase.$url.'?'.$data);
		return $out;
	}

	
	function train () {
		$url = "/api/v3/classifiers";
		$data = "api_key=".$this->_urlApi."&version=2016-05-20";
		echo $this->callWatson($url, $data);
	}


	function log ($data) {
		echo '<div>Log: '.$data.'</data>';
	}
}



$mc = new myClassifier();
echo $mc->train();
?>