const BYPASS_TRANSFORMATIONS = {
    "muito": "muyntu",
    "muitos": "muyintus",
    "muita": "muynta",
    "muitas": "muyntas",
    "e": "y",
    "até": "té",
    "mãe": "mãen",
    "mães": "mãens",
    "ou": "ô"
};

function handleVowelCombination(first, second) {
    // Define vowel groups
    const openVowels = "aáâã";
    const closedVowels = "eéêiy";
    const backVowels = "oóôu";
    const allVowels = openVowels + closedVowels + backVowels;
    
    if (!first || !second) return first + second;
    
    const firstLower = first.toLowerCase();
    const secondLower = second.toLowerCase();
    
    // Only process if ending/starting with vowels
    const lastVowel = firstLower[firstLower.length - 1];
    const firstVowel = secondLower[0];
    
    if (!allVowels.includes(lastVowel) || !allVowels.includes(firstVowel)) {
        return first + second;
    }
    
    // Special case: word ending in 'ê' + word starting with 'é' -> drop 'ê'
    if (lastVowel === 'ê' && firstVowel === 'é') {
        return first.slice(0, -1) + second;
    }
    
    // Rule 1: Same vowels usually merge
    if (lastVowel === firstVowel) {
        return first.slice(0, -1) + second;
    }
    
    // Rule 2: 'a' + 'e/i' drops the 'a'
    if (openVowels.includes(lastVowel) && closedVowels.includes(firstVowel)) {
        return first.slice(0, -1) + second;
    }
    
    // Rule 3: 'e/i' + 'a' adds 'y'
    if (closedVowels.includes(lastVowel) && openVowels.includes(firstVowel)) {
        return first + 'y' + second;
    }
    
    // Rule 4: 'o/u' + 'a/e/i' adds 'w'
    if (backVowels.includes(lastVowel) && (openVowels + closedVowels).includes(firstVowel)) {
        return first + 'w' + second;
    }
    
    // Rule 5: Keep both vowels in other cases
    return first + second;
}

function finalEndingsChange(word) {
    if (!word) return word;
    
    const wordLower = word.toLowerCase();
    
    // Handle endings
    const replacements = {
        "os": "us",
        "o": "u",
        "es": "is",
        "e": "i",
        "l": "u"
    };
    
    for (const [ending, replacement] of Object.entries(replacements)) {
        if (wordLower.endsWith(ending) && word.length > 1) {
            return word.slice(0, -ending.length) + replacement;
        }
    }
    
    // Handle special characters
    if (word.includes("à")) word = word.replace(/à/g, "a");
    if (word.includes("lh")) word = word.replace(/lh/g, "ly");
    
    // Remove initial 'h'
    if (wordLower.startsWith("h") && word.length > 1) {
        word = word.slice(1);
    }
    
    return word;
}

function transformTokens(cleanTokens) {
    if (!cleanTokens || cleanTokens.length === 0) return cleanTokens;
    
    // Transform words first
    let result = cleanTokens.map(word => 
        BYPASS_TRANSFORMATIONS[word.toLowerCase()] || finalEndingsChange(word)
    );
    
    // Apply vowel combinations
    const merged = [result[0]];
    for (let i = 1; i < result.length; i++) {
        merged[merged.length - 1] = handleVowelCombination(merged[merged.length - 1], result[i]);
    }
    
    return merged;
}

function convertText() {
    const input = document.getElementById('input').value;
    if (!input.trim()) return;
    
    const tokens = input.trim().split(/\s+/);
    const transformed = transformTokens(tokens);
    const result = transformed.join(' ');
    
    document.getElementById('result').style.display = 'block';
    document.getElementById('output').textContent = result;
}
