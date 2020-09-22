# 实现树型数据可视化，并能拖拽修改树结构

最近在看 react-smooth-dnd 官方用例的时候，发现官方的三层拖拽实现的太差劲了，bug 也很多，于是我改进了这个三层拖拽，并在三层拖拽的基础上实现了无限层级的拖拽。

## 主要插件以及插件 git 地址

[smooth-dnd-demo](https://kutlugsahin.github.io/smooth-dnd-demo/) 的 【Nested vertical sortable】页签

## 我实现的可无限嵌套拖拽的可视化数据 demo 的 git 地址

[无限嵌套拖拽](https://github.com/natureStory/react-smooth-study)

## 效果

图片我就不放出来了，需要动态操作，感兴趣的自己 clone 运行看效果

## 核心问题

存在以下几个比较难以处理的核心问题：

1. 官方例子是给每一层添加一个 onDrop 事件，因为每一层的拖拽操作都不一样。递归没法区分。

   解决思路：给拖拽事件加个参数————层级，再在拖拽事件中做不同处理。

1. 拖拽会触发两个事件，添加/删除。但是这两个时间返回的顺序并不一致。可能先删除，也可能先添加。

   解决思路

   1. 虽然可能先添加或者先删除，但是两者总会先后成对出现，如果先出现“添加/删除”，就先缓存起来，直至下个对应的事件出现，再归并处理。我称之为“物质的湮没”

1. 添加删除事件都是用 index 做下标，比如先添加后删除，添加的时候 index 是对的，如果再从后面删除，index 已经变了（+1）。

   解决思路

   1. 参考虚拟 DOM 的做法，不直接使用 index 去做删除，使用层级和 index，找到需要“添加”元素的父级和前个兄弟元素（可能为空，则为第一个），这样就可以准确插入了。

1. 叶子结点，非容器结点，如何将外部内容拖拽进去？

   解决思路

   1. 将叶子结点也处理成容器就好了，但是为了表现一致，和操作流畅，此处不好讲清楚，感兴趣的同学私下交流。

## 1. 介绍

react-smooth-dnd 是一个轻量的 DOM 拖拽插件，可以用极少的代码实现效果比较好的拖拽功能。但是官方虽然有[三层拖拽](https://github.com/kutlugsahin/smooth-dnd-demo/blob/master/src/demo/pages/nested-group.js)的例子，但是因为 bug 太多注释掉了。而且这种每多一层就要多写一层，实在繁琐。于是我写了一个无限嵌套的例子。

## 2. 最简单的例子

```js
import React, { Component } from "react";
import { Container, Draggable } from "react-smooth-dnd";
export default () => {
  const onDrop = () => {
    // do something with data
  };
  return (
    <div>
      <Container onDrop={onDrop}>
        <Draggable key={id}>
          {" "}
          <div>拖动区域</div>{" "}
        </Draggable>
      </Container>
    </div>
  );
};
```

## 3. 官方三层嵌套的例子

[三层拖拽](https://github.com/kutlugsahin/smooth-dnd-demo/blob/master/src/demo/pages/nested-group.js)

代码在上面链接，我就不贴出来了。由以上代码可以看出

1. 官方例子在每一层的拖动容器 Container 中都添加了事件 onDrop。每一层的 Container 中都会循环遍历生成 Draggable，并根据是否还有子项来确定渲染的 Draggable 中是否包含再进一层的 Container。
1. 这种实现，代码冗余且繁琐，而且只能有三层拖动，如果继续有四五六层，怎么办呢？
1. 官方例子没有解决刚才【核心问题】所说的

## 3. 无限嵌套的思路来源

就是使用递归去遍历我的树型数据，生成拖拽树，直到该项不存在子项了为止。但是叶子结点也要变成容器。

例如，存在以下格式的数据：

```json
[
  {
    "id": 1,
    "label": "111111111111111",
    "children": [
      {
        "id": 2,
        "label": "222222222222222222",
        "children": [
          {
            "id": 3,
            "label": "33333333333333",
            "children": []
          },
          {
            "id": 33,
            "label": "33-33333333333333",
            "children": []
          }
        ]
      },
      {
        "id": 22,
        "label": "2-222222222222222222",
        "children": [
          {
            "id": 32,
            "label": "3-33333333333333",
            "children": []
          }
        ]
      }
    ]
  },
  {
    "id": 4,
    "label": "4444444444444444",
    "children": [
      {
        "id": 5,
        "label": "5555555555555555",
        "children": [
          {
            "id": 6,
            "label": "66666666666666",
            "children": []
          }
        ]
      }
    ]
  },
  {
    "id": 7,
    "label": "777777777777",
    "children": []
  }
]
```

```js
export default () => {
  const createDataElement = (parent, list, deepNum = 0) => {
    return (
      <Container
        groupName="1"
        getChildPayload={(index) => list[index]}
        // 拖拽事件，包含事件本身 e，以及上级 parent 以及层级数 deepNum
        onDrop={(e) => containerOnDrop(e, parent, deepNum)}
        getGhostParent={() => document.body}
      >
        {list.map((item) => {
          if (!item.children?.length) {
            // 如果没有子项，就是叶子结点，但是也需要容器包裹
            return (
              <Draggable key={item.id}>
                <div className="draggable-item">
                  <Container
                    groupName="1"
                    getChildPayload={(index) => list[index]}
                    onDrop={(e) => containerOnDrop(e, item, deepNum + 1)}
                  >
                    {item.label}
                  </Container>
                </div>
              </Draggable>
            );
          } else {
            // item.children 还有 length 长度，说明应该继续递归
            return (
              <Draggable key={item.id}>
                <div
                  style={{
                    padding: "20px 20px",
                    marginTop: "2px",
                    marginBottom: "2px",
                    border: "1px solid rgba(0,0,0,.125)",
                    backgroundColor: "#fff",
                    cursor: "move",
                  }}
                >
                  <h4 style={{ textAlign: "center" }}>{item.label}</h4>
                  <div style={{ cursor: "default" }}>
                    {/* 此处递归循环 */}
                    {createDataElement(item, item.children, deepNum + 1)}
                  </div>
                </div>
              </Draggable>
            );
          }
        })}
      </Container>
    );
  };
  return <div className="App">{createDataElement(null, dataSource)}</div>;
};
```

## 4. 上面实现了显示，拖拽事件如下

1. 此处 e 事件会存在 removedIndex 和 addedIndex，两者可能同时存在，也可能一前一后出现。
1. 如果一前一后出现，则使用 lastImperfectDropE 缓存起来，直至等到下一个匹配操作出现。

```js
let lastImperfectDropE = { addedIndex: null, removedIndex: null };

const containerOnDrop = (e, parent, deepNum) => {
  const { removedIndex, addedIndex } = e;
  if (removedIndex !== null && addedIndex !== null) {
    lastImperfectDropE = {
      ...lastImperfectDropE,
      ...e,
      removedDeepNum: deepNum,
      removeParent: parent,
      addedDeepNum: deepNum,
      addParent: parent,
    };
  } else if (removedIndex !== null) {
    lastImperfectDropE = {
      ...lastImperfectDropE,
      ...e,
      addedIndex: lastImperfectDropE.addedIndex,
      removedDeepNum: deepNum,
      removeParent: parent,
    };
  } else if (addedIndex !== null) {
    lastImperfectDropE = {
      ...lastImperfectDropE,
      ...e,
      removedIndex: lastImperfectDropE.removedIndex,
      addedDeepNum: deepNum,
      addParent: parent,
    };
  }
  if (
    lastImperfectDropE.addedIndex !== null &&
    lastImperfectDropE.removedIndex !== null
  ) {
    // applyDrag 是数据处理函数
    setDataSource(applyDrag(dataSource, lastImperfectDropE));
    lastImperfectDropE = { addedIndex: null, removedIndex: null };
  }
};
```

## 5. 上面实现了显示，拖拽事件如下

此处比较简单，就是将原来的树计算了两遍，先删除元素(根据层级和 index)，再添加元素(根据层级和前个兄弟元素)。处理后的数据就是拖拽后的数据树了。

```js
const applyDrag = (arr, dragResult) => {
  const {
    removedIndex,
    removedDeepNum,
    removeParent,
    addedIndex,
    addedDeepNum,
    addParent,
    payload,
  } = dragResult;
  if (removedIndex === null && addedIndex === null) return arr;

  let result = [...arr];

  // 查找前个兄弟元素
  const targetBrother = findTargetBrother(
    arr,
    addParent,
    null,
    addedIndex,
    addedDeepNum
  );

  // 删除
  result = handleRemoveAndAdd({
    arr: result,
    currentDeepNum: 0,
    targetDeepNum: removedDeepNum,
    currentParent: null,
    targetParent: removeParent,
    target: payload,
    targetIndex: removedIndex,
    handleType: "sub",
  });
  // 添加
  result = handleRemoveAndAdd({
    arr: result,
    currentDeepNum: 0,
    targetDeepNum: addedDeepNum,
    currentParent: null,
    targetParent: addParent,
    target: payload,
    targetIndex: addedIndex,
    handleType: "add",
  });
  return result;
};
```

### 6. 查找前一个兄弟元素

根据目标元素的父级元素，以及层级和 index，查找到前一个兄弟元素。如果目标元素父级元素，则表明是顶层元素，直接返回 arr[targetIndex - 1] 即可。否则需要递归遍历查找，直至知道该元素的前兄弟元素。

```js
// todo: 这个代码仍有问题，操作元素仍然可能是之前或者之后
const findTargetBrother = (
  arr,
  targetParent,
  currentParent,
  targetIndex,
  targetDeepNum,
  currentDeepNum = 0
) => {
  if (targetParent) {
    if (targetDeepNum === currentDeepNum) {
      if (targetParent === currentParent) {
        return arr[targetIndex - 1];
      }
    } else {
      return arr
        .map((item) =>
          findTargetBrother(
            item.children || [],
            targetParent,
            item,
            targetIndex,
            targetDeepNum,
            currentDeepNum + 1
          )
        )
        .filter((item) => item)[0];
    }
  } else {
    // 没有 targetParent，则目标为第 0 层
    return arr[targetIndex - 1];
  }
};
```

### 7. 根据数据的目标层级、目标元素的父级元素、目标 index、操作类型 增删数据

根据数据的目标层级、目标元素的父级元素、目标 index、操作类型 进行数据的增删操作，此处也是递归操作。递归找到目标层级，找到目标元素的父级元素，找到目标 index，进行对应的操作。

```js
const handleRemoveAndAdd = ({
  arr,
  currentDeepNum,
  targetDeepNum,
  currentParent = {},
  targetParent,
  target,
  targetIndex,
  handleType,
}) => {
  if (currentDeepNum === targetDeepNum) {
    const tempArr = [...arr];
    switch (handleType) {
      case "add":
        if (targetParent?.id === currentParent?.id) {
          tempArr.splice(targetIndex, 0, target);
        }
        break;
      case "sub":
        if (targetParent?.id === currentParent?.id) {
          tempArr.splice(targetIndex, 1);
        }
        break;
      default:
    }
    return tempArr;
  } else {
    return arr.map((item) => {
      return {
        ...item,
        children: handleRemoveAndAdd({
          arr: item.children || [],
          currentDeepNum: currentDeepNum + 1,
          currentParent: item,
          targetParent,
          targetDeepNum,
          target,
          targetIndex,
          handleType,
        }),
      };
    });
  }
};
```

## 总结

1. 树型数据的可视化显示以及操作，需要使用大量的递归，对于技术有一定的要求
1. 修改官方的案例，实现更复杂的操作
1. 可以应用到其它方面，比如我上次分享的表达式可视化，可以与之结合做拖拽了
1. 下一期的工资单公式配置，也许有用武之地
