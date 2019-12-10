export class Animations {

	constructor() {}

    public static weirdFadeIn(scene: Phaser.Scene, object: any) {
		object.alpha = 0;

        scene.tweens.add({
			targets: object,
			alphaTopLeft: { value: 1, duration: 250 },
			alphaTopRight: { value: 1, duration: 250, delay: 250 },
			alphaBottomLeft: { value: 1, duration: 250, delay: 250 },
			alphaBottomRight: { value: 1, duration: 250 }
		});
	}
	
	public static fadeIn(scene: Phaser.Scene, object: any, speed?: number) {
		object.alpha = 0;
	
		if (speed != null)
			speed = 250;

        scene.tweens.add({
			targets: object,
			alphaTopLeft: { value: 1, duration: speed },
			alphaTopRight: { value: 1, duration: speed },
			alphaBottomLeft: { value: 1, duration: speed },
			alphaBottomRight: { value: 1, duration: speed }
		});
	}
}