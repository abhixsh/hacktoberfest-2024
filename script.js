function obfuscateCode() {
    const inputCode = document.getElementById("inputCode").value.trim();
    const obfuscationType = document.getElementById("obfuscationType").value;
    const strength = parseInt(document.getElementById("obfuscationStrength").value) || 1;
    
    // Input validation
    if (!inputCode) {
        showMessage("Please enter some JavaScript code to obfuscate.", "error");
        return;
    }
    
    let obfuscatedCode;
    
    try {
        switch (obfuscationType) {
            case "base64":
                obfuscatedCode = `eval(atob("${btoa(inputCode)}"))`;
                break;
            case "rot13":
                obfuscatedCode = `eval("${rot13(inputCode).replace(/"/g, '\\"')}")`;
                break;
            case "scramble":
                obfuscatedCode = scramble(inputCode, strength);
                break;
            case "unicode":
                obfuscatedCode = toUnicodeEscape(inputCode);
                break;
            case "hex":
                obfuscatedCode = toHexString(inputCode);
                break;
            default:
                obfuscatedCode = inputCode;
        }
        
        document.getElementById("outputCode").value = obfuscatedCode;
        showMessage("Code obfuscated successfully!", "success");
    } catch (error) {
        showMessage("Error obfuscating code: " + error.message, "error");
    }
}
  
  function rot13(str) {
    return str.replace(/[a-zA-Z]/g, (char) =>
      String.fromCharCode(
        char.charCodeAt(0) + (char.toLowerCase() < 'n' ? 13 : -13)
      )
    );
  }
  
  function scramble(str, strength) {
    let scrambled = str.split('').sort(() => Math.random() - 0.5).join('');
    for (let i = 1; i < strength; i++) {
      scrambled = scrambled.split('').sort(() => Math.random() - 0.5).join('');
    }
    return scrambled;
  }
  
async function copyCode() {
    const outputCode = document.getElementById("outputCode");
    const copyButton = document.getElementById("copyButton");
    
    if (!outputCode.value.trim()) {
        showMessage("No code to copy!", "error");
        return;
    }
    
    try {
        // Use modern Clipboard API
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(outputCode.value);
        } else {
            // Fallback for older browsers
            outputCode.select();
            document.execCommand("copy");
        }
        
        copyButton.innerText = "Copied!";
        copyButton.classList.add("copied");
        showMessage("Code copied to clipboard!", "success");
        
        setTimeout(() => {
            copyButton.innerText = "Copy Code";
            copyButton.classList.remove("copied");
        }, 2000);
    } catch (error) {
        showMessage("Failed to copy code: " + error.message, "error");
    }
}
  
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    const themeToggle = document.getElementById("theme-toggle-checkbox");
    const isDarkMode = document.body.classList.contains("dark-mode");
    
    // Update checkbox state
    if (themeToggle) {
        themeToggle.checked = isDarkMode;
    }
    
    // Save theme preference to localStorage
    localStorage.setItem("darkMode", isDarkMode);
}

// New helper functions
function showMessage(message, type = "info") {
    const messageDiv = document.getElementById("message") || createMessageDiv();
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = "block";
    
    setTimeout(() => {
        messageDiv.style.display = "none";
    }, 3000);
}

function createMessageDiv() {
    const messageDiv = document.createElement("div");
    messageDiv.id = "message";
    messageDiv.className = "message";
    messageDiv.style.display = "none";
    document.querySelector(".container").appendChild(messageDiv);
    return messageDiv;
}

function toUnicodeEscape(str) {
    return str.split('').map(char => 
        char.charCodeAt(0) > 127 ? 
        '\\u' + ('0000' + char.charCodeAt(0).toString(16)).slice(-4) : 
        char
    ).join('');
}

function toHexString(str) {
    return str.split('').map(char => 
        '\\x' + ('00' + char.charCodeAt(0).toString(16)).slice(-2)
    ).join('');
}

function updateStrengthVisibility() {
    const obfuscationType = document.getElementById("obfuscationType").value;
    const strengthContainer = document.getElementById("strength-container");
    
    if (obfuscationType === "scramble") {
        strengthContainer.style.display = "block";
    } else {
        strengthContainer.style.display = "none";
    }
}

// Initialize app
function initializeApp() {
    // Load saved theme preference
    const savedTheme = localStorage.getItem("darkMode");
    const themeToggle = document.getElementById("theme-toggle-checkbox");
    
    if (savedTheme === "true") {
        document.body.classList.add("dark-mode");
        if (themeToggle) {
            themeToggle.checked = true;
        }
    }
    
    // Hide preloader
    setTimeout(() => {
        const preloader = document.getElementById("preloader");
        if (preloader) {
            preloader.style.opacity = "0";
            setTimeout(() => preloader.style.display = "none", 500);
        }
    }, 1000);
    
    // Add event listeners
    document.getElementById("obfuscationType").addEventListener("change", updateStrengthVisibility);
    updateStrengthVisibility(); // Initial call
}

function clearAll() {
    document.getElementById("inputCode").value = "";
    document.getElementById("outputCode").value = "";
    showMessage("All fields cleared!", "success");
}

function updateStrengthValue() {
    const strengthInput = document.getElementById("obfuscationStrength");
    const strengthValue = document.getElementById("strength-value");
    if (strengthValue) {
        strengthValue.textContent = strengthInput.value;
    }
}

// Advanced obfuscation techniques
function obfuscateVariableNames(code) {
    const variableMap = new Map();
    let counter = 0;
    
    // Find variable declarations
    const variableRegex = /(?:var|let|const)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    let match;
    
    while ((match = variableRegex.exec(code)) !== null) {
        const originalName = match[1];
        if (!variableMap.has(originalName) && !isReservedWord(originalName)) {
            variableMap.set(originalName, `_${counter.toString(36)}`);
            counter++;
        }
    }
    
    // Replace variables
    let obfuscatedCode = code;
    for (const [original, obfuscated] of variableMap) {
        const regex = new RegExp(`\\b${original}\\b`, 'g');
        obfuscatedCode = obfuscatedCode.replace(regex, obfuscated);
    }
    
    return obfuscatedCode;
}

function isReservedWord(word) {
    const reserved = [
        'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 
        'default', 'delete', 'do', 'else', 'export', 'extends', 'false', 
        'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof', 
        'let', 'new', 'null', 'return', 'super', 'switch', 'this', 'throw', 
        'true', 'try', 'typeof', 'var', 'void', 'while', 'with', 'yield'
    ];
    return reserved.includes(word);
}

function minifyCode(code) {
    // Simple minification
    return code
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
        .replace(/\/\/.*$/gm, '') // Remove line comments
        .replace(/\s+/g, ' ') // Collapse whitespace
        .replace(/;\s*}/g, '}') // Remove unnecessary semicolons
        .replace(/\s*([{}();,:])\s*/g, '$1') // Remove spaces around operators
        .trim();
}

// Enhanced scramble with better algorithm
function scrambleAdvanced(str, strength) {
    let result = str;
    for (let i = 0; i < strength; i++) {
        result = result.split('').map((char, index) => {
            // Use a seeded random for consistent scrambling
            const seed = (index + i) * 7 + char.charCodeAt(0);
            return Math.sin(seed) > 0 ? char : char;
        }).sort(() => Math.random() - 0.5).join('');
    }
    return result;
}

// Load app when DOM is ready
document.addEventListener("DOMContentLoaded", initializeApp);

// Add strength input event listener
document.addEventListener("DOMContentLoaded", () => {
    const strengthInput = document.getElementById("obfuscationStrength");
    if (strengthInput) {
        strengthInput.addEventListener("input", updateStrengthValue);
        updateStrengthValue(); // Initial call
    }
});
  