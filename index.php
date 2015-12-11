<!DOCTYPE html>
<html>
<head>
	<title>Closure compiler watcher</title>
</head>
<body>

<?php
	$posted_file_name = false;
	if( ! empty($_REQUEST['file_path']) ){
		$posted_file_name = $_REQUEST['file_path'];
		?><h3><?php echo 'Watching now: <code>' . $posted_file_name . '</code>'; ?></h3><?php
	}
?>

<form id="the_form" method="post">
	<input id="file_path_input" type="text" name="file_path" value="<?php echo ( $posted_file_name ? $posted_file_name : '' ); ?>">
	<button id="watcher_button_start" type="submit">Watch it!</button>
</form>


<div id="container"></div>



<!-- scripts -->
	<script type="text/javascript" src="jquery.min.js"></script>
	<script type="text/javascript" src="script.js"></script>


<!-- styles -->
	<style type="text/css">
		body{
			font-family: monospace, sans-serif;
		}
		.success{ color: green; }
		.error{ color: red; }
		.time{
			display: inline-block;
			padding-right: 15px;
			width: 100px;
		}
		#file_path_input{
			width: 400px;
		}
	</style>

</body>
</html>