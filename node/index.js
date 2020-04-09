const fs = require('fs');//引用文件系统模块
const path = '../src/data/articles';

const articleDirs = fs.readdirSync(path);
console.log(articleDirs.map(dir => {
    const obj = {}; //定义一个对象存放文件的路径和名字
    obj.path = path; //路径
    obj.filename = dir; //名字
    debugger
    return {
        "pageName": dir,
        "articleTitle": "解决 本地调试代码不发送 cookie的问题【重复登录失效】",
        "time": "2020-3-17",
        "content": "问题描述：昨天升级系统后，打开谷歌，登录本地项目调试(采用代理的方式访问后端测试接口)，发现一直登录不上去，报登录失效没有权限，记录了一下问题的查找和解决思路。"
    };
}));