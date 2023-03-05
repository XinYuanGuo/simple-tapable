// 第一个参数是形参，第二个参数是函数体
let multiply = new Function("a,b", "return a*b");

// 等价于
let multiply2 = (a, b) => a * b;

console.log(multiply(2, 3));
console.log(multiply2(2, 3));
