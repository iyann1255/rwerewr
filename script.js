// script.js
document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    
    // Auto-resize textarea
    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });
    
    // Send message on Enter key (but allow Shift+Enter for new line)
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Send message on button click
    sendButton.addEventListener('click', sendMessage);
    
    function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;
        
        // Add user message to chat
        addMessage(message, 'user');
        userInput.value = '';
        userInput.style.height = 'auto';
        
        // Show loading indicator
        const loadingMessage = addMessage('<div class="loading"></div>', 'ai');
        
        // Send to API
        fetchAIResponse(message)
            .then(response => {
                // Remove loading message
                chatMessages.removeChild(loadingMessage);
                
                // Add AI response
                addMessage(response, 'ai');
            })
            .catch(error => {
                console.error('Error:', error);
                chatMessages.removeChild(loadingMessage);
                addMessage('Maaf, terjadi kesalahan saat memproses permintaan Anda.', 'ai');
            });
    }
    
    function addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        
        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        messageContent.innerHTML = `<p>${content}</p>`;
        
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        return messageDiv;
    }
    
    async function fetchAIResponse(message) {
        // Ganti API_KEY dengan API key Anda dari platform AI
        const API_KEY = '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';
        const API_URL = 'https://api.openai.com/v1/embeddings';
        
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: 'Anda adalah asisten AI yang ramah dan profesional. Anda menjawab dalam bahasa Indonesia dengan jelas dan ringkas.'
                        },
                        {
                            role: 'user',
                            content: message
                        }
                    ],
                    max_tokens: 500,
                    temperature: 0.7
                })
            });
            
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            
            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Error fetching AI response:', error);
            throw error;
        }
    }
});
