import { ButtonService } from "./button";

export class SoundService {

	buttonService: ButtonService;

	constructor(private scene: Phaser.Scene) {
		this.buttonService = new ButtonService(this.scene);
	}

	public async addSoundButton(): Promise<Phaser.GameObjects.Container> {
		let container: Phaser.GameObjects.Container;
		let startFrame = 0;

		let data = await FBInstant.player.getDataAsync(['soundMuted']);
		let fbMute = false;
		if (data != null && data.soundMuted) {
			fbMute = true;
			this.scene.sound.mute = fbMute;
		}

		if (this.isSoundMuted() || fbMute)
			startFrame += 2;

		this.buttonService.generateButton(
			this.scene.physics.world.bounds.right - 50,
			this.scene.physics.world.bounds.bottom - 50,
			container,
			'button-pixel-orange-sound',
			'',
			async (button: Phaser.GameObjects.Container) => {
				let btn = <Phaser.GameObjects.Sprite> button.getAt(0);

				if (!this.scene.sound.mute) {
					btn.setFrame(2);
					this.scene.sound.mute = true;
					await FBInstant.player.setDataAsync({
						soundMuted: true
					});
				} else {
					btn.setFrame(0);
					this.scene.sound.mute = false;
					await FBInstant.player.setDataAsync({
						soundMuted: false
					});
				}
			},
			startFrame
		);

		return container;
	}

	public isSoundMuted(): boolean {
		return this.scene.sound.mute;
	}
}