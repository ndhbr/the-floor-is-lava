import { Room } from "../enums/rooms";

const DEFAULT_SPEED = -350;

export class PlatformService {

	private room: Room;
	private positions: {
		x: number,
		y: number
	};

	private platformGroup: Phaser.GameObjects.Group;
	private platformPool: Phaser.GameObjects.Group;
	private nextPlatformDistance: number;

	private startPlatform: Phaser.GameObjects.TileSprite | any;
	private textureCounter: number;

	private platformSpeed: number;

	constructor(private scene: Phaser.Scene, room: Room) {
		this.room = room;

		if (room == Room.BASEMENT) {
			this.positions = {
				x: this.scene.physics.world.bounds.x,
				y: this.scene.physics.world.bounds.bottom
			};
		} else if (room == Room.LIVING_ROOM) {
			this.positions = {
				x: this.scene.physics.world.bounds.x,
				y: this.scene.physics.world.bounds.centerY
			};
		}

		this.platformGroup = this.scene.add.group({
			removeCallback: (platform) => {
				this.platformPool.add(platform);
			}
		});

		this.platformPool = this.scene.add.group({
			removeCallback: (platform) => {
				this.platformGroup.add(platform);
			}
		});

		// this.nextPlatformDistance = Phaser.Math.Between(50, 250);
		this.textureCounter = 0;
		this.platformSpeed = DEFAULT_SPEED;
		this.startPlatform = null;
	}

	addCollider(object: Phaser.GameObjects.GameObject |
		Phaser.GameObjects.GameObject[] | Phaser.GameObjects.Group |
		Phaser.GameObjects.Group[]): void {
		this.scene.physics.add.collider(
			object,
			this.platformGroup,
			this.setFriction,
			null,
			this.scene
		);

		this.scene.physics.add.collider(
			object,
			this.startPlatform,
			this.setFriction,
			null,
			this.scene
		);
	}

	update() {
		this.nextPlatformDistance = Phaser.Math.Between(64, 500);

		let minDistance = this.scene.physics.world.bounds.width;

		this.platformGroup.getChildren().forEach((platform: Phaser.Physics.Arcade.Sprite) => {
			let platformDistance = this.scene.physics.world.bounds.width - platform.x - platform.displayWidth / 2;

			// minDistance = Math.min(minDistance, platformDistance);
			minDistance = (platformDistance < minDistance) ? platformDistance : minDistance;

			if (platform.x < -platform.displayWidth / 2) {
				this.platformGroup.killAndHide(platform);
				this.platformGroup.remove(platform);
			} else {
				// platform.setVelocityX(this.platformSpeed);
			}
		}, this);

		if (minDistance > this.nextPlatformDistance) {
			this.addPlatform();
		}

		this.checkStartPlatform();
		// this.startPlatform.body.setVelocityX(this.platformSpeed);

		// if (this.platformSpeed > -450)
			// this.platformSpeed -= 0.02;
	}

	private addPlatform() {
		let platform: Phaser.Physics.Arcade.Sprite;
		let positionX = this.scene.physics.world.bounds.width;

		if (false && this.platformPool.getLength()) {
			platform = this.platformPool.getFirst();

			positionX += platform.displayWidth / 2;

			platform.setX(positionX);
			platform.setVelocityX(this.platformSpeed);
			platform.setActive(true);
			platform.setVisible(true);

			this.platformPool.remove(platform);
		} else {
			let textures;

			if (this.room == Room.LIVING_ROOM) {
				textures = [
					{
						key: 'table',
						height: 32,
						scale: 1
					},
					{
						key: 'couch',
						height: 32,
						scale: 1
					},
					{
						key: 'bed',
						height: 32,
						scale: 1
					},
					{
						key: 'closet',
						height: 64,
						scale: 2
					},
					{
						key: 'lamp',
						height: 48,
						scale: 1
					}
				];
			} else if (this.room == Room.BASEMENT) {
				textures = [
					{
						key: 'box',
						height: 32,
						scale: 1
					},
					{
						key: 'lamp',
						height: 48,
						scale: 1
					},
					{
						key: 'wineShelf',
						height: 64,
						scale: 2
					}
				]
			}

			platform = this.scene.physics.add.sprite(
				positionX,
				this.positions.y - 16 - textures[this.textureCounter].height,
				textures[this.textureCounter].key
			);
			positionX +=  platform.displayWidth / 2;
			platform.setX(positionX);
			platform.setScale(textures[this.textureCounter].scale);
			platform.setOrigin(0.5, 0.5);
			platform.setImmovable(true);
			platform.setVelocityX(this.platformSpeed);

			this.platformGroup.add(platform);

			const random = Phaser.Math.Between(1, 3);

			this.textureCounter += random;

			if (this.textureCounter > textures.length-1)
				this.textureCounter = 0;
		}
	}

	addStartPlatform(): void {
		if (this.startPlatform == null) {
			this.startPlatform = this.scene.add.tileSprite(
				this.scene.physics.world.bounds.centerX,
				this.positions.y - 16 - 32,
				this.scene.physics.world.bounds.width,
				32,
				'startPlatform'
			);
			this.startPlatform.depth = 2;

			this.scene.physics.add.existing(this.startPlatform);

			let body: Phaser.Physics.Arcade.Body = this.startPlatform.body;

			body.setEnable();
			body.setImmovable(true);
			body.setVelocityX(this.platformSpeed);
		} else {
			this.startPlatform.setX(this.scene.physics.world.bounds.centerX);
			this.startPlatform.body.setVelocityX(this.platformSpeed);
			this.startPlatform.setActive(true);
			this.startPlatform.setVisible(true);
		}
	}

	checkStartPlatform(): boolean {
		if (this.startPlatform != null) {
			if (this.startPlatform.x < - this.startPlatform.width / 2) {
				this.startPlatform.setActive(false);
				this.startPlatform.setVisible(false);

				return false;
			}
		} else {
			return false;
		}

		return true;
	}

	clearPlatforms(): void {
		this.textureCounter = 0;
		this.platformGroup.clear(true, true);
	}

	getPlatformGroup(): Phaser.GameObjects.Group {
		return this.platformGroup;
	}

	getPlatformPool(): Phaser.GameObjects.Group {
		return this.platformPool;
	}

	getStartPlatform(): Phaser.GameObjects.Group {
		return this.startPlatform;
	}

	private setFriction(player: Phaser.Physics.Arcade.Sprite, platform: any) {
		player.body.x -= platform.body.x - platform.body.prev.x;
	}
}