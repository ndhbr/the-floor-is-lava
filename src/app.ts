import * as Phaser from 'phaser';
import { PreloaderScene } from './scenes/preloader';
import { GameScene } from './scenes/game';
import { PauseMenuScene } from './scenes/pause-menu';
import { GameOverMenuScene } from './scenes/game-over-menu';
import { MainMenuScene } from './scenes/main-menu';

const DEFAULT_HEIGHT = 720;
const DEFAULT_WIDTH = (window.innerWidth / window.innerHeight) * DEFAULT_HEIGHT;

const config: Phaser.Types.Core.GameConfig = {
    title: 'First Game',
    type: Phaser.AUTO,
    scale: {
        parent: 'game',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: DEFAULT_WIDTH,
		height: DEFAULT_HEIGHT
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
	scene: [PreloaderScene, MainMenuScene, GameScene, GameOverMenuScene, PauseMenuScene],
	backgroundColor: '#2b2b2b',
	render: {
		pixelArt: true
	}
};

export class TheFloorIsLava extends Phaser.Game {
    constructor(config: Phaser.Types.Core.GameConfig) {
		super(config);
	}
}

window.onload = () => {
	// FBInstant.initializeAsync().then(function() {
		let game: TheFloorIsLava = new TheFloorIsLava(config);
	// });
};