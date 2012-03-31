/*
 * build page
 * 
 * by Christopher Reynolds
 * 
 */

$(document).ready(function() {
	
	//alert("This app is in its pre-alpha version and is still in development. This is only a preview. \nI really appreciate your interest! Check out the repo on github /chrisrayroxs/Line-Of-My-Life");
	
	$('table td')
		.click(function(){
			if( !$(this).is('.input') ){
				$(this).addClass('input')
					.html('<input type="text" value="'+ $(this).text() +'" />')
					.find('input').focus()
					.blur(function(){
						//remove td class, remove input
						$(this).parent().removeClass('input').html($(this).val() || 0);
						//update charts	
						$('.visualize').trigger('visualizeRefresh');
						updateTimeline()
						
					});					
			}
		})
		.hover(function(){ $(this).addClass('hover'); },function(){ $(this).removeClass('hover'); });
	$('table th')
		.click(function(){
			if( !$(this).is('.input') ){
				$(this).addClass('input')
					.html('<input type="text" value="'+ $(this).text() +'" />')
					.find('input').focus()
					.blur(function(){
						//remove td class, remove input
						$(this).parent().removeClass('input').html($(this).val() || 0);
						//update charts	
						$('.visualize').trigger('visualizeRefresh');
						updateTimeline()
					});					
			}
		})
		.hover(function(){ $(this).addClass('hover'); },function(){ $(this).removeClass('hover'); });
		
});