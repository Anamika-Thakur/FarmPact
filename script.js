// Modal Functions for Booking Crops
function openBookingModal() {
    document.getElementById("bookingModal").style.display = "block";
}

function closeBookingModal() {
    document.getElementById("bookingModal").style.display = "none";
}

// Chat Functions
function openChat() {
    document.getElementById("chatBox").style.display = "block";
}

function closeChat() {
    document.getElementById("chatBox").style.display = "none";
}

// Firebase reference
var chatRef = firebase.database().ref('chats');

// Send message function
function sendMessage() {
    var message = document.getElementById("chatMessage").value;
    if (message.trim() !== "") {
        var chatContent = document.getElementById("chatContent");
        var newMessage = document.createElement("p");
        newMessage.textContent = "You: " + message;
        
        // Display the message in the chat window
        chatContent.appendChild(newMessage);
        chatContent.scrollTop = chatContent.scrollHeight;
        
        // Send message to Firebase
        sendMessageToFirebase(message);
        
        // Clear the input field
        document.getElementById("chatMessage").value = "";
    } else {
        console.log("Cannot send empty message");
    }
}

// Send message to Firebase
function sendMessageToFirebase(message) {
    const sender = "Farmer"; // Example sender, adjust dynamically in a real app
    chatRef.push().set({
        sender: sender,
        message: message
    }).then(() => {
        console.log('Message successfully sent to Firebase');
    }).catch((error) => {
        console.error('Error sending message to Firebase:', error);
    });
}

// Listen for new messages from Firebase and display in chat window
chatRef.on('child_added', function(snapshot) {
    const chatWindow = document.getElementById('chatContent');
    const messageData = snapshot.val();
    const newMessage = document.createElement('p');
    newMessage.textContent = messageData.sender + ": " + messageData.message;
    chatWindow.appendChild(newMessage);
    chatWindow.scrollTop = chatWindow.scrollHeight; // Auto scroll to bottom
});

// Book a Crop using Ethers.js
async function bookCrop() {
    const cropId = document.getElementById("cropId").value;
    const price = document.getElementById("cropPrice").value;

    if (cropId && price) {
        try {
            const contract = await connectToBlockchain();
            const transaction = await contract.bookCrop(cropId, {
                value: ethers.utils.parseEther(price)
            });
            await transaction.wait(); // Wait for confirmation
            alert('Crop booked successfully!');
            closeBookingModal(); // Close modal after booking
        } catch (error) {
            console.error("Error booking crop:", error);
            alert("Failed to book crop. Please try again.");
        }
    } else {
        alert("Please fill in both Crop ID and Price.");
    }
}

// Close Modal on Outside Click
window.onclick = function(event) {
    var modal = document.getElementById("bookingModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Connect to the Blockchain using Ethers.js
async function connectToBlockchain() {
    if (typeof window.ethereum !== 'undefined') {
        await ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        // Replace with your smart contract details
        const contractAddress = "0xYourContractAddress"; // Replace with your contract address
        const abi = [ /* Your Contract ABI */ ]; // Replace with your ABI

        const contract = new ethers.Contract(contractAddress, abi, signer);
        return contract;
    } else {
        alert('Please install MetaMask to interact with this feature.');
    }
}
