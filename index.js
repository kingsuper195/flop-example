import { RenderLoop } from "./node_modules/flop-render/dist/flop-render.js";
import { Sprite, Flop } from "./node_modules/flop-vm/index.js";
const canvas = document.getElementById('stage');
let flop = new Flop();
const renderLoop = new RenderLoop(canvas);

flop.setRenderLoop(renderLoop);
flop.looks.setBackdrop("./backdrop1.png", "bitmap");

let sprite1 = new Sprite();
renderLoop.addSprite(sprite1, "Kitty");
sprite1.costumes[0] = {
    "data": "./costume1.svg",
    "type": "vector",
    "name": "Cat"
};
sprite1.costumes[1] = {
    "data": "./favicon.svg",
    "type": "vector",
    "name": "Suprise!"
};


let sprite2 = new Sprite();
sprite2.costumes[0] = {
    "data": "./backdrop2.png",
    "type": "bitmap",
    "name": "Bg2"
};
renderLoop.addSprite(sprite2, "Backtop");
const START_PIXELATION = 1000;
const START_BRIGHTNESS = 100;
sprite1.pixalate = START_PIXELATION;
sprite1.brightness = START_BRIGHTNESS;
async function run() {
    // const promises = [
    document.getElementById("start").remove();


    sprite1.looks.setCostume(0);

    sprite2.looks.setCostume(0);


    sprite2.motion.gotoXY(-147, 64);

    for (let i = 0; i < 7; i++) {

        await deploy(sprite1, false);
    }
    sprite1.looks.setCostume(1);
    await deploy(sprite1, true);
    // Promise.all(promises);

    setTimeout(async () => {
        renderLoop.deleteSprite("Backtop");
        sprite1.looks.hide();
        flop.looks.setBackdrop("./FLOP-JS.svg", "vector");

    }, 1000);


}

async function deploy(sprite, final) {
    if (!final) {
        flop.sound.playSound(-80, 100, 100, "Meow.wav");
    }
    await sprite.motion.gotoXY(-200, 25);

    const startX = -200;

    const endX = -30;

    for (let step = 1; sprite.motion.getX() < endX; step++) {
        await sprite.motion.changeX(5);

        sprite.looks.setEffect('pixalate', START_PIXELATION - (START_PIXELATION / (100 - startX)) * step * 5);
        sprite.looks.setEffect('brightness', START_BRIGHTNESS - (START_BRIGHTNESS / (100 - startX)) * step * 5);

    }
    const START2_PIXELATION = sprite.pixalate;
    const START2_BRIGHTNESS = sprite.brightness;


    for (let step = 1; sprite.motion.getX() < 100; step++) {
        await sprite.motion.changeX(5);
        sprite.motion.changeY((-24 - sprite.motion.getY()) / 20);
        sprite.looks.setEffect('pixalate', START2_PIXELATION - (START2_PIXELATION / (100 - endX)) * step * 5);
        sprite.looks.setEffect('brightness', START2_BRIGHTNESS - (START2_BRIGHTNESS / (100 - endX)) * step * 5);
    }
    await flop.sensing.resetTimer();
    await flop.control.waitUntil(() => flop.sensing.timer() > 1);
    if (!final) {
        for (let step = sprite.motion.getX(); step < 300; step += 5) {
            await sprite.motion.setX(step);
        }
    }
}

document.getElementById("start").addEventListener("click", async () => {
    await run();
});
