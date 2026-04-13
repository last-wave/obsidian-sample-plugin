/**
 * Data Configuration
 */
const glyphMap = {
    'common:  ・ 󰓘 ・ 󰎂󰫧 ・ 󰑮 ・ ': ['  ', ' 󰓘 ', '󰎂󰫧', '󰑮', ''],
    'frame data:  ・ ・ ・ 󱋱': ['', '・', '󱋱'],
    'directions:  ・ 󰁜 ・  ・ 󰁛 ・ ': ['', '󰁜', '', '󰁛', ''],
    'directions:  ・ 󰁂 ・  ・ 󰁃 ・ ': ['', '󰁂', '', '󰁃', ''],
    'motions:  ・  ・ 󰁃 ・ 󰁂 ・ ': ['', '', '󰁃', '󰁂', ''],
    'shotos: 󱠇 ・  ・ 󱠇 ・ 󱠇 ・  ・ ' : ['󱠇', '', '󱠇', '󱠇', '', ''],
    'alex:  ・ 󱥸 ・  ・ 󱞰 ・  ・ 󰿠' : ['ps.', 'ps.󱥸', 'ps.', 'ps.󱞰', 'ps.', 'ps.󰿠']
};

/**
 * Selection Logic
 * Recursively navigate through nested structures until a string glyph is selected
 * @param {Object|Array} data - The current data structure to select from
 * @returns {Promise<string|null>} - Selected glyph or null if canceled
 */
async function selectGlyph(data) {
	// If data is an object, let user choose a key
	if (data && typeof data === 'object' && !Array.isArray(data)) {
		const selected = await tp.system.suggester(item => item, Object.keys(data));
		if (!selected) return null;
		return selectGlyph(data[selected]);
	}

	// If data is an array, let user choose an item
	if (Array.isArray(data)) {
		const selected = await tp.system.suggester(item => item, data);
		return selected || null;
	}

	// If data is a primitive (string), return it
	return data;
}

/**
 * Main Execution
 */
const glyph = await selectGlyph(glyphMap);

if (glyph) {
	tR += glyph;
}
