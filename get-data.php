<?php
	$commodity = $_GET["commodity"];
	$page_num = 1;
	//5b8e62d4d48749d4b0c9ef06ffcec2d8f4cf334d
	//e3428409767bde1684f54002eafb9f528a8b274f
	$url = "http://api.dataweave.in/v1/commodities/findByCommodity/?api_key=5b8e62d4d48749d4b0c9ef06ffcec2d8f4cf334d&commodity=".$commodity."&start_date=20130302&end_date=20130302&page=".$page_num."&per_page=10";
	
	$userAgent = 'Mozilla/5.0 (Linux; U; Android 2.2; en-us; Nexus One Build/FRF91) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1';
	$ch = curl_init( $url );
	curl_setopt( $ch, CURLOPT_USERAGENT, $userAgent );
	curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
	curl_setopt( $ch, CURLOPT_FOLLOWLOCATION, true );
	curl_setopt( $ch, CURLOPT_SSL_VERIFYPEER, false ); // this is a hack since cURL aint configured with SSL on my system
	curl_setopt( $ch, CURLOPT_HEADER, 0 );
	$commodity_data = curl_exec( $ch ) or die(curl_error($ch));
	curl_close( $ch );
	echo $commodity_data;
	
?> 