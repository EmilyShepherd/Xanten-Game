/**
 * @file The HTML_Engine generates the HTML for the game. represents the View object (MCV). It  It generates the code, it adds the necessary listeners. Then it can disable the listeners
 * @author JavaScript Team. Team M
 * @version 30.12.2014
 */
/**
 * @namespace The HTML_Engine generates the HTML for the game. represents the View object (MCV). It  It generates the code, it adds the necessary listeners. Then it can disable the listeners
 * @constructor
 */
var HTML_Engine = {
	path: {
		img_city_bulding: '/static/img/game/city/building/',
		img_city_element: '/static/img/game/city/element/',
		img_city_background: '/static/img/game/city/building/',
		img_world_background: '/static/img/game/world/building/',
		img_resource: '/static/img/game/resource/'
	}
};

/**
 * It returns a short representation of the resource.
 * @example
 * <1000 => the value
 * 1k
 * 1m
 * 1b
 * @memberOf HTML_Engine
 * @param Number input The amount of resource
 * @returns string The amount in a short representation
 */
HTML_Engine.shortResourceRepresentation = function(input) {
	var len = parseInt(input.toString().length),
		text = "";

	if (len <= 3) {
		text = input;
	} else
	if (len >= 4 && len <= 6) {
		text = ((input / 1000 * 100) / 100).toFixed(2) + "k";
	} else
	if (len >= 7 && len <= 9) {
		text = ((input / 1000000 * 100) / 100).toFixed(2) + 'm';
	} else
		text = ((input / 1000000000 * 100) / 100).toFixed(2) + 'b';

	return "<span title='" + input.formatNumber(0) + "'>" + text + "</span>";
};

/**
 * It returns a short representation of time in this format: {hours} h, {minutes} h, {seconds} sec OR "Instant" (if time is 0)
 * @memberOf HTML_Engine
 * @param Number sec_num The time expressed in number of seconds
 * @return string The time in this format: {hours} h, {minutes} h, {seconds} sec OR "Instant" (if time is 0)
 */
HTML_Engine.shortTimeRepresentation = function(sec_num) {
	sec_num = parseInt(sec_num);

	if (sec_num === 0) {
		return "<span class='bold'>Instant</span>";
	}
	var elements = [],
		hours = Math.floor(sec_num / 3600),
		minutes = Math.floor((sec_num - (hours * 3600)) / 60),
		seconds = sec_num - (hours * 3600) - (minutes * 60);

	if (hours !== 0) {
		elements.push("<span class='bold'>" + hours + " h</span>");
	}
	if (minutes !== 0) {
		elements.push("<span class='bold'>" + minutes + " min</span>");
	}
	if (seconds !== 0) {
		elements.push("<span class='bold'>" + seconds + " sec</span>");
	}

	return elements.join(", ");
};

/**
 * @namespace It generates a table
 * @memberOf HTML_Engine
 */
HTML_Engine.table = {
	/**
	 * It generates a table
	 * @memberOf HTML_Engine.table
	 * @param {array} data information regarding the rows and columns of the table
	 * @param {boolean} boldFirst If set to true it bolds the first column
	 * @return The HTML code for the table
	 */
	content: function(data, boldFirst) {
		var html = "<table width='100%'>";
		for (var i = 0; i <= data.length - 1; i++) {
			var column = data[i];
			html += "<tr>";
			for (var j = 0; j <= column.length - 1; j++) {
				html += "<td " + (boldFirst ? "class='bold'" : "") + " style='color:" + (j % 2 === 0 ? "rgb(142, 142, 142)" : "rgb(0, 71, 187)") + "'>" + data[i][j] + "</td>";
			}
			html += "</tr>";
		}
		html += "</table>";
		return html;
	}
};

/**
 * @namespace It returns a image from the game
 * @memberOf HTML_Engine
 */
HTML_Engine.getImage = {
	/**
	 * It constructs an image. For example: HTML_Engine.content.getImage('img_resource', 'gold', 'Gold') returns ===> <img title="Gold" src="/static/img/game/resource/gold.png" align="absmiddle">
	 * @param {string} path A HTML_Engine.path string
	 * @param {string} image The name of the image (for example: gold or mine
	 * @param {string} title It is optional. It sets the title for the image
	 * @return {string} The HTML code for the image
	 */
	content: function(path, image, title, type) {
		type = typeof type !== 'undefined' ? type : "png";
		return "<img " + (title ? ("title='" + image.capitalize() + "'") : "") + " src='" + HTML_Engine.path[path] + image + "." + type + "' align='absmiddle' />";
	}
};

/**
 * @namespace It displays the resources (gold, wood, stone, food, people and the time)  in HTML format
 * @memberOf HTML_Engine
 */
HTML_Engine.displayResources = {
	/**
	 * It displays the resources
	 * @param {Resources} resources The resources specified by Resources.prepareResources
	 * @see Resources
	 * @return {string} The HTML code which displays the resources
	 */
	content: function(resources) {

		var text = "<div class='tab'> ",
			things = [];

		var interval = resources.interval ? ("<span style='font-weight:italic;color:#969696'> for " + resources.interval) + "</span>" : "";
		var unit = resources.unit ? ("<span style='font-weight:italic;color:#969696'>" + resources.unit) + "</span>" : "";

		for (var resource in resources.resources) {
			if (resources.resources.hasOwnProperty(resource)) {
				things.push(HTML_Engine.getImage.content("img_resource", resource, resource) + " <span class='bold resource_format_" + resource + "'>" + HTML_Engine.shortResourceRepresentation(resources.resources[resource]) + " </span>" + interval + unit);
			}
		}

		if (resources.people) {
			things.push(HTML_Engine.getImage.content("img_resource", 'people', 'people') + " <span class='bold resource_format_people" + "'>" + HTML_Engine.shortResourceRepresentation(resources.people) + " </span>" + interval);
		}

		if (resources.time) {
			things.push("Time: " + HTML_Engine.shortTimeRepresentation(resources.time));
		}

		text += things.join("<br />") + "</div>";

		return text;
	}
};

/**
 * @namespace It returns the string for no action for a string
 * @memberOf HTML_Engine
 */
HTML_Engine.noAction = {
	/**
	 * It returns the string for no action
	 * @return {string} The string for no action
	 */
	content: function() {
		return "No action for now";
	}
};

/**
 * @namespace It returns the string when an action which needs information from server fail. It allows the user to perform again it
 * @memberOf HTML_Engine
 */
HTML_Engine.failAction = {
	/**
	 * It returns the string
	 * @return {string} It returns the string
	 */
	content: function() {
		$("#actions_board .inside").html("Sir, there was a problem retrieving that information... Perhaps try again. <span class='link' id='action-try-again'>to try again</span>");
	},
	/**
	 * It adds a listener for the button 'try again'
	 */
	enable: function() {
		$("#action-try-again").click(function() {
			game.currentAction.perform();
		});
	}
};

/**
 * @namespace It shows the message when an task fails
 * @memberOf HTML_Engine
 */
HTML_Engine.failTask = {
	/**
	 * It adds a new news which shows that that task was not possible for a certain reson
	 * @param {string} task_title The title of the task
	 * @param {string} reason The reason of the task
	 */
	content: function(task_title, reason) {
		Window.newsBoard.add("<span class='news_problem'>Problem</span>:" + task_title + "<br /> <span class='bold'>Reason:</span> was not possible because " + reason);
	}
};

/**
 * @namespace It displays the string which is seen while an action is performing an AJAX request
 * @memberOf HTML_Engine
 */
HTML_Engine.loadAction = {
	/**
	 * It returns the string for loading an action
	 * @return {string} The string for loading an action
	 */
	content: function() {
		$("#actions_board .inside").html("<div class='center'><img src='static/img/game/loading.gif' width='32px' height='32px'/></div> Sir, please wait while this is checked...");
	}
};


/**
 * @namespace A chooser represents a set of mutiple input values from user using sliders
 * @memberOf HTML_Engine
 */
HTML_Engine.chooser = {
	/**
	 * It generates the html of the chooser
	 * @param {object} args Information regarding the chooser. It must contain:
	 * @example The id of the chooser: chooser.id
	 * A description for the chooser: chooser.info
	 * The elements of the choose as an array, each object with an id and title: chooser.values
	 * The title of the button: chooser.button
	 * @return {string} The HTML code for the chooser
	 */
	content: function(args) {
		var html = '';
		html = "<div class='heading'>" +
			"<div class='chooser' id='" + args.id + "_chooser' > " +
			"<div class='info'>" + (args.info ? args.info : "") + "</div>";
		for (var i = 0; i < args.values.length; i++) {
			var value = args.values[i];
			html += "<div class='element' id='element_" + value.id + "'>" +
				"<div class='bold'>" + value.title + ":</div>" +
				"<div id='extra'></div>" +
				"<div><div id='slider' class='element_slider'></div></div>" +
				"<div>" +
				"<input type='number' size='3' value=''  id='input_value' />" +
				"</div>" +
				"</div>";
		}
		html += "<div class='center'>" +
			"<input type='button' value='" + args.button + "' id='" + args.id + "_button' /> " +
			"</div>" +
			"</div>" +
			"</div>";
		return html;
	},
	/**
	 * It enables the chooser. It enables all the elements inside it
	 * @param {object} args An object with the settings for all the elements inside a chooser:
	 * @example The id of the chooser: args.id
	 * The values of the elements as an array: args.values. Each element contain: id, min, max
	 * The action to be performed when the button is clicked: chooser.performAction
	 */
	enable: function(args) {

		$.each(args.values, function(index, value) {

			value = args.values[index];

			var id = args.id,
				div = $("#" + id + "_chooser #element_" + value.id),
				input = div.find("#input_value"),
				slider = div.find("#slider"),
				extra = div.find("#extra"),
				action = value.change ? value.change : undefined,
				gen_act = args.generalChange ? args.generalChange : undefined,
				change = function(event, ui) {
					input.val(ui.value);
					if (action) {
						action(event, ui, extra);
					}
					if (gen_act) {
						gen_act(event, ui, extra);
					}
				};

			slider.slider({
				min: value.min ? value.min : 0,
				max: value.max ? value.max : 0,
				animate: true,
				range: "min",
				value: value.min ? value.min : 0,
				slide: change,
				change: change,
				create: function(event, ui) {
					ui.value = $(this).slider("option", "min");
					change(event, ui);
				}
			});

			input.on("change keyup paste", function() {
				if ($(this).val() !== '' && (parseInt($(this).val()) || $(this).val() === '0')) {
					slider.slider("value", parseInt($(this).val()));
				}
			});


		});

		$("#" + args.id + "_button")
			.button()
			.click(args.performAction);
	},
	/**
	 * It removes the functions from the memory and disables the listenerrs
	 * @param {object} args An object with the id of the chooser.
	 */
	disable: function(args) {

		var divs = $("#" + args.id + "_chooser div.element");

		for (var i = 0; i < divs.length; i++) {
			var div = divs[i];
			$(div).find("#slider").slider("destroy");
			$(div).find("#input_value").off();
		}
	},

	/**
	 * It returns the value for an element inside a chooser
	 * @param {string} chooser The id of the chooser
	 * @param {string} element The id of the element
	 * @return {number} The value of the element inside that chooser
	 */
	fetch: function(chooser, element) {
		return $("#" + chooser + "_chooser #element_" + element + " #input_value").val();
	},

	/**
	 * It returns the all the values of the elements inside a chooser
	 * @param {string} chooser The id of the chooser
	 * @return {number} The values of all the chooser's elements
	 */
	fetchAll: function(chooser) {
		var all = $("#" + chooser + "_chooser").find(".element"),
			values = {};

		for (var i = 0; i <= all.length - 1; i++) {
			values[$(all[i]).attr("id")] = $(all[i]).find("#input_value").val();
		}
		return values;
	}
};

/**
 * @namespace It returns the HTML code when the game is over
 * @memberOf HTML_Engine
 */
HTML_Engine.gameOver = {
	/**
	 * It returns the string when the game is over
	 * @return {string} Returns a message when the game is over
	 */
	content: function() {
		return "The game is over";
	}
};

/* ------------------------------ City Map  ------------------------------ */

/**
 * @namespace It returns the HTML code when the city map was chosen
 * @memberOf HTML_Engine
 */
HTML_Engine.cityMapSelected = {
	/**
	 * It returns the string when the city map is selected
	 * @return {string} Returns a general description of the city
	 */
	content: function() {
		return "<br /><img src='http://clipart.nicubunu.ro/svg/rpg_map/statue.svg' /><div><span class='bold'>Hello there, </span><br />This is your glorious city, with brave citizens who have a wonderful life. Be careful to keep your city happy and prosperous...</div>";
	}
};

/**
 * @namespace Returns the list of all the building which can be created and the resources for them
 * @memberOf HTML_Engine
 */
HTML_Engine.getAvailableBuildings = {

	/**
	 * It generates the content
	 * @returns {string} A list of all the buildings and the resources to be created
	 */
	content: function() {
		var text = "<span class='bold'>Buildings available to build here: </span><br />",
			b = 0;

		for (var building in game.player.city.buildings) {
			if (game.player.city.buildings.hasOwnProperty(building)) {
				var data = game.constructions.buildings[building],
					b_obj = game.player.city.buildings[building];

				if ((!data.maxLevel || (data.maxLevel && b_obj.level < data.maxLevel)) &&
					(!data.maxNumber || (data.maxNumber && b_obj.num < data.maxNumber)) &&
					b_obj.status !== 'under_construction') {
					var resources = game.constructions.buildings[building].levelUp(1);
					text += "<div class='board_list hover' building_name='" + building + "' id='action_build_" + building + "' >" +
						HTML_Engine.getBuilding.info(building);
					text += HTML_Engine.displayResources.content(resources);
					text += "</div><br />";
					b++;
				}
			}
		}
		if (b === 0) {
			text += "It seems there are no buildings to be built...";
		}
		return text;
	},
	/**
	 * It add a listener for each building
	 */
	enable: function() {
		$("#actions_board .board_list").click(function() {
			game.performTask("create_building", this);
		});
	},
	/**
	 * It removes all the listeners
	 */
	disable: function() {
		$("#actions_board .board_list").off();
	}
};
/* ------------------ Buildings  ------------------ */

/**
 * @namespace The administration building (1)
 * @memberOf HTML_Engine
 */
HTML_Engine.inside_administration = {

	/**
	 * It generates the content for the administration building
	 * @return (string) The HTML code for the administration building
	 */
	content: function() {
		var nr_of_free_units = game.player.city.buildings.administration.people,
		capacity = game.constructions.buildings.house.capacity().people;
			html = "";

		html += HTML_Engine.getBuilding.info("administration", true);
		html += HTML_Engine.upgradeBuilding.content("administration", (parseInt(game.player.city.buildings.administration.level) + 1));
		html += "<div class='heading'> The number of free people:";
		html += HTML_Engine.displayResources.content({
			resources: {
				"people": nr_of_free_units
			},
		}) + "</div>";
		html += "<div class='heading'> Daily income from free people: " +
			HTML_Engine.displayResources.content({
				resources: {
					"gold": nr_of_free_units * 0.1
				}
			}) + "</div>";
			
		html += "<div class='heading'> Satisfaction level: " +
			HTML_Engine.displayResources.content({
				resources: {
					"satisfaction": 0
				}
			}) + "</div>";

		if (nr_of_free_units < capacity) {
			html += HTML_Engine.chooser.content({
				info: "You can create more free people here using food. ",
				values: [{
					title: "Create new people",
					id: "units"
				}],
				button: "Create",
				id: "free_train"
			});
		} else {
			html += "Unfortunately, you have reached the max capacity. You can create more free people by building more houses.";
		}
		return html;
	},
	enable: function() {
		HTML_Engine.upgradeBuilding.enable("administration", (parseInt(game.player.city.buildings.administration.level) + 1));
		
		var nr_of_free_units = game.player.city.buildings.administration.people,
			capacity = game.constructions.buildings.house.capacity().people;

		/*
		 * It creates the chooser to let the user to choose how many units to create
		 */
		if (nr_of_free_units < capacity) {
			HTML_Engine.chooser.enable({

				id: "free_train",
				values: [{
					id: 'units',
					min: 1,
					max: capacity - nr_of_free_units,
					change: function(event, ui, extra) {
						extra.html(HTML_Engine.displayResources.content(
								game.unit.free.create(parseInt(ui.value))
							)
						)
					}
				}],
				performAction: function() {
					game.performTask("train_free", {
						to: "administration",
						number: HTML_Engine.chooser.fetch("free_train", "units")
					});
				}
			});
		}
	},
	disable: function() {
		HTML_Engine.upgradeBuilding.disable("administration");
		HTML_Engine.chooser.disable({
			id: "free_train"
		});
	}
};

/**
 * @namespace The military building (2)
 * @memberOf HTML_Engine
 */
HTML_Engine.inside_military = {

	/**
	 * It generates the content for the military building
	 * @return {string} It generates the content for the military building
	 */
	content: function() {
		var nr_of_active_units = game.player.city.buildings.military.people,
			html = "",
			capacity = game.constructions.buildings.military.capacity(game.player.city.buildings.military.level).resources.military;
		html += HTML_Engine.getBuilding.info("military", true);
		html += HTML_Engine.upgradeBuilding.content("military", (parseInt(game.player.city.buildings.military.level) + 1));
		html += "<div class='heading'>";
		if (nr_of_active_units === 0) {
			html += "Sir, we have no military!";
		} else {
			html += "The number of active units:";
			html += HTML_Engine.displayResources.content({
				resources: {
					"military": nr_of_active_units
				}
			}) + "</div>";

			html += "<div class='heading'> The daily cost of the military is: " +
				HTML_Engine.displayResources.content(
					game.unit.military.idle(parseInt(nr_of_active_units))
				) + "</div>";
		}
		html += "</div>";

		if (nr_of_active_units < capacity) {
			html += HTML_Engine.chooser.content({
				info: "The military plays an important role for your city. You can increase your military power and became a local or imperial power. The first step is to train free people into hardened military units. ",
				values: [{
					title: "Train new military units",
					id: "units"
				}],
				button: "Train !",
				id: "military_train"
			});
		} else {
			html += "Unfortunately, you have reached the max capacity. You can train more units after you upgrade the building.";
		}

		if (nr_of_active_units !== 0) {
			html += HTML_Engine.chooser.content({
				info: "You can reduce the cost of military by reducing the number of military units. Unfortunately this does not give back the resources.",
				values: [{
					title: "Reduce military units",
					id: "units"
				}],
				button: "Reduce units!",
				id: "military_untrain"
			});
		}
		return html;
	},
	/**
	 * It enables the functionality for the military building
	 */
	enable: function() {
		var nr_of_active_units = game.player.city.buildings.military.people,
			capacity = game.constructions.buildings.military.capacity(game.player.city.buildings.military.level).resources.military;

		HTML_Engine.upgradeBuilding.enable("military", (parseInt(game.player.city.buildings.military.level) + 1));

		/*
		 * It creates the chooser to let the user to choose how many utits to create
		 */
		if (nr_of_active_units < capacity) {
			HTML_Engine.chooser.enable({

				id: "military_train",
				values: [{
					id: 'units',
					min: 1,
					max: capacity - nr_of_active_units,
					change: function(event, ui, extra) {
						extra.html(HTML_Engine.displayResources.content(
								game.unit.military.create(parseInt(ui.value))
							) + "<div> Daily cost: </div>" +
							HTML_Engine.displayResources.content(
								game.unit.military.idle(parseInt(ui.value))
							));
					}
				}],
				performAction: function() {
					game.performTask("train_military", {
						from: "administration",
						to: "military",
						number: HTML_Engine.chooser.fetch("military_train", "units")
					});
				}
			});
		}

		if (nr_of_active_units !== 0) {
			/*
			 * It creates the chooser to let the user to choose how many utits to create
			 */
			HTML_Engine.chooser.enable({

				id: "military_untrain",
				values: [{
					id: 'units',
					min: 1,
					max: nr_of_active_units,
					change: function(event, ui, extra) {
						extra.html(HTML_Engine.displayResources.content({
							time: parseInt(ui.value) * 5
						}));
					}
				}],
				performAction: function() {
					game.performTask("untrain_military", {
						from: "military",
						to: "administration",
						number: HTML_Engine.chooser.fetch("military_untrain", "units")
					});
				}
			});
		}
	},
	/**
	 * It disable the functionality for military building
	 */
	disable: function() {
		HTML_Engine.chooser.disable({
			id: "military_train"
		});
		HTML_Engine.chooser.disable({
			id: "military_untrain"
		});
		HTML_Engine.upgradeBuilding.disable("military");
	}
};

/**
 * @namespace The storage building (3)
 * @memberOf HTML_Engine
 */
HTML_Engine.inside_storage = {

	/**
	 * It generates the content for the storage building
	 * @return {string} It generates the content for the storage building
	 */
	content: function() {
		var html = "";
		html += HTML_Engine.getBuilding.info("storage", true);
		html += HTML_Engine.upgradeBuilding.content("storage", (parseInt(game.player.city.buildings.storage.level) + 1));
		return html;
	},
	/**
	 * It enables the functionality for the building
	 */
	enable: function() {
		HTML_Engine.upgradeBuilding.enable("storage", (parseInt(game.player.city.buildings.storage.level) + 1));
	},
	/**
	 * It disables the functionality for the building
	 */
	disable: function() {
		HTML_Engine.upgradeBuilding.disable("storage");
	}
};


/**
 * @namespace The mill building (4)
 * @memberOf HTML_Engine
 */
HTML_Engine.inside_mill = {

	/**
	 * It returns the HTML content for the mill building
	 * @return {string} HTML code for the mill building
	 */
	content: function() {
		var nr_of_active_units = game.player.city.buildings.mill.people,
			html = "",
			capacity = game.constructions.buildings.mill.capacity(game.player.city.buildings.mill.level).people;
		html += HTML_Engine.getBuilding.info("mill", true);
		html += HTML_Engine.upgradeBuilding.content("mill", (parseInt(game.player.city.buildings.mill.level) + 1));
		html += "<div class='heading'>";
		if (nr_of_active_units === 0) {
			html += "Sir, we have no millers!";
		} else {
			html += "The number of active millers:";
			html += HTML_Engine.displayResources.content({
				resources: {
					"people": nr_of_active_units
				}
			}) + "</div>";

			html += "<div class='heading'> The daily increase in satisfaction is: " +
				HTML_Engine.displayResources.content(
					game.unit.miller.work(parseInt(nr_of_active_units))
				) + "</div>";
		}
		html += "</div>";

		if (nr_of_active_units < capacity) {
			html += HTML_Engine.chooser.content({
				info: "Create millers to generate higher satisfaction.",
				values: [{
					title: "Train new millers",
					id: "units"
				}],
				button: "Train!",
				id: "miller_train"
			});
		} else {
			html += "Unfortunately, you have reached the max capacity. You can train more units after you upgrade the building.";
		}

		if (nr_of_active_units !== 0) {
			html += HTML_Engine.chooser.content({
				info: "Reducing the amount of millers decreases satisfaction but frees people for different tasks. Unfortunately this does not give back the resources.",
				values: [{
					title: "Reduce millers",
					id: "units"
				}],
				button: "Reduce units!",
				id: "miller_untrain"
			});
		}
		return html;
	},

	/**
	 * It enables the functionality for the building
	 */
	enable: function() {
		var nr_of_active_units = game.player.city.buildings.mill.people,
			capacity = game.constructions.buildings.mill.capacity(game.player.city.buildings.mill.level).people;

		HTML_Engine.upgradeBuilding.enable("mill", (parseInt(game.player.city.buildings.mill.level) + 1));

		/*
		 * It creates the chooser to let the user to choose how many utits to create
		 */
		if (nr_of_active_units < capacity) {
			HTML_Engine.chooser.enable({
				id: "miller_train",
				values: [{
					id: 'units',
					min: 1,
					max: capacity - nr_of_active_units,
					change: function(event, ui, extra) {
						extra.html(HTML_Engine.displayResources.content(
								game.unit.miller.create(parseInt(ui.value))
							) + "<div> Daily income: </div>" +
							HTML_Engine.displayResources.content(
								game.unit.miller.work(parseInt(ui.value))
							));
					}
				}],
				performAction: function() {
					game.performTask("train_miller", {
						from: "administration",
						to: "mill",
						number: HTML_Engine.chooser.fetch("miller_train", "units")
					});
				}
			});
		}

		if (nr_of_active_units !== 0) {
			/*
			 * It creates the chooser to let the user to choose how many units to create
			 */
			HTML_Engine.chooser.enable({

				id: "miller_untrain",
				values: [{
					id: 'units',
					min: 1,
					max: nr_of_active_units,
					change: function(event, ui, extra) {
						extra.html(HTML_Engine.displayResources.content({
							time: parseInt(ui.value) * 5
						}));
					}
				}],
				performAction: function() {
					game.performTask("untrain_miller", {
						from: "mill",
						to: "administration",
						number: HTML_Engine.chooser.fetch("miller_untrain", "units")
					});
				}
			});
		}
	},

	/**
	 * It disables the functionality for the building
	 */
	disable: function() {
		HTML_Engine.chooser.disable({
			id: "miller_train"
		});
		HTML_Engine.chooser.disable({
			id: "miller_untrain"
		});
		HTML_Engine.upgradeBuilding.disable("mill");
	}
};

/**
 * @namespace The mine building(5)
 * @memberOf HTML_Engine
 */
HTML_Engine.inside_mine = {

	/**
	 * It generates the content for the mine building
	 * @return {string} HTML code for mine building
	 */
	content: function() {
		var nr_of_active_units = game.player.city.buildings.mine.people,
			html = "",
			capacity = game.constructions.buildings.mine.capacity(game.player.city.buildings.mine.level).people;
		html += HTML_Engine.getBuilding.info("mine", true);
		html += HTML_Engine.upgradeBuilding.content("mine", (parseInt(game.player.city.buildings.mine.level) + 1));
		html += "<div class='heading'>";
		if (nr_of_active_units === 0) {
			html += "Sir, we have no miners!";
		} else {
			html += "The number of active miners:";
			html += HTML_Engine.displayResources.content({
				resources: {
					"people": nr_of_active_units
				}
			}) + "</div>";

			html += "<div class='heading'> The daily income of stone is: " +
				HTML_Engine.displayResources.content(
					game.unit.miner.work(parseInt(nr_of_active_units))
				) + "</div>";
		}
		html += "</div>";

		if (nr_of_active_units < capacity) {
			html += HTML_Engine.chooser.content({
				info: "Create Miners to generate higher income of stone.",
				values: [{
					title: "Train new miners",
					id: "units"
				}],
				button: "Train!",
				id: "mine_train"
			});
		} else {
			html += "Unfortunately, you have reached the max capacity. You can train more units after you upgrade the building.";
		}

		if (nr_of_active_units !== 0) {
			html += HTML_Engine.chooser.content({
				info: "Reducing the amount of miners decreases stone income but frees people for different tasks. Unfortunately this does not give back the resources.",
				values: [{
					title: "Reduce miners",
					id: "units"
				}],
				button: "Reduce units!",
				id: "mine_untrain"
			});
		}
		return html;
	},

	/**
	 * It enables the functionality for the building
	 */
	enable: function() {
		var nr_of_active_units = game.player.city.buildings.mine.people,
			capacity = game.constructions.buildings.mine.capacity(game.player.city.buildings.mine.level).people;

		HTML_Engine.upgradeBuilding.enable("mine", (parseInt(game.player.city.buildings.mine.level) + 1));

		/*
		 * It creates the chooser to let the user to choose how many utits to create
		 */
		if (nr_of_active_units < capacity) {
			HTML_Engine.chooser.enable({
				id: "mine_train",
				values: [{
					id: 'units',
					min: 1,
					max: capacity - nr_of_active_units,
					change: function(event, ui, extra) {
						extra.html(HTML_Engine.displayResources.content(
								game.unit.miner.create(parseInt(ui.value))
							) + "<div> Daily income: </div>" +
							HTML_Engine.displayResources.content(
								game.unit.miner.work(parseInt(ui.value))
							));
					}
				}],
				performAction: function() {
					game.performTask("train_miner", {
						from: "administration",
						to: "mine",
						number: HTML_Engine.chooser.fetch("mine_train", "units")
					});
				}
			});
		}

		if (nr_of_active_units !== 0) {
			/*
			 * It creates the chooser to let the user to choose how many units to create
			 */
			HTML_Engine.chooser.enable({

				id: "mine_untrain",
				values: [{
					id: 'units',
					min: 1,
					max: nr_of_active_units,
					change: function(event, ui, extra) {
						extra.html(HTML_Engine.displayResources.content({
							time: parseInt(ui.value) * 5
						}));
					}
				}],
				performAction: function() {
					game.performTask("untrain_miner", {
						from: "mine",
						to: "administration",
						number: HTML_Engine.chooser.fetch("mine_untrain", "units")
					});
				}
			});
		}
	},

	/**
	 * It disables the functionality for the building
	 */
	disable: function() {
		HTML_Engine.chooser.disable({
			id: "mine_train"
		});
		HTML_Engine.chooser.disable({
			id: "mine_untrain"
		});
		HTML_Engine.upgradeBuilding.disable("mine");
	}
};


/**
 * @namespace The house building (6)
 * @memberOf HTML_Engine
 */
HTML_Engine.inside_house = {

	/**
	 * It generates the content for the house building
	 * @return {string} The HTML code for the house building
	 */
	content: function() {
		var html = "";
		html += HTML_Engine.getBuilding.info("house", true);
		return html;
	},
	/**
	 * It enables the functionality for the building
	 */
	enable: function() {
		HTML_Engine.upgradeBuilding.enable("house", (parseInt(game.player.city.buildings.administration.level) + 1));
	},
	/**
	 * It disables the functionality for the building
	 */
	disable: function() {
		HTML_Engine.upgradeBuilding.disable("house");
	}
};

/**
 * @namespace The trade building (7)
 * @memberOf HTML_Engine
 */
HTML_Engine.inside_trade = {

	/**
	 * It generates the content for the trade building
	 * @return {string} The HTML code for the trade building
	 */
	content: function() {
		var html = "";
		html += HTML_Engine.getBuilding.info("trade", true);
		html += HTML_Engine.upgradeBuilding.content("trade", (parseInt(game.player.city.buildings.trade.level) + 1));
		html += HTML_Engine.chooser.content({
			info: "Sell your resources for gold",
			values: [{
				title: "Food",
				id: "food"
			}, {
				title: "Wood",
				id: "wood"
			}, {
				title: "Stone",
				id: "stone"
			}],
			button: "Trade",
			id: "trade_for_gold"
		});

		html += HTML_Engine.chooser.content({
			info: "Buy resources with gold",
			values: [{
				title: "Food",
				id: "food"
			}, {
				title: "Wood",
				id: "wood"
			}, {
				title: "Stone",
				id: "stone"
			}],
			button: "Trade",
			id: "trade_for_resources"
		});

		return html;
	},
	/**
	 * It enables the functionality for the building
	 */
	enable: function() {
		HTML_Engine.upgradeBuilding.enable("trade", (parseInt(game.player.city.buildings.trade.level) + 1));

		var changeValue = function(event, ui, extra, value, what) {
				extra.html(HTML_Engine.displayResources.content(
					game.unit.trade(parseInt(ui.value), value, what)
				));
			},
			capacity = game.constructions.buildings.trade.capacity(game.player.city.buildings.trade.level);

		HTML_Engine.chooser.enable({

			id: "trade_for_gold",
			values: [{
				id: 'food',
				min: 0,
				max: (game.player.resources.food > capacity.resources.food) ? capacity.resources.food : game.player.resources.food,
				change: function(event, ui, extra) {
					changeValue(event, ui, extra, 0.50, "gold");
				}
			}, {
				id: 'wood',
				min: 0,
				max: (game.player.resources.wood > capacity.resources.wood) ? capacity.resources.wood : game.player.resources.wood,
				change: function(event, ui, extra) {
					changeValue(event, ui, extra, 0.10, "gold");
				}
			}, {
				id: 'stone',
				min: 0,
				max: (game.player.resources.stone > capacity.resources.stone) ? capacity.resources.stone : game.player.resources.stone,
				change: function(event, ui, extra) {
					changeValue(event, ui, extra, 0.20, "gold");
				}
			}],
			performAction: function() {
				game.performTask("trade", {
					"resources": HTML_Engine.chooser.fetchAll("trade_for_gold"),
					"what": "resources",
					"for": "gold"
				});
			}
		});

		HTML_Engine.chooser.enable({

			id: "trade_for_resources",
			values: [{
				id: 'food',
				min: 0,
				max: (game.player.resources.gold > capacity.resources.gold) ? capacity.resources.gold : game.player.resources.gold,
				change: function(event, ui, extra) {
					changeValue(event, ui, extra, 25, "food");
				}
			}, {
				id: 'wood',
				min: 0,
				max: (game.player.resources.gold > capacity.resources.gold) ? capacity.resources.gold : game.player.resources.gold,
				change: function(event, ui, extra) {
					changeValue(event, ui, extra, 5, "wood");
				}
			}, {
				id: 'stone',
				min: 0,
				max: (game.player.resources.gold > capacity.resources.gold) ? capacity.resources.gold : game.player.resources.gold,
				change: function(event, ui, extra) {
					changeValue(event, ui, extra, 10, "stone");
				}
			}],
			performAction: function() {
				game.performTask("trade", {
					"resources": HTML_Engine.chooser.fetchAll("trade_for_resources"),
					"for": "resources",
					"what": "gold"
				});
			}
		});
	},
	/**
	 * It disables the functionality for the building
	 */
	disable: function() {
		HTML_Engine.upgradeBuilding.disable("trade");
	}
};


/**
 * @namespace The lumberjack building (8)
 * @memberOf
 */
HTML_Engine.inside_lumberjack = {

	/**
	 * It generates the content for the lumberjack building
	 * @return {string} HTML code for lumberjack building
	 */
	content: function() {
		var nr_of_active_units = game.player.city.buildings.lumberjack.people,
			html = "",
			capacity = game.constructions.buildings.lumberjack.capacity(game.player.city.buildings.lumberjack.level).people;
		html += HTML_Engine.getBuilding.info("lumberjack", true);
		html += HTML_Engine.upgradeBuilding.content("lumberjack", (parseInt(game.player.city.buildings.lumberjack.level) + 1));
		html += "<div class='heading'>";
		if (nr_of_active_units === 0) {
			html += "Sir, we have no lumberjacks!";
		} else {
			html += "The number of active lumberjacks:";
			html += HTML_Engine.displayResources.content({
				resources: {
					"people": nr_of_active_units
				}
			}) + "</div>";

			html += "<div class='heading'> The daily income of lumber is: " +
				HTML_Engine.displayResources.content(
					game.unit.lumberjack.work(parseInt(nr_of_active_units))
				) + "</div>";
		}
		html += "</div>";

		if (nr_of_active_units < capacity) {
			html += HTML_Engine.chooser.content({
				info: "Create lumberjacks to generate higher income of lumber.",
				values: [{
					title: "Train new lumberjacks",
					id: "units"
				}],
				button: "Train!",
				id: "lumberjack_train"
			});
		} else {
			html += "Unfortunately, you have reached the max capacity. You can train more units after you upgrade the building.";
		}

		if (nr_of_active_units !== 0) {
			html += HTML_Engine.chooser.content({
				info: "Reducing the amount of lumberjacks decreases lumber income but frees people for different tasks. Unfortunately this does not give back the resources.",
				values: [{
					title: "Reduce lumberjacks",
					id: "units"
				}],
				button: "Reduce units!",
				id: "lumberjack_untrain"
			});
		}
		return html;
	},

	/**
	 * It enables the functionality for the building
	 */
	enable: function() {
		var nr_of_active_units = game.player.city.buildings.lumberjack.people,
			capacity = game.constructions.buildings.lumberjack.capacity(game.player.city.buildings.lumberjack.level).people;

		HTML_Engine.upgradeBuilding.enable("lumberjack", (parseInt(game.player.city.buildings.lumberjack.level) + 1));

		/*
		 * It creates the chooser to let the user to choose how many utits to create
		 */
		if (nr_of_active_units < capacity) {
			HTML_Engine.chooser.enable({
				id: "lumberjack_train",
				values: [{
					id: 'units',
					min: 1,
					max: capacity - nr_of_active_units,
					change: function(event, ui, extra) {
						extra.html(HTML_Engine.displayResources.content(
								game.unit.lumberjack.create(parseInt(ui.value))
							) + "<div> Daily income: </div>" +
							HTML_Engine.displayResources.content(
								game.unit.lumberjack.work(parseInt(ui.value))
							));
					}
				}],
				performAction: function() {
					game.performTask("train_lumberjack", {
						from: "administration",
						to: "lumberjack",
						number: HTML_Engine.chooser.fetch("lumberjack_train", "units")
					});
				}
			});
		}

		if (nr_of_active_units !== 0) {
			/*
			 * It creates the chooser to let the user to choose how many units to create
			 */
			HTML_Engine.chooser.enable({

				id: "lumberjack_untrain",
				values: [{
					id: 'units',
					min: 1,
					max: nr_of_active_units,
					change: function(event, ui, extra) {
						extra.html(HTML_Engine.displayResources.content({
							time: parseInt(ui.value) * 5
						}));
					}
				}],
				performAction: function() {
					game.performTask("untrain_lumberjack", {
						from: "lumberjack",
						to: "administration",
						number: HTML_Engine.chooser.fetch("lumberjack_untrain", "units")
					});
				}
			});
		}
	},

	/**
	 * It disables the functionality for the building
	 */
	disable: function() {
		HTML_Engine.chooser.disable({
			id: "lumberjack_train"
		});
		HTML_Engine.chooser.disable({
			id: "lumberjack_untrain"
		});
		HTML_Engine.upgradeBuilding.disable("lumberjack");
	}
};

/**
 * @namespace The farm building (9)
 * @memberOf HTML_Engine
 */
HTML_Engine.inside_farm = {

	/**
	 * It generates the content for the mine building
	 * @return {string} HTML code for mine building
	 */
	content: function() {
		var nr_of_active_units = game.player.city.buildings.farm.people,
			html = "",
			capacity = game.constructions.buildings.farm.capacity(game.player.city.buildings.farm.level).people;
		html += HTML_Engine.getBuilding.info("farm", true);
		html += HTML_Engine.upgradeBuilding.content("farm", (parseInt(game.player.city.buildings.farm.level) + 1));
		html += "<div class='heading'>";
		if (nr_of_active_units === 0) {
			html += "Sir, we have no farmers!";
		} else {
			html += "The number of active farmers:";
			html += HTML_Engine.displayResources.content({
				resources: {
					"people": nr_of_active_units
				}
			}) + "</div>";

			html += "<div class='heading'> The daily income of food is: " +
				HTML_Engine.displayResources.content(
					game.unit.farmer.work(parseInt(nr_of_active_units))
				) + "</div>";
		}
		html += "</div>";

		if (nr_of_active_units < capacity) {
			html += HTML_Engine.chooser.content({
				info: "Create farmers to generate higher income of food.",
				values: [{
					title: "Train new farmers",
					id: "units"
				}],
				button: "Train!",
				id: "farm_train"
			});
		} else {
			html += "Unfortunately, you have reached the max capacity. You can train more units after you upgrade the building.";
		}

		if (nr_of_active_units !== 0) {
			html += HTML_Engine.chooser.content({
				info: "Reducing the amount of farmers decreases food income but frees people for different tasks. Unfortunately this does not give back the resources.",
				values: [{
					title: "Reduce farmers",
					id: "units"
				}],
				button: "Reduce units!",
				id: "farm_untrain"
			});
		}
		return html;
	},

	/**
	 * It enables the functionality for the building
	 */
	enable: function() {
		var nr_of_active_units = game.player.city.buildings.farm.people,
			capacity = game.constructions.buildings.farm.capacity(game.player.city.buildings.farm.level).people;

		HTML_Engine.upgradeBuilding.enable("farm", (parseInt(game.player.city.buildings.farm.level) + 1));

		/*
		 * It creates the chooser to let the user to choose how many utits to create
		 */
		if (nr_of_active_units < capacity) {
			HTML_Engine.chooser.enable({
				id: "farm_train",
				values: [{
					id: 'units',
					min: 1,
					max: capacity - nr_of_active_units,
					change: function(event, ui, extra) {
						extra.html(HTML_Engine.displayResources.content(
								game.unit.farmer.create(parseInt(ui.value))
							) + "<div> Daily income: </div>" +
							HTML_Engine.displayResources.content(
								game.unit.farmer.work(parseInt(ui.value))
							));
					}
				}],
				performAction: function() {
					game.performTask("train_farmer", {
						from: "administration",
						to: "farm",
						number: HTML_Engine.chooser.fetch("farm_train", "units")
					});
				}
			});
		}

		if (nr_of_active_units !== 0) {
			/*
			 * It creates the chooser to let the user to choose how many units to create
			 */
			HTML_Engine.chooser.enable({

				id: "farm_untrain",
				values: [{
					id: 'units',
					min: 1,
					max: nr_of_active_units,
					change: function(event, ui, extra) {
						extra.html(HTML_Engine.displayResources.content({
							time: parseInt(ui.value) * 5
						}));
					}
				}],
				performAction: function() {
					game.performTask("untrain_farmer", {
						from: "farm",
						to: "administration",
						number: HTML_Engine.chooser.fetch("farm_untrain", "units")
					});
				}
			});
		}
	},

	/**
	 * It disables the functionality for the building
	 */
	disable: function() {
		HTML_Engine.chooser.disable({
			id: "farm_train"
		});
		HTML_Engine.chooser.disable({
			id: "farm_untrain"
		});
		HTML_Engine.upgradeBuilding.disable("farm");
	}
};

/**
 * @namespace It returns html information regarding the building
 * @memberOf HTML_Engine
 */
HTML_Engine.getBuilding = {
	/**
	 *  It returns the name of the building (special names for house or administration)
	 *  @param {string} name The name of the building
	 *  @param {number} level The level of the building
	 *  @return {string} The name of the building capitalized
	 */
	name: function(name, level) {
		name = typeof name !== 'undefined' ? name : "";
		if (name === "house") {
			name = game.organization.getByLevel("house", level);
		} else if (name === "administration") {
			name = game.organization.getByLevel("administration", level);
		}
		return name.capitalize();
	},
	/**
	 * It returns the image of the building. Note: the administration building has 6 different images according to the level of the city
	 *  @param {string} name The name of the building
	 *  @param {number} level The level of the building
	 *  @param {number} dim The dimension for height and width of the image
	 *  @return {string} The image of the building
	 */
	image: function(name, level, dim) {

		var src = name.replaceAll(" ", "_"),
			title = "";

		name = HTML_Engine.getBuilding.name(name, level);

		if (name === "administration") {
			title = game.organization.getByLevel("administration", level);
		}

		if (title) {
			name += "-" + title;
		}

		return "<img align='absmiddle' width='" + dim + "px' height='" + dim + "px' src='/static/img/game/buildings/" + src + ".png' />";
	},
	/**
	 * It returns the description of the building
	 * @param {string} name The name of the building
	 * @return {string} The description of the building
	 */
	description: function(name) {
		switch (name.toLowerCase()) {
			case "administration":
				return "This is the heart of your great city, here you can level up your city and view your gold income.";
			case "mine":
				return "Your hard workers can bring you stone. This building increases your income of stone.";
			case "storage":
				return "This building keeps some of your resources safe, in case of an attack.";
			case "military":
				return "This building is where you can train/retire people for the military.";
			case "house":
				return "This building increases the population of your city.";
			case "farm":
				return "Train people into farmers here who will generate food for you.";
			case "lumberjack":
				return "Train people into strong lumberjacks who can generate wood for you.";
			case "mill":
				return "Send people to work in the mill to refine your food and keep your citizens happy.";
			case "trade":
				return "The trade building helps your city to sell or buy resources";
		}
	},
	/**
	 * It returns a general info regarding the building. It includes the image and the description of the building
	 * @param {string} building The name of the building
	 * @return {string} A general info about the building
	 */
	info: function(building, full) {
		var data = game.constructions.buildings[building],
			level = game.player.city.buildings[building].level,
			html = "<div class='building_info'>";
		html += "<div class='title'> " + HTML_Engine.getBuilding.image(building, game.player.getLevel(), 60) + "<span class='bold'>" + HTML_Engine.getBuilding.name(building, game.player.getLevel()) + "</span>";
		if (level && full) {
			html += "<div class='level'>" + game.player.city.buildings[building].level + "</div>";
		}
		html += "</div>";
		if (data.capacity && full) {
			html += "<div class='capacity'> Capacity: <br />" + HTML_Engine.displayResources.content(data.capacity(level)) + "</div>";
		}
		html += "<div class='description'>" + HTML_Engine.getBuilding.description(building) + "</div>";
		html += "</div>";
		return html;
	}
};

/**
 * @namespace The HTML Engine object for showing that a building is under consturction
 * @memberOf HTML_Engine
 */
HTML_Engine.buildingUnderConstruction = {
	/**
	 * It returns the content
	 * @return {string} The HTML content
	 */
	content: function() {
		// image from http://www.iconarchive.com/show/construction-icons-by-proycontec/document-construction-icon.html
		return "This building is under construction. <br /> <div class='center'><img src='/static/img/game/buildings/building_construction.png' /></div>";
	}
};

/**
 * @namespace HTML content for the upgrading a building
 * @memberOf HTML_Engine
 */
HTML_Engine.upgradeBuilding = {

	/**
	 * It shows the upgrading panel or a message if the upgrading building is being performed
	 * @param {string} building_name The name of the building
	 * @param {number} next_level The level of building
	 * @return {string} A string which shows the building is under upgrading or a panel to upgrade the building
	 */
	content: function(building_name, next_level) {
		if (game.player.city.buildings[building_name].status === 'upgrading') {
			return "Your workers are upgrading this building...";
		} else {
			var data = game.constructions.buildings[building_name];
			if (!data.maxLevel || (next_level <= data.maxLevel)) {
				// image from http://www.iconarchive.com/show/orb-icons-by-taytel/arrow-up-icon.html
				return "<div class='board_list hover chooser' id='upgrade_building' building_name='" + building_name + "'>" +
					HTML_Engine.table.content([
						["Upgrade to level <span class='bold'>" + next_level + "</span></span> <br />" + HTML_Engine.displayResources.content(game.constructions.buildings[building_name].levelUp(next_level)), "<img src='/static/img/game/buildings/upgrade.png' align='right' />"]
					], false) +
					"</div>";
			} else {
				return "The building has the maximum level.";
			}
		}
	},
	/**
	 * It enables the panel
	 */
	enable: function(building_name, next_level) {

		if (building_name !== 'house' && building_name !== 'administration') {
			$("#upgrade_building img").qtip({
				content: "Capacity for level " + next_level + "<br />" + (HTML_Engine.displayResources.content(game.constructions.buildings[building_name].capacity(next_level))),
				position: {
					target: 'mouse', // Track the mouse as the positioning target
					adjust: {
						x: 5,
						y: 5
					} // Offset it slightly from under the mouse
				}

			});
		}
		$("#upgrade_building").click(function() {
			game.performTask("update_building", {
				building: $(this).attr("building_name"),
				toLevel: (parseInt(game.player.city.buildings[$(this).attr("building_name")].level) + 1)
			});
		});
	},
	/**
	 * It disables the panel
	 */
	disable: function() {
		$("#upgrade_building").off();
	}
};

/* ------------------------------ World Map  ------------------------------ */


/**
 * @namespace It returns the HTML code when the world map was chosen
 * @memberOf HTML_Engine
 */
HTML_Engine.worldMapSelected = {
	/**
	 * It returns the string
	 * @return {string} It returns the content
	 */
	content: function() {
		return "<img align='middle' src='http://clipart.nicubunu.ro/png/events/graduation03.svg.png' /> <div>Hmmm... It seems you can see the world map. It contains the other cities. Click on a city to see the options.</div>";
	}
};

/**
 * @namespace The HTML_Engine when a city is selected
 * @memberOf HTML_Engine
 */
HTML_Engine.selectCity = {
	/**
	 * It returns the content
	 * @param {number} id The id of the selected city
	 * @return {string} The HTML content
	 */
	content: function(id) {
		var city = game.worldMap.getCityById(id);
		var html = "";
		html += HTML_Engine.table.content(
			[
				["Name of city:", city.name],
				["Player:", city.player],
				["Level:", city.level]
			], true
		);

		html += "<br /><br />" +
			"<div class='heading'><span class='bold'> Actions for this city: </span><br />" +
			"<div class='heading'>Do you want to help him. <br /><input class='action_bt' id='send_units' value='Send units' /></div>" +
			"<div class='heading'>Your imperial forces can bring new resources. <br /><input class='action_bt' id='start_attack' value='Perform an attack' /></div>" +
			"<div class='heading'>Do you have something important to tell to this king ? <br /><input class='action_bt' id='send_message' value='Send message' /></div>" +
			"" +
			"</div>";

		return html;

	},
	/**
	 * It enables the functionality for the HTML_Engine
	 * @param {number} id_selected_city The id of the city
	 */
	enable: function(id_selected_city) {
		$(".action_bt").button();
		$("#send_units").click(function() {
			game.performAction("sendUnits", id_selected_city);
		});
		$("#start_attack").click(function() {
			game.performAction("attackCity", id_selected_city);
		});
		$("#send_message").click(function() {
			game.performAction("sendMessage", id_selected_city);
		});
	},
	/**
	 * It disables the functionality
	 */
	disable: function() {
		$(".action_bt, #start_attack, #send_message").off();
	}
};



/**
 * @namespace The HTML_Engine in order to send units
 * @memberOf HTML_Engine
 */
HTML_Engine.sendUnits = {

	/**
	 * It generates the content
	 * @param {number} idCity The id of the city
	 * @return {string} The HTML content in order to perform an attack
	 */
	content: function(idCity) {
		var nr_of_active_units = game.player.city.buildings.military.people;
		var html = "<div class='heading'>Target: <span class='bold' style='color:red'>" + game.worldMap.getCityById(idCity).name + "</div>";
		html += "<div class='heading'> The number of active units:";
		html += HTML_Engine.displayResources.content({
			resources: {
				"military": nr_of_active_units
			},
		}) + "</div>";

		if (nr_of_active_units !== 0 && game.player.city.buildings.military.level !== 0) {
			html += HTML_Engine.chooser.content({
				info: "Decide very wize how many units you want to send. The daily cost is an addition cost to the one from military for the units.",
				values: [{
					title: "Military units",
					id: "units"
				}],
				button: "Send units !",
				id: "send_units_chooser"
			});
		} else {
			html += "<div>Unfortunately, you have no military units to use</div>";
		}

		return html;
	},
	/**
	 * It enables the functionality for the attack
	 * @param {number} idCity The id of the city
	 */
	enable: function(idCity) {

		var nr_of_active_units = game.player.city.buildings.military.people;

		if (nr_of_active_units !== 0 && game.player.city.buildings.military.level !== 0) {
			/**
			 * It creates the chooser to let the user to choose how many utits to send into attack
			 */
			HTML_Engine.chooser.enable({

				id: "send_units_chooser",
				values: [{
					id: 'units',
					min: 1,
					max: nr_of_active_units,
					change: function(event, ui, extra) {
						extra.html(HTML_Engine.displayResources.content(
							game.unit.military.send(parseInt(ui.value))
						));
					}
				}],
				performAction: function() {
					game.performTask("send_units", {
						from: game.player.id,
						to: idCity,
						options: HTML_Engine.chooser.fetchAll("send_units_chooser")
					});
				}
			});
		} else {
			return "You have no active units or military.";
		}
	},
	/**
	 * It calls the disable methods of the military choosers
	 */
	disable: function() {
		HTML_Engine.chooser.disable({
			id: "send_units"
		});
	},
};

/**
 * @namespace The HTML_Engine in order to attack a city
 * @memberOf HTML_Engine
 */
HTML_Engine.attackCity = {

	/**
	 * It generates the content for the military building
	 * @param {number} idCity The id of the city
	 * @return {string} The HTML content in order to perform an attack
	 */
	content: function(idCity) {
		var nr_of_active_units = game.player.city.buildings.military.people;
		var html = "<div class='heading'>Target: <span class='bold' style='color:red'>" + game.worldMap.getCityById(idCity).name + "</div>";
		html += "<div class='heading'> The number of active units:";
		html += HTML_Engine.displayResources.content({
			resources: {
				"military": nr_of_active_units
			},
		}) + "</div>";

		if (nr_of_active_units !== 0 && game.player.city.buildings.military.level !== 0) {
			html += HTML_Engine.chooser.content({
				info: "Decide wisely how many units you want to send. The daily cost is an addition cost to the one from military for the units.",
				values: [{
					title: "Military units",
					id: "units"
				}, {
					title: "Wine to increse happiness",
					id: "wine"
				}],
				button: "Start attack !",
				id: "military_attack"
			});
		} else {
			html += "<div>Unfortunately, you have no military units to use</div>";
		}

		return html;
	},
	/**
	 * It enables the functionality for the attack
	 * @param {number} idCity The id of the city
	 */
	enable: function(idCity) {

		var nr_of_active_units = game.player.city.buildings.military.people;

		if (nr_of_active_units !== 0 && game.player.city.buildings.military.level !== 0) {
			/**
			 * It creates the chooser to let the user to choose how many utits to send into attack
			 */
			HTML_Engine.chooser.enable({

				id: "military_attack",
				values: [{
					id: 'units',
					min: 1,
					max: nr_of_active_units,
					change: function(event, ui, extra) {
						extra.html(HTML_Engine.displayResources.content(
							game.unit.military.attack(parseInt(ui.value))
						));
					}
				}, {
					id: 'wine',
					mine: 1,
					max: game.player.resources.food,
					change: function(event, ui, extra) {
						extra.html("Incresed by " + Math.round(parseInt(ui.value) / 900 * 25) + "%");
					}

				}],
				performAction: function() {
					game.performTask("move_military_units", {
						from: game.player.id,
						to: idCity,
						options: HTML_Engine.chooser.fetchAll("military_attack")
					});
				}
			});
		} else {
			return "You have no active units or military.";
		}
	},
	/**
	 * It calls the disable methods of the military choosers
	 */
	disable: function() {
		HTML_Engine.chooser.disable({
			id: "military_attack"
		});
	},

	/**
	 * It generates a report regarding the battle
	 * @param {object} response The response from the server about the attack
	 * @param {object} data The data of task
	 */
	report: function(data, response) {
		var html = "<span class='bold'>Attack report</span> at " + HTML_Engine.worldPath.getCityName(data.from) + "<br />" +
			"<span class='bold'>Your military and friends:</span> " +
			HTML_Engine.displayResources.content(response.friends) +
			"<span class='bold'>Your enemies:</span> " +
			HTML_Engine.displayResources.content(response.enemies);
		if (response.status === 'won') {
			html += "You won the battle! <br />";
			html += "<span class='bold'>Returning home with:</span>";
			html += HTML_Engine.displayResources.content(response.carring);
		} else {
			html += "You lost all the units.";
		}
		return html;
	}
};

/**
 * @namespace The THML_Engine object for paths
 * @memberOf HTML_Engine
 */
HTML_Engine.worldPath = {
	/**
	 * It returns the name of the city based on the id
	 * @param {number} idCity The id of the city
	 * @return {string} The name of the city
	 */
	getCityName: function(idCity) {
		return ((game.worldMap.getCityById(idCity) === game.player.id) ? "Your city" : game.worldMap.getCityById(idCity).name);
	},
	/**
	 * It returns the string for a description of moving military units
	 * @param {number} c1 The id of the "from" city
	 * @param {number} c2 The id of the "to" city
	 * @param {Resources} resources An object to describe the resources which are being carried
	 * @return {string} The HMTL code for describing the moving of military units
	 */
	moveMilitaryUnits: function(c1, c2, resources) {
		return "<span class='bold'>Move military units</span> <br/> From: " + HTML_Engine.worldPath.getCityName(c1) + " </br> Target: " + HTML_Engine.worldPath.getCityName(c2) + "<br /><br /> " + HTML_Engine.displayResources.content(resources);
	}
};

/**
 * @namespace The object for sending a message
 * @memberOf HTML_Engine
 */
HTML_Engine.sendMessage = {

	/**
	 * It generates the content for the message
	 * @return {string} The HTML code for sending a message
	 */
	content: function(id) {
		return "<div class='heading'><input type='hidden' id='message_to' value='" + game.worldMap.getCityById(id).id + "'/><span class='bold'>To</span>: " + game.worldMap.getCityById(id).name + "<br /><span class='bold'>Message: </span><br /><textarea rows='20' cols='25' id='message'></textarea><br /></div><div class='heading'><input class='action_bt' id='confirm_send' value='Send message' /></div>";
	},
	/**
	 * It enables the functionality for the message
	 */
	enable: function() {
		$(".action_bt").button();
		
		$("#confirm_send").click(function() {
			game.performTask("sendMessage", {
				message : $("#message").val(),
				to		: $("#message_to").val()
			});
			game.performAction("city-map-selected");
		});
		$("#message").focus();
	},
	/**
	 * It disables the functionality
	 */
	disable: function() {
		$("#confirm_send").off();
	}
};


/**
 * @namespace The HTML_Engine object for displaying a message
 * @memberOf HTML_Engine
 */
HTML_Engine.seeMessage = {
	/**
	 * It displays the content of the message
	 * @param {object} msg The object which contain information regarding the message ('id', 'content' and 'from' (the token of the player))
	 * @return {string} The HTML content for displaying the message
	 */
	content: function(msg) {
		return "<div class='heading'> <span class='link' id='back_msg'>Back to messages</span></div><br /><div>From: <span class='bold'>" + game.worldMap.getCityById(msg.from).name + "</span>:<br/ ><i>" + msg.content + '</i></div> <br /><div class="center heading"> <span class="link" id="replay_msg" from="' + msg.from + '" >Reply back</span></div>';
	},
	enable: function() {
		$("#back_msg").click(function(){
			game.performAction("messages");
		});
		$("#replay_msg").button().click(function(){
			game.performAction('sendMessage', $(this).attr("from"));
		});
	},
	disable: function() {
		$("#back_msg, #replay_msg").off();
	}
};

/**
 * @namespace The HTML_Engine object for displaying all the messages
 * @memberOf HTML_Engine
 */
HTML_Engine.messages = {
	/**
	 * It displays the content of the message
	 * @return {string} The HTML content for displaying the message
	 */
	content: function() {
		var html = "";
		for(var i = 0; i < game.player.messages.length; i++) {
			var msg = game.player.messages[i];
			html += "<div class='heading'>From: <span class='bold'>" + game.worldMap.getCityById(msg.from).name + "</span><input msg='" + msg.id + "' class='confirm_see' value='See message' /></div>";
		}
		return (html === ''?"You have no message :(":html + "<div class='center'><span class='link' id='delete_messages'>Delete all messages</span></div>");
	},
	/**
	 * It creates and enables the listeners
	 */
	enable: function() {
		$(".confirm_see").button().click(function(){
			game.performAction('seeMessage', game.player.messages[$(this).attr("msg")]);
		});
		$("#delete_messages").click(function(){
			game.player.messages = [];
			game.update();
		});
	},
	/**
	 * It disables the listeners
	 */
	disable: function() {
		$(".confirm_see, #delete_messages").off();
	}
};