TimberNerd.Preloader = function(){
	//variable stuff
	this.logoOn = false;
	this.assetsLoaded = false;
};

TimberNerd.Preloader.prototype = {
	init: function() {
		logInfo("init Preloader");	
		this.white = null;		
	},
	
	preload: function() {
		this.addLogo();
		this.loadingAssets();
	},
	
	create: function() {
		this.assetsLoaded = true;
		this.tryGo();
	},
	
	tryGo: function() {
		if (this.logoOn && this.assetsLoaded)
			game.time.events.add(1500, this.fadeOut, this);
	},
	
	addLogo: function() {
		var offset = 10;
		var logo = this.add.sprite(game.width / 2, game.height / 2 - offset,"intro", "levelup");
		logo.anchor.set(0.5);
		
		var presents = this.add.sprite(game.width / 2, game.height / 2 + 18 - offset,"intro", "presents");
		presents.anchor.set(0.5, 1);
		
		var lgd = this.add.sprite(game.width / 2, game.height - 2,"intro", "lgd");
		lgd.anchor.set(0.5, 1);
		
		this.fadeIn();
	},
	
	fadeIn: function() {
		this.white = this.add.sprite(0, 0, "intro", "weiss");
		this.white.width = game.width;
		this.white.height = game.height;
		this.white.alpha = 1;
		game.stage.backgroundColor = 0xff7800;
		var t = this.add.tween(this.white).to({
			alpha: 0
		}, 500);
		t.start();
		var that = this;
		t.onComplete.add(function(){
			that.logoOn = true;
			that.tryGo()});
	},
	
	fadeOut: function() {		
		var t = this.add.tween(this.white).to({
			alpha: 1
		}, 250);
		t.onComplete.add(this.startGame);
		t.start();
		
	},
	
	startGame: function() {
		game.state.start("Game");

	},
		
	loadingAssets: function() {
		this.load.path = 'assets/';
		game.load.atlas("atlas");
		game.load.bitmapFont("font");
		game.load.audio("chop", "chop.wav");
		game.load.audio("deadjingle", "dead.mp3");
		game.load.audio("music", "music.mp3");
	}
};