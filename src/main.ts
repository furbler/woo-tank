import { Canvas2DUtility } from "./canvas2d"
import { Tank, Shot } from "./character"

//キーの押下状態を調べるためのオブジェクト
window.isKeyDown = {};

(() => {
    //canvas の幅
    const CANVAS_WIDTH = 900;
    //canvas の高さ
    const CANVAS_HEIGHT = 600;

    //Canvas2D API をラップしたユーティリティクラス
    let util: Canvas2DUtility = null;
    //描画対象となる Canvas Element
    let canvas: HTMLCanvasElement = null;
    //Canvas2D API のコンテキスト
    let ctx: CanvasRenderingContext2D = null;

    //自機キャラクターのインスタンス
    let tank_blue: Tank = null;

    //弾のインスタンスを格納する配列
    let shotArray: Array<Shot> = [];

    //ショットの最大個数
    const SHOT_MAX_COUNT = 100;

    let mainRequestID: number = null;

    //ページのロードが完了したときに発火する load イベント
    window.addEventListener('load', () => {
        // ユーティリティクラスを初期化
        util = new Canvas2DUtility(document.body.querySelector('#main_canvas'));
        // ユーティリティクラスから canvas を取得
        canvas = util.canvas;
        // ユーティリティクラスから 2d コンテキストを取得
        ctx = util.context;
        // canvas の大きさを設定
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;

        // 初期化処理を行う
        initialize();
        loadCheck();
    }, false);


    //canvas やコンテキストを初期化する
    function initialize() {
        // 自機キャラクターを初期化する
        tank_blue = new Tank(ctx, CANVAS_WIDTH * 0.3, CANVAS_HEIGHT * 0.9, 1.2, './image/tank_blue.png', 0.4, './image/turret_blue.png');

        //弾を初期化する
        for (let i = 0; i < SHOT_MAX_COUNT; ++i) {
            shotArray[i] = new Shot(ctx, 0, 0, 3, 1, './image/bullet.png');
        }
        //弾を戦車に登録する
        tank_blue.setShotArray(shotArray);

        console.log('画像の読み込み完了しました！！');
    }

    // 全ての準備が完了したら描画処理を開始する
    //インスタンスの準備が完了しているか確認する
    function loadCheck() {
        // 準備完了を意味する真偽値
        let ready: boolean = true;

        // AND 演算で準備完了しているかチェックする
        ready = ready && tank_blue.ready;

        if (ready) {
            // イベントを設定する
            eventSetting();
            //ループ処理
            update();
        } else {
            // 準備が完了していない場合は 0.1 秒ごとに再帰呼出しする
            setTimeout(loadCheck, 100);
        }
    }
    //イベントを設定する
    function eventSetting() {
        // キーの押下時に呼び出されるイベントリスナーを設定する
        window.addEventListener('keydown', (event) => {
            // キーの押下状態を管理するオブジェクトに押下されたことを設定する
            window.isKeyDown[`key_${event.key}`] = true;
            //スペースの場合
            if (event.key === ' ') {
                // キーの押下状態を管理するオブジェクトに押下されたことを設定する
                window.isKeyDown[`key_Space`] = true;
            }
        }, false);

        // キーが離された時に呼び出されるイベントリスナーを設定する
        window.addEventListener('keyup', (event) => {
            // キーが離されたことを設定する
            window.isKeyDown[`key_${event.key}`] = false;

            //スペースの場合
            if (event.key === ' ') {
                // キーの押下状態を管理するオブジェクトに押下されたことを設定する
                window.isKeyDown[`key_Space`] = false;
            }
        }, false);

    }

    //処理を行う
    function update() {
        //ゲーム実行
        // グローバルなアルファを必ず 1.0 で描画処理を開始する
        ctx.globalAlpha = 1.0;
        // 描画前に画面を背景色で塗りつぶす
        util.drawRect(0, 0, canvas.width, canvas.height, '#000000');

        tank_blue.update();

        // すべてのショットの状態を更新する
        shotArray.map((shot) => {
            shot.update();
        });

        // 恒常ループのために描画処理を再帰呼出しする
        mainRequestID = requestAnimationFrame(update);
    }
})();
