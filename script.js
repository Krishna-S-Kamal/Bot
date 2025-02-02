let apiKey = "AIzaSyCF4REJzu_uZb3c9K0CznVAZcuZrqnKRXQ";

document.addEventListener("DOMContentLoaded", loadChatHistory);

async function sendMessage() {
    let userInput = document.getElementById("user-input");
    let chatBox = document.getElementById("chat-box");
    let loadingSpinner = document.getElementById("loading-spinner");

    if (userInput.value.trim() === "") return;

    
    let userMessage = createMessageElement(userInput.value, "user");
    chatBox.appendChild(userMessage);
    saveMessage(userInput.value, "user");
    chatBox.scrollTop = chatBox.scrollHeight;


    loadingSpinner.style.display = "block";

    
    let botMessage = createMessageElement("Thinking...", "bot");
    chatBox.appendChild(botMessage);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        
        let responsePromise = fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: userInput.value }] }] })
        });

        let [response] = await Promise.all([responsePromise]); // Handle promise efficiently

        let data = await response.json();
        let botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Error: No response from Gemini.";

        botMessage.textContent = botReply;
        saveMessage(botReply, "bot");
    } catch (error) {
        console.error("Fetch error:", error);
        botMessage.textContent = "Error: Unable to fetch response.";
        saveMessage("Error: Unable to fetch response.", "bot");
    }

    
    loadingSpinner.style.display = "none";


    userInput.value = "";
}


function createMessageElement(text, sender) {
    let messageDiv = document.createElement("div");
    messageDiv.classList.add("chat-message", sender);
    messageDiv.textContent = text;
    return messageDiv;
}


function saveMessage(message, sender) {
    let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    chatHistory.push({ text: message, sender: sender });
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}


function loadChatHistory() {
    let chatBox = document.getElementById("chat-box");
    let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];

    chatHistory.forEach(msg => {
        let messageElement = createMessageElement(msg.text, msg.sender);
        chatBox.appendChild(messageElement);
    });

    chatBox.scrollTop = chatBox.scrollHeight;
}


function clearChat() {
    localStorage.removeItem("chatHistory");
    document.getElementById("chat-box").innerHTML = "";
}
