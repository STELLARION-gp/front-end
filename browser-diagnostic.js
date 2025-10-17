// PASTE THIS IN BROWSER CONSOLE TO DIAGNOSE THE CHATBOT ISSUE
// Open Developer Tools (F12 or Cmd+Option+I) and paste this entire script

console.log("🔍 ========== CHATBOT DIAGNOSTIC TOOL ==========");

// 1. Check localStorage
console.log("\n📦 LocalStorage Check:");
const chatbotKeys = Object.keys(localStorage).filter(
  (key) =>
    key.toLowerCase().includes("chatbot") || key.toLowerCase().includes("astro")
);
console.log("Chatbot-related keys:", chatbotKeys);
chatbotKeys.forEach((key) => {
  console.log(`  ${key}:`, localStorage.getItem(key));
});

// 2. Check if input and button exist
console.log("\n🎯 DOM Element Check:");
const input = document.querySelector(".chatbot-input");
const button = document.querySelector(".send-btn");
console.log("Input element found:", !!input);
console.log("Button element found:", !!button);

if (input) {
  console.log("Input disabled:", input.disabled);
  console.log("Input value:", input.value);
  console.log("Input styles:", {
    pointerEvents: getComputedStyle(input).pointerEvents,
    opacity: getComputedStyle(input).opacity,
    display: getComputedStyle(input).display,
    visibility: getComputedStyle(input).visibility,
  });
}

if (button) {
  console.log("Button disabled:", button.disabled);
  console.log("Button styles:", {
    pointerEvents: getComputedStyle(button).pointerEvents,
    opacity: getComputedStyle(button).opacity,
    display: getComputedStyle(button).display,
    visibility: getComputedStyle(button).visibility,
  });
}

// 3. Check for debug indicator
console.log("\n⚠️ Debug Indicator Check:");
const debugIndicator = document.querySelector(".chatbot-debug");
console.log("Debug indicator found:", !!debugIndicator);
if (debugIndicator) {
  console.log("Debug indicator text:", debugIndicator.textContent);
}

// 4. Check React DevTools (if available)
console.log("\n⚛️ React State Check:");
console.log("To check React state, use React DevTools extension");
console.log("Look for 'Chatbot' component and check 'isLoading' hook value");

// 5. Provide fix commands
console.log("\n🔧 FIXES TO TRY:");
console.log("\n1️⃣ Clear localStorage and reload:");
console.log("   localStorage.clear(); location.reload();");

console.log("\n2️⃣ Clear only chatbot data:");
console.log(
  `   ${chatbotKeys
    .map((k) => `localStorage.removeItem('${k}')`)
    .join("; ")}; location.reload();`
);

console.log("\n3️⃣ Force enable input (temporary):");
console.log("   document.querySelector('.chatbot-input').disabled = false;");
console.log("   document.querySelector('.send-btn').disabled = false;");

console.log("\n4️⃣ Check for errors in Console tab");
console.log("   Look for red error messages above");

console.log("\n========================================");
console.log("📋 After running diagnostics, report back:");
console.log("   - Input disabled value (true/false)");
console.log("   - Any localStorage values shown");
console.log("   - Any red errors in console");
console.log("========================================\n");
