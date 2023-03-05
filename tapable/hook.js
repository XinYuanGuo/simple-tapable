class Hook {
  constructor(args) {
    // 形参列表
    this.args = Array.isArray(args) ? args : [args];
    // 存放的回调函数
    this.taps = [];
    // 代理的call方法，调用后会动态生成函数
    this.call = CALL_DELEGATE;
    this.callAsync = CALL_ASYNC_DELEGATE;
    this.promise = PROMISE_DELEGATE;
  }

  tap(options, fn) {
    // tap注册的回调类型就是同步的
    this._tap("sync", options, fn);
  }

  tapAsync(options, fn) {
    this._tap("async", options, fn);
  }

  tapPromise(options, fn) {
    this._tap("promise", options, fn);
  }

  _tap(type, options, fn) {
    if (typeof options === "string") {
      options = {
        name: options,
      };
    }
    const tapInfo = { ...options, type, fn };
    this._insert(tapInfo);
  }

  _insert(tapInfo) {
    this.taps.push(tapInfo);
  }

  _createCall(type) {
    // 每种hook 执行编译的方式不同，需要由子类型自己去实现compile方法
    return this.compile({
      taps: this.taps,
      args: this.args,
      type,
    });
  }
}

/**
 * 动态编译
 * 不能用箭头函数 this会出问题
 * 只有当调用的时候才会执行，替换掉代理的call方法
 * 第一次执行会比较慢，动态去创建function
 * 多次调用时就不需要重新编译了
 */

const CALL_DELEGATE = function (...args) {
  // 动态创建一个sync类型的call方法
  this.call = this._createCall("sync");
  return this.call(...args);
};

const CALL_ASYNC_DELEGATE = function (...args) {
  this.callAsync = this._createCall("async");
  return this.callAsync(...args);
};

const PROMISE_DELEGATE = function (...args) {
  this.promise = this._createCall("promise");
  return this.promise(...args);
};

module.exports = Hook;
