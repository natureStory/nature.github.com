# scss 嵌套语法模板解析

在使用scss的时候，我在思考scss的语法解析规则，尤其嵌套语法如何编译成常规的css，我就本着好奇去百度了一下，结果没有找到这方面比较好的资料，那好吧，我就发挥脑洞，简单思考一下如何手写一个scss嵌套语法解析。

先看一段示例样式：
```scss
// 我们的scss样例

#header {
    width: 100%;
    height: 200px;
    .nav ul.active {
        height: 100px
        display: flex
        li {
            flex: 1
            color: gray
            &:hover {
                color: #fff;
            }
            span a {
                background: gray;
            }
            &:hover span a {
                background: red;
            }
        }
    }
    .icon {position: absolute; top: 0;left: 0;}
}
```
## 1. 先思考我们想要何种格式的解析对象
1. 判断嵌套层级关系，在于选择器上下文，也就是选择器和“{”、“}”
1. 据此，可以让选择器与“{”在一行，每条css语法在一行，“}”在一行
目标数据结构格式：
```js
[
  '#header {',
  'width: 100%',
  'height: 200px',
  '.nav ul.active {',
  'height: 100px',
  'display: flex',
  'li {',
  'flex: 1',
  'color: gray',
  '&:hover {',
  'color: #fff',
  '}',
  'span a {',
  'background: gray',
  '}',
  '&:hover span a {',
  'background: red',
  '}',
  '}',
  '}',
  '.icon {',
  'position: absolute',
  ' top: 0',
  'left: 0',
  '}',
  '}'
 ]
```
因此定义如下处理函数：
```js
function formatData(str) {
    return str
        .replace(/(\{)(\n)*/g, '{\n')  // 处理 “{” 统一为 “{”带一个换行
        .replace(/(\})(\n)*/g, '\n}\n')  // 处理 “}” 统一为 “}”前后带一个换行
        .replace(/( )( )+/g, '')    // 处理多空格为一个空格
        .replace(/(\n)+/g, '\n')  // 处理多个换行为一个换行
        .trim()    // 处理前后空白
        .split(/;\n|;|\n/);    // 按照 '\n'、';\n'、';' 三种方式拆解
}
```
将得到上述格式字符串数组。
## 2. 接下来很明显就是循环解析了。因为嵌套scss有层级的关系，我就采用栈的结构，碰到一个选择器入栈一个，碰到一个反花括号“}”出栈一个，因此：
```js
function babelScss(arr) {
    var selectors = [];    // 存储选择器
    return (arr.map(item => {
        if(/\{/.test(item)) {    // 碰到“{”，则入栈一个选择器，并去掉“{”
            selectors.push(item.slice(0, -1));
            const needSplit = selectors.length > 1 ? '}' : '';    // 如果不是首个选择器，需要加一个“}”来结束之前的选择器上下文
            return needSplit + selectors.join(' ') + '{'
        }
        if(/\}/.test(item)) {    // 碰到“}”，则出栈一个选择器
            selectors.pop();
            return ''
        }
        return item + ';';    // 其他的为css样式，则直接加入分号入栈
    })
      .join('') + '}')    // 最终拼接成字符串，并拼接一个“}”结束
      .replace(/( )*\&/g, '')    // 去掉“&”父选择器
      .replace(/( )+/g, ' ');    // 合并多空格，格式化
}
```
## 3. 思考：如果需要解析函数，extend继承，变量等，如何改进？
这方面我没有做，但我还是思考了如何实现。其实很简单，作用于仍然借助于栈的结构，只不过存储的单位不再是单层的选择器，而是包括当前层选择器、当前层变量、当前层函数模板或者函数等，然后在babelScss函数中对应语法结构用正则加入相应解析，或变量或函数的查找从当前层依次往上遍历即可。
[完整代码：https://github.com/natureStory/simplescssbabel](https://github.com/natureStory/simplescssbabel)

这是一年多前闲来无事做着玩的，下一期，我将使用语法解析来完成这件事，敬请期待~