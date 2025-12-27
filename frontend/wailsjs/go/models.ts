export namespace player {
	
	export class PlayerStatus {
	    paused: any;
	    position: any;
	    duration: any;
	    volume: any;
	    muted: any;
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
	        this.muted = source["muted"];
	        this.speed = source["speed"];
	    }
	}

}

export namespace playlist {
	
	export class ReturnType {
	    data: any;
	
	    static createFrom(source: any = {}) {
	        return new ReturnType(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.data = source["data"];
	    }
	}

}

export namespace queue {
	
	export class ReturnType {
	    data: any;
	
	    static createFrom(source: any = {}) {
	        return new ReturnType(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.data = source["data"];
	    }
	}
	export class filter {
	    type: string;
	    args: string;
	    shuffle: boolean;
	
	    static createFrom(source: any = {}) {
	        return new filter(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.type = source["type"];
	        this.args = source["args"];
	        this.shuffle = source["shuffle"];
	    }
	}

}

export namespace sharedTypes {
	
	export class ReturnType {
	    data: any;
	
	    static createFrom(source: any = {}) {
	        return new ReturnType(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.data = source["data"];
	    }
	}

}

