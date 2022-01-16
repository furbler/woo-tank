const AngleDefault = -Math.PI / 2;
const EPS = 0.00001; //浮動小数点演算の誤差用のEPSILON

/**
 * 座標を管理するためのクラス
 */
export class Vector2 {
    x: number;
    y: number;

    /**
     * ベクトルの長さを返す静的メソッド
     * @static
     * @param {number} x - X 要素
     * @param {number} y - Y 要素
     */
    static calcLength(x, y) {
        return Math.sqrt(x * x + y * y);
    }
    /**
     * ベクトルを単位化した結果を返す静的メソッド
     * @static
     * @param {number} x - X 要素
     * @param {number} y - Y 要素
     */
    static calcnormal(x, y) {
        let len = Vector2.calcLength(x, y);
        return new Vector2(x / len, y / len);
    }

    /**
     * @constructor
     * @param {number} x - X 座標
     * @param {number} y - Y 座標
     */
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * 値を設定する
     * @param {number} [x] - 設定する X 座標
     * @param {number} [y] - 設定する Y 座標
     */
    set(x: number, y: number) {
        if (x != null) { this.x = x; }
        if (y != null) { this.y = y; }
    }

    //ベクトルの長さを返す
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * 対象の Vector2 クラスのインスタンスとの距離を返す
     * @param {Vector2} target - 距離を測る対象
     */
    distance(target: Vector2) {
        let x = this.x - target.x;
        let y = this.y - target.y;
        return Math.sqrt(x * x + y * y);
    }

    //内積
    innerProduct(target: Vector2): number {
        return this.x * target.x + this.y * target.y;
    }

    /**
     * 対象の Vector2 クラスのインスタンスとの外積を計算する
     * this.vector x target.vector
     * @param {Vector2} target - 外積の計算を行う対象
     */
    cross(target: Vector2): number {
        return this.x * target.y - this.y * target.x;
    }

    //半時計回り方向(マイナス方向の角度)にある法線ベクトルを返す
    //大きさは元と同じ
    ccwNormal(): [number, number] {
        return [this.y, -this.x];
    }

    /**
     * 自身を正規化する
     */
    normalize() {
        // ベクトルの大きさを計算する
        let l = this.length();
        // 大きさが 0 の場合は XY も 0 なのでなにもしない
        if (Math.abs(l) < EPS) {
        }
        // 自身の XY 要素を大きさで割る
        // 単位化されたベクトルを返す
        this.set(this.x / l, this.y / l);
    }

    //自身を回転させる
    //axis: 回転軸の座標
    //theta: 回転角度(rad)
    rotate(axis: Vector2, theta: number, norm: number) {
        // 指定されたラジアンからサインとコサインを求める
        let s = Math.sin(theta);
        let c = Math.cos(theta);

        //回転軸から自身の点までのベクトルの単位ベクトルを求める
        let unit: Vector2 = new Vector2(this.x - axis.x, this.y - axis.y);


        unit.normalize();

        unit.x = unit.x * c + unit.y * -s;
        unit.y = unit.x * s + unit.y * c;
        //戻す
        this.x = unit.x * norm + axis.x;
        this.y = unit.y * norm + axis.y;
    }
}


/**
 * キャラクター管理のための基幹クラス
 */
class Character {
    ctx: CanvasRenderingContext2D; //描画などに利用する 2D コンテキスト
    x: number; //x座標
    y: number; //y座標
    speed: number; //移動速度
    scale: number; //画像をオリジナルの何倍で表示したいか
    imagePath: string; //キャラクター用の画像のパス
    position: Vector2; //座標
    vector: Vector2; //移動方向(単位ベクトル)
    image: HTMLImageElement;
    ready: boolean; //画像の読み込みが終わったか否か

    angle: number; //画像の前方の向き 1.5 * Math.PI (rad) で元画像の向きで描画
    width: number;
    height: number;

    constructor(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, hp: number, imgPath: string) {
        this.ctx = ctx;
        this.position = new Vector2(x, y);
        this.vector = new Vector2(0.0, -1.0);
        this.angle = AngleDefault; //元画像のまま
        this.speed = 0; //デフォルトの値

        this.scale = scale;
        this.image = new Image();
        this.image.addEventListener('load', () => {
            // 画像のロードが完了したら準備完了フラグを立てる
            this.ready = true;
            //元画像のサイズと指定されたスケールからサイズを決定
            this.width = this.scale * this.image.naturalWidth;
            this.height = this.scale * this.image.naturalHeight;
        }, false);

        this.image.src = imgPath;

    }

    /**
     * 進行方向を設定する
     * @param {number} x - X 方向の移動量
     * @param {number} y - Y 方向の移動量
     */
    setVector(x, y) {
        this.vector.set(x, y);
    }

    //自身の向きの角度(rad)を-PI 〜 PIの範囲に直す
    limitRange() {
        if (this.angle <= -Math.PI) {
            this.angle += 2 * Math.PI;
        } else if (this.angle > Math.PI) {
            this.angle -= 2 * Math.PI;
        }
    }

    /**
     * キャラクターを描画する
     */
    draw() {
        // キャラクターの幅を考慮してオフセットする量
        let offsetX = this.width / 2;
        let offsetY = this.height / 2;

        // キャラクターの幅やオフセットする量を加味して描画する
        this.ctx.drawImage(
            this.image,
            this.position.x - offsetX,
            this.position.y - offsetY,
            this.width,
            this.height
        );
    }
    /**
     * 自身の回転量を元に座標系を回転させる
     */
    rotationDraw() {
        this.limitRange();
        // 座標系を回転する前の状態を保存する
        this.ctx.save();
        // 自身の位置が座標系の中心と重なるように平行移動する
        this.ctx.translate(this.position.x, this.position.y);
        // 座標系を回転させる（270 度の位置を基準にするため Math.PI * 1.5 を引いている）
        this.ctx.rotate(this.angle - AngleDefault);

        // キャラクターの幅を考慮してオフセットする量
        let offsetX = (this.width / 2);
        let offsetY = (this.height / 2);

        // キャラクターの幅やオフセットする量を加味して描画する
        this.ctx.drawImage(
            this.image,
            -offsetX, // 先に translate で平行移動しているのでオフセットのみ行う
            -offsetY, // 先に translate で平行移動しているのでオフセットのみ行う
            this.width,
            this.height
        );

        // 座標系を回転する前の状態に戻す
        this.ctx.restore();
    }
}

//tankクラス
export class Tank extends Character {
    //初期位置
    init_pos: Vector2;
    //車体前方を基準にした砲塔の方向
    angle_turret: number;
    //砲塔のサイズ
    width_turret: number;
    height_turret: number;
    //砲塔画像
    imageTurret: HTMLImageElement;

    constructor(ctx, x, y, scale_body: number, bodyImagePath: string, scale_turret: number, turretImagePath: string) {
        //車体を初期化
        super(ctx, x, y, scale_body, 5, bodyImagePath);
        this.init_pos = new Vector2(x, y);
        //自身の移動スピード（update 一回あたりの移動量）
        this.speed = 3;
        //車体と同じ向き
        this.angle_turret = 0;

        //砲塔画像読み込み
        this.imageTurret = new Image();
        this.imageTurret.addEventListener('load', () => {
            // 画像のロードが完了したら準備完了フラグを立てる
            this.ready = true;
            //元画像のサイズと指定されたスケールからサイズを決定
            this.width_turret = scale_turret * this.imageTurret.naturalWidth;
            this.height_turret = scale_turret * this.imageTurret.naturalHeight;
        }, false);
        this.imageTurret.src = turretImagePath;
    }


    //キャラクターの状態を更新し描画を行う
    update() {
        //自身の移動方向
        let pre_pos: Vector2 = new Vector2(this.position.x, this.position.y);
        //後進
        if (window.isKeyDown.key_s || window.isKeyDown.key_ArrowDown) {
            //旋回
            //後進中は旋回方向を反転する
            if (window.isKeyDown.key_ArrowLeft || window.isKeyDown.key_a) {
                this.angle += 2 * Math.PI / 180; // 1度
            }
            if (window.isKeyDown.key_ArrowRight || window.isKeyDown.key_d) {
                this.angle -= 2 * Math.PI / 180; // 1度
            }
            this.position.x -= this.speed * Math.cos(this.angle);
            this.position.y -= this.speed * Math.sin(this.angle);
        } else {
            //旋回
            if (window.isKeyDown.key_ArrowLeft || window.isKeyDown.key_a) {
                this.angle -= 2 * Math.PI / 180; // 1度
            }
            if (window.isKeyDown.key_ArrowRight || window.isKeyDown.key_d) {
                this.angle += 2 * Math.PI / 180; // 1度
            }
            //前進
            if (window.isKeyDown.key_w || window.isKeyDown.key_ArrowUp) {
                this.position.x += this.speed * Math.cos(this.angle);
                this.position.y += this.speed * Math.sin(this.angle);
            }
        }

        //速度ベクトルを更新
        this.vector.set(Math.cos(this.angle), Math.sin(this.angle));

        //キー入力で砲塔旋回
        //砲塔左旋回
        if (window.isKeyDown.key_q) {
            this.angle_turret -= 4 * Math.PI / 180; // 1度
        }
        //砲塔右旋回
        if (window.isKeyDown.key_e) {
            this.angle_turret += 4 * Math.PI / 180; // 1度
        }


        // 移動後の位置が画面外へ出ていないか確認して修正する
        let canvasWidth = this.ctx.canvas.width;
        let canvasHeight = this.ctx.canvas.height;
        let tx = Math.min(Math.max(this.position.x, this.width / 2), canvasWidth - this.width / 2);
        let ty = Math.min(Math.max(this.position.y, 0), canvasHeight);
        this.position.set(tx, ty);

        // 車体を描画する
        this.rotationDraw();
        //砲塔を描画する
        this.drawTurret();

        // 念の為グローバルなアルファの状態を元に戻す
        this.ctx.globalAlpha = 1.0;
    }
    //砲塔を描画
    drawTurret() {
        this.limitRange();
        // 座標系を回転する前の状態を保存する
        this.ctx.save();
        // 自身の位置が座標系の中心と重なるように平行移動する
        this.ctx.translate(this.position.x, this.position.y);
        // 座標系を回転させる（270 度の位置を基準にするため Math.PI * 1.5 を引いている）
        this.ctx.rotate(this.angle + this.angle_turret - AngleDefault);

        // キャラクターの幅を考慮してオフセットする量
        let offsetX = (this.width_turret / 2);
        let offsetY = (this.height_turret / 2);

        // キャラクターの幅やオフセットする量を加味して描画する
        this.ctx.drawImage(
            this.imageTurret,
            -offsetX, // 先に translate で平行移動しているのでオフセットのみ行う
            -offsetY, // 先に translate で平行移動しているのでオフセットのみ行う
            this.width_turret,
            this.height_turret
        );

        // 座標系を回転する前の状態に戻す
        this.ctx.restore();
    }
}
