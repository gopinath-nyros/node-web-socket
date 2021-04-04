const users = [];

// addUser
const addUser = ({ id, username, room }) => {
  // clean the data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  //   validate the data
  if (!username || !room) {
    return {
      error: "username and room are required",
    };
  }

  // check for existing user
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  //   validate username
  if (existingUser) {
    return {
      error: "username is in use",
    };
  }

  //storing the user
  const user = { id, username, room };
  users.push(user);
  return { user };
};

// removeUser
const removeUser = (id) => {
  // find index which is a number
  const index = users.findIndex((user) => user.id === id);
  // we get either -1 (if no match) or greater than 1 (if match found)
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

// addUser({
//   id: 21,
//   username: "gopi",
//   room: "testing",
// });

// addUser({
//   id: 22,
//   username: "nivetha",
//   room: "testing",
// });

// addUser({
//   id: 11,
//   username: "gopi",
//   room: "erode",
// });
// console.log(users);

// getUser
const getUser = (id) => {
  return users.find((user) => user.id === id);
};

// const user = getUser(211);
// console.log(user);

// getUsersInRoom
const getUsersInRoom = (room) => {
  return users.filter((user) => user.room === room);
};

const userList = getUsersInRoom("erode");
console.log(userList);

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};
