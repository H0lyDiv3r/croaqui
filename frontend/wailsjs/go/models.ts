export namespace player {
	
	export class PlayerStatus {
	    paused: any;
	    position: any;
	    duration: any;
	    volume: any;
	    Muted: any;
	    speed: any;
	
	    static createFrom(source: any = {}) {
	        return new PlayerStatus(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.paused = source["paused"];
	        this.position = source["position"];
	        this.duration = source["duration"];
	        this.volume = source["volume"];
	        this.Muted = source["Muted"];
	        this.speed = source["speed"];
	    }
	}

}

