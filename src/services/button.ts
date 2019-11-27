import { DefaultText } from "../classes/default-text";

export class ButtonService {

	constructor(private scene: Phaser.Scene) {}

	public generateButton(x: number, y: number,
		container: Phaser.GameObjects.Container,
		type: string, text: string, callback: (container) => void): void {
		const textPositionY = -2;

		container = this.scene.add.container(
			x,
			y,
		);

		let buttonBg = this.scene.add.sprite(
			0,
			0,
			type,
			0
		);
		buttonBg.setInteractive();
		buttonBg.setScale(2);

		let buttonText = new DefaultText(
			this.scene,
			0,
			0,
			text,
			32
		);

		buttonText.setOrigin(0.5, 0.5);

		container.add(buttonBg);
		container.add(buttonText);
		container.setDepth(4);

		buttonBg.on('pointerdown', () => {
			buttonText.y = textPositionY + 4;
			buttonBg.setFrame(1);
		}, this);

		buttonBg.on('pointerout', () => {
			buttonText.y = textPositionY;
			buttonBg.setFrame(0);
			callback(container);
		});
	}
}