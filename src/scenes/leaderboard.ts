import * as Phaser from 'phaser';
import { ButtonService } from '../services/button';
import { DefaultText } from '../classes/default-text';
import { Animations } from '../services/animations';
import { TranslateService } from '../services/translate';

enum Leaderboard {
	FRIENDS,
	WORLD
}

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Leaderboard',
};

export class LeaderboardScene extends Phaser.Scene {

	currentLeaderboard: Leaderboard;
	leaderboardEntriesGroup: Phaser.GameObjects.Group;

	buttonService: ButtonService;
	translateService: TranslateService;

    constructor() {
        super(sceneConfig);

		this.buttonService = new ButtonService(this);
		this.translateService = new TranslateService(this);
    }

    public init(data: any): void {
		this.load.on(`filecomplete-image`,
		() => {
			console.log('Loaded image');
		});

		this.currentLeaderboard = Leaderboard.WORLD;
		this.leaderboardEntriesGroup = new Phaser.GameObjects.Group(this);
	}

    public preload(): void {}

    public create(data: any): void {
        this.addBackdrop();
		this.addCloseButton();
		this.addHeading();
		this.loadLeaderboard(this.currentLeaderboard);
		this.addLeaderboardSwitch();
    }

    public update(time: number): void {}

	private addHeading() {
		const heading = new DefaultText(
			this,
			this.physics.world.bounds.centerX,
			50,
			this.translateService.localise('LEADERBOARD', 'HEADING'),
			32
		);

		heading.setOrigin(0.5, 0.5);
	}

    private async loadLeaderboard(scope: Leaderboard) {
		const leaderboard = await FBInstant.getLeaderboardAsync('global-score');
		let entries: FBInstant.LeaderboardEntry[];
		let i: number, currentY: number = 120;

		this.leaderboardEntriesGroup.clear(true, true);
		this.currentLeaderboard = scope;

		if (scope === Leaderboard.FRIENDS) {
			entries = await leaderboard.getConnectedPlayerEntriesAsync(8, 0);
		} else {
			entries = await leaderboard.getEntriesAsync(8, 0);
		}

		for (i = 0; i < entries.length; i++)
		{
			this.leaderboardEntriesGroup.add(this.addLeaderboardBadge(this.physics.world.bounds.centerX, currentY, entries[i]));
			currentY += 64;
		}
	}

	private addLeaderboardSwitch() {
		const colors = {
			active: 0xf2b000,
			default: 0xffffff
		};

		const container: Phaser.GameObjects.Container = this.add.container(
			this.physics.world.bounds.centerX,
			this.physics.world.bounds.bottom - 64
		);

		const world = new DefaultText(
			this,
			-105,
			0,
			this.translateService.localise('LEADERBOARD', 'WORLD'),
			32
		).setInteractive();

		const friends = new DefaultText(
			this,
			10,
			0,
			this.translateService.localise('LEADERBOARD', 'FRIENDS'),
			32
		).setInteractive();

		container.setDepth(4);

		if (this.currentLeaderboard === Leaderboard.WORLD) {
			world.setTint(colors.active);
		} else if (this.currentLeaderboard === Leaderboard.FRIENDS) {
			friends.setTint(colors.active);
		}

		world.on('pointerdown', () => {
			if (this.currentLeaderboard !== Leaderboard.WORLD) {
				this.sound.play('menuSelect');

				this.currentLeaderboard = Leaderboard.WORLD;
				world.setTint(colors.active);
				friends.setTint(colors.default);
				this.loadLeaderboard(this.currentLeaderboard);
			}
		}, this);

		friends.on('pointerdown', () => {
			if (this.currentLeaderboard !== Leaderboard.FRIENDS) {
				this.sound.play('menuSelect');

				this.currentLeaderboard = Leaderboard.FRIENDS;
				world.setTint(colors.default);
				friends.setTint(colors.active);
				this.loadLeaderboard(this.currentLeaderboard);
			}
		}, this);

		container.add(world);
		container.add(friends);
	}

	private addLeaderboardBadge(x: number, y: number,
		leaderboardEntry: FBInstant.LeaderboardEntry): Phaser.GameObjects.Container {
		let container: Phaser.GameObjects.Container = this.add.container(
			x,
			y
		);
		container.setDepth(4);

		const badge = this.add.sprite(
			0,
			0,
			'leaderboardBadge',
		);
		badge.setScale(2);

		let name = new DefaultText(
			this,
			-badge.displayWidth/2 + 34,
			-badge.displayHeight/2 + 4,
			(leaderboardEntry.getPlayer().getName()).substr(0, 11),
			32
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

		const profilePictureKey: string = `profilePicture${leaderboardEntry.getPlayer().getID()}`

		if (!this.textures.exists(profilePictureKey)) {
			this.load.on(`filecomplete-image-${profilePictureKey}`,
			() => {
				const profilePicture = this.addProfilePictureToContainer(profilePictureKey,
					badge, container);

				Animations.weirdFadeIn(this, profilePicture);
			}, this);

			this.load.image(profilePictureKey, leaderboardEntry.getPlayer().getPhoto());
			this.load.start();
		} else {
			this.addProfilePictureToContainer(profilePictureKey,
				badge, container);
		}

		Animations.weirdFadeIn(this, container);

		return container;
	}

	private addProfilePictureToContainer(profilePictureKey: string,
		badge: Phaser.GameObjects.Sprite, container: Phaser.GameObjects.Container)
		: Phaser.GameObjects.Sprite {

		const profilePicture = this.add.sprite(
			badge.displayWidth/2 - 30,
			-badge.displayHeight/2 + 28,
			profilePictureKey
		);

		profilePicture.setScale(0.175);
		profilePicture.setDepth(4);

		container.add(profilePicture);

		return profilePicture;
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
        ).setInteractive();
		backdrop.depth = 3;

		backdrop.on('pointerdown', () => {}, this);

        return backdrop;
    }
}