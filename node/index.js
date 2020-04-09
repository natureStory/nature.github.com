const fs = require('fs');//引用文件系统模块
const showdown = require('../src/assets/js/showdown.min.js');

const config = {
    articlesPath: '../src/data/articles',
    articlesHtmlPath: '../src/pages',
    articleTemplatePath: './article-template.html',
    listDataPath: '../src/data/listData.json'
};
deleteHtml();
createHtmlAndData();

function deleteHtml() {
    const articleHtmls = fs.readdirSync(config.articlesHtmlPath)
        .filter(item => item.indexOf('page.html') > -1)
        .forEach(item => {
            fs.unlinkSync(`${config.articlesHtmlPath}/${item}`);
        });
}
function createHtmlAndData() {
    const articleDirs = fs.readdirSync(config.articlesPath);
    const listData = articleDirs.map(dir => {
        const article = fs.readFileSync(`${config.articlesPath}/${dir}/index.md`).toString();
        // console.log(fs.statSync(`${config.articlesPath}/${dir}/index.md`)); // 读取文件信息
        const converter = new showdown.Converter();
        let html = converter.makeHtml(article).split('\n');
        const articleTitle = delHtmlTag(html[0]);
        const content = delHtmlTag(html[1]);
        const articleTemplate = fs.readFileSync(config.articleTemplatePath).toString();
        const articleHtml = articleTemplate.replace('{{pageName}}', dir).replace('{{articleTitle}}', articleTitle);
        const writeStream = fs.createWriteStream(`${config.articlesHtmlPath}/${dir}.html`, {encoding:'utf8'});
        writeStream.write(articleHtml);
        writeStream.end();
        return {
            pageName: dir,
            time: dir.replace(/\./ig, '-').replace('page', ''),
            articleTitle,
            content
        };
    });
    listData.sort((a, b) => a.time - b.time).reverse();
    fs.writeFile(config.listDataPath,JSON.stringify(listData),'utf8',function(err){
        //如果err=null，表示文件使用成功，否则，表示希尔文件失败
        if(err)
            console.log('listData 写入错误，原因：'+err);
        else
            console.log('listData 数据写入成功！');
    })
}

function delHtmlTag(str){
    return str.replace(/<[^>]+>/g,"");  //正则去掉所有的html标记
}