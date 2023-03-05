const Hook = require("./hook");
const HookCodeFactory = require("./hookCodeFactory");

class ASyncParallelHookCodeFactory extends HookCodeFactory {
  content(options) {
    // 串行调用函数
    return this.callTapsParallel(options);
  }
}

const factory = new ASyncParallelHookCodeFactory();

class AsyncParallelHook extends Hook {
  compile(options) {
    factory.setup(this, options);
    return factory.create(options);
  }
}

module.exports = AsyncParallelHook;
