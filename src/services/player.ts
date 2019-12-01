import { Room } from "../enums/rooms";

const GRAVITY_Y = 2000;

export class PlayerService {

	player: Phaser.Physics.Arcade.Sprite;
	playerJumps: number;

	startPosition: {
		livingRoom: {
			x: number,
			y: number
		},
		basement: {
			x: number,
			y: number
		}
	};
	currentRoom: Room;

	constructor(private scene: Phaser.Scene) {
		this.startPosition = {
			livingRoom: {
				x: 50,
				y: 0
			},
			basement: {
				x: 50,
				y: this.scene.physics.world.bounds.centerY + 64
			}
		};

		this.currentRoom = Room.LIVING_ROOM;
	}

	addPlayer() {
		if (this.currentRoom == Room.LIVING_ROOM) {
			this.player = this.scene.physics.add.sprite(
				this.startPosition.livingRoom.x,
				this.startPosition.livingRoom.y,
				'player'
			);
		} else if (this.currentRoom == Room.BASEMENT) {
			this.player = this.scene.physics.add.sprite(
				this.startPosition.basement.x,
				this.startPosition.basement.y,
				'player'
			);
		}

		this.player.depth = 2;
		// this.player.setBounceY(1);

		this.scene.anims.create({
			key: 'run',
			frames: this.scene.anims.generateFrameNumbers('player', {start: 0, end: 7}),
			frameRate: 10,
			repeat: -1
		});

		this.scene.anims.play('run', this.player);

		this.player.setGravityY(GRAVITY_Y);
	}

	resetPosition() {
		this.player.setVelocity(0, 0);

		if (this.currentRoom == Room.BASEMENT) {
			this.player.setPosition(
				this.startPosition.basement.x,
				this.startPosition.basement.y
			);
		} else if (this.currentRoom == Room.LIVING_ROOM) {
			this.player.setPosition(
				this.startPosition.livingRoom.x,
				this.startPosition.livingRoom.y
			);
		}
	}

	jump() {
		if (this.player.body.touching.down || (this.playerJumps > 0 && this.playerJumps < 2)) {
			if (this.player.body.touching.down)
				this.playerJumps = 0;

			if (this.playerJumps < 2) {
				this.player.setVelocityY(-600);
			} else {
				// this.player.setVelocityY(-1200);
			}

			this.playerJumps++;
		}
	}

	animate() {}

	getPlayer(): Phaser.Physics.Arcade.Sprite {
		return this.player;
	}

	getCurrentRoom(): Room {
		return this.currentRoom;
	}

	getBounds() {
		return this.player.getBounds();
	}

	toggleRoom(): Room {
		if (this.currentRoom == Room.LIVING_ROOM) {
			this.setRoom(Room.BASEMENT);
			return Room.BASEMENT;
		} else {
			this.setRoom(Room.LIVING_ROOM);
			return Room.LIVING_ROOM;
		}
	}

	setRoom(room: Room) {
		this.currentRoom = room;
		this.resetPosition();
	}

	setPlayerJumps(value?: number) {
		if (!value)
			value = 0;

		this.playerJumps = value;
	}

	getPlayerJumps() {
		return this.playerJumps;
	}
}