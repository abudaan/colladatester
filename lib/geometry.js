(function(){

	"use strict";

	var PI = Math.PI,
		halfPI = PI/2,
		quarterPI = PI/4,
		twoPI = PI*2,
		cos = Math.cos,
		sin = Math.sin,
		DEG_TO_RAD = PI / 180,
		RAD_TO_DEG = 1 / DEG_TO_RAD;


	Math.twoPI = twoPI;
	Math.halfPI = halfPI;
	Math.quarterPI = quarterPI;
	Math.degToRad = function(value){
		return value * DEG_TO_RAD;
	};
	Math.radToDeg = function(value){
		return value * RAD_TO_DEG;
	};


}());