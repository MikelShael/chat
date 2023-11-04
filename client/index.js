// index.js
const socket = io("http://192.168.50.4:3000");
const form = document.getElementById("form");
const input = document.getElementById("input");

let clientId = localStorage.getItem("clientId");

console.log(clientId);
socket.emit("setClientId", clientId);

// When a chat message is received, append it to the list
socket.on("chat message", function (msg, id) {
  appendMessage(msg, id);
});

socket.on("client id", function (id) {
  localStorage.setItem("clientId", id);
  document.getElementById("client-id").textContent = `Your ID: ${id}`;
});

socket.on("chatHistory", function (chatHistory) {
  for (message of chatHistory) {
    appendMessage(message.msg, message.id);
  }
});

// When the form is submitted, send the input value to the server
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const input = document.getElementById("input");
  if (input.value) {
    socket.emit("chat message", input.value, clientId);
    input.value = "";
  }
});
input.addEventListener("keypress", function (e) {
  if (e.value === "Enter") {
    form.dispatchEvent(new Event("submit", { cancelable: true }));
  }
});

function appendMessage(msg, id) {
  const li = document.createElement("li");
  console.log("new message:");
  console.log(`Client_id: ${clientId}, message_id: ${id}`);
  if (clientId === id) {
    li.classList.add("mymessages");
  } else {
    li.classList.add("othermessages");
  }

  li.textContent = msg;
  document.getElementById("messages").appendChild(li);

  const messages = document.getElementById("messages");
  messages.scrollTop = messages.scrollHeight;
}
