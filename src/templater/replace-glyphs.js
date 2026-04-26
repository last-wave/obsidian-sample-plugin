import { App, Notice } from 'obsidian';

const app = new App();

/**
 * Text Replacement Mapping
 */
const replacementMap = {
    '(?<!~)~(?!~)': '',  // Match only when NOT preceded or followed by ~
    '>>': '󰓘',
    '->': '󰓘',
    'xx': '󰎂󰫧',
    'ndr': '󰑮',
    'drc': '󰑮',
    'dr.': '󰑮.',
    'parry': '',
    '__': '・',
    ' : ': '  ',
    '||': '󱋱',
    'j9': '󰁜',
    'j8': '',
    'j7': '󰁛',
    '66': '',
    '44': '',
    'qcf': '󰁃',
    '236': '󰁃',
    '636': '󰁃',
    '623': '󰁃',
    'qcb': '󰁂',
    '214': '󰁂',
    '632146': '󰁃󰁂',
    '.fb': '.󱠇',
    '.dp': '.',
    'hfb': '󱠇',
    'lfb': '󱠇',
    '.pw': '.',
    '.tk': '.',
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
 * Check if a pattern string contains regex syntax
 * @param {string} pattern - The pattern to check
 * @returns {boolean} - True if pattern contains regex syntax
 */
function isRegexPattern(pattern) {
    return pattern.includes('(?') || pattern.includes('\\');
}

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

    // Separate regex patterns from literal strings
    const patterns = Object.keys(replacementMap);
    const regexPatterns = patterns.filter(isRegexPattern);
    const literalPatterns = patterns.filter(p => !isRegexPattern(p));

    // Sort literal patterns by length (desc) to prevent partial matches
    literalPatterns.sort((a, b) => b.length - a.length);

    // First, apply regex patterns (they handle their own specificity)
    regexPatterns.forEach(pattern => {
        const regex = new RegExp(pattern, 'g');
        body = body.replace(regex, () => {
            replacementCount++;
            return replacementMap[pattern];
        });
    });

    // Then, apply literal patterns in a single pass
    if (literalPatterns.length > 0) {
        // Escape special regex characters and combine into a single pattern
        const escapedPatterns = literalPatterns.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        const combinedRegex = new RegExp(escapedPatterns.join('|'), 'g');

        // Apply replacements only to body text
        body = body.replace(combinedRegex, match => {
            const replacement = replacementMap[match];
            replacementCount++;
            return replacement;
        });
    }

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
