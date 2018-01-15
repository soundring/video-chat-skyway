// peerオブジェクト
const peer = new Peer({
  key: '24b4a787-6830-4b44-b5bd-4f19022e1794', // 自分のAPIキーを入力
  debug: 3
});

// 入室
let room = null;
$('#join').click(function(){
  room = peer.joinRoom($('#roomName').val(), {mode: 'sfu'});
  chatlog('<i>' + $('#roomName').val() + '</i>に入室しました');

  // チャットを送信
  $('#send').click(function(){
      var msg = $('#msg').val();
      room.send(msg);
      chatlog('自分> ' + msg);
  });

  // チャットを受信
  room.on('data', function(data){
      chatlog('ID: ' + data.src + '> ' + data.data); // data.src = 送信者のpeerid, data.data = 送信されたメッセージ
  });
});

// 退室
$('#leave').click(function(){
  room.close();
  chatlog('<i>' + $('#roomName').val() + '</i>から退室しました');
})


// チャットログに記録するための関数
function chatlog(msg){
  $('#chatLog').append('<p>' + msg + '</p>');
}