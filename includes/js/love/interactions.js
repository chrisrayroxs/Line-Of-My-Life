/* Main page interactions */
/*  
 * by Christopher Reynolds
 *  */

function createTimeline() {
		
	Raphael.fn.drawGrid = function (x, y, w, h, wv, hv, color) {
    color = color || "#000";
    var path = ["M", Math.round(x) + .5, Math.round(y) + .5, "L", Math.round(x + w) + .5, Math.round(y) + .5, Math.round(x + w) + .5, Math.round(y + h) + .5, Math.round(x) + .5, Math.round(y + h) + .5, Math.round(x) + .5, Math.round(y) + .5],
        rowHeight = h / hv,
        columnWidth = w / wv;
    for (var i = 1; i < hv; i++) {
        path = path.concat(["M", Math.round(x) + .5, Math.round(y + i * rowHeight) + .5, "H", Math.round(x + w) + .5]);
    }
    for (i = 1; i < wv; i++) {
        path = path.concat(["M", Math.round(x + i * columnWidth) + .5, Math.round(y) + .5, "V", Math.round(y + h) + .5]);
    }
    return this.path(path.join(",")).attr({stroke: color});
	};

    function getAnchors(p1x, p1y, p2x, p2y, p3x, p3y) {
        var l1 = (p2x - p1x) / 2,
            l2 = (p3x - p2x) / 2,
            a = Math.atan((p2x - p1x) / Math.abs(p2y - p1y)),
            b = Math.atan((p3x - p2x) / Math.abs(p2y - p3y));
        a = p1y < p2y ? Math.PI - a : a;
        b = p3y < p2y ? Math.PI - b : b;
        var alpha = Math.PI / 2 - ((a + b) % (Math.PI * 2)) / 2,
            dx1 = l1 * Math.sin(alpha + a),
            dy1 = l1 * Math.cos(alpha + a),
            dx2 = l2 * Math.sin(alpha + b),
            dy2 = l2 * Math.cos(alpha + b);
        return {
            x1: p2x - dx1,
            y1: p2y + dy1,
            x2: p2x + dx2,
            y2: p2y + dy2
        };
    }
    // Grab the data
    var labels = [],
        data = [];
    $("#data tfoot th").each(function () {
        labels.push($(this).html());
    });
    $("#data tbody td").each(function () {
        data.push($(this).html());
    });
    
    // Draw
    var width = 800,
        height = 250,
        leftgutter = 30,
        bottomgutter = 20,
        topgutter = 20,
        colorhue = .6 || Math.random(),
        color = "hsl(" + [colorhue, .5, .5] + ")",
        r = Raphael("holder", width, height),
        txt = {font: '12px Helvetica, Arial', fill: "#404040"},
        txt1 = {font: '10px Helvetica, Arial', fill: "#404040"},
        txt2 = {font: '12px Helvetica, Arial', fill: "#000"},
        X = (width - leftgutter) / labels.length,
        max = Math.max.apply(Math, data),
        Y = (height - bottomgutter - topgutter) / max;
    r.drawGrid(leftgutter + X * .5 + .5, topgutter + .5, width - leftgutter - X, height - topgutter - bottomgutter, 10, 10, "#000");
    var path = r.path().attr({stroke: color, "stroke-width": 4, "stroke-linejoin": "round"}),
        bgp = r.path().attr({stroke: "none", opacity: .3, fill: color}),
        label = r.set(),
        lx = 0, ly = 0,
        is_label_visible = false,
        leave_timer,
        blanket = r.set();
    label.push(r.text(60, 12, "24 hits").attr(txt));
    label.push(r.text(60, 27, "22 September 2008").attr(txt1).attr({fill: color}));
    label.hide();
    var frame = r.popup(100, 100, label, "right").attr({fill: "#000", stroke: "#666", "stroke-width": 2, "fill-opacity": .7}).hide();

    var p, bgpp;
    for (var i = 0, ii = labels.length; i < ii; i++) {
        var y = Math.round(height - bottomgutter - Y * data[i]),
            x = Math.round(leftgutter + X * (i + .5)),
            t = r.text(x, height - 6, labels[i]).attr(txt).toBack();
        if (!i) {
            p = ["M", x, y, "C", x, y];
            bgpp = ["M", leftgutter + X * .5, height - bottomgutter, "L", x, y, "C", x, y];
        }
        if (i && i < ii - 1) {
            var Y0 = Math.round(height - bottomgutter - Y * data[i - 1]),
                X0 = Math.round(leftgutter + X * (i - .5)),
                Y2 = Math.round(height - bottomgutter - Y * data[i + 1]),
                X2 = Math.round(leftgutter + X * (i + 1.5));
            var a = getAnchors(X0, Y0, x, y, X2, Y2);
            p = p.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
            bgpp = bgpp.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
        }
        var dot = r.circle(x, y, 4).attr({fill: "#333", stroke: color, "stroke-width": 2});
        blanket.push(r.rect(leftgutter + X * i, 0, X, height - bottomgutter).attr({stroke: "none", fill: "#fff", opacity: 0}));
        var rect = blanket[blanket.length - 1];
        (function (x, y, data, lbl, dot) {
            var timer, i = 0;
            rect.hover(function () {
                clearTimeout(leave_timer);
                var side = "right";
                if (x + frame.getBBox().width > width) {
                    side = "left";
                }
                var ppp = r.popup(x, y, label, side, 1),
                    anim = Raphael.animation({
                        path: ppp.path,
                        transform: ["t", ppp.dx, ppp.dy]
                    }, 200 * is_label_visible);
                lx = label[0].transform()[0][1] + ppp.dx;
                ly = label[0].transform()[0][2] + ppp.dy;
                frame.show().stop().animate(anim);
                label[0].attr({text: data + " hit" + (data == 1 ? "" : "s")}).show().stop().animateWith(frame, anim, {transform: ["t", lx, ly]}, 200 * is_label_visible);
                label[1].attr({text: lbl + " September 2008"}).show().stop().animateWith(frame, anim, {transform: ["t", lx, ly]}, 200 * is_label_visible);
                dot.attr("r", 6);
                is_label_visible = true;
            }, function () {
                dot.attr("r", 4);
                leave_timer = setTimeout(function () {
                    frame.hide();
                    label[0].hide();
                    label[1].hide();
                    is_label_visible = false;
                }, 1);
            });
        })(x, y, data[i], labels[i], dot);
    }
    p = p.concat([x, y, x, y]);
    bgpp = bgpp.concat([x, y, x, y, "L", x, height - bottomgutter, "z"]);
    path.attr({path: p});
    bgp.attr({path: bgpp});
    frame.toFront();
    label[0].toFront();
    label[1].toFront();
    blanket.toFront();

    var W = 640,
    H = 480,
  /*  r = Raphael("holder", W, H),*/
    values = [],
    len = 7;
	for (var i = len; i--;) {
    	values.push(50);
	}

	function translate(x, y) {
	    return [
	        50 + (W - 60) / (values.length - 1) * x,
	        H - 10 - (H - 20) / 100 * y
	    ];
	}
	
	function drawPath() {
	    var p = [];
	    for (var j = 1, jj = X.length; j < jj; j++) {
	        p.push(X[j], Y[j]);
	    }
	    p = ["M", X[0], Y[0], "R"].concat(p);
	    var subaddon = "L" + (W - 10) + "," + (H - 10) + ",50," + (H - 10) + "z";
	    path.attr({path: p});
	    sub.attr({path: p + subaddon});
	}
	
	var p = [["M"].concat(translate(0, values[0]))],
	    color = "hsb(240°, 1, 1)",
	    X = [],
	    Y = [],
	    blankets = r.set(),
	    buttons = r.set(),
	    w = (W - 60) / values.length,
	    isDrag = -1,
	    start = null,
	    sub = r.path().attr({stroke: "none", fill: [90, color, color].join("-"), opacity: 0}),
	    path = r.path().attr({stroke: color, "stroke-width": 2}),
	    unhighlight = function () {};
	var ii;
	for (i = 0, ii = values.length - 1; i < ii; i++) {
	    var xy = translate(i, values[i]),
	        xy1 = translate(i + 1, values[i + 1]),
	        f;
	    X[i] = xy[0];
	    Y[i] = xy[1];
	    (f = function (i, xy) {
	        buttons.push(r.circle(xy[0], xy[1], 5).attr({fill: color, stroke: "none"}));
	        blankets.push(r.circle(xy[0], xy[1], w / 2).attr({stroke: "none", fill: "#fff", opacity: 0}).mouseover(function () {
	            if (isDrag + 1) {
	                unhighlight = function () {};
	            } else {
	                buttons.items[i].animate({r: 10}, 200);
	            }
	        }).mouseout(function () {
	            if (isDrag + 1) {
	                unhighlight = function () {
	                    buttons.items[i].animate({r: 5}, 200);
	                };
	            } else {
	                buttons.items[i].animate({r: 5}, 200);
	            }
	        }).drag(function (dx, dy) {
	            var start = this.start;
	            start && update(start.i, start.p + dy);
	        }, function (x, y) {
	            this.start = {i: i, m: y, p: Y[i]};
	        }));
	        blankets.items[blankets.items.length - 1].node.style.cursor = "move";
	        })(i, xy);
	        if (i == ii - 1) {
	            f(i + 1, xy1);
	        }
	    }
	    xy = translate(ii, values[ii]);
	    X.push(xy[0]);
	    Y.push(xy[1]);
	    
	    drawPath();
	    var update = function (i, d) {
	        (d > H - 10) && (d = H - 10);
	        (d < 10) && (d = 10);
	        Y[i] = d;
	        drawPath();
	        buttons.items[i].attr({cy: d});
	        blankets.items[i].attr({cy: d});
	        r.safari();
	    };
};

function updateTimeline() {
	$(".timeLine svg").remove();
	createTimeline();
}

var limitT = 0;
function createDynamicTable(tbody, cols) {
	
	if(limitT < 1){
		if (cols > 10) { alert("Version alpha only allows for up to 10 columns per table."); return};
	
   if (tbody == null || tbody.length < 1) return;
  
   	 $('.span16').append('<table id="data"><tfoot>');
	 for (var r = 1; r <= 1; r++) {
	     var trow = $("<tr>");
	 for (var c = 1; c <= cols; c++) {
	     var cellText = "Cell " + r + "." + c
	 $("<th>")
	    .addClass("tableCell")
	    .appendTo(trow);
     }
     $('tfoot').append(trow);
	}
	$('.span16').append('</tfoot><tbody>');
	 for (var r = 1; r <= 1; r++) {
	     var trow = $("<tr>");
	 for (var c = 1; c <= cols; c++) {
	     var cellText = "Cell " + r + "." + c
	 $("<td>")
	    .addClass("tableCell")
	    .appendTo(trow);
     }
     trow.appendTo(tbody);
	}
	$('.span16').append('</tbody></table>');
	
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
					});					
			}
		})
		.hover(function(){ $(this).addClass('hover'); },function(){ $(this).removeClass('hover'); });

  limitT++;
  
 } // end if
 else
  alert("We're sorry, version alpha only allows for one table to be created per canvas.");
  
}

$(document).ready(function() {

	var paper = Raphael("timeLine", 500, 500);
	var path = paper.path("M10,20L30,40");
	
   $(".timeLine").mousedown(function(e){
   	var n = 0;
   	console.log("we have touchdown");
    var X1 = (e.pageX - this.offsetLeft) - 8;
    var Y1 = (e.pageY - this.offsetTop) - 8;
    var X12 = (e.pageX) - 8;
    var Y12 = (e.pageY) - 8;
   
    $(this).mouseup(function(e){
    	console.log("we have liftoff");
        var X2 = (e.pageX - this.offsetLeft) - 8;
        var Y2 = (e.pageY - this.offsetTop) - 8;
        $(this).unbind('mouseup');
       	width = X2 - X1;
       	height = Y2 - Y1;		
		var paper = Raphael(X1, Y1, width, width);
		var stringPath = "M" + 0 + " " + 0 + "L" + width + " " + height;
		var path = paper.path(stringPath);
		  $('svg').draggable({ containment: "#canvas" });
		  $('.timeLine svg').attr('class', 'svgDrawingObject').css('position', 'absolute').css('left', X12).css('top', Y12);

		});
		$(this).unbind('mousedown');
	});

});
