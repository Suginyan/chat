// モジュール初期化
var fs = require("fs");// ファイル操作
var server = require("http").createServer(function(req, res) {// 以下，httpリクエストを受けた時の処理
	switch(req.url){
	case '/css/normalize.css':
		res.writeHead(200, {"Content-Type":"text/css"});// レスポンスヘッダ(404とかのやつ)
		var output = fs.readFileSync("./css/normalize.css", "utf-8");
		res.end(output);
		break;
	case '/css/style.css':
		res.writeHead(200, {"Content-Type":"text/css"});
		var output = fs.readFileSync("./css/style.css", "utf-8");
		res.end(output);
		break;
	case '/css/chat.css':
		res.writeHead(200, {"Content-Type":"text/css"});
		var output = fs.readFileSync("./css/chat.css", "utf-8");
		res.end(output);
		break;
	default:
		res.writeHead(200, {"Content-Type":"text/html"});
		var output = fs.readFileSync("./chatroom.html", "utf-8");
		res.end(output);
		break;
	}
}).listen(8080);
var io = require("socket.io").listen(server);

// ユーザ管理ハッシュ
var userHash = {};

// socket.ioのイベント定義
io.sockets.on("connection", function (socket) {

  // 接続開始カスタムイベント(入室しました)
  socket.on("connected", function (name) {
    var msg = name + "が入室しました";
    userHash[socket.id] = name;
    io.sockets.emit("publish", {value: msg});
  });

  // メッセージ送信カスタムイベント
  socket.on("publish", function (data) {
    io.sockets.emit("publish", {value:data.value});
  });

  // 接続終了組み込みイベント(退室しました)
  socket.on("disconnect", function () {
    if (userHash[socket.id]) {
      var msg = userHash[socket.id] + "が退出しました";
      delete userHash[socket.id];
      io.sockets.emit("publish", {value: msg});
    }
  });
});