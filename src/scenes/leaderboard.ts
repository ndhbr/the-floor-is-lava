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

    public init(data: any): void {
		this.load.on(`filecomplete-image`,
		() => {
			console.log('Loaded image');
		});
	}

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

        let i: number, currentY: number = 120;

		for (i = 0; i < entries.length; i++)
		{
            // let entryText = new DefaultText(
            //     this,
            //     26,
            //     currentY,
            //     `${entries[i].getRank()}. ${entries[i].getPlayer().getName()}: ${entries[i].getScore()}`,
            //     24
            // );

            // Animations.weirdFadeIn(this, entryText);
			this.addLeaderboardBadge(this.physics.world.bounds.centerX, currentY, entries[i]);

            currentY += 20;
		}
	}

	private addLeaderboardBadge(x: number, y: number, leaderboardEntry: FBInstant.LeaderboardEntry) {
		let container: Phaser.GameObjects.Container = this.add.container(
			x,
			y
		);
		container.setDepth(4);

		const profilePictureKey: string = `profilePicture${leaderboardEntry.getPlayer().getID()}`

		this.load.on(`filecomplete-image`,
		() => {
			console.log('Loaded image');

			const profilePicture = this.add.sprite(
				container.getBounds().width,
				container.getBounds().centerY,
				profilePictureKey
			);

			container.add(profilePicture);
		}, this);

		console.log(leaderboardEntry.getPlayer().getPhoto());
		console.log(FBInstant.player.getPhoto());

		// this.load.image(profilePictureKey, leaderboardEntry.getPlayer().getPhoto());
		this.load.image(profilePictureKey, 'https://platform-lookaside.fbsbx.com/platform/instantgames/profile_pic.jpg?igpid=2675436335850683&height=256&width=256&ext=1578645386&hash=AeQUOe4RB3x8i2qS');

		const badge = this.add.sprite(
			0,
			0,
			'leaderboardBadge',
		);
		badge.setScale(2);

		let name = new DefaultText(
			this,
			-badge.displayWidth/2 + 34,
			-badge.displayHeight/2 - 28,
			leaderboardEntry.getPlayer().getName().substr(0, 12),
			32
		);
		name.setMaxWidth(
			10
		);

		const score = new DefaultText(
			this,
			-badge.displayWidth/2 + 34,
			-badge.displayHeight/2 + 26,
			`${leaderboardEntry.getScore()}m`,
			24
		);

		const ranking = new DefaultText(
			this,
			-badge.displayWidth/2 + 6,
			-badge.displayHeight/2 + 5,
			`${leaderboardEntry.getRank()}`,
			48
		);

		container.add(badge);
		container.add(name);
		container.add(score);
		container.add(ranking);

		Animations.weirdFadeIn(this, container);
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