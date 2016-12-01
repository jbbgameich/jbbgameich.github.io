TimberNerd.Introload = function(){
	//variable stuff
};

TimberNerd.Introload.prototype = {
	init: function() {
		logInfo("init Introload");
		this.generalSettings();
		game.stage.backgroundColor = 0xffffff;
	},
	
	preload: function() {
		this.loadingAssets();
	},
	
	create: function() {
		game.time.events.add(200, this.startPreloader, this);
	},
	
	startPreloader: function() {
		game.state.start("Preloader");
	},
	
	generalSettings: function() {
		this.input.maxPointers = 1;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    this.game.renderer.renderSession.roundPixels = true;
	},
	
	loadingAssets: function() {
		this.load.path = 'assets/';
		game.load.atlas("intro");
	}
};