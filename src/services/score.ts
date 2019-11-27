import { DefaultText } from "../classes/default-text";

export class ScoreService {

	private score: number;
	private scoreText: DefaultText;

	constructor(private scene: Phaser.Scene) {
		this.score = 0;
	}

	initScoreText(value?: number) {
		this.scoreText = new DefaultText(
			this.scene,
			this.scene.physics.world.bounds.centerX,
			128,
			null,
			48
		);

		this.scoreText.setOrigin(0.5, 0.5);

		this.setScore(value);
	}

	setVisibility(visible?: boolean) {
		this.scoreText.setVisible(visible);
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
