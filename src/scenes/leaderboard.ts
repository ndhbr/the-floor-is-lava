import * as Phaser from 'phaser';
import { ButtonService } from '../services/button';
import { DefaultText } from '../classes/default-text';
import { Animations } from '../services/animations';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Leaderboard',
};

export class LeaderboardScene extends Phaser.Scene {

    buttonService: ButtonService;

    constructor() {
        super(sceneConfig);

        this.buttonService = new ButtonService(this);
    }

    public init(data: any): void {}

    public preload(): void {}

    public create(data: any): void {
        this.addBackdrop();
        this.addCloseButton();
        this.loadLeaderboard('world');
    }

    public update(time: number): void {}

    private async loadLeaderboard(scope: string) {
        const leaderboard = await FBInstant.getLeaderboardAsync('global-score');
        let entries;

        if (scope === 'friends') {
            entries = await leaderboard.getConnectedPlayerEntriesAsync(10, 0);
        } else {
            entries = await leaderboard.getEntriesAsync(10, 0);
        }

        let i: number, currentY: number = 100;

		for (i = 0; i < entries.length; i++)
		{
            let entryText = new DefaultText(
                this,
                26,
                currentY,
                `${entries[i].getRank()}. ${entries[i].getPlayer().getName()}: ${entries[i].getScore()}`,
                24
            );

            Animations.weirdFadeIn(this, entryText);

            currentY += 20;
		}
    }

    private addCloseButton(): Phaser.GameObjects.Container {
        let container: Phaser.GameObjects.Container;

        this.buttonService.generateButton(
            50,
            50,
            container,
            'close',
            null,
            (button: Phaser.GameObjects.Container) => {
                this.scene.stop('Leaderboard');
            }
        );

        return container;
    }

    private addBackdrop(): Phaser.GameObjects.Rectangle {
        const backdrop = this.add.rectangle(
            this.physics.world.bounds.centerX,
            this.physics.world.bounds.centerY,
            this.physics.world.bounds.width,
            this.physics.world.bounds.height,
            0x000000,
            0.6
        );
        backdrop.depth = 4;

        return backdrop;
    }
}