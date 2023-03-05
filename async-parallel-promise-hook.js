const { AsyncParallelHook } = require("./tapable");

const hook = new AsyncParallelHook(["name", "age"]);

hook.tapPromise("1", (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("1", name, age);
      resolve();
    }, 1000);
  });
});

hook.tapPromise("2", (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("2", name, age);
      resolve();
    }, 2000);
  });
});

hook.tapPromise("3", (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("3", name, age);
      resolve();
    }, 3000);
  });
});

hook.promise("逍遥", 18).then(() => {
  console.log("done");
});
