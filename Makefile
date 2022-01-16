#ソースファイルの場所
TS_SRC = src/
#JSファイルの出力先
TARGET = dist/

#出力JSファイル
default: $(TARGET)*

#tsファイルをコンパイルしてjsファイル
$(TARGET)*: $(TS_SRC)* Makefile
	npm run build

#npmで必要なパッケージをインストール
install:
	npm install --save-dev webpack webpack-cli ts-loader typescript

#ローカルwebサーバを起動
server-run: $(TARGET)*
	python -m http.server 8000

clean:
	rm $(TARGET)*
