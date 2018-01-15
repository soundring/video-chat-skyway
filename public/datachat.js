var conn;     // データ通信用connectionオブジェクトの保存用変数 
 
// SkyWayのシグナリングサーバーへ接続する  (APIキーを置き換える必要あり）
var peer = new Peer({ key: 'YourApiKey', debug: 3});
 
// シグナリングサーバへの接続が確立したときに、このopenイベントが呼ばれる
peer.on('open', function(){
    // 自分のIDを表示する
    // - 自分のIDはpeerオブジェクトのidプロパティに存在する
    // - 相手はこのIDを指定することで、通信を開始することが出来る
    $('#my-id').text(peer.id);
});
 
// 相手からデータ通信の接続要求イベントが来た場合、このconnectionイベントが呼ばれる
// - 渡されるconnectionオブジェクトを操作することで、データ通信が可能
peer.on('connection', function(connection){
  　
    // データ通信用に connectionオブジェクトを保存しておく
    conn = connection;
 
    // 接続が完了した場合のイベントの設定
    conn.on("open", function() {
        // 相手のIDを表示する
        // - 相手のIDはconnectionオブジェクトのidプロパティに存在する
        $("#peer-id").text(conn.id);
    });
 
    // メッセージ受信イベントの設定
    conn.on("data", onRecvMessage);
});
 
// メッセージ受信イベントの設定
function onRecvMessage(data) {
    // 画面に受信したメッセージを表示
    $("#messages").append($("<p>").text(conn.id + ": " + data).css("font-weight", "bold"));
}
 
// DOM要素の構築が終わった場合に呼ばれるイベント
// - DOM要素に結びつく設定はこの中で行なう
$(function() {
 
    // Connectボタンクリック時の動作
    $("#connect").click(function() {
        // 接続先のIDをフォームから取得する
        var peer_id = $('#peer-id-input').val();
 
        // 相手への接続を開始する
        conn = peer.connect(peer_id);
 
        // 接続が完了した場合のイベントの設定
        conn.on("open", function() {
            // 相手のIDを表示する
            // - 相手のIDはconnectionオブジェクトのidプロパティに存在する
            $("#peer-id").text(conn.id);
        });
 
        // メッセージ受信イベントの設定
        conn.on("data", onRecvMessage);
    });
 
    // Sendボタンクリック時の動作
    $("#send").click(function() {
        // 送信テキストの取得
        var message = $("#message").val();
 
        // 送信
        conn.send(message);
 
        // 自分の画面に表示
        $("#messages").append($("<p>").html(peer.id + ": " + message));
 
        // 送信テキストボックスをクリア
        $("#message").val("");
    });
 
    // Closeボタンクリック時の動作
    $("#close").click(function() {
        conn.close();
    });
});