const adIds = {
	"REWARDED_VIDEO": "566170080885812_572575426911944",
	"INTERSTITIAL": "566170080885812_572985533537600"
}

export class AdService {

	static gameCount: number = 0;

	constructor() {}

	static incrementGameCount() {
		this.gameCount++;
	}

	static async loadRewardedVideo(): Promise<FBInstant.AdInstance> {
		const video = await FBInstant.getRewardedVideoAsync(adIds.REWARDED_VIDEO);
		await video.loadAsync();
		return video;
	}

	static async loadInterstitial(): Promise<FBInstant.AdInstance> {
		if (this.gameCount == 1 || (this.gameCount > 1 && this.gameCount % 5)) {
			const interstitial = await FBInstant.getInterstitialAdAsync(adIds.INTERSTITIAL);
			await interstitial.loadAsync();
			return interstitial;
		}

		return null;
	}

	static async showRewardedVideo(video: FBInstant.AdInstance): Promise<void> {
		if (video != null) {
			await video.showAsync();
		} else {
			console.log('Too slow to load video.');

			const video = await AdService.loadRewardedVideo();
			await video.showAsync();
		}
	}

	static async showInterstitial(interstitial: FBInstant.AdInstance): Promise<void> {
		if (this.gameCount == 1 || (this.gameCount > 1 && this.gameCount % 5)) {
			if (interstitial != null) {
				await interstitial.showAsync();
			} else {
				console.log('Too slow to load interstitial.');
	
				const interstitial = await AdService.loadInterstitial();
				await interstitial.showAsync();
			}
		}

		return null;
	}
}