export class ScoreService {

	private score: number;
	private scoreText: Phaser.GameObjects.Text;

	constructor(private scene: Phaser.Scene) {
		this.score = 0;
	}

	initScoreText(value?: number) {
		this.scoreText = this.scene.add.text(
			this.scene.physics.world.bounds.centerX,
			128,
			null,
			{
				fontFamily: 'VT323, Roboto, Calibri, sans-serif',
				fontSize: '48px'
			}
		);
		this.scoreText.setShadow(2, 3, 'rgba(0,0,0,0.6)', 1);
		this.scoreText.setOrigin(0.5, 0.5);

		this.setScore(value);
	}

	incrementScore(value?: number) {
		if (!value)
			value = 1;

		this.score += value;

		this.updateScoreText();
	}

	decrementScore(value: number) {
		this.score -= value;

		this.updateScoreText();
	}

	resetScore() {
		this.score = 0;

		this.updateScoreText();
	}

	setScore(value?: number) {
		if (value)
			this.score = value;

		this.updateScoreText();
	}

	getScore() {
		return this.score;
	}

	private updateScoreText() {
		this.scoreText.setText(this.score + 'm');
	}
}
