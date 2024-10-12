"use strict";

class CharaSelectScene extends Scene {
    constructor() {
        super();

        const addActor = (actorList) => {
            actorList.forEach((actor, id) => {
                actor.id = id;
                this.add(actor);
            });
        };

        const actorList = [];

        //bg
        {
            const bg = new RectActor("#fff", 0, 0, 400, 300);
            actorList.push(bg);
        }

        // unko
        {
            for (let i = 1; i <= 6; i++) {
                const s = new Sprite(assets.get("u" + i), new Rectangle(0, 0, 40, 40));
                const u = new SpriteActor(s, -40 + 50 * i, 100, 40, 40);
                actorList.push(u);
            }
        }

        // girl
        {
            const girl = new Sprite(assets.get("girl"), new Rectangle(0, 0, 80, 120));
            const ga = new SpriteActor(girl, 320, 180, 80, 120);
            actorList.push(ga);
        }

        // frame
        {
            const frame = new Sprite(assets.get("frame"), new Rectangle(0, 0, 320, 120));
            const fa = new SpriteActor(frame, 0, 180, 320, 120);
            actorList.push(fa);
            const next = new Sprite(assets.get("next"), new Rectangle(0, 0, 40, 40));
            const na = new SpriteActor(next, 240, 265, 40, 40);
            na.update = () => {
                na.y = 265 + 5 * Math.sin(na.time / 15);
                na.time++;
            };
            actorList.push(na);
        }

        // text
        {
            this.textList = [
                "こんにちは！",
                "このゲームの目的は\n「品評会で最優勝賞を取る」です",
                "一緒に頑張りましょう！",
                "育成するうんこを\n選んでください",
                "これを育成しますか？\nはい : Space / いいえ : C",
            ];
            this.textNum = 0;
            const t = this.textList[this.textNum].split("\n");
            const text = new TextActor(t[0], 160, 220);
            const text2 = new TextActor(t[1] || "", 160, 260);
            text.layer = text2.layer = 1;
            text2.id = 2;
            this.add(text);
            this.add(text2);

            this.text1 = text;
            this.text2 = text2;
        }

        // parameter
        {
            const sra = new StrokeRectActor("#000", 310, 10, 80, 160);
            actorList.push(sra);

            this.unkoStatusActor = {};

            // name
            initStatus["unko1"].name.split("\n").forEach((name, id) => {
                const na = new TextActor(name, 350, 30 + 15 * id);
                na.font = "12px monospace";
                actorList.push(na);
                this.unkoStatusActor["name" + (id + 1)] = na;
            });

            // status
            const st1 = new TextActor("硬さ：" + initStatus["unko1"].hard, 350, 80);
            const st2 = new TextActor("長さ：" + initStatus["unko1"].long, 350, 100);
            const st3 = new TextActor("速さ：" + initStatus["unko1"].speed, 350, 120);
            const st4 = new TextActor("匂い：" + initStatus["unko1"].smell, 350, 140);

            [st1, st2, st3, st4].forEach((actor, id) => {
                actor.font = "12px monospace";
                actorList.push(actor);
                this.unkoStatusActor["st" + (id + 1)] = actor;
            });
        }

        // cursor
        {
            const cursor = new Sprite(assets.get("cursor"), new Rectangle(0, 0, 40, 40));
            const ca = new SpriteActor(cursor, 30, 60, 40, 40);
            actorList.push(ca);

            const sra = new StrokeRectActor("#c00", 10, 100, 40, 40);
            actorList.push(sra);

            this.cursor = ca;
            this.cursorRect = sra;
        }
        this.cursorPosition = 0;
        this.isWaiting = false;

        addActor(actorList);
    }

    update(inputManager) {
        super.update(inputManager);

        // select
        if (this.textNum == 3) {
            const listNum = 6;
            if (inputManager.getKey("ArrowLeft") == 1 || inputManager.getKey("a") == 1) {
                this.cursorPosition = (this.cursorPosition + listNum - 1) % listNum;
            }
            if (inputManager.getKey("ArrowRight") == 1 || inputManager.getKey("d") == 1) {
                this.cursorPosition = (this.cursorPosition + 1) % listNum;
            }

            const unkoNum = "unko" + (this.cursorPosition + 1);
            initStatus[unkoNum].name.split("\n").forEach((name, id) => {
                this.unkoStatusActor["name" + (id + 1)].text = name;
            });
            this.unkoStatusActor.st1.text = "硬さ：" + initStatus[unkoNum].hard;
            this.unkoStatusActor.st2.text = "長さ：" + initStatus[unkoNum].long;
            this.unkoStatusActor.st3.text = "速さ：" + initStatus[unkoNum].speed;
            this.unkoStatusActor.st4.text = "匂い：" + initStatus[unkoNum].smell;

            this.cursor.x = 30 + this.cursorPosition * 50;
            this.cursorRect.x = 10 + this.cursorPosition * 50;

            if (inputManager.getKey(" ") == 1) {
                // --でよろしいですか？
                this.isWaiting = true;

                const t = this.textList[++this.textNum].split("\n");
                this.text1.text = t[0];
                this.text2.text = t[1] || "";
            }
        } else {
            if (inputManager.getKey(" ") == 1) {
                if (this.textNum == this.textList.length - 1) {
                    // テキスト末尾
                    this.changeScene([new TrainingScene(1 + this.cursorPosition)]);
                } else {
                    // テキスト送り
                    const t = this.textList[++this.textNum].split("\n");
                    this.text1.text = t[0];
                    this.text2.text = t[1] || "";
                }
            }
            if (inputManager.getKey("c") == 1) {
                // キャンセル
                const t = this.textList[(this.textNum = Math.max(0, --this.textNum))].split("\n");
                this.text1.text = t[0];
                this.text2.text = t[1] || "";
            }
        }
    }
}
