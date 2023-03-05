class HookCodeFactory {
  setup(hookInstance, options) {
    hookInstance._x = options.taps.map((tapInfo) => tapInfo.fn);
  }

  init(options) {
    this.options = options;
  }

  args(config = {}) {
    const { before, after } = config;
    let allArgs = [...this.options.args];
    if (before) {
      allArgs = [before, ...allArgs];
    }
    if (after) {
      allArgs = [...allArgs, after];
    }
    if (allArgs.length) {
      return allArgs.join(",");
    }
    return "";
  }

  header() {
    let code = ``;
    code += `var _x = this._x;\n`;
    const interceptors = this.options.interceptors;
    if (interceptors.length) {
      code += `
      var _taps = this.taps;
      var _interceptors = this.interceptors;
      `;
      interceptors.forEach((interceptor, index) => {
        if (interceptor.call) {
          code += `_interceptors[${index}].call(${this.args()});\n`;
        }
      });
    }
    return code;
  }

  create(options) {
    this.init(options);
    let fn;
    /**
     * 根据函数类型去动态创建
     * 函数体分为header和content
     * header每个函数都一样，content需要由子类型自己去实现
     */
    switch (this.options.type) {
      case "sync":
        fn = new Function(this.args(), this.header() + this.content());
        break;
      case "async":
        fn = new Function(
          this.args({
            after: "_callback",
          }),
          this.header() +
            this.content({
              onDone: () => "_callback()",
            })
        );
        break;
      case "promise":
        let tapsContent = this.content({
          onDone: () => "_resolve()",
        });
        let content = `return new Promise(function(_resolve,_reject){
          ${tapsContent}
        })`;
        fn = new Function(this.args(), this.header() + content);
        break;
    }
    this.deInit();
    return fn;
  }

  // 串行回调
  callTapsSeries() {
    let code = ``;
    for (let i = 0; i < this.options.taps.length; i++) {
      const tapContent = this.callTap(i);
      code += tapContent;
    }
    return code;
  }

  // 并行回调
  callTapsParallel({ onDone }) {
    let code = ``;
    code += `var _counter = ${this.options.taps.length}\n`;
    code += `
    var _done = function(){
      ${onDone()}
    }
    `;
    for (let i = 0; i < this.options.taps.length; i++) {
      const tapContent = this.callTap(i, {
        onDone: () => `if(--_counter === 0) _done();`,
      });
      code += tapContent;
    }
    return code;
  }

  callTap(tapIndex, options = {}) {
    const { onDone } = options;
    let code = ``;
    const interceptors = this.options.interceptors;
    if (interceptors.length) {
      code += `var tap${tapIndex} = _taps[${tapIndex}]\n`;
      interceptors.forEach((interceptor, index) => {
        if (interceptor.tap) {
          code += `_interceptors[${index}].tap(_taps[${tapIndex}]);\n`;
        }
      });
    }
    code += `var _fn${tapIndex} = _x[${tapIndex}];\n`;
    let tapInfo = this.options.taps[tapIndex];
    switch (tapInfo.type) {
      case "sync":
        code += `_fn${tapIndex}(${this.args()});\n`;
        if (onDone) code += onDone();
        break;
      case "async":
        code += `
        _fn${tapIndex}(${this.args()}, function(){
          if(--_counter === 0) _done();
        });\n
        `;
        break;
      case "promise":
        code += `
        var _promise${tapIndex} = _fn${tapIndex}(${this.args()});
        _promise${tapIndex}.then(function(){
          if(--_counter === 0) _done();
        })
        `;
    }
    return code;
  }

  deInit() {
    this.options = null;
  }
}

module.exports = HookCodeFactory;
