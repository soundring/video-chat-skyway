'use strict';

let localStream = null;
let peer = null;
let existingCall = null;

navigator.mediaDevices.getUserMedia({video: true, audio: true})
    .then(function (stream) {
        // Success
        $('#my-video').get(0).srcObject = stream;
        localStream = stream;
    }).catch(function (error) {
        // Error
        console.error('mediaDevice.getUserMedia() error:', error);
        return;
    });

peer = new Peer({
  key: '24b4a787-6830-4b44-b5bd-4f19022e1794',
  debug:3
});

//SkyWayのシグナリングサーバと接続し、利用する準備が整ったら発火
peer.on('open', function(){
  $('#my-id').text(peer.id);
});

//何らかのエラーが発生した場合に発火
peer.on('error', function(err) {
  alert(err.message);
});

//Peer（相手）との接続が切れた際に発火
peer.on('close', function() {
});

//シグナリングサーバとの接続が切れた際に発火
peer.on('disconnected', function() {
});

//発信ボタンをクリックした場合に相手に発信
$('#make-call').submit(function(e){
  e.preventDefault();
  const call = peer.call($('#callto-id').val(), localStream);
  setupCallEventHandlers(call);
});

//切断ボタンをクリックした場合に、相手との接続を切断
$('end-call').click(function() {
  existingCall.close();
});

//相手から接続要求がきた場合に応答
peer.on('call', function(call){
  call.answer(localStream);
  setupCallEventHandlers(call);
});


//Callオブジェクトに必要なイベントリスナー
function setupCallEventHandlers(call){
  if (existingCall) {
      existingCall.close();
  };

  existingCall = call;

  call.on('stream', function(stream){
    addVideo(call,stream);
    setupEndCallUI();
    $('#their-id').text(call.remoteId);
  });

  call.on('close', function(){
    removeVideo(call.remoteId);
    setupMakeCallUI();
  });
}

//VIDEOを再生するための処理
function addVideo(call,stream){
  $('#their-video').get(0).srcObject = stream;
}

//切断された（した）相手のvideo要素を削除
function removeVideo(peerId){
  $('#'+peerId).remove();
}

function setupMakeCallUI(){
  $('#make-call').show();
  $('#end-call').hide();
}

function setupEndCallUI() {
  $('#make-call').hide();
  $('#end-call').show();
}

