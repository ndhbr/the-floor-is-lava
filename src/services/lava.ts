export class LavaService {

	livingRoomLava: Phaser.GameObjects.TileSprite;
	livingRoomFurnitureOverlay: Phaser.Physics.Arcade.Group;
	basementLava: Phaser.GameObjects.TileSprite;
	basementFurnitureOverlay: Phaser.Physics.Arcade.Group;

	livingRoomLavaParticles: Phaser.GameObjects.Particles.ParticleEmitterManager;
	livingRoomLavaParticlesPositionX: number;
	basementLavaParticles: Phaser.GameObjects.Particles.ParticleEmitterManager;
	basementLavaParticlesPositonX: number;

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
		this.livingRoomFurnitureOverlay = this.scene.physics.add.group();

		let lavaNeeded = this.scene.physics.world.bounds.width / 32 + 1;
		for (let i = 0; i < lavaNeeded; i++) {
			let lava = this.scene.physics.add.sprite(
				i * 32,
				this.scene.physics.world.bounds.bottom - 24,
				'lava'
			);

			lava.depth = 3;

			this.basementFurnitureOverlay.add(lava);

			lava = this.scene.physics.add.sprite(
				i * 32,
				this.scene.physics.world.bounds.centerY - 24,
				'lava'
			);

			lava.depth = 3;

			this.livingRoomFurnitureOverlay.add(lava);
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
		this.livingRoomFurnitureOverlay.playAnimation('lava');
	}

	addLavaParticles() {
		this.basementLavaParticles = this.scene.add.particles('particle');
		this.basementLavaParticlesPositonX = this.getRandomParticlesStartPosition();
		this.createEmitter(this.basementLavaParticles, 0, this.scene.physics.world.bounds.bottom - 32 - 10);

		this.livingRoomLavaParticles = this.scene.add.particles('particle');
		this.livingRoomLavaParticlesPositionX = this.getRandomParticlesStartPosition();
		this.createEmitter(this.basementLavaParticles, 0, this.scene.physics.world.bounds.centerY - 32 - 10);
	}

	updateLavaParticles() {
		this.livingRoomLava.tilePositionX += 4;
		this.basementLava.tilePositionX += 4;

		this.basementLavaParticlesPositonX -= Math.random();
		this.basementLavaParticles.setX(this.basementLavaParticlesPositonX);

		if(this.basementLavaParticlesPositonX < this.scene.physics.world.bounds.left - 100)
			this.basementLavaParticlesPositonX = this.scene.physics.world.bounds.width + 100;

		this.livingRoomLavaParticlesPositionX -= Math.random();
		this.livingRoomLavaParticles.setX(this.livingRoomLavaParticlesPositionX);

		if(this.livingRoomLavaParticlesPositionX < this.scene.physics.world.bounds.left - 100)
			this.livingRoomLavaParticlesPositionX = this.scene.physics.world.bounds.width + 100;
	}

	private getRandomParticlesStartPosition() {
		return Phaser.Math.Between(
			this.scene.physics.world.bounds.width + 50,
			this.scene.physics.world.bounds.width + 150
		);
	}

	private createEmitter(particles: Phaser.GameObjects.Particles.ParticleEmitterManager,
		x: number, y: number) {
		particles.createEmitter({
			x: x,
			y: y,
			speed: 50,
			angle: { min: 180, max: 360 },
			scale: { start: 1, end: 0.1 },
			gravityX: 10,
			lifespan: 2000
		});

		particles.depth = 0;
	}
}