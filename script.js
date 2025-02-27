const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const darkModeToggle = document.getElementById("dark-mode-toggle");
const voiceBtn = document.getElementById("voice-btn");

// Memory to store previous messages
let chatMemory = [];

// Smart AI responses with time-aware logic
const smartResponses = {
    "hello|hi": ["Hi there! How can I assist you?", "Hello! Need any help?"],
    "how are you": ["I'm great! How about you?", "Doing well, thanks for asking!"],
    "what is your name": ["Call me BuzzBot!"],
    "bye|goodbye": ["Goodbye! Have a great day!", "See you soon!"],
    "thanks|thank you": ["You're welcome!", "Happy to help!"],
    "who made you": ["I was created by a developers like you.....Anish,Tushar & Kalpesh!"],
    "what is javascript": ["JavaScript (JS) is a programming language used to create interactive and dynamic content on websites.It is often called the brain of the web because it adds functionality to HTML and CSS."],
    "what is html": ["HTML (HyperText Markup Language) is the foundation of web pages. It provides the structure for web content using elements like headings, paragraphs, images, and links."],
    "what is css": ["CSS (Cascading Style Sheets) is a styling language used to make HTML pages beautiful and visually appealing."],
    "who are you": ["I'm your chatbot assistant!"],
    "tell me a joke":["Today, a man knocked on my door and asked for a small donation toward the local swimming pool. I gave him a glass of water."],
    "tell me a riddle":["The more you take, the more you leave behind. What am I?"],
    "answer|ans": ["You take footsteps and leave footprints."],
    "who is the prime minister of india": ["Shri Narendra Modi is the prime minister of India"],
};

// Function to generate smart responses with time-based greetings
function getSmartResponse(userText) {
    userText = userText.toLowerCase();

    let currentHour = new Date().getHours();

    // Check for time-aware greetings
if (userText.includes("good morning")) {
    return currentHour < 12 ? "Good morning! Have a wonderful day!" : "It's already past morning, but I hope your day is going well!";
}
if (userText.includes("good afternoon")) {
    return currentHour >= 12 && currentHour < 18 ? "Good afternoon! Hope you're having a great day!" : "It's not afternoon right now, but I hope your day is going well!";
}
if (userText.includes("good night")) {
    return currentHour >= 18 ? "Good night! Sleep well and take care!" : "It's not quite night yet, However, I trust you're having a good day so far!";
}
    // Open websites based on user command
    if (userText.includes("open youtube")) {
        window.open("https://www.youtube.com", "_blank");
        return "Opening YouTube...";
    }
    if (userText.includes("open google")) {
        window.open("https://www.google.com", "_blank");
        return "Opening Google...";
    }
    if (userText.includes("open facebook")) {
        window.open("https://www.facebook.com", "_blank");
        return "Opening Facebook...";
    }
    if (userText.includes("open gmail")) {
        window.open("https://mail.google.com", "_blank");
        return "Opening Gmail...";
    }
    if (userText.includes("open chatgpt")) {
        window.open("https://www.chatgpt.com", "_blank");
        return "Opening Chatgpt...";
    }
    if (userText.includes("open whatsapp")) {
        window.open("https://www.whatsapp.com", "_blank");
        return "Opening WhatsApp...";
    }
    //Search functionality
    let googleSearchMatch = userText.match(/search for (.+) on google/);
    if (googleSearchMatch) {
        let query = encodeURIComponent(googleSearchMatch[1]);
        window.open(`https://www.google.com/search?q=${query}`, "_blank");
        return `Searching Google for "${googleSearchMatch[1]}"...`;
    }

    let youtubeSearchMatch = userText.match(/search youtube for (.+)/);
    if (youtubeSearchMatch) {
        let query = encodeURIComponent(youtubeSearchMatch[1]);
        window.open(`https://www.youtube.com/results?search_query=${query}`, "_blank");
        return `Searching YouTube for "${youtubeSearchMatch[1]}"...`;
    }

    // Check predefined responses
    for (let pattern in smartResponses) {
        let regex = new RegExp(pattern);
        if (regex.test(userText)) {
            let replies = smartResponses[pattern];
            return replies[Math.floor(Math.random() * replies.length)];
        }
    }

    // Check for date, time, or day
    let dateTimeResponse = getDateTimeInfo(userText);
    if (dateTimeResponse) return dateTimeResponse;

    // Check for math expressions
    if (userText.match(/[\d+\-*/()]+/)) {
        return solveMathExpression(userText);
    }

    // Default response
    return "I'm not sure how to respond to that. Could you rephrase?";
}

// Function to get date, time, or day
function getDateTimeInfo(userText) {
    let now = new Date();
    if (userText.includes("time")) {
        return `The current time is ${now.toLocaleTimeString()}.`;
    }
    if (userText.includes("date")) {
        return `Today's date is ${now.toLocaleDateString()}.`;
    }
    if (userText.includes("day")) {
        return `Today is ${now.toLocaleDateString(undefined, { weekday: 'long' })}.`;
    }
    return null;
}

// Function to solve advanced math expressions
function solveMathExpression(userText) {
    try {
        let expression = userText.match(/[\d+\-*/(). ]+/g);
        if (expression) {
            let result = eval(expression[0]);
            return `The answer is ${result}.`;
        }
    } catch (error) {
        return "I couldn't solve that. Please enter a valid math expression.";
    }
    return null;
}

// Function to send a message
function sendMessage() {
    let userText = userInput.value.trim();
    if (userText === "") return;

    chatMemory.push({ role: "user", message: userText });

    displayMessage(userText, "user-message");

    let botMessage = document.createElement("div");
    botMessage.classList.add("bot-message");
    botMessage.textContent = "Typing...";
    chatBox.appendChild(botMessage);
    chatBox.scrollTop = chatBox.scrollHeight;

    setTimeout(() => {
        chatBox.removeChild(botMessage);
        let response = getSmartResponse(userText);

        chatMemory.push({ role: "bot", message: response });

        displayMessage(response, "bot-message");
        speak(response);
    }, 1000);

    userInput.value = "";
}

// Function to display messages in chat
function displayMessage(text, className) {
    let message = document.createElement("div");
    message.classList.add(className);
    message.textContent = text;
    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Dark Mode Toggle
darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

// Voice Input (Speech Recognition)
voiceBtn.addEventListener("click", () => {
    let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";

    recognition.onresult = function (event) {
        userInput.value = event.results[0][0].transcript;
        sendMessage();
    };

    recognition.start();
});

// Speak Bot Response
function speak(text) {
    let speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
}
// Send Message Button (Arrow Click)
const sendBtn = document.getElementById("send-btn");

sendBtn.addEventListener("click", () => {
    sendMessage();
});

// Send message on "Enter" key press
userInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});
