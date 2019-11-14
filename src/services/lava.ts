export class LavaService {

	lava: Phaser.GameObjects.TileSprite;

	lavaParticles: Phaser.GameObjects.Particles.ParticleEmitterManager;
	lavaParticlesPositonX: number;

	constructor(private scene: Phaser.Scene) {
		this.scene.anims.create({
			key: 'lava',
			frames: this.scene.anims.generateFrameNumbers('lava', {start: 0, end: 15}),
			frameRate: 10,
			repeat: -1
		});
	}

	init() {
		this.lava = this.scene.add.tileSprite(
			this.scene.physics.world.bounds.centerX,
			this.scene.physics.world.bounds.bottom - 4,
			this.scene.physics.world.bounds.width,
			16,
			'lava'
		);
	}

	addLavaParticles() {
		this.lavaParticles = this.scene.add.particles('particle');
		this.lavaParticlesPositonX = this.scene.physics.world.bounds.width + 100;

		this.lavaParticles.createEmitter({
			x: 0,
			y: this.scene.physics.world.bounds.bottom - 10,
			speed: 50,
			angle: { min: 180, max: 360 },
			scale: { start: 1, end: 0.1 },
			gravityX: 10,
			lifespan: 2000
		});
	}

	updateLavaParticles() {
		this.lava.tilePositionX += 4;
		this.lavaParticlesPositonX -= 1;
		this.lavaParticles.setX(this.lavaParticlesPositonX);

		if(this.lavaParticlesPositonX < this.scene.physics.world.bounds.left - 100)
			this.lavaParticlesPositonX = this.scene.physics.world.bounds.width + 100;
	}
}