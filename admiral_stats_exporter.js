// Base URL
var BASE_URL = 'https://kancolle-arcade.net/ac/api/';

// API URLs
var API_URLS = [
  'Personal/basicInfo',
  'Area/captureInfo',
  'TcBook/info',
  'EquipBook/info',
  'Campaign/history',
  'Campaign/info',
  'Campaign/present',
  // From REVISION 2 (2016-06-30)
  'CharacterList/info',
  'EquipList/info',
  // From 2016-07-26
  'Quest/info'
]

// timestamp format: %Y%m%d_%H%M%S
var now = new Date,
  timestamp = [
    now.getFullYear(),
    ('0' + (now.getMonth() + 1)).slice(-2),
    ('0' + now.getDate()).slice(-2),
    '_',
    ('0' + now.getHours()).slice(-2),
    ('0' + now.getMinutes()).slice(-2),
    ('0' + now.getSeconds()).slice(-2)].join(''),
  fileNameSuffix = '_' + timestamp + '.json'

API_URLS.forEach(
  function (url) {
    var request = new XMLHttpRequest,
      fileName = url.replace('/', '_') + fileNameSuffix;
    request.open('GET', BASE_URL + url);
    request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    request.responseType = 'blob';

    request.onload = function () {
      if (request.status === 200) {
        var blob = new Blob([request.response]);
        if (window.navigator.msSaveBlob) {
          // Windows の場合は msSaveBlob でファイルに保存
          window.navigator.msSaveBlob(blob, fileName);
        } else {
          // Windows 以外の場合は HTML5 の download 属性を用いてファイル名を指定
          var objectUrl = (window.URL || window.webkitURL).createObjectURL(blob),
            a = document.createElement('a');
          document.body.appendChild(a);
          a.download = url.replace('/', '_') + '_' + timestamp + '.json';
          a.href = objectUrl;
          a.click();
          document.body.removeChild(a);
          console.log(objectUrl)
        }
      } else {
        console.log(request.responseText)
      }
    };
    request.send();
  }
)
