export namespace dir {
	
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

export namespace player {
	
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

