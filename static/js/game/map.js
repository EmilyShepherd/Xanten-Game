
/**
 *  It generates and returns a random map for the world
 *
 * @param (string) The size of the map (small, medium, large)
 * @returns (string) The map for the world
 * @author Joe
 *
 */

function generateGeneralMap(size){

	// Controlling amount of space on the map.
	var minClear = 0;
	var noClear = 49;
	switch (size) {
		// Small: 2-4 players
		// Medium: 4-6 players
		// Large: 6-10 players
		case "small":
			minClear = 8;
			break;
		case "large":
			minClear = 20;
			break;
		default:
			minClear = 12;
		}

	// Variables which control properties of the world being generated:
	// How often do things appear?
	var OCEAN_SEED = Math.floor((Math.random() * 9) + 1)/100; // 0.01 ---> 0.09
	var ROCK_SEED = 0.01;
	var FOREST_SEED = 0.1;
	// What's the likelihood that they'll spread?
	var OCEAN_EXPAND = Math.floor((Math.random() * 9) + 3)/100; // 0.03 --> 0.09
	var FOREST_EXPAND = Math.floor((Math.random() * 9) + 5)/100; // 0.05 --> 0.09
  // Calculating probabilities:
  var p_ocean = 1 - OCEAN_SEED;
  var p_rock = p_ocean - ROCK_SEED;
  var p_forest = p_rock - FOREST_SEED;

	var x = 0;
	var y = 0;
	var r = 0;
	var imgArray = [
		[],
		[],
		[],
		[],
		[],
		[],
		[]
	];

	// First sweep, populating the world with trees, rocks and single-block oceans.
  while (y < 7) {
    while (x < 7) {
      r = Math.random();
      if ((r > p_ocean) && (noClear > minClear)) {
        imgArray[y][x] = "o";
				noClear--;
      } else if ((r > p_rock) && (noClear > minClear)) {
        imgArray[y][x] = "m".concat(Math.round(10*(r - p_rock)));
				noClear--;
      } else if ((r > p_forest) && (noClear > minClear)) {
        imgArray[y][x] = "t".concat(Math.round(10*(r - p_forest)));
				noClear--;
      } else {
        imgArray[y][x] = "g";
      }
      x++;
    }
    x = 0;
    y++;
  }

  // Second sweep, finding single-block oceans and expanding them.
	x = 0;
	y = 0;
	while (y < 7) {
		while (x < 7) {
			if (noClear > minClear) {
				if (imgArray[y][x] === "o") {
					if (x > 0) {
						if (Math.random() < OCEAN_EXPAND) {
							imgArray[y][x - 1] = "o";
							noClear--;
						}
					}
					if (x < 6) {
							if (Math.random() < OCEAN_EXPAND) {
							imgArray[y][x + 1] = "o";
							noClear--;
						}
					}
					if (y > 0) {
						if (Math.random() < OCEAN_EXPAND) {
							imgArray[y - 1][x] = "o";
							noClear--;
						}
					}
					if (y < 6) {
						if (Math.random() < OCEAN_EXPAND) {
							imgArray[y + 1][x] = "o";
							noClear--;
						}
					}
				} else if (imgArray[y][x] === "t0") {
					if (x > 0) {
						if (Math.random() < FOREST_EXPAND) {
							imgArray[y][x - 1] = "t1";
							noClear--;
						}
					}
					if (x < 6) {
						if (Math.random() < FOREST_EXPAND) {
							imgArray[y][x + 1] = "t1";
							noClear--;
						}
					}
					if (y > 0) {
							if (Math.random() < FOREST_EXPAND) {
							imgArray[y - 1][x] = "t1";
							noClear--;
						}
					}
					if (y < 6) {
						if (Math.random() < FOREST_EXPAND) {
							imgArray[y + 1][x] = "t1";
							noClear--;
						}
					}
				}
			}
			x++;
		}
		x = 0;
		y++;
	}

  // Third sweep, adding nice smooth coastline to the oceans.
	x = 0;
	y = 0;
	while (y < 7) {
		while (x < 7) {
			if (imgArray[y][x] !== "o") {
				var n = false;
				var s = false;
				var w = false;
				var e = false;
				var nw = false;
				var ne = false;
				var sw = false;
				var se = false;
				if (y > 0) {
					n = (imgArray[y - 1][x] === "o" || imgArray[y - 1][x] === "ob-se" || imgArray[y - 1][x] === "ob-sw" || imgArray[y - 1][x] === "o-s");
				}
				if (y < 6) {
					s = (imgArray[y + 1][x] === "o" || imgArray[y + 1][x] === "ob-ne" || imgArray[y + 1][x] === "ob-nw" || imgArray[y + 1][x] === "o-n");
				}
				if (x > 0) {
					w = (imgArray[y][x - 1] === "o" || imgArray[y][x - 1] === "ob-ne" || imgArray[y][x - 1] === "ob-se" || imgArray[y][x - 1] === "o-e");
					if (y > 0) {
						nw = (imgArray[y - 1][x - 1] === "o");
					}
					if (y < 6) {
						sw = (imgArray[y + 1][x - 1] === "o");
					}
				}
				if (x < 6) {
					e = (imgArray[y][x + 1] === "o" || imgArray[y][x + 1] === "ob-nw" || imgArray[y][x + 1] === "ob-sw" || imgArray[y][x + 1] === "o-w");
					if (y > 0) {
						ne = (imgArray[y - 1][x + 1] === "o");
					}
					if (y < 6) {
						se = (imgArray[y + 1][x + 1] === "o");
					}
				}
				if ((n && s) || (w && e)) {
					imgArray[y][x] = "o";
					x = 0;
					y = 0;
				} else if (n && !w && !e && !s) {
					imgArray[y][x] = "o-n";
				} else if (!n && !w && !e && s) {
					imgArray[y][x] = "o-s";
				} else if (!n && w && !e && !s) {
					imgArray[y][x] = "o-w";
				} else if (!n && !w && e && !s) {
					imgArray[y][x] = "o-e";
				} else if (nw && se && !n && !s && !e && !w) {
					imgArray[y][x] = "oa-nw";
				} else if (sw && ne && !n && !s && !e && !w) {
					imgArray[y][x] = "oa-ne";
				} else if (nw && !n && !w) {
					imgArray[y][x] = "oc-nw";
				} else if (ne && !n && !e) {
					imgArray[y][x] = "oc-ne";
				} else if (sw && !s && !w) {
					imgArray[y][x] = "oc-sw";
				} else if (se && !s && !e) {
					imgArray[y][x] = "oc-se";
				}
			}
			x++;
		}
		x = 0;
		y++;
	}

	x = 0;
	y = 0;
	while (y < 7) {
		while (x < 7) {
			if (x===0 && y===0) {
				console.log("restart");
			}
			if (imgArray[y][x] !== "o") {
				var n = false;
				var s = false;
				var w = false;
				var e = false;
				var nw = false;
				var ne = false;
				var sw = false;
				var se = false;
				if (y > 0) {
					n = (imgArray[y - 1][x] === "o");
				}
				if (y < 6) {
					s = (imgArray[y + 1][x] === "o");
				}
				if (x > 0) {
					w = (imgArray[y][x - 1] === "o");
					if (y > 0) {
						nw = (imgArray[y - 1][x - 1] === "o");
					}
					if (y < 6) {
						sw = (imgArray[y + 1][x - 1] === "o");
					}
				}
				if (x < 6) {
					e = (imgArray[y][x + 1] === "o");
					if (y > 0) {
						ne = (imgArray[y - 1][x + 1] === "o");
					}
					if (y < 6) {
						se = (imgArray[y + 1][x + 1] === "o");
					}
				}
				if ((n && (w || sw)) || (w && ne)){
					if (x === 6 && y === 6) {
						imgArray[y][x] = "ob-nw";
					} else if (x === 6) {
						if (imgArray[y+1][x] === "o-w" || imgArray[y+1][x] === "ob-sw" || imgArray[y+1][x] === "oc-nw" || imgArray[y+1][x] === "oa-nw") {
							imgArray[y][x] = "ob-nw";
						}
					} else if (y === 6) {
						if (imgArray[y][x+1] === "o-n" || imgArray[y][x+1] === "ob-ne" || imgArray[y][x+1] === "oc-nw" || imgArray[y][x+1] === "oa-nw" ) {
							imgArray[y][x] = "ob-nw";
						}
					} else {
						if (imgArray[y+1][x] === "o-w" || imgArray[y+1][x] === "ob-sw" || imgArray[y+1][x] === "oc-nw" || imgArray[y+1][x] === "oa-nw") {
							if (imgArray[y][x+1] === "o-n" || imgArray[y][x+1] === "ob-ne" || imgArray[y][x+1] === "oc-nw" || imgArray[y][x+1] === "oa-nw" ) {
								imgArray[y][x] = "ob-nw";
							}
						}
					}
				}
				if ((n && (e || se)) || (e && nw)){
					if (x === 0 && y === 6) {
						imgArray[y][x] = "ob-ne";
					} else if (x === 0) {
						if (imgArray[y+1][x] === "o-e" || imgArray[y+1][x] === "ob-se" || imgArray[y+1][x] === "oc-ne" || imgArray[y+1][x] === "oa-ne") {
							imgArray[y][x] = "ob-ne";
						}
					} else if (y === 6) {
						if (imgArray[y][x-1] === "o-n" || imgArray[y][x-1] === "ob-nw" || imgArray[y][x-1] === "oc-ne" || imgArray[y][x-1] === "oa-ne" ) {
							imgArray[y][x] = "ob-ne";
						}
					} else {
						if (imgArray[y+1][x] === "o-e" || imgArray[y+1][x] === "ob-se" || imgArray[y+1][x] === "oc-ne" || imgArray[y+1][x] === "oa-ne") {
							if (imgArray[y][x-1] === "o-n" || imgArray[y][x-1] === "ob-nw" || imgArray[y][x-1] === "oc-ne" || imgArray[y][x-1] === "oa-ne" ) {
								imgArray[y][x] = "ob-ne";
							}
						}
					}
				}
				if ((s && (w || nw)) || (w && se)){
					if (x === 6 && y === 0) {
						imgArray[y][x] = "ob-sw";
					} else if (x === 6) {
						if (imgArray[y-1][x] === "o-w" || imgArray[y-1][x] === "ob-nw" || imgArray[y-1][x] === "oc-sw" || imgArray[y-1][x] === "oa-ne") {
							imgArray[y][x] = "ob-sw";
						}
					} else if (y === 0) {
						if (imgArray[y][x+1] === "o-s" || imgArray[y][x+1] === "ob-se" || imgArray[y][x+1] === "oc-sw" || imgArray[y][x+1] === "oa-ne" ) {
							imgArray[y][x] = "ob-sw";
						}
					} else {
						if (imgArray[y-1][x] === "o-w" || imgArray[y-1][x] === "ob-nw" || imgArray[y-1][x] === "oc-sw" || imgArray[y-1][x] === "oa-ne") {
							if (imgArray[y][x+1] === "o-s" || imgArray[y][x+1] === "ob-se" || imgArray[y][x+1] === "oc-sw" || imgArray[y][x+1] === "oa-ne" ) {
								imgArray[y][x] = "ob-sw";
							}
						}
					}
				}
				if ((s && (e || ne)) || (e && sw)){
					if (x === 0 && y === 0) {
						imgArray[y][x] = "ob-se";
					} else if (x === 0) {
						if (imgArray[y-1][x] === "o-e" || imgArray[y-1][x] === "ob-ne" || imgArray[y-1][x] === "oc-se" || imgArray[y-1][x] === "oa-nw") {
							imgArray[y][x] = "ob-se";
						}
					} else if (y === 0) {
						if (imgArray[y][x-1] === "o-s" || imgArray[y][x-1] === "ob-sw" || imgArray[y][x-1] === "oc-se" || imgArray[y][x-1] === "oa-nw" ) {
							imgArray[y][x] = "ob-se";
						}
					} else {
						if (imgArray[y-1][x] === "o-e" || imgArray[y-1][x] === "ob-ne" || imgArray[y-1][x] === "oc-se" || imgArray[y-1][x] === "oa-nw") {
							if (imgArray[y][x-1] === "o-s" || imgArray[y][x-1] === "ob-sw" || imgArray[y][x-1] === "oc-se" || imgArray[y][x-1] === "oa-nw" ) {
								imgArray[y][x] = "ob-se";
							}
						}
					}
				}
			}
			x++;
		}
		x = 0;
		y++;
	}
	return imgArray;
}

/**
 *  It returns the html representation of the map
 *	@param imgArray (array) An array with the map
 *  @returns (string) A string representing the HTML map
 */
function generateHTMLMap(imgArray){
	var x = 0,
		y = 0,
		map = "  <table class='map' border='0' cellspacing='0'><tr>";
	while (y < 7) {
		while (x < 7) {
			map += "<td><img src='static/img/map/general/normal/"+ imgArray[y][x]+ ".png' /></td>";
			x++;
		}
		map += "</tr><tr>";
		x = 0;
		y++;
	}
	map += "</tr></table>";
	return map;
}
