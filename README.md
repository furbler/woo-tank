# woo-tank
戦車から発射した弾で敵を倒す、対戦ゲームを制作しています。

## 開発環境
- OS : Ubuntu 18.04 LTS
- python : version 3.6.8

```bash
$ npm --version
6.14.6

$ ./node_modules/.bin/tsc --version
Version 4.5.4

$ ./node_modules/.bin/webpack --version
webpack: 5.65.0
webpack-cli: 4.9.1
webpack-dev-server not installed
```
ここはpackage.jsonにも書いてあります。

## 使い方

### コンパイル
```bash
$ make
```
srcディレクトリ内にあるtsファイルをjsファイルにコンパイルし、distディレクトリに出力

### 実行
```bash
$ make server-run
```
で必要に応じてコンパイルを行い、ローカルにwebサーバを起動します。。
それからブラウザで http://localhost:8000/ にアクセスするとwebページが表示されます。

最初に「Press to START」のボタンのみが表示されるので、そのボタンをクリックすればゲームが起動します。
戦車は方向キーまたはAWSDで前進/後進/左右旋回が可能です。

## 参考元

### [［ゲーム＆モダン JavaScript文法で2倍楽しい］グラフィックスプログラミング入門｜技術評論社](https://gihyo.jp/book/2020/978-4-297-11085-7)
この本の[サンプルコード](https://github.com/doxas/graphics-programming-book)を元に制作しています。