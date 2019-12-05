import { Room } from "../enums/rooms";

export class BackgroundObjects extends Phaser.GameObjects.TileSprite {

	speed: number;

	constructor(scene: Phaser.Scene, room: Room, textureKey: string, speed?: number) {
		let x: number,
			y: number,
			width: number,
			height: number;

		super(scene, x, y, width, height, textureKey);

 		x = this.scene.physics.world.bounds.centerX;
		width = this.scene.physics.world.bounds.width;
		height = 64;

		if (room == Room.BASEMENT) {
 			y = this.scene.physics.world.bounds.bottom - 80;
 		} else {
            y = this.scene.physics.world.bounds.centerY - 64;
		}

		this.setPosition(x, y);
		this.setSize(width, height);
		this.setScale(1.5);
		this.setTint(0xbbbbbb);

		if (!speed) {
			this.speed = 1;
		} else {
			this.speed = speed;
		}

		this.scene.add.existing(this);
	}

	incrementTilePosition() {
		this.tilePositionX += this.speed;
	}
}