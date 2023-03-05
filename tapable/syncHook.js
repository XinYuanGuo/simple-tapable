const Hook = require("./hook");
const HookCodeFactory = require("./hookCodeFactory");

class SyncHookCodeFactory extends HookCodeFactory {
  content() {
    // 串行调用函数
    return this.callTapsSeries();
  }
}

const factory = new SyncHookCodeFactory();

class SyncHook extends Hook {
  compile(options) {
    factory.setup(this, options);
    return factory.create(options);
  }
}

module.exports = SyncHook;
