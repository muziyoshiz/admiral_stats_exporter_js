# admiral_stats_exporter_js

[![Join the chat at https://gitter.im/muziyoshiz/admiral_stats](https://badges.gitter.im/muziyoshiz/admiral_stats.svg)](https://gitter.im/muziyoshiz/admiral_stats?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

艦これアーケードのプレイデータをエクスポートするツール（JavaScript 版）の開発環境

## このリポジトリについて

@sophiarcp さんに提供頂いたブックマークレットをもとに、機能追加していくための開発用リポジトリです。
ビルド後のブックマークレットは [Admiral Stats](https://www.admiral-stats.com) のサイトで配布します。

また、ブックマークレットの生成には、[JavaScriptを圧縮・整形するコマンド作り - ザリガニが見ていた...。](http://d.hatena.ne.jp/zariganitosh/20140814/making_of_closure_compiler_command "JavaScriptを圧縮・整形するコマンド作り - ザリガニが見ていた...。") にて公開されている
js-compile.rb に -b (--bookmarklet) オプションを追加したものを用いています。

## ビルド環境の構築

- Ruby のインストールされた環境を準備する


## ビルド方法

### Admiral Stats が対応するファイルのみを出力する bookmarklet

```
$ cat admiral_stats_exporter.js | ruby js-compile.rb -l2 -b
```

### 現時点でエクスポートできるすべてのファイルを出力する bookmarklet

```
$ cat admiral_stats_exporter.js | sed -e 's/var dataTypes/\/\/ var dataTypes/g' | sed -e 's/\/\/ var allDataTypes/var dataTypes/g' | ruby js-compile.rb -l2 -b
```
