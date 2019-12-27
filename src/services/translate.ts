export class TranslateService {

    langFile: any;

	constructor(private scene: Phaser.Scene) {}

	public localise(scene: string, key: string): string | null {
        if (this.langFile == null)
            this.langFile = this.scene.cache.json.get('language-file');

		return this.langFile[scene][key];
	}
}