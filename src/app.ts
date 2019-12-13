import * as Phaser from 'phaser';
import { PreloaderScene } from './scenes/preloader';
import { GameScene } from './scenes/game';
import { PauseMenuScene } from './scenes/pause-menu';
import { GameOverMenuScene } from './scenes/game-over-menu';
import { MainMenuScene } from './scenes/main-menu';
import { LeaderboardScene } from './scenes/leaderboard';

// DEBUG URL: https://www.facebook.com/embed/instantgames/566170080885812/player?game_url=https%3A%2F%2Flocalhost%3A8080
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
	scene: [PreloaderScene, MainMenuScene, GameScene, GameOverMenuScene, PauseMenuScene, LeaderboardScene],
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

window.onload = async () => {
	await FBInstant.initializeAsync()
	await FBInstant.startGameAsync();

	let game: TheFloorIsLava = new TheFloorIsLava(config);

	// window.addEventListener('resize', () => {
	// 	game.scale.resize(window.innerWidth, window.innerHeight);
	// 	game.scale.refresh();
	// });
};