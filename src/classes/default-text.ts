export class DefaultText extends Phaser.GameObjects.BitmapText {

	constructor(scene: Phaser.Scene, x: number, y: number,
		text?: string | string[], size?: number,
		align?: number) {
		super(scene, x, y, 'basis33', text, size, align);

		this.setDepth(4);

		scene.add.existing(this);
	}
}