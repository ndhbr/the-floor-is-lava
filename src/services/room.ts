export class RoomService {

	roof: Phaser.GameObjects.TileSprite;

	livingRoom: Phaser.GameObjects.TileSprite;
	basement: Phaser.GameObjects.TileSprite;

	livingRoomFloor: Phaser.GameObjects.TileSprite;
	basementFloor: Phaser.GameObjects.TileSprite;

	constructor(private scene: Phaser.Scene) {}

	preload() {}

	drawFloors() {
		this.livingRoomFloor = this.scene.add.tileSprite(
			this.scene.physics.world.bounds.centerX,
			this.scene.physics.world.bounds.bottom - 16,
			this.scene.physics.world.bounds.width,
			32,
			'concreteWithLava'
		);
		this.livingRoomFloor.depth = 3;

		this.basementFloor = this.scene.add.tileSprite(
			this.scene.physics.world.bounds.centerX,
			(this.scene.physics.world.bounds.height / 2) - 16,
			this.scene.physics.world.bounds.width,
			32,
			'concreteWithLava'
		);

		this.roof = this.scene.add.tileSprite(
			this.scene.physics.world.bounds.centerX,
			32,
			this.scene.physics.world.bounds.width,
			64,
			'concreteWithRoof'
		);
	}

	drawBackgrounds() {
		this.basement = this.scene.add.tileSprite(
			0,
			this.scene.physics.world.bounds.height / 2,
			this.scene.physics.world.bounds.width,
			this.scene.physics.world.bounds.height / 2,
			'cobblestone'
		);

		this.livingRoom = this.scene.add.tileSprite(
			0,
			0,
			this.scene.physics.world.bounds.width,
			this.scene.physics.world.bounds.height / 2,
			'wood'
		);

		this.basement.setOrigin(0, 0);
		this.livingRoom.setOrigin(0, 0);
	}

	updateTilePositions() {
		this.basement.tilePositionX += 1;
		this.livingRoom.tilePositionX += 1;

		this.roof.tilePositionX += 3;

		this.livingRoomFloor.tilePositionX += 3;
		this.basementFloor.tilePositionX += 3;
	}
}