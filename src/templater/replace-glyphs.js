import { App, Notice } from 'obsidian';

const app = new App();

/**
 * Text Replacement Mapping
 */
const replacementMap = {
    '~': '',
    '>>': '󰓘',
    '->': '󰓘',
    'xx': '󰎂󰫧',
    'ndr': '󰑮',
    'drc': '󰑮',
    'dr.': '󰑮.',
    'parry': '',
    ' : ': '',
    '__': '・',
    '||': '󱋱',
    'j9': '󰁜',
    'j8': '',
    'j7': '󰁛',
    '66': '',
    '44': '',
    'qcf': '󰁃',
    '236': '󰁃',
    '636': '󰁃',
    'qcb': '󰁂',
    '214': '󰁂',
    'fb': '󱠇',
    'dp': '',
    'hfb': '󱠇',
    'lfb': '󱠇',
    'pw': '',
    'tk': '',
    'ps.mp': 'ps.',
    'ps.hp': 'ps.󱥸',
    'ps.lk': 'ps.',
    'ps.mk': 'ps.󱞰',
    'ps.hk': 'ps.',
    'ps.6p': 'ps.󰿠',
    'ps./': 'ps.󰿠',
    'ps.6lp': 'ps.lp.󰿠',
    'ps.6mp': 'ps.mp.󰿠',
    'ps.6hp': 'ps.hp.󰿠',
};

let replacementCount = 0;

/**
 * Parse and replace strings in the current note
 * @param {string} text - The text to process
 * @returns {string} - Text with replacements applied
 */
function replaceGlyphs(text) {
	let frontmatter = '';
	let body = text;

	// Check if text starts with frontmatter (--- delimiter)
	if (text.startsWith('---')) {
		const frontmatterEnd = text.indexOf('---', 3);

		if (frontmatterEnd !== -1) {
			// Extract frontmatter (including both --- delimiters)
			frontmatter = text.substring(0, frontmatterEnd + 3);

			// Get the text after frontmatter
			body = text.substring(frontmatterEnd + 3);
		}
	}

	// Sort patterns by length (desc) to prevent partial matches
	const patterns = Object.keys(replacementMap).sort((a, b) => b.length - a.length);

	// Escape special regex characters and combine into a single pattern
	const escapedPatterns = patterns.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
	const combinedRegex = new RegExp(escapedPatterns.join('|'), 'g');

	// Single pass replacement using a lookup function
	// Apply replacements only to body text
	body = body.replace(combinedRegex, match => {
		replacementCount++;
		return replacementMap[match];
	});

	return frontmatter + body;
}

/**
 * Main Execution
 * Gets the current file content, applies replacements, and returns the result
 */
const file = tp.app.workspace.getActiveFile();
const fileText = await tp.app.vault.read(file);
const replacedText = replaceGlyphs(fileText);

// Update the TFile w/the replaced content
if (replacementCount > 0) {
	await tp.app.vault.modify(file, replacedText);
	new Notice(`${replacementCount} strings replaced`);
} else {
	new Notice(`No replaceable strings found`);
}
