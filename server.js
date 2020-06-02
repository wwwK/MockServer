let express = require('express');
let morgan = require('morgan');
let fs = require('fs');
let Mock = require('mockjs');
let bodyParser = require('body-parser');
const app = express();

const PORT = process.env.APP_PORT || 9999;


app.use(bodyParser.json()); //body-parser 解析json格式数据
app.use(bodyParser.urlencoded({ //此项必须在 bodyParser.json 下面,为参数编码
	extended: true
}));

app.use(morgan("dev"));

/*readdir读取目录下所有文件*/
fs.readdir('./mock', function (err, files) {
	if (err) {
		console.log(err);
	} else {
		/*成功读取文件，取得文件名，拼接生成对应action，监听对应接口并返回对应文件数据*/
		files.forEach(function (v, i) {
			app.all(`/${v.replace(/json/, 'action')}`, function (req, res) {
				fs.readFile(`./mock/${v}`, 'utf-8', function (err, data) {
					if (err) {
						console.log(err);
					} else {
						res.json(Mock.mock(JSON.parse(data)));
					}
				})
			})
		})
	}
})

/*为app添加中间件处理跨域请求*/
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

app.listen(PORT, () => {
	console.log(`listening on port! ${PORT}`);
});

//localhost:9999/user.action