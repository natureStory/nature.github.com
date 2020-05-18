# 最近工作中的心得记录

最近没时间去学习什么新技术，接下来呢，想去研究一下语法分析相关的算法的东西，但那是后话了。我就把最近工作中一些经验的东西，做个小结吧

## react hooks 的 useCallback/useEffect 的依赖问题

之前有做过一个 Form 组件，进入之后，如果有默认值设置，则调用 form.setFieldsValue() 赋值，结果陷入了死循环，主要代码如下：

```js
const Form = (defaultValues) => {
  useEffect(() => {
    if (defaultValues) {
      form.setFieldsValue(defaultValues);
    }
  }, [defaultValues, form]);

  ......
};
```

### 原因分析：

useEffect 依赖了 form, 首次进入组件后， form.setFieldsValue 更改表单值，表单值变化引起 form 变化，form 变化导致再次调用 useEffect，因此陷入了无限循环。我之前认为 form.setFieldsValue 并不会引起 form 变化，但是我通过反复打印并比较两者，发现并非同一个 form。但是有个有趣的点，form 即使变化了，你使用了旧的 form 去调用 setFieldsValue，仍然可以取到正确的值。

### 解决方案：

把依赖里的 form 去掉就好了

## react hooks 里的防抖

不要使用 useState 记录 timer，而要使用 useRef

### 原因分析：
原因很简单，但是如果没有采坑过很容易理所当然。使用 useState 记录 timer，组件更新之后的 timer 都将被重置，从而无法实现防抖。而 useRef 将会始终如一

## antd 的 datePicker 的 mode=“year/month” 后功能失效的问题

### 原因分析：

antd 的问题。antd 设计的 mode=“year/month” 仅仅是一个展示的变化，并非功能的变化。虽然时间选择器由按天变成了按月/年，但是选中事件仍然必须是点击日期后触发选中事件，所以失效了。

### 问题的复现：

[https://codesandbox.io/s/dank-brook-v1csy](https://codesandbox.io/s/dank-brook-v1csy)

### 问题的解决：

1. 使用 面板变化的属性而非 onChange 属性，就可以触发。还有其它坑点，参考如下博客： [https://juejin.im/post/5cf65c366fb9a07eca6968f9](https://juejin.im/post/5cf65c366fb9a07eca6968f9)
2. 升级 antd4.x^。新的 antd 已经解决，

## 组件设计经验

我们在写组件的时候，一个函数在声明之后，往往在多处被调用多次，管理起来也比较混乱。经典的场景就是有个请求列表的函数，我们在搜索条件、页码等其它条件发生变化后需要重新请求。

### 设计思路：

我们可以把搜索参数、页码等当做条件，获取列表数据当做结果。也就是条件改变后重新计算结果。既然使用了 react————响应式编程，就不应该再面向过程编程了。

### 具体实现：
将 搜索参数、页码等作为 useEffect 里数据请求的依赖，变更后自动调用 useEffect 的数据请求