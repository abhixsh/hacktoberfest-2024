function obfuscateCode() {
    const inputCode = document.getElementById("inputCode").value;
    const obfuscationType = document.getElementById("obfuscationType").value;
    const strength = parseInt(document.getElementById("obfuscationStrength").value);
    let obfuscatedCode;
  
    switch (obfuscationType) {
      case "base64":
        obfuscatedCode = btoa(inputCode);
        break;
      case "rot13":
        obfuscatedCode = rot13(inputCode);
        break;
      case "scramble":
        obfuscatedCode = scramble(inputCode, strength);
        break;
      default:
        obfuscatedCode = inputCode;
    }
  
    document.getElementById("outputCode").value = obfuscatedCode;
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
  
  function copyCode() {
    const outputCode = document.getElementById("outputCode");
    outputCode.select();
    document.execCommand("copy");
  
    const copyButton = document.getElementById("copyButton");
    copyButton.innerText = "Copied!";
    setTimeout(() => copyButton.innerText = "Copy Code", 2000);
  }
  
  function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    const themeIcon = document.getElementById("themeIcon");
    themeIcon.textContent = document.body.classList.contains("dark-mode") ? "🌙" : "☀️";
  }
  