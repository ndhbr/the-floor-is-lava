import { DefaultText } from "../classes/default-text";
import { Animations } from "./animations";

export class ButtonService {

	constructor(private scene: Phaser.Scene) {}

	public generateButton(x: number, y: number,
		container: Phaser.GameObjects.Container,
		type: string, text: string, callback: (container) => void,
		startFrame?: number): void {
		const textPositionY = -2;
		let frameUp = 0;
		let frameDown = 1;

		if (startFrame) {
			frameUp += startFrame;
			frameDown += startFrame;
		}

		container = this.scene.add.container(
			x,
			y,
		);

		let buttonBg = this.scene.add.sprite(
			0,
			0,
			type,
			frameUp
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
			buttonBg.setFrame(frameDown);
		}, this);

		buttonBg.on('pointerup', () => {
			buttonText.y = textPositionY;
			buttonBg.setFrame(frameUp);
			this.scene.sound.play('menuSelect');
			callback(container);
		}, this);

		Animations.fadeIn(this.scene, container, 100);
	}
}