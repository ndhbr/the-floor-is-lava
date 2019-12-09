import { ButtonService } from "./button";

export class SoundService {

	buttonService: ButtonService;

	constructor(private scene: Phaser.Scene) {
		this.buttonService = new ButtonService(this.scene);
	}

	public addSoundButton(): Phaser.GameObjects.Container {
		let container: Phaser.GameObjects.Container;

		this.buttonService.generateButton(
			this.scene.physics.world.bounds.right - 50,
			this.scene.physics.world.bounds.bottom - 50,
			container,
			'button-pixel-orange-sound',
			'',
			(button: Phaser.GameObjects.Container) => {
				let btn = <Phaser.GameObjects.Sprite> button.getAt(0);

				if (!this.scene.sound.mute) {
					btn.setFrame(2);
					this.scene.sound.mute = true;
				} else {
					btn.setFrame(0);
					this.scene.sound.mute = false;
				}
			}
		);

		return container;
	}

	public playSound(): void {
		//
	}

	public isSoundMuted(): boolean {
		return this.scene.sound.mute;
	}
}