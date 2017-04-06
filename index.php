<?php
class myClassifier {

	private $urlBase;
	private $urlApi;

	function __construct () {
		$this->_urlBase = "https://watson-api-explorer.mybluemix.net/visual-recognition";
		$this->_urlApi = "mypersonalkey";
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