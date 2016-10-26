(function () {
  // bookmarklet のバージョン番号
  var version = 'Admiral Stats エクスポータ v1.1.0';

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
  var dataTypes = ['Personal/basicInfo', 'TcBook/info', 'CharacterList/info'];

  // プレイデータの URL の末尾（現在取得できるすべてのプレイデータ）
  // var dataTypes = ['Personal/basicInfo', 'Area/captureInfo', 'TcBook/info', 'EquipBook/info', 'Campaign/history', 'Campaign/info', 'Campaign/present', 'CharacterList/info', 'EquipList/info', 'Quest/info', 'Event/info'];

  // ログイン認証が必要な URL にいない場合は、アラートを出して終了
  if (!window.location.href.match(authorizedUrls)) {
    alert(version + '：プレイヤーズサイトにログインし、海域情報が表示された状態で実行してください。');
    return;
  }

  dataTypes.forEach(function (dataType) {
    var xhr = new XMLHttpRequest();
    var fname = dataType.replace('/', '_') + '_' + ymdhms + '.json';
    xhr.open('GET', apiUrl + dataType);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.responseType = 'blob';
    xhr.onload = function () {
      if (xhr.status === 200) {
        /* success */
        var blob = new Blob([xhr.response]);
        if (window.navigator.msSaveBlob) {
          window.navigator.msSaveBlob(blob, fname);
        } else {
          var url = window.URL || window.webkitURL;
          var blobUrl = url.createObjectURL(blob);
          var a = document.createElement('a');
          document.body.appendChild(a);
          a.download = dataType.replace('/', '_') + '_' + ymdhms + '.json';
          a.href = blobUrl;
          a.click();
          document.body.removeChild(a);
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
