export class TranslateService {

	constructor(private scene: Phaser.Scene) {}

	public localise(scene: string, key: string): string | null {
		const langFile = this.scene.cache.json.get('language-file');

		return langFile[scene][key];
	}
}