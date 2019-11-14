import { Service } from "../interfaces/service";

export class RoomService implements Service {

	atticFloor: Phaser.GameObjects.TileSprite;
	livingRoom: Phaser.GameObjects.TileSprite;
	basement: Phaser.GameObjects.TileSprite;

	constructor(private scene: Phaser.Scene) {}

	preload() {}

	drawFloors() {
		this.scene.add.tileSprite(
			this.scene.physics.world.bounds.centerX,
			this.scene.physics.world.bounds.height / 3,
			this.scene.physics.world.bounds.width,
			32,
			'concrete'
		);

		this.scene.add.tileSprite(
			this.scene.physics.world.bounds.centerX,
			(this.scene.physics.world.bounds.height / 3) * 2,
			this.scene.physics.world.bounds.width,
			32,
			'concrete'
		);
	}

	drawBackgrounds() {
		this.basement = this.scene.add.tileSprite(
			0,
			(this.scene.physics.world.bounds.height / 3) * 2,
			this.scene.physics.world.bounds.width,
			this.scene.physics.world.bounds.height / 3,
			'cobblestone'
		);

		this.livingRoom = this.scene.add.tileSprite(
			0,
			(this.scene.physics.world.bounds.height / 3),
			this.scene.physics.world.bounds.width,
			this.scene.physics.world.bounds.height / 3,
			'wood'
		);

		this.atticFloor = this.scene.add.tileSprite(
			0,
			0,
			this.scene.physics.world.bounds.width,
			this.scene.physics.world.bounds.height / 3,
			'woodDark'
		);

		this.basement.setOrigin(0, 0);
		this.livingRoom.setOrigin(0, 0);
		this.atticFloor.setOrigin(0, 0);
	}

	updateTilePositions() {
		this.basement.tilePositionX += 1;
		this.livingRoom.tilePositionX += 1;
		this.atticFloor.tilePositionX += 1;
	}
}