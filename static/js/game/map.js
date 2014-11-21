
/**
 *  It generates and returns a random map for the world
 * @param (string) The size of the map (small, medium, large)
 * @returns (string) The map for the world
 * @author Joe
 *
 */

function generateGeneralMap(size){
	
	/*
	 * for joe. the size is "small, medium or large"
	 *
	 */
	
	
	// Variables which control properties of the world being generated:
	// How often do oceans appear?
	var OCEAN_SEED = Math.floor((Math.random() * 9) + 1)/100; // 0.01 ---> 0.09
	// How big are they?
	var OCEAN_EXPAND = Math.floor((Math.random() * 9) + 3)/100; // 0.03 --> 0.09
	// How often do rocks appear?
	var ROCK_SEED = 0.01;
  // How often do trees appear?
  var TREE_SEED = 0.1;
  // Calculating probabilities:
  var p_ocean = 1 - OCEAN_SEED;
  var p_rock = p_ocean - ROCK_SEED;
  var p_tree = p_rock - TREE_SEED;

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
      if (r > p_ocean) {
        imgArray[y][x] = "o";
      } else if (r > p_rock) {
        imgArray[y][x] = "m".concat(Math.round(10*(r - p_rock)));
      } else if (r > p_tree) {
        imgArray[y][x] = "t".concat(Math.round(10*(r - p_tree)));
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
			if (imgArray[y][x] === "o") {
				if (Math.random() < OCEAN_EXPAND) {
					if (x > 0) {
						imgArray[y][x - 1] = "o";
					}
				}
				if (Math.random() < OCEAN_EXPAND) {
					if (x < 6) {
						imgArray[y][x + 1] = "o";
					}
				}
				if (Math.random() < OCEAN_EXPAND) {
					if (y > 0) {
						imgArray[y - 1][x] = "o";
					}
				}
				if (Math.random() < OCEAN_EXPAND) {
					if (y < 6) {
						imgArray[y + 1][x] = "o";
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
				if ((n && s) || (w && e)) {
					imgArray[y][x] = "o";
					x = 0;
					y = 0;
				} else if (n && (w || sw) || (w && ne)) {
					imgArray[y][x] = "ob-nw";
				} else if (n && (e || se) || (e && nw)) {
					imgArray[y][x] = "ob-ne";
				} else if (s && (w || nw) || (w && se)) {
					imgArray[y][x] = "ob-sw";
				} else if (s && (e || ne) || (e && sw)) {
					imgArray[y][x] = "ob-se";
				} else if (n) {
					imgArray[y][x] = "o-n";
				} else if (s) {
					imgArray[y][x] = "o-s";
				} else if (w) {
					imgArray[y][x] = "o-w";
				} else if (e) {
					imgArray[y][x] = "o-e";
				} else if (nw && se) {
					imgArray[y][x] = "oa-nw";
				} else if (sw && ne) {
					imgArray[y][x] = "oa-ne";
				} else if (nw) {
					imgArray[y][x] = "oc-nw";
				} else if (ne) {
					imgArray[y][x] = "oc-ne";
				} else if (sw) {
					imgArray[y][x] = "oc-sw";
				} else if (se) {
					imgArray[y][x] = "oc-se";
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
 *	@param imbArray (array) An array with the map
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
	map += "</tr></table>"
	return map;
}
