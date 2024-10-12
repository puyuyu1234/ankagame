"use strict";

class StrokeRectActor extends RectActor {
    render(canvas) {
        const ctx = canvas.getContext("2d");
        ctx.globalAlpha = this.globalAlpha;
        ctx.strokeStyle = this.color;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
}

class AudioActor extends Actor {
    constructor(track, loopStart = -1, loopEnd = -1) {
        super();
        this.audio = new Audio(track);
        this.loopStart = loopStart;
        this.loopEnd = loopEnd;
        this.canPlay = false;
    }

    update() {
        // console.log(this.audio.currentTime, this.loopEnd);
        // if (this.loopEnd < this.audio.currentTime) {
        //     this.audio.currentTime -= this.loopEnd - this.loopStart;
        // }
    }

    render() {}

    changeVolume(volume) {
        this.audio.volume = volume;
    }

    play(currentTime = 0) {
        if (!this.canPlay) return;
        this.isPlaying = true;
        this.audio.currentTime = currentTime / 1000;
        this.audio.play();

        clearTimeout(this.timeoutID);
        if (this.loopStart != -1) {
            this.timeoutID = setTimeout(() => {
                this.play(this.loopStart);
            }, this.loopEnd - currentTime);
        }
    }

    stop() {
        this.isPlaying = false;
        this.audio.pause();
        clearTimeout(this.timeoutID);
    }
}

class Goal {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    judgeEntity(player, entityList) {
        let f = false;
        const el = entityList.concat(player);
        el.forEach((entity) => {
            if (entity.x == this.x && entity.y == this.y && (CHARA[entity.c][2] & 8) == 8) {
                f = true;
                return;
            }
        });
        return f;
    }
}

class UnkoGame extends Game {
    constructor(canvas, currentSceneList) {
        super(canvas, currentSceneList, 60);
        this.changeScene(currentSceneList);
    }
}

//const time = (8 * 4 * 60 * 1000) / 126;
//const audio = {
//    move: new AudioActor("se/move.mp3"),
//    select: new AudioActor("se/select.mp3"),
//    push: new AudioActor("se/push.mp3"),
//    clear: new AudioActor("se/clear.mp3"),
//    bgm: new AudioActor("bgm/bgm.mp3", time / 2, (time * 3) / 2),
//};
//
//
//canvas.addEventListener(
//    "click",
//    () => {
//        for (let key in audio) {
//            audio[key].canPlay = true;
//        }
//    },
//    { once: true }
//);

canvas.getContext("2d").imageSmoothingEnabled = false;
assets.addImage("u1", "img/unko1.bmp");
assets.addImage("u2", "img/unko2.bmp");
assets.addImage("u3", "img/unko3.bmp");
assets.addImage("u4", "img/unko4.bmp");
assets.addImage("u5", "img/unko5.bmp");
assets.addImage("u6", "img/unko6.bmp");
assets.addImage("u1r", "img/unko1_red.bmp");
assets.addImage("u2r", "img/unko2_red.bmp");
assets.addImage("u3r", "img/unko3_red.bmp");
assets.addImage("u4r", "img/unko4_red.bmp");
assets.addImage("u5r", "img/unko5_red.bmp");
assets.addImage("u6r", "img/unko6_red.bmp");
assets.addImage("girl", "img/girl.bmp");
assets.addImage("frame", "img/frame.bmp");
assets.addImage("frame2", "img/frame2.bmp");
assets.addImage("cursor", "img/cursor.bmp");
assets.addImage("next", "img/next.bmp");
assets.addImage("t1", "img/train1.bmp");
assets.addImage("t2", "img/train2.bmp");
assets.addImage("t3", "img/train3.bmp");
assets.addImage("t4", "img/train4.bmp");
assets.addImage("t5", "img/train5.bmp");

assets.loadAll().then(() => {
    //const scene = [new TrainingScene(6)];
    //const scene = [new CharaSelectScene()];
    const scene = [new TitleScene()];
    const game = new UnkoGame(canvas, scene, 60);
    game.start();
});
