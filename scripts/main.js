var gCtx    = null;
var gCanvas = null;

var imageData = null;
var ii=0;
var jj=0;
var c=0;

$(function(){
	initCanvas(320,240);	
});


function initCanvas(ww,hh)
{
	gCanvas = document.getElementById("canvas");
	var w = ww;
	var h = hh;
	gCanvas.style.width = w + "px";
	gCanvas.style.height = h + "px";
	gCanvas.width = w;
	gCanvas.height = h;
	gCtx = gCanvas.getContext("2d");
	gCtx.clearRect(0, 0, w, h);
	imageData = gCtx.getImageData( 0,0,320,240);
}

function passLine(stringPixels) { 
	//a = (intVal >> 24) & 0xff;

	var coll = stringPixels.split("-");

	for(var i=0;i<320;i++) { 
		var intVal = parseInt(coll[i]);
		r = (intVal >> 16) & 0xff;
		g = (intVal >> 8) & 0xff;
		b = (intVal ) & 0xff;
		imageData.data[c+0]=r;
		imageData.data[c+1]=g;
		imageData.data[c+2]=b;
		imageData.data[c+3]=128;
		c+=4;
	} 

	if(c>=320*240*4) { 
		c=0;
    			gCtx.putImageData(imageData, 0,0);
	} 
} 

function captureToCanvas() {
	setInterval(function(){ capture(); }, 1000);
	
	blinks = 1;
	active = false;
	
	display = window.open("", "display", "status=0,toolbar=0,location=0,menubar=0,scrollbars=0");
	display.document.body.innerHTML = '<img src="' + window.location.href + 'images/inactive-1.png"><style type="text/css"> html,body {background: #000; overflow: hidden}';
}

function capture() {
	flash = document.getElementById("embedflash");
	flash.ccCapture();
	
	var comp = ccv.detect_objects({ "canvas"   : gCanvas,
	                                "cascade"  : cascade,
	                                "interval" : 5,
	                                "min_neighbors" : 1});
	

	if (comp.length <= 0 && active) {
		display.document.body.innerHTML = '<img src="' + window.location.href + 'images/inactive-' + blinks++ + '.png"><style type="text/css"> html,body {background: #000;}';
		if (blinks > 4) {
			setTimeout(function(){
				var snd = new Audio("scream.wav");
				snd.play();
			}, 1);
			
			blinks = 1;
		}
		
		active = false;
	} else if (comp.length > 0 && !active) {
		display.document.body.innerHTML = '<img src="' + window.location.href + 'images/active-' + blinks + '.png"><style type="text/css"> html,body {background: #000;}';
		active = true;
	}
	
	for (var i = 0; i < comp.length; i++) {
		gCanvas.getContext("2d").strokeRect(comp[i].x, comp[i].y, comp[i].width, comp[i].height);
	}
}


