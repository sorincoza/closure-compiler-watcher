;(function($){

	var lastModifiedTime = '',
		paused = false,
		ajaxInProgress = false;


	$("#file_path_input").on( 'change', function(){
		checkFile();
	} );
	$("#watcher_button_start").on('click', function(){
		paused = false;
		checkFile();
	});
	$("#watcher_button_pause").on( 'click', function(){
		paused = true;
	} );



	function checkFile(){

		if( paused || ajaxInProgress ){
			return;
		}

		file = getFilePath();
		if( ! file ){
			// set the next check then return
			setTimeout( function(){
				checkFile();
			}, 2000 );
			return;
		}

		// if we got this far, we have a file and we check it
		ajaxInProgress = true;
		$.ajax({
			type: "POST",
			url: 'compiler.php',
			data: { 
				file_name: file,
				last_modified: lastModifiedTime
			},
			success: function( response ){
				ajaxInProgress = false;

				var time = getTime();
				var nextInterval = 2000;

				try{
					response = $.parseJSON( response );
				}catch(e){ 
					response = false;
					alert( 'JSON parse error' ); 
				}


				if( response === false ){
					addFeedbackMessage( 'error', 'Error parsing ajax response as JSON.');
				}else if( ! response.status ){
					addFeedbackMessage( 'error', 'Bad ajax response format' );
				}else if( response.status.toUpperCase() === 'OK' ){

					if( response.operation.toUpperCase() === 'MODIFIED' ){
						lastModifiedTime = response.last_modified;
						nextInterval = 10000;
						addFeedbackMessage( 'success', 'Successfully compiled at ' + time );
					}

					setTimeout( function(){
						checkFile();
					}, nextInterval );
				
				}else if( response.status.toUpperCase() === 'ERROR' ){
					addFeedbackMessage( 'error', response.message );
				}

			},
			error: function( jqXHR, textStatus, errorThrown ){
				ajaxInProgress = false;
				var time = getTime();
				addFeedbackMessage( 'error', 'Error: ' + textStatus + ' , errorThrown: ' + errorThrown + ', time: ' + time );
			},
			dataType: 'text'
		});
	}

	function getFilePath(){
		return $("#file_path_input").val().trim();
	}

	function getTime(){
		var now = new Date();
   		var time = now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();
   		return time;
	}

	function addFeedbackMessage( className, content ){
		$("#container").append( '<div class="' + className + '">' + content + '</div>' );
	}


})(jQuery);