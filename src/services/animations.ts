export class Animations {

	static defaultSpeed: number = 100;

	constructor() {}

    public static weirdFadeIn(scene: Phaser.Scene, object: any) {
		object.alpha = 0;

        scene.tweens.add({
			targets: object,
			alphaTopLeft: { value: 1, duration: this.defaultSpeed },
			alphaTopRight: { value: 1, duration: this.defaultSpeed, delay: this.defaultSpeed },
			alphaBottomLeft: { value: 1, duration: this.defaultSpeed, delay: this.defaultSpeed },
			alphaBottomRight: { value: 1, duration: this.defaultSpeed }
		});
	}

	public static fadeIn(scene: Phaser.Scene, object: any, speed?: number) {
		object.alpha = 0;

		if (speed != null)
			speed = this.defaultSpeed;

        scene.tweens.add({
			targets: object,
			alphaTopLeft: { value: 1, duration: speed },
			alphaTopRight: { value: 1, duration: speed },
			alphaBottomLeft: { value: 1, duration: speed },
			alphaBottomRight: { value: 1, duration: speed }
		});
	}

	public static fadeOut(scene: Phaser.Scene, object: any, speed?: number,
		callback?: () => void) {
		object.alpha = 1;

		if (speed != null)
			speed = this.defaultSpeed;

		scene.tweens.add({
			targets: object,
			alphaTopLeft: { value: 0, duration: speed },
			alphaTopRight: { value: 0, duration: speed },
			alphaBottomLeft: { value: 0, duration: speed },
			alphaBottomRight: { value: 0, duration: speed }
		});

		if (callback != null)
			setTimeout(callback, speed);
	}
}