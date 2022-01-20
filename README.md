# woo-tank
戦車から発射した弾で敵を倒す、2Dの対戦ゲームを制作しています。
使用言語はTypeScript、ブラウザ上でキーボード操作に対応しています。
ゲーム用のライブラリは使用していません。

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
これらのバージョンはpackage.jsonにも書いてあります。

## 使い方

### コンパイル
```bash
$ make
```
srcディレクトリ内にあるtsファイルをjsファイルにコンパイルし、distディレクトリに出力。

### 実行
```bash
$ make server-run
```
で必要に応じてコンパイルを行い、ローカルにwebサーバを起動。
ブラウザで http://localhost:8000/ にアクセスするとwebページが表示され、ゲームが起動します。

### 操作方法
戦車は方向キーまたはAWSDで前進/後進/左右旋回。
Spaceキー、EnterキーまたはZキーで弾を発射。

## 参考元

### [［ゲーム＆モダン JavaScript文法で2倍楽しい］グラフィックスプログラミング入門｜技術評論社](https://gihyo.jp/book/2020/978-4-297-11085-7)
この本の[サンプルコード](https://github.com/doxas/graphics-programming-book)を元にしています。