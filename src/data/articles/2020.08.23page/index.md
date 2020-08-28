# 表达式的语法解析与前端可视化

对于 Boolean 表达式，怎么进行语法解析，并用于前端可视化渲染呢？今天我来给大家分享一下

## 目标
1. 将 Boolean 表达式进行语法解析；
2. 将抽象语法树进行可视化渲染；

## 使用到的技术
jison

## 抽象后的 Boolean 表达式
A && B && ( C || D ) && ( E || F )

## 分享ppt
[分享.pptx](http://view.officeapps.live.com/op/view.aspx?src=https://naturestory.github.io/src/data/articles/2020.08.23page/1.pptx)

## 可视化后的结果
![image.png](./1.png)
