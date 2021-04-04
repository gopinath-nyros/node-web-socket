// connect the client to the server
const socket = io();
// elements
const messageForm = document.getElementById("messageForm");
const messageFormInput = messageForm.querySelector("input");
const messageFormBtn = messageForm.querySelector("button");
const locationBtn = document.getElementById("sendLocation");
const messages = document.getElementById("messages");

// templates
const messageTemplate = document.getElementById("message-template").innerHTML;
const locationmessageTemplate = document.getElementById(
  "location-message-template"
).innerHTML;
const sideBarTemplate = document.querySelector("#sidebar-template").innerHTML;

// options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// Auto Scroll
const autoScroll = () => {
  // new message
  const $newMessage = messages.lastElementChild;

  // height of new message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;
  console.log(newMessageMargin);

  // visible height
  const visibleHeight = messages.offsetHeight;
  // height for message container
  const containerHeight = messages.scrollHeight;

  // how far have i scrolled
  const scrollOffset = messages.scrollTop + visibleHeight;

  // logic to scroll to bottom
  if (containerHeight - newMessageHeight <= scrollOffset) {
    messages.scrollTop = messages.scrollHeight;
  }
};

socket.on("message", (greet) => {
  console.log(greet);
  const html = Mustache.render(messageTemplate, {
    username: greet.username,
    message: greet.text,
    createdAt: moment(greet.createdAt).format("h:mm a"),
  });
  messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

// for location
socket.on("locationMessage", (message) => {
  console.log(message);
  const html = Mustache.render(locationmessageTemplate, {
    username: message.username,
    url: message.url,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

socket.on("roomData", ({ room, users }) => {
  console.log(room);
  console.log(users);
  const html = Mustache.render(sideBarTemplate, {
    room,
    users,
  });
  document.querySelector("#sidebar").innerHTML = html;
});

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // disable
  messageFormBtn.setAttribute("disabled", "disabled");
  const message = e.target.elements.message.value;
  socket.emit("sendMessage", message, (error) => {
    // enable btn
    messageFormBtn.removeAttribute("disabled");
    messageFormInput.value = "";
    messageFormInput.focus();
    if (error) {
      return console.log(error);
    }
    console.log("message delivered");
  });
});

// event listener for sending location

locationBtn.addEventListener("click", () => {
  // disable
  if (!navigator.geolocation) {
    return alert("geolocation navigator is not supported by ur browser");
  }
  locationBtn.setAttribute("disabled", "disabled");
  navigator.geolocation.getCurrentPosition((position) => {
    // console.log(position);
    const geolocation = {
      lat: position.coords.latitude,
      long: position.coords.longitude,
    };
    // acknowledge for location sharing
    socket.emit("sendGeoLocation", geolocation, () => {
      locationBtn.removeAttribute("disabled");
      console.log("location shared");
    });
  });
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
