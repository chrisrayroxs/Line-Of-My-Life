/* Main page interactions */
/*  
 * by Christopher Reynolds
 * thanks to ** raphael -> raphaeljs.com
 *  */

function createTimeline() {

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
    
    /*
    // Grab the data
    var labels = [],
        data = [];
    $("#data tfoot th").each(function () {
        labels.push($(this).html());
    });
    $("#data tbody td").each(function () {
        data.push($(this).html());
    });
    */
   
   // Grab the data
    var labels = [],
        data = [],
        description = [];
        
    $(".eDate").each(function () {
        labels.push($(this).html());
    });
    $(".eValue").each(function () {
        data.push($(this).html());
    });
    $(".eDescription").each(function () {
        description.push($(this).html());
    });
   
    // Draw
   var w = $(window).width();
    var width = w,
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
    var frame = r.popup(100, 100, label, "right").attr({fill: "#FFF", stroke: "#666", "stroke-width": 2, "fill-opacity": .7}).hide();

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
        
        (function (x, y, data, lbl, description, dot) {
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
                label[0].attr({text: data + (data == 1 ? "" : "s")}).show().stop().animateWith(frame, anim, {transform: ["t", lx, ly]}, 200 * is_label_visible);
                label[1].attr({text: description }).show().stop().animateWith(frame, anim, {transform: ["t", lx, ly]}, 200 * is_label_visible);
                
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
        })(x, y, data[i], labels[i], description[i], dot);
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

$(document).ready(function set() {

	var w = $(window).width();
	var h = $(window).height();
	var r = Raphael("timeLine", w, h),
        R = 200,
        init = true,
        param = {stroke: "#fff", "stroke-width": 30},
        hash = document.location.hash,
        marksAttr = {fill: hash || "#444", stroke: "none"},
        html = [
            document.getElementById("h"),
            document.getElementById("m"),
            document.getElementById("s"),
            document.getElementById("d"),
            document.getElementById("mnth"),
            document.getElementById("ampm")
        ];
        var clockOuterLining = r.circle(300, 300, 200);
		clockOuterLining.attr({stroke: "#ddd", "stroke-width": 30, fill: "#FFF"});
	    var clockShell = r.circle(300, 300, 217);
		clockShell.attr({stroke: "#99ACBD", "stroke-width": 4});
	    var clockInnerLining = r.circle(300, 300, 183);
		clockInnerLining.attr({stroke: "#99ACBD", "stroke-width": 4});
	    
    // Custom Attribute
    r.customAttributes.arc = function (value, total, R) {
        var alpha = 360 / total * value,
            a = (90 - alpha) * Math.PI / 180,
            x = 300 + R * Math.cos(a),
            y = 300 - R * Math.sin(a),
            color = "hsb(".concat(Math.round(R) / 300, ",", value / total, ", .75)"),
            path;
        if (total == value) {
            path = [["M", 300, 300 - R], ["A", R, R, 0, 1, 1, 299.99, 300 - R]];
        } else {
            path = [["M", 300, 300 - R], ["A", R, R, 0, +(alpha > 180), 1, x, y]];
        }
        return {path: path, stroke: color};
    };

    drawMarks(R, 60);
    var sec = r.path().attr(param).attr({arc: [0, 60, R]});
    R -= 40;
    //drawMarks(R, 60);
    var min = r.path().attr(param).attr({arc: [0, 60, R]});
    R -= 40;
    //drawMarks(R, 12);
    var hor = r.path().attr(param).attr({arc: [0, 12, R]});
    R -= 40;
    //drawMarks(R, 31);
    var day = r.path().attr(param).attr({arc: [0, 31, R]});
    R -= 40;
    drawMarks(R, 12);
    var mon = r.path().attr(param).attr({arc: [0, 12, R]});
    var pm = r.circle(300, 300, 16).attr({stroke: "none", fill: Raphael.hsb2rgb(15 / 200, 1, .75).hex});
    html[5].style.color = Raphael.hsb2rgb(15 / 200, 1, .75).hex;

    function updateVal(value, total, R, hand, id) {
        if (total == 31) { // month
            var d = new Date;
            d.setDate(1);
            d.setMonth(d.getMonth() + 1);
            d.setDate(-1);
            total = d.getDate();
        }
        var color = "hsb(".concat(Math.round(R) / 200, ",", value / total, ", .75)");
        if (init) {
            hand.animate({arc: [value, total, R]}, 900, ">");
        } else {
            if (!value || value == total) {
                value = total;
                hand.animate({arc: [value, total, R]}, 750, "bounce", function () {
                    hand.attr({arc: [0, total, R]});
                    offset = 200;
                });
            } else {
                hand.animate({arc: [value, total, R]}, 750, "bounce");
            }
        }
        html[id].innerHTML = (value < 10 ? "0" : "") + value;
        html[id].style.color = Raphael.getRGB(color).hex;
    }

    function drawMarks(R, total) {
        if (total == 31) { // month
            var d = new Date;
            d.setDate(1);
            d.setMonth(d.getMonth() + 1);
            d.setDate(-1);
            total = d.getDate();
        }
        var color = "hsb(".concat(Math.round(R) / 200, ", 1, .75)"),
            out = r.set();
        for (var value = 0; value < total; value++) {
            var alpha = 360 / total * value,
                a = (90 - alpha) * Math.PI / 180,
                x = 300 + R * Math.cos(a),
                y = 300 - R * Math.sin(a);
            out.push(r.circle(x, y, 2).attr(marksAttr));
        }
        return out;
    }
    (function () {
        var d = new Date,
            am = (d.getHours() < 12),
            h = d.getHours() % 12 || 12;
        updateVal(d.getSeconds(), 60, 200, sec, 2);
        /*
        updateVal(d.getMinutes(), 60, 160, min, 1);
        updateVal(h, 12, 120, hor, 0);
        updateVal(d.getDate(), 31, 80, day, 3);
        updateVal(d.getMonth() + 1, 12, 40, mon, 4);
        pm[(am ? "hide" : "show")]();
        html[5].innerHTML = am ? "AM" : "PM";
        */
        setTimeout(arguments.callee, 1000);
        init = false;
    })();
	
/*	var paper = Raphael("timeLine", w, h);
	//var lifeline = paper.circle(w/2, h/2.5, w/6);
	path = [["M", 20, 20], ["L", 40, 40], ["M", 50, 50], ["L", 60, 60]];
	path2 = "M100 100 a50 50 1 1 0 0.00001 0";
	path3 = "M100 100 C100 100 200 200 270 260";
	var lifeline = paper.path(path3);
	
	lifeline .attr({stroke: "#000", "stroke-width": 4, fill: "#FFF"});
	console.log("w: " + w/2 + " h: "+ h);
	//var lifeline = paper.path("M" + 50 + " " + 50 + "L" + w + " " + 50);
	var positionX = 50;
	var positionY = 50; 
	var interval = 5; */
	/*	var rendering = setInterval(function() {
			if(interval < 200){	    
				var circle = paper.circle(positionX, positionY, 10);
				circle.attr({stroke: "#DDD", "stroke-width": 4, fill: "#FFF"});

				positionX += 50;
				interval += 5;
				//$("svg").css({left: -interval});
			}
			else{
				clearInterval( rendering );
				set();
				
			}
		}, 1000);
*/
});

function addEntry() {
	var currentTime = new Date();
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();

	var data = $(".newEvent").val();
	console.log(" currentTime: " + currentTime + " data: " + data);
}


