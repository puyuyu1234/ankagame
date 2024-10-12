"use strict";

class Unko {
    constructor(param) {
        this.status = [];
        this.name = param.name;
        this.status[0] = param.hard;
        this.status[1] = param.long;
        this.status[2] = param.speed;
        this.status[3] = param.smell;
        this.actor = null;

        this.isRed = false;
    }

    paramText(num) {
        return ["硬さ : ", "長さ : ", "速さ : ", "匂い : "][num] + this.status[num];
    }

    paramDelta(trainNum) {
        const paramDelta = [0, 0, 0, 0];
        if (trainNum == 0) {
            // 乳酸菌
            paramDelta[2] = 30000;
            paramDelta[0] = -10000;
            paramDelta[3] = -10000;
        }
        if (trainNum == 1) {
            // おいも
        }
        if (trainNum == 2) {
            // ラー油
            paramDelta[0] = -56562;
        }
        if (trainNum == 3) {
            // 有酸素運動
        }
        if (trainNum == 4) {
            // 喫煙
        }

        return paramDelta;
    }

    training(trainNum) {
        const pd = this.paramDelta(trainNum);

        for (let i = 0; i < 4; i++) {
            this.status[i] += pd[i];
        }

        if (trainNum == 2) this.isRed = true;
    }
}

class EffectTextActor extends TextActor {
    constructor(text, x, y) {
        if (text >= 0) text = "+" + text;
        super(text, x, y);
    }

    update() {
        const effect = +this.text;
        if (effect > 0) {
            this.color = "#f00";
        } else if (effect < 0) {
            this.color = "#00f";
        } else {
            this.color = "#000";
        }
    }
}
