const { SyncHook } = require("./tapable");

const hook = new SyncHook(["name", "age"]);

hook.intercept({
  register: (tapInfo) => {
    console.log("register", tapInfo);
  },
  call: (...args) => {
    console.log("call", ...args);
  },
  tap: (...args) => {
    console.log("tap", ...args);
  },
});

hook.tap("1", (name, age) => {
  console.log("1", name, age);
});

hook.tap("2", (name, age) => {
  console.log("2", name, age);
});

hook.tap("3", (name, age) => {
  console.log("3", name, age);
});

hook.call("逍遥", 18);
