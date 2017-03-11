(function () {
  // bookmarklet のバージョン番号
  var version = 'Admiral Stats エクスポータ v1.6.1';

  // エクスポートの実行時刻
  var date = new Date();

  // エクスポートしたファイルに付与するタイムスタンプ
  var ymdhms = [date.getFullYear(),
    ('0' + (date.getMonth() + 1)).slice(-2),
    ('0' + date.getDate()).slice(-2),
    '_',
    ('0' + date.getHours()).slice(-2),
    ('0' + date.getMinutes()).slice(-2),
    ('0' + date.getSeconds()).slice(-2)].join('');

  // ログイン認証が必要な URL にマッチする正規表現
  var authorizedUrls = new RegExp('^https://kancolle-arcade\.net/ac/#/(area|list|pictureBook)');

  // API のベースとなる URL
  var apiUrl = 'https://kancolle-arcade.net/ac/api/';

  // プレイデータの URL の末尾（Admiral Stats がインポートできるプレイデータのみ）
  var dataTypes = ['Personal/basicInfo', 'TcBook/info', 'CharacterList/info', 'Event/info'];

  // プレイデータの URL の末尾（現在取得できるすべてのプレイデータ）
  // var dataTypes = ['Personal/basicInfo', 'Area/captureInfo', 'TcBook/info', 'EquipBook/info', 'Campaign/history', 'Campaign/info', 'Campaign/present', 'CharacterList/info', 'EquipList/info', 'Quest/info', 'Event/info', 'RoomItemList/info'];

  // ログイン認証が必要な URL にいない場合は、アラートを出して終了
  if (!window.location.href.match(authorizedUrls)) {
    alert(version + '：プレイヤーズサイトにログインし、海域情報が表示された状態で実行してください。');
    return;
  }

  // <script> タグの属性から、動作を切り替えるオプションを取得
  var s = document.getElementById('admiral-stats-exporter');

  // Admiral Stats の API トークン（空文字列の場合は nil に設定）
  // API トークンが nil でない場合は、Admiral Stats にデータをアップロードする
  var token = (s && s.getAttribute('data-token'));
  if (token && token.length === 0) {
    token = nil;
  }
  // ローカルディスクにファイルを保存するかどうか（'true' の場合は true に設定し、それ以外は false）
  var skipBackup = (s && s.getAttribute('data-skip-backup') === 'true');

  dataTypes.forEach(function (dataType) {
    var fileType = dataType.replace('/', '_');

    var xhr = new XMLHttpRequest();
    var fname = fileType + '_' + ymdhms + '.json';
    xhr.open('GET', apiUrl + dataType);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.responseType = 'blob';
    xhr.onload = function () {
      if (xhr.status === 200) {
        if (token) {
          var post = new XMLHttpRequest();
          post.open('POST', 'https://www.admiral-stats.com/api/v1/import/' + fileType + '/' + ymdhms);
          post.setRequestHeader('Content-Type', 'application/json');
          post.setRequestHeader('Authorization', 'Bearer ' + token);
          post.send(xhr.response);
        }

        if (!skipBackup) {
          var blob = new Blob([xhr.response]);
          if (window.navigator.msSaveBlob) {
            window.navigator.msSaveBlob(blob, fname);
          } else {
            var url = window.URL || window.webkitURL;
            var blobUrl = url.createObjectURL(blob);
            var a = document.createElement('a');
            document.body.appendChild(a);
            a.download = fileType + '_' + ymdhms + '.json';
            a.href = blobUrl;
            a.click();
            document.body.removeChild(a);
          }
        }
      } else {
        /* error */
        // 同じエラーが何回も表示されるのを防ぐために、URL の末尾が dataType[0] に一致するときだけエラーメッセージを表示する
        if (dataType === dataTypes[0]) {
          alert(version + '：接続に失敗しました。プレイヤーズサイトに再ログインしてから実行してください。(status code = ' + xhr.status + ')');
        }
      }
    };
    xhr.send();
  });
})();
