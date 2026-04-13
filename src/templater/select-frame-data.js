const { Notice } = require("obsidian");

let frameData;

async function loadFrameData(tp) {
	const filePath = 'templates/scripts/sf6-frame-data-sm.json'
	const file = tp.app.vault.getFileByPath(filePath);
	const fileText = await tp.app.vault.cachedRead(file);

	// JSON parse method
	frameData = JSON.parse(fileText);

	if (file && frameData) {
		new Notice(`${file.name} parsed`);
	} else {
		new Notice(`File parsing error:\ntfile = ${file.basename},  frameData = ${frameData}`);
	}
}

// Helper function to check if a value is an object or array (not a primitive)
function isObjectOrArray(value) {
	return value !== null && typeof value === 'object';
}

async function recursiveSelect(tp, data, path = []) {
	// If data is not an object or array, return it (base case)
	if (!isObjectOrArray(data)) {
		return { value: data, path: path };
	}

	// Get keys (for objects) or indices (for arrays)
	const keys = Array.isArray(data) ? data.map((_, index) => index.toString()) : Object.keys(data);

	// Create display labels with type hints
	const displayLabels = keys.map(key => {
		const value = data[key];
		const type = Array.isArray(value) ? '[]' : isObjectOrArray(value) ? '{}' : typeof value;
		return `${key} (${type})`;
	});

	// Show selection menu
	const selected = await tp.system.suggester(displayLabels, keys);

	if (selected === null || selected === undefined) {
		return null; // User cancelled
	}

	const selectedValue = data[selected];
	const newPath = [...path, selected];

	// Recursively navigate into the selected value
	return await recursiveSelect(tp, selectedValue, newPath);
}

async function selectFrameData(tp) {
	if (!frameData) await loadFrameData(tp);

	const result = await recursiveSelect(tp, frameData);

	if (result) {
		new Notice(`Selected: ${result.path.join(' → ')}`);
		return result.value;
	}

	return null;
}

module.exports = selectFrameData;
