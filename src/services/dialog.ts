import { DefaultText } from "../classes/default-text";

export class DialogService {

	constructor(private scene: Phaser.Scene) {}

	async add(heading: string, text: string, yesText?: string, noText?: string,
		yesCallback?: void, noCallback?: void): Promise<Phaser.GameObjects.Container> {
		const container = this.scene.add.container(
			this.scene.physics.world.bounds.centerX,
			this.scene.physics.world.bounds.centerY
		);

		const backdrop = this.scene.add.rectangle(
			0,
			0,
			this.scene.physics.world.bounds.width,
			this.scene.physics.world.bounds.height,
			0x000000,
			0
		);
		backdrop.setInteractive();

		const background = this.scene.add.graphics();
		background.fillStyle(0x888888);

		const headerBackground = this.scene.add.graphics();
		headerBackground.fillStyle(0xffffff);
		headerBackground.fillRoundedRect(
			-150,
			-150,
			300,
			48,
			{
				tl: 20,
				tr: 20,
				bl: 0,
				br: 0
			}
		);

		const headingText = new DefaultText(
			this.scene,
			-140,
			-140,
			heading,
			32
		);
		headingText.setTint(0x000000);

		const mainText = new DefaultText(
			this.scene,
			-140,
			-92,
			text,
			24
		);
		mainText.setDepth(10);
		mainText.setMaxWidth(280);
		background.fillRoundedRect(
			-150,
			-150,
			300,
			mainText.height + 64,
			20
		);

		const closeButton = this.scene.add.sprite(
			125,
			-127,
			'closeWithoutBox'
		);
		closeButton.setInteractive();
		closeButton.on('pointerdown', () => {
			container.setActive(false);
			container.setVisible(false);
		});

		if (yesText) {}

		if (noText) {}

		container.add(backdrop);
		container.add(background);
		container.add(headerBackground);
		container.add(headingText);
		container.add(closeButton);
		container.add(mainText);

		container.setDepth(5);

		return container;
	}

	public restoreDialog(container: Phaser.GameObjects.Container) {
		container.setActive(true);
		container.setVisible(true);
	}
}