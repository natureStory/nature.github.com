# 事件循环中的宏任务微任务出栈入栈关系
烂大街的博客上的事件循环都讲的太浅显了，对于宏任务微任务的执行堆栈关系都没有讲清楚，下面这个例子将很深入很好的解释清楚。我这个例子看懂了，就根本不需要看那么多分析博客
#### event loop，先执行主线程，主线程执行完，再执行微任务，再执行宏任务，然后重复下去，这个例子有点复杂，可看分析：
[分析链接](https://stackoverflow.com/questions/58270410/how-to-understand-this-promise-execution-order)
######解释：微任务是在当前主线程中碰到的微任务加入，然后去执行。
```
setTimeout(_ => console.log(10));

new Promise(resolve => {
    resolve();
    console.log(1);
}).then(_ => {
    console.log(3);
    Promise.resolve().then(_ => {
        console.log(4);
    }).then(_ => {
        console.log(6);
        Promise.resolve().then(_ => {
            console.log(7);
        }).then(_=> {
            console.log(9);
        });
    }).then(_ => {
        console.log(8);
    });
}).then(_=> {
    console.log(5);
});

console.log(2);
```
进阶版：
######解释：微任务是在当前主线程中碰到的微任务加入，然后去执行。
```
new Promise(resolve => {
    resolve()
})
    .then(() => {
        new Promise(resolve => {
            resolve()
        })
            .then(() => {
                console.log(1)
            })
            .then(() => {
                console.log(2)
            })
            .then(() => {
                console.log(3.1)
            })
    })
    .then(() => {
        console.log(1.1)
        new Promise((resolve => {
            resolve()
        }))
            .then(() => {
                new Promise(resolve => {
                    resolve()
                })
                    .then(() => {
                        console.log(4)
                    })
                    .then(() => {
                        console.log(6)
                    })
            })
            .then(() => {
                console.log(5)
            })
    })
    .then(() => {
        console.log(3)
    })
console.log(0)
```
进阶版2：
######解释：加入return之后，promise需要递归获取最终的非promise的值，简单说就是要执行到最后一个resolve，具体原因牵扯到[promise的实现](https://www.jianshu.com/p/c633a22f9e8c)
。
```
new Promise(resolve => resolve())
  .then(() => {
    return new Promise(resolve => resolve())
      .then(() => console.log(1))
      .then(() => console.log(2))
      .then(() => console.log(3.1));
  })
  .then(() => {
    console.log(1.1);
    return new Promise((resolve => resolve()))
      .then(() => {
        return new Promise((resolve) => resolve())
          .then(() => console.log(4))
          .then(() => console.log(6))
      }).then(() => console.log(5))
  }).then(() => console.log(3))

console.log(0)
```
