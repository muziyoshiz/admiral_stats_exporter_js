# admiral_stats_exporter_js

艦これアーケードのプレイデータをエクスポートするツール（JavaScript 版）の開発環境

## このリポジトリについて

@sophiarcp さんに提供頂いたブックマークレットをもとに、機能追加していくための開発用リポジトリです。
ビルド後のブックマークレットは Admiral Stats のサイトで配布していましたが、すでにサービス提供は終了しています。

また、ブックマークレットの生成には、[JavaScriptを圧縮・整形するコマンド作り - ザリガニが見ていた...。](http://d.hatena.ne.jp/zariganitosh/20140814/making_of_closure_compiler_command "JavaScriptを圧縮・整形するコマンド作り - ザリガニが見ていた...。") にて公開されている
js-compile.rb に -b (--bookmarklet) オプションを追加したものを用いています。

## ビルド環境の構築

- Ruby のインストールされた環境を準備する


## 開発時のビルド方法

### Admiral Stats が対応するファイルのみを出力する bookmarklet

```
$ cat admiral_stats_exporter.js | ruby js-compile.rb -l2 -b
```

### 現時点でエクスポートできるすべてのファイルを出力する bookmarklet

```
$ cat admiral_stats_exporter.js | sed -e 's/var dataTypes/\/\/ var dataTypes/g' | sed -e 's/\/\/ \/\/ var dataTypes/var dataTypes/g' | ruby js-compile.rb -l2 -b
```

## リリース版のビルド方法

```
$ ./build.sh
```

以下の2ファイルを生成します。

- exporter.js: Admiral Stats が対応するファイルのみを出力する 
- exporter_all.js: 現時点でエクスポートできるすべてのファイルを出力する

ビルド結果は以下のスクリプトから読み込まれるため、"javascript:" を付与しません。

```
javascript:(function(u){var%20s=document.createElement('script');s.charset='UTF-8';s.src=u;document.body.appendChild(s)})('https://www.admiral-stats.com/bookmarklets/exporter.js');
```
