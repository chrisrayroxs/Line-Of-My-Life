/* Main page interactions */
/*  
 * by Christopher Reynolds
 *  */

$(document).ready(function() {
	
	$(".timeLine").click(function(){
		
		   $(".timeLine").mousedown(function(e){
		    var X1 = (e.pageX - this.offsetLeft) - 8;
		    var Y1 = (e.pageY - this.offsetTop) - 8;
		    var X12 = (e.pageX) - 8;
		    var Y12 = (e.pageY) - 8;
		    $(".timeLine").mousemove(function(e){
		    	$('.timeLine svg').remove();
		  var width = ((e.pageX - this.offsetLeft) - 8) - X1;
		  var height = ((e.pageY - this.offsetTop) - 8) - Y1;
				var paper = Raphael(X12, Y12, e.pageX, e.pageY);
				var stringPath = "M" + 0 + " " + 0 + "L" + width + " " + height;
				var path = paper.path(stringPath);
		});
		    $(this).mouseup(function(e){
		    	$("#showBox").remove();
		    	$(this).unbind('mousemove');
		        var X2 = (e.pageX - this.offsetLeft) - 8;
		        var Y2 = (e.pageY - this.offsetTop) - 8;
		        //alert(X1 + " " + X2 + " " + Y1 + " " + Y2);
		        $(this).unbind('mouseup');
		       	width = X2 - X1;
		       	height = Y2 - Y1;		
				var paper = Raphael(X1, Y1, width, width);
				var stringPath = "M" + 0 + " " + 0 + "L" + width + " " + height;
				var path = paper.path(stringPath);
				  $('svg').draggable({ containment: "#canvas" });
				 // $('.timeLine svg').attr('class', 'svgDrawingObject').css('position', 'absolute').css('left', X12).css('top', Y12);
	
			});
			$(this).unbind('mousedown');
		});
	});

});