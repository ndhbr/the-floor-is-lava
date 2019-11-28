export class RoomService {

	lampPositionsX: {
		start: number,
		end: number
	};

	roof: Phaser.GameObjects.TileSprite;

	basementLamp: Phaser.Physics.Arcade.Sprite;
	basementLampLight: Phaser.GameObjects.Light;

	livingRoomLamp: Phaser.Physics.Arcade.Sprite;
	livingRoomLampLight: Phaser.GameObjects.Light;

	livingRoom: Phaser.GameObjects.TileSprite;
	basement: Phaser.GameObjects.TileSprite;

	livingRoomFloor: Phaser.GameObjects.TileSprite;
	basementFloor: Phaser.GameObjects.TileSprite;

	constructor(private scene: Phaser.Scene) {
		this.lampPositionsX = {
			start: this.scene.physics.world.bounds.width + 200,
			end: -200
		};
	}

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
		this.basementFloor.depth = 3;

		this.roof = this.scene.add.tileSprite(
			this.scene.physics.world.bounds.centerX,
			32,
			this.scene.physics.world.bounds.width,
			64,
			'concreteWithRoof'
		);
	}

	drawCeilingLamps() {
		this.basementLamp = this.scene.physics.add.sprite(
			this.lampPositionsX.start,
			this.scene.physics.world.bounds.centerY + 32,
			'ceilingLamp'
		);

		this.basementLampLight = this.scene.lights.addLight(
			this.lampPositionsX.start,
			this.scene.physics.world.bounds.centerY + 64,
			300
		);

		this.livingRoomLamp = this.scene.physics.add.sprite(
			this.lampPositionsX.start,
			96,
			'ceilingLamp'
		);

		this.livingRoomLampLight = this.scene.lights.addLight(
			this.lampPositionsX.start,
			128,
			300
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
		this.basement.setPipeline('Light2D');

		this.livingRoom = this.scene.add.tileSprite(
			0,
			0,
			this.scene.physics.world.bounds.width,
			this.scene.physics.world.bounds.height / 2,
			'wood'
		);
		this.livingRoom.setPipeline('Light2D');

		this.basement.setOrigin(0, 0);
		this.livingRoom.setOrigin(0, 0);
	}

	updateTilePositions() {
		this.basement.tilePositionX += 1;
		this.livingRoom.tilePositionX += 1;

		this.roof.tilePositionX += 3;

		this.livingRoomFloor.tilePositionX += 3;
		this.basementFloor.tilePositionX += 3;

		this.basementLampLight.x -= 3;
		this.basementLamp.x -= 3;

		this.livingRoomLamp.x -= 3;
		this.livingRoomLampLight.x -= 3;

		if (this.basementLampLight.x < this.lampPositionsX.end) {
			this.basementLamp.x = this.lampPositionsX.start;
			this.basementLampLight.x = this.lampPositionsX.start;

			this.livingRoomLamp.x = this.lampPositionsX.start;
			this.livingRoomLampLight.x = this.lampPositionsX.start;
		}
	}
}