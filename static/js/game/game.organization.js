/**
 * Holds information regarding the organization
 */
game.organization = {};

/**
 * It returns a particular info regarding the level of an organization
 * @param (string) what It can be "name", "administration", "house" or "period"
 * @param (string) level The level of organization
 * @return (string) The particular information
 */
game.organization.getByLevel = function(what, level) {

	var info = {};
  level = parseInt(level);

	if (level <= 4) {
		info = {
			name: "Hamlet",
			administration: "Foyer",
			house: "Neighbourhood",
			period: "Ancient Time"
		};
	} else
	if (level >= 5 && level <= 9) {
		info = {
			name: "Village",
			administration: "Village Hall",
			house: "Cul-de-sac",
			period: "Medieval Age"
		};
	} else
	if (level >= 10 && level <= 14) {
		info = {
			name: "Town",
			administration: "Town Square",
			house: "Residential Area",
			period: "Classical Era"

		};
	} else
	if (level >= 15 && level <= 19) {
		info = {
			name: "City",
			administration: "City Hall",
			house: "Borough",
			period: "Industrial Period"
		};
	} else
	if (level >= 20 && level <= 49) {
		info = {
			name: "Metropolis",
			administration: "Metropolis Hall",
			house: "District",
			period: "Modern History"
		};
	} else {
		info = {
			name: "Magapolis",
			administration: "Government",
			house: "Region",
			period: "Contemporary Period"
		};
	}

	return info[what];
};