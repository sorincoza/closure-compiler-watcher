<?php

if( empty( $_REQUEST['file_name'] ) ) 
	returnAjaxResponse( array(
		'status' => 'ERROR',
		'message' => 'No file specified'
	) );


$file = $_REQUEST['file_name'];
if( ! file_exists( $file ) )
	returnAjaxResponse( array(
		'status' => 'ERROR',
		'message' => 'Source file does not exist at the specified path.'
	) );


$min_js_file = preg_replace( '~.js$~i', '.min.js', $file );
if( $file === $min_js_file )
	returnAjaxResponse( array(
		'status' => 'ERROR',
		'message' => 'Either bad file format (not .js), or file is already minified, and thus it will not be replaced.'
	) );



$min_js_last_modified = file_exists($min_js_file) ? filemtime($min_js_file) : 0;

if( filemtime($file) > $min_js_last_modified ){
	minifyJSFile( $file, $min_js_file );
}else{
	returnAjaxResponse( array(
		'status' => 'OK',
		'operation' => 'NOT MODIFIED'
	) ) ;
}




// FUNCTIONS

function returnAjaxResponse( $arr = array() ){
	echo json_encode($arr);
	exit;
}

function minifyJSFile( $file, $min_js_file ){
	$min_js_code = getRemoteMinifiedResponse( $file );
	if( $min_js_code === false ) returnAjaxResponse( array(
			'status' => 'ERROR',
			'message' => 'Failed post request to closure-compiler.appspot.com'
		) );


	$save = file_put_contents( $min_js_file, $min_js_code );

	if( $save === false ){
		returnAjaxResponse( array(
			'status' => 'ERROR',
			'message' => 'Failed to save minified file'
		) );
	}else{
		returnAjaxResponse( array(
			'status' => 'OK',
			'operation' => 'MODIFIED',
		) );
	}


}

function getRemoteMinifiedResponse( $file ){

	$js_code = file_get_contents($file);
	if( ! trim($js_code) ){
		returnAjaxResponse( array(
			'status' => 'ERROR',
			'message' => 'Source file is empty, there is nothing to compile!'
		) );
	}


	$postdata = http_build_query(
	    array(
	        'js_code' => $js_code,
	        'output_info' => 'compiled_code',
	        'output_format' => 'text'
	    )
	);

	// Create a stream
	$opts = array(
	  'http'=>array(
	    'method'=>"POST",
	    'header'=>"Content-type: application/x-www-form-urlencoded",
	    'content' => $postdata
	  )
	);

	$context = stream_context_create($opts);

	// Open the file using the HTTP headers set above
	return file_get_contents( 'http://closure-compiler.appspot.com/compile', false, $context );
}