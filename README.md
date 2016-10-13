# admiral_stats_exporter_js
艦これアーケードのプレイデータをエクスポートするツール（JavaScript 版）の開発環境

## ビルド環境の構築手順（Mac の場合）

git clone したディレクトリで以下を実行する。

```
brew update
brew install yarn
yarn install 
```

## ビルド方法

シェルで以下を実行する。出力された文字列をブックマークとして登録する。

```
minified=`./node_modules/uglify-js/bin/uglifyjs --mangle --enclose -- admiral_stats_exporter.js`
encoded=`node -p "encodeURIComponent('$minified')"`
echo -n "javascript:$encoded$"
```
