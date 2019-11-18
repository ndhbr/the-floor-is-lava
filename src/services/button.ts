export class ButtonService {

	constructor(private scene: Phaser.Scene) {}

	public generateButton(x: number, y: number,
		container: Phaser.GameObjects.Container,
		type: string, text: string, callback: (container) => void): void {
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

		let buttonText = this.scene.add.text(
			0, -5, text, {
				fontFamily: 'Roboto, Calibri, sans-serif',
				shadow: {
					offsetX: 5,
					offsetY: 5,
					color: '#000',
					blur: 0,
					stroke: false,
					fill: false
				}
			}
		);
		buttonText.setOrigin(0.5, 0.5);

		container.add(buttonBg);
		container.add(buttonText);

		buttonBg.on('pointerdown', () => {
			buttonText.y += 3;
			buttonBg.setFrame(1);
		}, this);

		buttonBg.on('pointerup', () => {
			buttonText.y -= 3;
			buttonBg.setFrame(0);
			callback(container);
		});
	}
}