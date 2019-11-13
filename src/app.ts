import * as Phaser from 'phaser';
import { GameScene } from './scenes/game';

// const DEFAULT_HEIGHT = 1080;
// const DEFAULT_WIDTH = (window.innerWidth / window.innerHeight) * DEFAULT_HEIGHT;

const config: Phaser.Types.Core.GameConfig = {
    title: 'First Game',
    type: Phaser.AUTO,
    scale: {
        parent: 'game',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
		height: window.innerHeight
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
	scene: [GameScene],
	backgroundColor: '#2b2b2b',
	render: {
		pixelArt: true
	}
};

export class FirstGame extends Phaser.Game {
    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config);
    }
}

window.onload = () => {
	let game: FirstGame = new FirstGame(config);
};