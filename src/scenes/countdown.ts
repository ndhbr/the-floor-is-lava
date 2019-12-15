import * as Phaser from 'phaser';
import { DefaultText } from '../classes/default-text';

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
        backdrop.setDepth(10);

        let seconds = 3;
        let countdown = new DefaultText(
            this,
            this.physics.world.bounds.centerX,
            this.physics.world.bounds.centerY,
            3 + '',
            64
        );

        let timer = setInterval(() => {
            if (seconds == 0) {
                this.scene.stop();
                this.scene.resume('Game');

                clearInterval(timer);
                timer = null;
            } else {
                console.log(seconds);
                
                seconds--;
                countdown.setText(seconds + '');
            }
        }, 1000);
    }

    public update(time: number): void {}
}
