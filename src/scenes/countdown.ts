import * as Phaser from 'phaser';
import { DefaultText } from '../classes/default-text';
import { Animations } from '../services/animations';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Countdown',
};

export class CountdownScene extends Phaser.Scene {

    constructor() {
        super(sceneConfig);
    }

    public init(data: any): void {}

    public preload(): void {}

    public create(data: any): void {
        let backdrop = this.add.rectangle(
			this.physics.world.bounds.centerX,
			this.physics.world.bounds.centerY,
			this.physics.world.bounds.width,
			this.physics.world.bounds.height,
			0x000000,
			0.6
		);

        let countdown = new DefaultText(
            this,
            this.physics.world.bounds.centerX,
            this.physics.world.bounds.centerY,
            3 + '',
            128
		);
		countdown.setOrigin(0.5, 0.5);

		let seconds = 3;
		this.tweens.add({
			targets: countdown,
			scale: 0,
			ease: 'Linear',
			duration: 1000,
			yoyo: false,
			repeat: 3,
			onRepeat: () => {
				countdown.scaleX = 0;

				seconds--;
				countdown.setText(seconds + '');

				if (seconds == 0) {
					this.scene.stop();
					this.scene.resume('Game');
				}
			}
		});
    }

    public update(time: number): void {}
}
