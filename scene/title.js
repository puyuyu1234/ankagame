"use strict";

class TitleScene extends Scene {
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
        // title
        {
            const title = new TextActor("育成ゲーム", 200, 40);
            const title2 = new TextActor("うんこ", 200, 120);
            title2.font = "80px monospace";
            const title3 = new TextActor("↑うんち、な", 200, 180);
            actorList.push(title, title2, title3);
        }

        // press any key
        {
            const pak = new TextActor("- Press Space Key -", 200, 240);
            actorList.push(pak);
        }

        addActor(actorList);
    }

    update(inputManager) {
        if (inputManager.getKey(" ") == 1) {
            this.changeScene([new CharaSelectScene()]);
        }
    }
}
