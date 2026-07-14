module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
    'node': true
  },

  'extends': [
    'eslint:recommended', // 使用 ESLint 推荐规则
    'plugin:vue/essential' // 使用 Vue 插件的基础规则
  ],

  // 解析器选项配置
  'parserOptions': {
    'ecmaVersion': 12, // 使用 ES2021 语法（ECMAScript 12）
    'sourceType': 'module', // 使用 ES6 模块系统
    'parser': '@babel/eslint-parser', // 使用 Babel 解析器来解析代码
    'requireConfigFile': false // 不需要 Babel 配置文件
  },

  // 使用的插件
  'plugins': [
    'vue' // Vue.js 插件，用于检查 Vue 文件
  ],

  // 自定义规则配置
  'rules': {
    // Vue 相关规则
    // 关闭单文件组件名必须多词的限制（允许使用单词组件名如 <Header>）
    'vue/multi-word-component-names': 'off',

    // HTML 模板缩进规则：使用 2 个空格缩进
    'vue/html-indent': ['error', 2, {
      'attribute': 1, // 属性相对于标签缩进 1 级
      'baseIndent': 1, // 基础缩进级别为 1
      'closeBracket': 0, // 闭合标签不额外缩进
      'alignAttributesVertically': true, // 垂直对齐多个属性
      'ignores': [] // 没有忽略的元素
    }],

    // 每行最大属性数量限制
    'vue/max-attributes-per-line': ['error', {
      'singleline': {
        'max': 3 // 单行最多 3 个属性
      },
      'multiline': {
        'max': 1 // 多行时每行最多 1 个属性
      }
    }],

    // HTML 闭合标签的间距规则
    'vue/html-closing-bracket-spacing': ['error', {
      'startTag': 'never', // 开始标签的闭合括号前不允许空格
      'endTag': 'never', // 结束标签的闭合括号前不允许空格
      'selfClosingTag': 'always' // 自闭合标签的闭合括号前必须有空格
    }],

    // HTML 闭合标签的换行规则
    'vue/html-closing-bracket-newline': 'off',

    // 关闭单行 HTML 元素内容换行要求
    'vue/singleline-html-element-content-newline': 'off',

    // 关闭多行 HTML 元素内容换行要求
    'vue/multiline-html-element-content-newline': 'off',

    // Vue script 标签中的代码缩进：使用 2 个空格
    'vue/script-indent': ['error', 2, {
      'baseIndent': 0, // 基础缩进为 0（相对于 script 标签）
      'switchCase': 1, // switch 语句的 case 子句额外缩进 1 级
      'ignores': [] // 没有忽略的节点
    }],

    // 缩进规则

    // 代码缩进规则：使用 2 个空格
    'indent': ['error', 2, {
      'SwitchCase': 1, // switch 语句的 case 子句额外缩进 1 级
      'VariableDeclarator': 1, // 变量声明时，变量名相对于类型额外缩进 1 级
      'outerIIFEBody': 1, // 立即执行函数表达式（IIFE）的 body 额外缩进 1 级
      'MemberExpression': 1, // 成员表达式的属性额外缩进 1 级
      'FunctionDeclaration': {
        'parameters': 1, // 函数参数的缩进级别
        'body': 1 // 函数体的缩进级别
      },
      'FunctionExpression': {
        'parameters': 1, // 函数表达式的参数缩进级别
        'body': 1 // 函数表达式的函数体缩进级别
      },
      'CallExpression': {
        'arguments': 1 // 函数调用参数的缩进级别
      },
      'ArrayExpression': 1, // 数组元素的缩进级别
      'ObjectExpression': 1, // 对象属性的缩进级别
      'ImportDeclaration': 1, // import 语句的缩进级别
      'flatTernaryExpressions': false, // 不允许扁平的三元表达式
      'ignoreComments': false // 不忽略注释的缩进
    }],

    // ==================== 引号规则 ====================

    // 字符串必须使用单引号
    'quotes': ['error', 'single', {
      'avoidEscape': true, // 允许在字符串中使用转义字符来避免引号冲突
      'allowTemplateLiterals': true // 允许使用模板字符串（反引号）
    }],

    // ==================== 分号规则 ====================

    // 语句末尾必须使用分号
    'semi': ['error', 'always'],

    // ==================== 空格规则 ====================

    // 函数名和括号之间的空格规则
    'space-before-function-paren': ['error', {
      'anonymous': 'always', // 匿名函数名后必须有空格：function () {}
      'named': 'never', // 命名函数名后不能有空格：function name() {}
      'asyncArrow': 'always' // async 箭头函数后必须有空格：async () => {}
    }],

    // 对象大括号内必须有空格：{ foo: bar } 而不是 {foo: bar}
    'object-curly-spacing': ['error', 'always'],

    // 数组方括号内不能有空格：[1, 2] 而不是 [ 1, 2 ]
    'array-bracket-spacing': ['error', 'never'],

    // 计算属性方括号内不能有空格：obj[key] 而不是 obj[ key ]
    'computed-property-spacing': ['error', 'never'],

    // 关键字前后的空格规则
    'keyword-spacing': ['error', {
      'before': true, // 关键字前必须有空格
      'after': true // 关键字后必须有空格
    }],

    // 中缀运算符前后必须有空格：a + b 而不是 a+b
    'space-infix-ops': 'error',

    // 代码块前必须有空格：if () {} 而不是 if (){}
    'space-before-blocks': 'error',

    // 圆括号内不能有空格：foo(bar) 而不是 foo( bar )
    'space-in-parens': ['error', 'never'],

    // 注释前后必须有空格
    'spaced-comment': ['error', 'always', {
      'line': {
        'markers': ['/'], // 行注释标记
        'exceptions': ['-', '+'] // 允许的例外字符（如 //- 或 //+）
      },
      'block': {
        'markers': ['!'], // 块注释标记
        'exceptions': ['*'], // 允许的例外字符
        'balanced': true // 要求块注释平衡（开始和结束标记匹配）
      }
    }],

    // 逗号前后的空格规则
    'comma-spacing': ['error', {
      'before': false, // 逗号前不能有空格
      'after': true // 逗号后必须有空格
    }],

    // 对象键值对中冒号前后的空格规则
    'key-spacing': ['error', {
      'beforeColon': false, // 冒号前不能有空格
      'afterColon': true // 冒号后必须有空格
    }],

    // 一元运算符的空格规则
    'space-unary-ops': ['error', {
      'words': true, // 单词类一元运算符（如 new、typeof）后必须有空格
      'nonwords': false // 非单词类一元运算符（如 ++、--）前后不能有空格
    }],

    // 大括号风格：使用 1tbs（One True Brace Style），即左大括号不换行
    'brace-style': ['error', '1tbs', {
      'allowSingleLine': true // 允许单行的大括号：if (x) { return; }
    }],

    // 禁止尾随逗号（数组、对象、import、export、函数参数末尾不能有逗号）
    'comma-dangle': ['error', {
      'arrays': 'never', // 数组末尾不能有逗号
      'objects': 'never', // 对象末尾不能有逗号
      'imports': 'never', // import 语句末尾不能有逗号
      'exports': 'never', // export 语句末尾不能有逗号
      'functions': 'never' // 函数参数末尾不能有逗号
    }],

    // 箭头函数的箭头前后必须有空格：() => {} 而不是 ()=>{}
    'arrow-spacing': ['error', {
      'before': true, // 箭头前必须有空格
      'after': true // 箭头后必须有空格
    }],

    // 代码块大括号内必须有空格：{ foo } 而不是 {foo}
    'block-spacing': ['error', 'always'],

    // 函数调用时函数名和括号之间不能有空格：foo() 而不是 foo ()
    'func-call-spacing': ['error', 'never'],

    // 禁止行尾空格
    'no-trailing-spaces': ['error', {
      'skipBlankLines': false, // 不跳过空行
      'ignoreComments': false // 不忽略注释中的尾随空格
    }],

    // 限制连续空行的数量
    'no-multiple-empty-lines': ['error', {
      'max': 1, // 最多允许 1 个连续空行
      'maxEOF': 0, // 文件末尾不允许空行
      'maxBOF': 0 // 文件开头不允许空行
    }],

    // 文件末尾必须有换行符
    'eol-last': ['error', 'always'],

    // ==================== 其他代码质量规则 ====================

    // debugger 语句警告（允许使用但会警告）
    'no-debugger': 'warn',

    // 未使用的变量警告
    'no-unused-vars': ['error', {
      'argsIgnorePattern': '^_', // 以下划线开头的参数名会被忽略（如 _unused）
      'varsIgnorePattern': '^_' // 以下划线开头的变量名会被忽略
    }],

    // 禁止多个连续空格（除了缩进和字符串）
    'no-multi-spaces': 'error',

    // 禁止属性访问前有空格：obj.prop 而不是 obj .prop
    'no-whitespace-before-property': 'error',

    // 代码块内不允许空行填充：不允许 { } 这样的格式
    'padded-blocks': ['error', 'never'],

    'padding-line-between-statements': 'off',

    // 关闭空格和tab混合使用
    'no-mixed-spaces-and-tabs': 'off'
  }
};
