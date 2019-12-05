import { Room } from "../enums/rooms";

export class BackgroundObjects extends Phaser.GameObjects.TileSprite {

	constructor(scene: Phaser.Scene, room: Room, frameKey?: string | number) {
		let x: number,
			y: number,
			width: number,
			height: number,
			textureKey: string;

		super(scene, x, y, width, height, textureKey, frameKey);

		x = 0;
		width = this.scene.physics.world.bounds.width;
		height = 64;

		if (room == Room.BASEMENT) {
			textureKey = '';
			y = this.scene.physics.world.bounds.bottom;
		} else {
			textureKey = '';
            y = this.scene.physics.world.bounds.centerY;
		}

		this.setOrigin(0, 0);
		this.setPosition(x, y);
		this.setTexture(textureKey);
		this.setSize(width, height);
	}
}