
	/**
	 *  It generates and returns a random map for the world
	 *
	 * @param (string) The size of the map (small, medium, large)
	 * @returns (string) The map for the world
	 * @author Joe
	 *
	 */

	function check(y_coord, x_coord) {
		// Checks the value of a space in the map array, returning the empty string for co-ordinates that don't exist.
		// (This avoids nasty array index errors when we get close to the edges.)
		if (x_coord < 0 || y_coord < 0 || x_coord > 6 || y_coord > 6) {
			return "";
		} else {
			return imgArray[y_coord][x_coord];
		}
	}

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
		var imgArray = [[], [], [], [], [], [], []];
		while (y < 7) {
			while (x < 7) {
				r = Math.random();
				if ((r > p_ocean) && (noClear > minClear)) {
					imgArray[y][x] = "o";
					noClear--;
				} else {
					imgArray[y][x] = "g";
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
				if (check(y, x) === "g") {
					if (check(y+1, x) === "o") {
						if (check(y-1, x) === "o") {
							imgArray[y][x] = "o";
						} else {
							imgArray[y][x] = "o-s";
						}
					}
					if (check(y-1, x) === "o") {
						if (check(y+1, x) === "o") {
							imgArray[y][x] = "o";
						} else {
							imgArray[y][x] = "o-n";
						}
					}
					if (check(y, x+1) === "o") {
						if (check(y, x-1) === "o") {
							imgArray[y][x] = "o";
						} else {
							imgArray[y][x] = "o-e";
						}
					}
					if (check(y, x-1) === "o") {
						if (check(y, x+1) === "o") {
							imgArray[y][x] = "o";
						} else {
							imgArray[y][x] = "o-w";
						}
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
				if (check(y, x) === "g") {
					if (check(y+1, x) === "o-e" && check(y, x+1) === "o-s") imgArray[y][x] = "oc-se";
					if (check(y+1, x) === "o-w" && check(y, x-1) === "o-s") imgArray[y][x] = "oc-sw";
					if (check(y-1, x) === "o-e" && check(y, x+1) === "o-n") imgArray[y][x] = "oc-ne";
					if (check(y-1, x) === "o-w" && check(y, x-1) === "o-n") imgArray[y][x] = "oc-nw";
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
				if (check(y, x) === "o-e") {
					if (check(y, x-1) === "o-n") imgArray[y][x] = "ob-ne";
					if (check(y, x-1) === "o-s") imgArray[y][x] = "ob-se";
				}
				if (check(y, x) === "o-w") {
					if (check(y, x+1) === "o-n") imgArray[y][x] = "ob-nw";
					if (check(y, x+1) === "o-s") imgArray[y][x] = "ob-sw";
				}
				if (check(y, x) === "o-s") {
					if (check(y-1, x) === "o-e") imgArray[y][x] = "ob-se";
					if (check(y-1, x) === "o-w") imgArray[y][x] = "ob-sw";
				}
				if (check(y, x) === "o-n") {
					if (check(y+1, x) === "o-e") imgArray[y][x] = "ob-ne";
					if (check(y+1, x) === "o-w") imgArray[y][x] = "ob-nw";
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
				if (check(y, x) === "g") {
					if (check(y-1, x) === "o-e" && check(y, x+1) === "o-e") {
						imgArray[y][x] = "oc-ne";
						imgArray[y][x+1] = "ob-ne";
					}
					if (check(y-1, x) === "o-w" && check(y, x-1) === "o-w") {
						imgArray[y][x] = "oc-nw";
						imgArray[y][x-1] = "ob-nw";
					}
					if (check(y+1, x) === "o-e" && check(y, x+1) === "o-e") {
						imgArray[y][x] = "oc-se";
						imgArray[y][x+1] = "ob-se";
					}
					if (check(y+1, x) === "o-w" && check(y, x-1) === "o-w") {
						imgArray[y][x] = "oc-sw";
						imgArray[y][x-1] = "ob-sw";
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
				if (check(y, x) === "o-w") {
					if (check(y+1, x) === "o") imgArray[y][x] = "ob-sw";
					if (check(y-1, x) === "o") imgArray[y][x] = "ob-nw";
				}
				if (check(y, x) === "o-e") {
					if (check(y+1, x) === "o") imgArray[y][x] = "ob-se";
					if (check(y-1, x) === "o") imgArray[y][x] = "ob-ne";
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
				if (check(y, x) === "ob-nw" && check(y, x+1) === "ob-nw") imgArray[y][x] = "o";
				if (check(y, x) === "ob-ne" && check(y, x-1) === "ob-ne") imgArray[y][x] = "o";
				if (check(y-1, x) === "ob-ne" && check(y, x+1) === "ob-ne") imgArray[y][x] = "oc-ne";
				if (check(y-1, x) === "ob-nw" && check(y, x-1) === "ob-nw") imgArray[y][x] = "oc-nw";
				if (check(y+1, x) === "ob-se" && check(y, x+1) === "ob-se") imgArray[y][x] = "oc-se";
				if (check(y+1, x) === "ob-sw" && check(y, x-1) === "ob-sw") imgArray[y][x] = "oc-sw";
				if (check(y,x) === "o-w" && check(y, x+1) === "ob-se") imgArray[y][x] = "ob-sw";
				if (check(y,x) === "o-w" && check(y, x+1) === "ob-ne") imgArray[y][x] = "ob-nw";
				if (check(y,x) === "o-e" && check(y, x-1) === "ob-nw") imgArray[y][x] = "ob-ne";
				if (check(y,x) === "o-e" && check(y, x-1) === "ob-sw") imgArray[y][x] = "ob-se";
				if (check(y,x) === "o-n" && check(y+1, x) === "ob-se") imgArray[y][x] = "ob-ne";
				if (check(y,x) === "o-n" && check(y+1, x) === "ob-sw") imgArray[y][x] = "ob-nw";
				if (check(y,x) === "o-s" && check(y-1, x) === "ob-ne") imgArray[y][x] = "ob-sw";
				if (check(y,x) === "o-s" && check(y-1, x) === "ob-nw") imgArray[y][x] = "ob-se";
				x++;
			}
			x = 0;
			y++;
		}
		x = 0;
		y = 0;
		while (y < 7) {
			while (x < 7) {
				if (check(y, x) === "ob-sw") {
					if (check(y-1, x) === "o" || check(y-1, x) === "ob-sw" || check(y-1, x) === "ob-se" || check(y-1, x) === "o-s" || check(y, x+1) === "o" || check(y, x+1) === "ob-sw" || check(y, x+1) === "ob-nw" || check(y, x+1) === "o-w") {
						imgArray[y][x] = "o";
					}
				}
				if (check(y, x) === "ob-nw") {
					if (check(y+1, x) === "o" || check(y+1, x) === "ob-nw" || check(y+1, x) === "ob-ne" || check(y+1, x) === "o-n" || check(y, x+1) === "o" || check(y, x+1) === "ob-nw" || check(y, x+1) === "ob-sw" || check(y, x+1) === "o-w") {
						imgArray[y][x] = "o";
					}
				}
				if (check(y, x) === "ob-se") {
					if (check(y-1, x) === "o" || check(y-1, x) === "ob-sw" || check(y-1, x) === "ob-se" || check(y-1, x) === "o-s" || check(y, x-1) === "o" || check(y, x-1) === "ob-se" || check(y, x-1) === "ob-ne" || check(y, x-1) === "o-e") {
						imgArray[y][x] = "o";
					}
				}
				if (check(y, x) === "ob-ne") {
					if (check(y+1, x) === "o" || check(y+1, x) === "ob-nw" || check(y+1, x) === "ob-ne" || check(y+1, x) === "o-n" || check(y, x-1) === "o" || check(y, x-1) === "ob-ne" || check(y, x-1) === "ob-se" || check(y, x-1) === "o-e") {
						imgArray[y][x] = "o";
					}
				}
				x++;
			}
			x = 0;
			y++;
		}
		// Straight borders
		x = 0;
		y = 0;
		while (y < 7) {
			while (x < 7) {
				if (check(y, x-1) === "o-s" && check(y, x+1) === "o-s") imgArray[y][x] = "o-s";
				if (check(y, x-1) === "o-n" && check(y, x+1) === "o-n") imgArray[y][x] = "o-n";
				if (check(y-1, x) === "o-e" && check(y+1, x) === "o-e") imgArray[y][x] = "o-e";
				if (check(y-1, x) === "o-w" && check(y+1, x) === "o-w") imgArray[y][x] = "o-w";
				if (check(y, x) === "g" || check(y, x) === "g") {
					if (check(y-1, x) === "o-e" && check(y, x-1) === "o-s") imgArray[y][x] = "ob-se";
					if (check(y-1, x) === "o-e" && check(y, x+1) === "o-n") imgArray[y][x] = "ob-ne";
					if (check(y+1, x) === "o-w" && check(y, x-1) === "o-s") imgArray[y][x] = "ob-sw";
					if (check(y+1, x) === "o-w" && check(y, x+1) === "o-n") imgArray[y][x] = "ob-nw";
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
				if (check(y, x) === "g") {
					if (check(y+1, x) === "o") {
						if (check(y-1, x) === "o") {
							imgArray[y][x] = "o";
						} else {
							imgArray[y][x] = "o-s";
						}
					}
					if (check(y-1, x) === "o") imgArray[y][x] = "o-n";
					if (check(y, x+1) === "o") {
						if (check(y, x-1) === "o") {
							imgArray[y][x] = "o";
						} else {
							imgArray[y][x] = "o-e";
						}
					}
					if (check(y, x-1) === "o") imgArray[y][x] = "o-w";
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
				if (check(y, x) === "oc-ne") {
					if (check(y, x-1) === "o-s") imgArray[y][x] = "oa-ne";
					if (check(y+1, x) === "o-w") imgArray[y][x] = "oa-ne";
				}
				if (check(y, x) === "oc-nw") {
					if (check(y, x+1) === "o-s") imgArray[y][x] = "oa-nw";
					if (check(y+1, x) === "o-e") imgArray[y][x] = "oa-nw";
				}
				if (check(y, x) === "oc-se") {
					if (check(y, x-1) === "o-n") imgArray[y][x] = "oa-ne";
					if (check(y-1, x) === "o-e") imgArray[y][x] = "oa-ne";
				}
				if (check(y, x) === "oc-sw") {
					if (check(y, x+1) === "o-n") imgArray[y][x] = "oa-nw";
					if (check(y-1, x) === "o-w") imgArray[y][x] = "oa-nw";
				}
				if (check(y, x) === "o") {
					if (check(y-1, x) === "ob-nw" && check(y, x+1) === "oc-sw") imgArray[y][x] = "ob-sw";
					if (check(y+1, x) === "ob-sw" && check(y, x+1) === "oc-nw") imgArray[y][x] = "ob-nw";
					if (check(y-1, x) === "ob-ne" && check(y, x-1) === "oc-se") imgArray[y][x] = "ob-se";
					if (check(y+1, x) === "ob-se" && check(y, x-1) === "oc-ne") imgArray[y][x] = "ob-ne";
				}
				if (check(y, x) === "g") {
					r = Math.random();
					if (r < FOREST_SEED/2) {
						imgArray[y][x] = "t0";
					} else if (r < FOREST_SEED) {
						imgArray[y][x] = "t1";
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
				if (check(y, x) === "t0") {
					if (check(y-1,x) === "g" && Math.random() < FOREST_EXPAND) imgArray[y-1][x] = "t1";
					if (check(y+1,x) === "g" && Math.random() < FOREST_EXPAND) imgArray[y+1][x] = "t1";
					if (check(y,x-1) === "g" && Math.random() < FOREST_EXPAND) imgArray[y][x-1] = "t1";
					if (check(y,x+1) === "g" && Math.random() < FOREST_EXPAND) imgArray[y][x+1] = "t1";
				}
				if (check(y, x) === "g" && Math.random() < ROCK_SEED) imgArray[y][x] = "m".concat(Math.round(Math.random()));
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
			size = imgArray.length,
			map = "  <table class='map' border='0' cellspacing='0'><tr>";

		while (y < size) {
			while (x < size) {
				map += "<td style=\"background-image: url('static/img/map/general/"+ imgArray[y][x]+ ".png');\"></td>";
				x++;
			}
			if (y < size-1) {
				map += "</tr><tr>";
			}
			x = 0;
			y++;
		}
		map += "</tr></table>";
		return map;
	}
