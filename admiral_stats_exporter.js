var date = new Date();
var ymdhms = [date.getFullYear(),
  ('0' + (date.getMonth() + 1)).slice(-2),
  ('0' + date.getDate()).slice(-2),
  '_',
  ('0' + date.getHours()).slice(-2),
  ('0' + date.getMinutes()).slice(-2),
  ('0' + date.getSeconds()).slice(-2)].join('');

var api_base = 'https://kancolle-arcade.net/ac/api/';
var infoarray = ['Personal/basicInfo', 'Area/captureInfo', 'TcBook/info', 'EquipBook/info', 'Campaign/history', 'Campaign/info', 'Campaign/present', 'CharacterList/info', 'EquipList/info', 'Quest/info'];
/*    var infoarray = ['Personal/basicInfo', 'TcBook/info', 'CharacterList/info'];
 */
infoarray.forEach(function (u) {
  var xhr = new XMLHttpRequest();
  var fname = u.replace('/', '_') + '_' + ymdhms + '.json';
  xhr.open('GET', api_base + u);
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
        a.download = u.replace('/', '_') + '_' + ymdhms + '.json';
        a.href = blobUrl;
        a.click();
        document.body.removeChild(a);
        console.log(blobUrl);
      }
    } else {
      /* error */
      /*console.log(xhr.responseText);*/
    }
  };
  xhr.send();
});
