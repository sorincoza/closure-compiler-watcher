;(function($){

	var paused = false,
		ajaxInProgress = false;

	checkFile();



	function checkFile(){

		if( paused || ajaxInProgress ){
			return;
		}

		file = getFilePath();

		// if we got this far, we have a file and we check it
		ajaxInProgress = true;
		$.ajax({
			type: "POST",
			url: 'compiler.php',
			data: { 
				file_name: file,
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
						nextInterval = 10000;
						addFeedbackMessage( 'success', 'Successfully compiled' );
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
				addFeedbackMessage( 'error', 'Error: ' + textStatus + ' , errorThrown: ' + errorThrown );
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
		$("#container").append( '<div class="' + className + '"><span class="time">' + getTime() + '</span>' + content + '</div>' );
	}


})(jQuery);