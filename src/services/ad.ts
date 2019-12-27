const adIds = {
	"REWARDED_VIDEO": "566170080885812_585142955655191",
	"INTERSTITIAL": "566170080885812_585143358988484"
}

export class AdService {

	static gameCount: number = 0;
	static runDistance: number = 0;
	static interstitial: FBInstant.AdInstance;
	static video: FBInstant.AdInstance;

	constructor() {}

	static incrementGameCount() {
		this.gameCount++;
	}

	static incrementRunDistance(distance: number) {
		this.runDistance += distance;
	}

	static async loadRewardedVideo(): Promise<FBInstant.AdInstance> {
		const video = await FBInstant.getRewardedVideoAsync(adIds.REWARDED_VIDEO);
		await video.loadAsync();
		return video;
	}

	static async loadInterstitial(): Promise<FBInstant.AdInstance> {
		if (this.gameCount == 1 || this.runDistance > 5000) {
			try {
				const interstitial = await FBInstant.getInterstitialAdAsync(adIds.INTERSTITIAL);
				await interstitial.loadAsync();
				return interstitial;
			} catch (error) {
				console.error(error);
				return null;
			}
		}

		return null;
	}

	static async showRewardedVideo(video?: FBInstant.AdInstance): Promise<void> {
		if (video == null && AdService.video != null) {
			await AdService.video.showAsync();
			AdService.video = null;
		} else if (video != null) {
			await video.showAsync();
			video = null;
		} else {
			console.log('Too slow to load video.');

			const video = await AdService.loadRewardedVideo();

			if (video != null)
				await video.showAsync();
		}
	}

	static async showInterstitial(interstitial?: FBInstant.AdInstance): Promise<void> {
		if (this.gameCount == 1 || this.runDistance > 3000) {
			console.log(this.runDistance + ' Time for showing some ads.');
			
			if (interstitial == null && AdService.interstitial != null) {
				await AdService.interstitial.showAsync();
				AdService.interstitial = null;
			} else if (interstitial != null) {
				await interstitial.showAsync();
				interstitial = null;
			} else {
				console.log('Too slow to load interstitial.');

				const interstitial = await AdService.loadInterstitial();

				if (interstitial != null) {
					await interstitial.showAsync();
				}
			}

			if (this.runDistance > 3000)
				this.runDistance = 0;
		}
	}

	static async createShortcut(): Promise<void> {
		if (this.gameCount == 1) {
			let playerData = await FBInstant.player.getDataAsync(['shortcut']);

			if (!playerData.shortcut) {
				let canCreateShortcut = await FBInstant.canCreateShortcutAsync();

				if (canCreateShortcut) {
					try {
						await FBInstant.createShortcutAsync();
						await FBInstant.player.setDataAsync({shortcut: true});
					} catch (error) {
						console.error('SHORTCUT', 'Did not create shortcut.');
					}
				}
			} else {
				console.log('SHORTCUT', 'Shortcut already existing.');
			}
		}
	}
}