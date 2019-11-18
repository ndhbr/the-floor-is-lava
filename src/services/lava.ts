export class LavaService {

	livingRoomLava: Phaser.GameObjects.TileSprite;
	livingRoomFurnitureOverlay: Phaser.Physics.Arcade.Group;
	basementLava: Phaser.GameObjects.TileSprite;
	basementFurnitureOverlay: Phaser.Physics.Arcade.Group;

	lavaParticles: Phaser.GameObjects.Particles.ParticleEmitterManager;
	lavaParticlesPositonX: number;

	constructor(private scene: Phaser.Scene) {}

	init() {
		this.scene.anims.create({
			key: 'lava',
			frames: this.scene.anims.generateFrameNumbers('lava', {start: 0, end: 2}),
			frameRate: 6,
			repeat: -1
		});

		this.livingRoomLava = this.scene.add.tileSprite(
			this.scene.physics.world.bounds.centerX,
			this.scene.physics.world.bounds.centerY - 4 - 32,
			this.scene.physics.world.bounds.width,
			16,
			'lava',
			0
		);

		this.basementFurnitureOverlay = this.scene.physics.add.group();

		let lavaNeeded = this.scene.physics.world.bounds.width / 32 + 1;
		for (let i = 0; i < lavaNeeded; i++) {
			let lava = this.scene.physics.add.sprite(
				i * 32,
				this.scene.physics.world.bounds.bottom - 24,
				'lava'
			);

			lava.depth = 3;

			this.basementFurnitureOverlay.add(lava);
		}

		this.basementLava = this.scene.add.tileSprite(
			this.scene.physics.world.bounds.centerX,
			this.scene.physics.world.bounds.bottom - 4 - 32,
			this.scene.physics.world.bounds.width,
			16,
			'lava',
			0
		);
	}

	animate() {
		this.basementFurnitureOverlay.playAnimation('lava');
	}

	addLavaParticles() {
		this.lavaParticles = this.scene.add.particles('particle');
		this.lavaParticlesPositonX = this.scene.physics.world.bounds.width + 100;

		this.lavaParticles.createEmitter({
			x: 0,
			y: this.scene.physics.world.bounds.bottom - 32 - 10,
			speed: 50,
			angle: { min: 180, max: 360 },
			scale: { start: 1, end: 0.1 },
			gravityX: 10,
			lifespan: 2000
		});
		this.lavaParticles.depth = 0;
	}

	updateLavaParticles() {
		this.livingRoomLava.tilePositionX += 4;
		this.basementLava.tilePositionX += 4;

		this.lavaParticlesPositonX -= 1;
		this.lavaParticles.setX(this.lavaParticlesPositonX);

		if(this.lavaParticlesPositonX < this.scene.physics.world.bounds.left - 100)
			this.lavaParticlesPositonX = this.scene.physics.world.bounds.width + 100;
	}
}