"use strict";

class TrainingScene extends Scene {
    constructor(num) {
        super();

        {
            const param = initStatus["unko" + num];
            this.unko = new Unko(param);
        }

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
            const unko = new Sprite(assets.get("u" + num), new Rectangle(0, 0, 40, 40));
            const ua = new SpriteActor(unko, 20, 30, 120, 120);
            ua.update = () => {
                ua.sprite.image = assets.get("u" + num + (this.unko.isRed ? "r" : ""));
            };
            const sra = new StrokeRectActor("#000", 20, 30, 120, 120);
            actorList.push(ua, sra);
            const names = this.unko.name.split("\n");
            const na1 = new TextActor(names[0], 80, 40);
            const na2 = new TextActor(names[1], 80, 56);
            na1.font = na2.font = "12px monospace";
            actorList.push(na1, na2);
        }

        // status
        {
            const sra = new StrokeRectActor("#000", 150, 30, 120, 120);
            actorList.push(sra);
            for (let i = 0; i < 4; i++) {
                const pa = new TextActor(this.unko.paramText(i), 210, 60 + i * 20);
                pa.font = "12px monospace";
                pa.update = () => {
                    pa.text = this.unko.paramText(i);
                };
                actorList.push(pa);
            }
        }

        // training
        {
            const frame = new RectActor("#000", 0, 180 - 2, 400, 2);
            const name = new TextActor("トレーニング", 140, 205);
            actorList.push(frame, name);
            for (let i = 1; i <= 5; i++) {
                const train = new Sprite(assets.get("t" + i), new Rectangle(0, 0, 40, 40));
                const ta = new SpriteActor(train, -30 + 50 * i, 230, 40, 40);
                actorList.push(ta);
            }
        }

        // frame
        {
            const frame = new Sprite(assets.get("frame2"), new Rectangle(0, 0, 120, 180));
            const fa = new SpriteActor(frame, 280, 0, 120, 180);
            actorList.push(fa);
        }

        // girl
        {
            const girl = new Sprite(assets.get("girl"), new Rectangle(0, 0, 80, 120));
            const ga = new SpriteActor(girl, 320, 180, 80, 120);
            actorList.push(ga);
        }

        // text
        {
            const trainNum = "training" + 1;
            const text = new TextActor(training[trainNum].name, 340, 40);
            const effect = training[trainNum].effect.split("\n");
            const text2 = new TextActor(effect[0], 340, 60);
            const text3 = new TextActor(effect[1] || "", 340, 75);
            text.font = "12px monospace";
            text2.font = text3.font = "10px monospace";
            text.layer = text2.layer = text3.layer = 1;
            text2.id = 2;
            text3.id = 3;
            this.add(text);
            this.add(text2);
            this.add(text3);

            this.text1 = text;
            this.text2 = text2;
            this.text3 = text3;

            // effect
            {
                const names = ["硬さ : ", "長さ : ", "速さ : ", "匂い : "];

                const nameList = [];
                this.effectTexts = [];
                const eff = this.unko.paramDelta(0);
                eff.forEach((e, id) => {
                    const y = 100 + id * 16;
                    const n = new EffectTextActor(names[id], 300, y);
                    const t = new EffectTextActor(e, 340, y);
                    n.font = t.font = "12px monospace";
                    n.textAlign = t.textAlign = "left";
                    nameList.push(n);
                    this.effectTexts.push(t);
                });

                actorList.push(...nameList);
                actorList.push(...this.effectTexts);
            }
        }

        // cursor
        {
            const cursor = new Sprite(assets.get("cursor"), new Rectangle(0, 0, 40, 40));
            const ca = new SpriteActor(cursor, 40, 190, 40, 40);
            actorList.push(ca);

            const sra = new StrokeRectActor("#c00", 20, 230, 40, 40);
            actorList.push(sra);

            this.cursor = ca;
            this.cursorRect = sra;

            this.cursorPosition = 0;
        }

        addActor(actorList);
    }

    update(inputManager) {
        super.update(inputManager);

        {
            const listNum = 5;
            if (inputManager.getKey("ArrowLeft") == 1 || inputManager.getKey("a") == 1) {
                this.cursorPosition = (this.cursorPosition + listNum - 1) % listNum;
            }
            if (inputManager.getKey("ArrowRight") == 1 || inputManager.getKey("d") == 1) {
                this.cursorPosition = (this.cursorPosition + 1) % listNum;
            }

            const trainNum = "training" + (this.cursorPosition + 1);
            this.text1.text = training[trainNum].name;
            const effect = training[trainNum].effect.split("\n");
            this.text2.text = effect[0];
            this.text3.text = effect[1] || "";

            // effect
            const eff = this.unko.paramDelta(this.cursorPosition);
            this.effectTexts.forEach((t, id) => {
                t.text = eff[id];
            });

            this.cursor.x = 40 + this.cursorPosition * 50;
            this.cursorRect.x = 20 + this.cursorPosition * 50;
        }

        // space
        {
            if (inputManager.getKey(" ") == 1) {
                this.unko.training(this.cursorPosition);
            }
        }
    }
}
