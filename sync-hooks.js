const { SyncHook } = require("./tapable");

const hook = new SyncHook(["name", "age"]);

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
