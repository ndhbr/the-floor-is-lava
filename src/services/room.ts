import { Room } from "../enums/rooms";
import { BackgroundObjects } from "../classes/background-objects";

export class RoomService {

	lampPositionsX: {
		start: number,
		end: number
	};

	floorPositions: {
		basement: {
			x: number,
			y: number
		},
		livingRoom: {
			x: number,
			y: number
		}
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

	basementBackgroundObjectsLayer0: BackgroundObjects;
	basementBackgroundObjectsLayer1: BackgroundObjects;

	constructor(private scene: Phaser.Scene) {
		this.lampPositionsX = {
			start: this.scene.physics.world.bounds.width + 300,
			end: -300
		};

		this.floorPositions = {
			livingRoom: {
				x: this.scene.physics.world.bounds.centerX,
				y: (this.scene.physics.world.bounds.height / 2) - 16,
			},
			basement: {
				x: this.scene.physics.world.bounds.centerX,
				y: this.scene.physics.world.bounds.bottom - 16
			}
		};
	}

	preload() {}

	addCollider(object: Phaser.GameObjects.GameObject |
		Phaser.GameObjects.GameObject[] | Phaser.GameObjects.Group |
		Phaser.GameObjects.Group[], gameOverCallback: () => void): void {

		this.scene.physics.add.collider(
			object,
			this.livingRoomFloor,
			(object1: Phaser.GameObjects.GameObject, object2: Phaser.GameObjects.GameObject) => {
				let body = <Phaser.Physics.Arcade.Body>object2.body;

				if (body.touching.up)
					gameOverCallback();
			}
		);

		this.scene.physics.add.collider(
			object,
			this.basementFloor,
			(object1: Phaser.GameObjects.GameObject, object2: Phaser.GameObjects.GameObject) => {
				gameOverCallback();
			}
		);

		this.scene.physics.add.collider(
			object,
			this.roof
		);
	}

	drawFloors() {
		this.drawFloor(Room.BASEMENT);
		this.drawFloor(Room.LIVING_ROOM);

		this.drawRoof();
	}

	private drawRoof() {
		this.roof = this.scene.add.tileSprite(
			this.scene.physics.world.bounds.centerX,
			32,
			this.scene.physics.world.bounds.width,
			64,
			'concreteWithRoof'
		);

		this.scene.physics.add.existing(this.roof);

		let body = <Phaser.Physics.Arcade.Body>this.roof.body;

		body.setEnable();
		body.setImmovable(true);
	}

	private drawFloor(room: Room) {
		let x: number, y: number;

		if (room == Room.BASEMENT) {
			x = this.floorPositions.basement.x;
			y = this.floorPositions.basement.y;
		} else {
			x = this.floorPositions.livingRoom.x;
			y = this.floorPositions.livingRoom.y;
		}

		let floor = this.scene.add.tileSprite(
			x,
			y,
			this.scene.physics.world.bounds.width,
			32,
			'concreteWithLava'
		);

		floor.setDepth(3);

		this.scene.physics.add.existing(floor);

		let body = <Phaser.Physics.Arcade.Body>floor.body;
		body.setEnable();
		body.setImmovable(true);

		if (room == Room.BASEMENT) {
			this.basementFloor = floor;
		} else {
			this.livingRoomFloor = floor;
		}
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

		this.basementBackgroundObjectsLayer0 = new BackgroundObjects(this.scene,
			Room.BASEMENT, 'backgroundBasement0');
		this.basementBackgroundObjectsLayer1 = new BackgroundObjects(this.scene,
			Room.BASEMENT, 'backgroundBasement1', 2);
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

		this.basementBackgroundObjectsLayer0.incrementTilePosition();
		this.basementBackgroundObjectsLayer1.incrementTilePosition();
	}
}