TimberNerd.Game = function(){
	//variable stuff
	this.SUCCESS = 0;
	this.BRANCH_FROM_ABOVE = 1;
	this.BRANCH_FROM_SIDE = 2;
	
	this.backhillData = null;
	this.backDraw = null;
	this.firstStart = true;
	this.music = null;
	
	this.isSoundOn = true;
	this.isMusicOn = true;
};

var TrunkType = {
	NORMAL: 0,
	RIGHT: 1,
	LEFT: 2,
	BOMB: 3
};
var trunkCounter = 0;

TimberNerd.Game.prototype = {
	init: function() {	
		logInfo("init Game");	
		trunkCounter = 0;
		this.trunks = null;
		this.currentTween = null;
		this.playerIsLeft = true;
		this.score = 0;
		this.scoreText = null;
		this.player = null;
		this.animatePlayer = 0;
		this.animationPlayerTimer = 0;
		game.stage.backgroundColor = 0xb6f4ff;
		
		this.timebarbar = null;
		this.timebar = null;
		this.timebarMax = 0;
		this.timebarbar = null;
		this.timeMax = 0;
		this.timeCurrent = 0;
		this.plusTime = 300;
		this.isGameOver = false;
		this.isStart = false;
		
		this.controlls = null;
		this.logo = null;
		this.deadBy = this.SUCCESS;
	},
	
	preload: function() {
	},
	
	create: function() {

		if (this.backDraw) {
			this.add.sprite(0,0,this.backDraw);
		} else {
			this.backDraw = game.add.renderTexture(game.width, game.height);
			this.addSkyLine();
			this.addBackTrees();
		}
		
		this.addSnowflakes("snowflake");
		this.addGround();
		this.addBackHills();

		this.trunks = this.add.group();
		
		for (var i = 0; i < 6; i++) {
			this.addNewTrunk();
		}
		game.input.onDown.add(this.onTap, this);
		game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(this.chopLeft, this);
		game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(this.chopRight, this);

		
		
		var trunkBottom = game.add.sprite(game.width / 2, game.height, "atlas", "trunkbottom");
		trunkBottom.x -= trunkBottom.width / 2;
		trunkBottom.y -= 25;

		this.scoreText = this.add.bitmapText(game.width / 2, game.height - 20, "font", "" + this.score, 14);
		this.scoreText.anchor.set(0.5, 1);
		
		this.player = this.add.sprite(game.width / 2 , game.height - 16, "atlas", "oli1");
		this.player.anchor.set(1,1);
		
		this.addSnowflakes("snowflake");

		//UI
		game.cache.addNinePatch("timebar", "atlas", "timebar", 3, 3, 3, 3);
		game.cache.addNinePatch("panel", "atlas", "panel", 7, 7, 7, 7);
		
		
		
		
		this.timebar = new Phaser.NinePatchImage(game, "timebar", game.width / 2, 5, 60, 12);
		this.world.add(this.timebar);
		
		this.timebarbar = this.add.sprite(0, 0, "atlas", "timebarbar");
		this.timebar.x = (game.width - this.timebar.targetWidth) / 2;
		this.timebarbar.x = 3;
		this.timebarbar.width = this.timebar.targetWidth - 6;
		this.timebarMax = this.timebar.targetWidth - 6;
		this.timebar.addChild(this.timebarbar);
		
		this.timeMax = 4000;
		this.timeCurrent = this.timeMax;
		
		this.addSoundIU();
		
		if (this.firstStart) {
				this.addControlsTutorial();
				this.timebar.visible = false;
				this.addLogo();
				this.music = this.playMusic('music');
		} else {
			if (this.isMusicOn) this.music.fadeIn(500);
		}
		
		
		this.isStart = true;
		this.firstStart = false;
		
		 
		
		this.fadeIn();
	},
	
	addLogo: function() {
		this.logo = this.add.sprite(game.width / 2, 10, "atlas", "logo");
		this.logo.anchor.set(0.5, 0);
	},
	
	fadeIn: function() {
		this.white = this.add.sprite(0, 0, "intro", "weiss");
		this.white.width = game.width;
		this.white.height = game.height;
		this.white.alpha = 1;
		
		var t = this.add.tween(this.white).to({
			alpha: 0
		}, 500);
		t.start();
	},
	
	addControlsTutorial: function() {
		this.controlls = this.add.group();
		this.controlls.isUp = true;
		var left = this.add.sprite(game.width / 2 - 20, game.height - 5, "atlas", isMobile ? "touch_left" : "key_left");
		left.anchor.set(1,1);
		var right = this.add.sprite(game.width / 2 + 20, game.height - 5, "atlas", isMobile ? "touch_right" : "key_right");
		right.anchor.set(0,1);
		this.controlls.addChild(left);
		this.controlls.addChild(right);
		
		var timer = game.time.create(false);
		timer.loop(200, function(){
			this.controlls.y += this.controlls.isUp ? -1 : 1;
			this.controlls.isUp = !this.controlls.isUp;
		}, this);
		timer.start();
		this.controlls.timer = timer;
		
	},

	addSkyLine: function() {

			var turm = this.add.sprite(game.width / 2 - 30, 40, "atlas", "fernsehturm");
			this.backDraw.renderXY(turm, turm.x, turm.y);

			var x = 0;
			while (x < game.width) {
				var b = this.add.sprite(x, 120, "atlas", "house");
				b.anchor.set(0, 1);
				b.height = this.rnd.between(0, 30);
				b.width = this.rnd.between(10, 15);
				this.backDraw.renderXY(b, b.x, b.y);
				x += b.width;
			}
		
	},


	addBackTrees: function() {
			var x = -15;
			while (x < game.width) {
				var t = this.add.sprite(x, 0, "atlas", "treeback");
				t.width = this.rnd.between(6,11);
				var nx = this.rnd.between(10, 15);
				x += t.width + nx;
				this.backDraw.renderXY(t, t.x, t.y);
			}
		
		
	},

	addBackHills: function() {
		var setSprite = function(x, name) {
			var t = trees.create(x, game.height - 40, "atlas", name);
			t.anchor.set(0,1);
			return t;
		}

		var trees = this.add.group();
		if (this.backhillData) {
			for ( var i = 0; i < this.backhillData.length; i++) {
				setSprite(this.backhillData[i].x, this.backhillData[i].name);
			}
		} else {
			var x = -10;
			this.backhillData = [];
			while (x < game.width) {
				var t = setSprite(x, "backhill" + this.rnd.between(0,2));
				var nx = this.rnd.between(10, 30);
				x += t.width + nx;
				this.backhillData.push({x:t.x, name:t.frameName});
			}
		}
	},


	addSnowflakes: function(name) {
		if (isMobile) return;
		var emitter = game.add.emitter(game.world.centerX, -32, 600);
    	emitter.makeParticles("atlas", ["snowflake", "snowflakebig"]);
	    emitter.maxParticleScale = 1;
	    emitter.minParticleScale = 1;
	    emitter.setXSpeed(-10, 10);
	    emitter.setXSpeed(2, 10);
	    emitter.gravity = 0;
	    emitter.width = game.world.width * 1.5;
	    emitter.minRotation = 0;
	    emitter.maxRotation = 0;
	    emitter.start(false, 4000, 1);


	},

	addGround: function() {
		var groundpattern = this.add.sprite(0, game.height, "atlas", "groundpattern");
		groundpattern.anchor.set(0, 1);
		groundpattern.width = game.width;

		var ground = this.add.sprite(game.width / 2, game.height, "atlas", "ground");
		ground.anchor.set(0.5, 1);
	},
	
	onTap: function(touch) {
		var isLeft = false;
		if (touch.x < 14 && touch.y < 30) return;
		if (touch.x < game.width /2) {
			isLeft = true;
		} 
		
		this.testChop(isLeft);
	},
	
	chopLeft: function() {
		this.testChop(true);
	},
	
	chopRight: function() {
		this.testChop(false);
	},
	
	testChop: function(isLeft) {
		
		if (this.controlls != null) {
			this.controlls.timer.stop();
			this.controlls.removeAll(true, true);
			this.controlls = null;
		}
		if (this.logo != null) {
			var t = this.add.tween(this.logo).to({
				alpha: 0
			}, 400);
			t.start();
			this.logo = null;
			this.timebar.visible = true;
		}
		
		this.isStart = false;
		this.playerIsLeft = isLeft;
		this.swapPlayer();
		if(this.isTrunkHitPossible(isLeft)) {
			this.timeCurrent += this.plusTime;
			if (this.timeCurrent > this.timeMax) this.timeCurrent = this.timeMax;
			this.plusTime -= this.time.physicsElapsedMS / 2;
			if (this.plusTime < 0) this.plusTime = 0;
			
			this.animatePlayer = 1;
			this.addNewTrunk();
			this.bashTrunkAway(isLeft);
			this.plusPoint();
			this.collision();
		} else {
			//gameOver
			this.deadBy = this.BRANCH_FROM_SIDE;
			this.gameOver();
		}
	},

	saveScore: function() {
		saveItem("best", this.score);
	},

	loadScore: function() {
		var best = loadItem("best");
		if (best) return best;
		return 0;
	},

	plusPoint: function(amount) {
		if (!amount) amount = 1;
		this.score += amount;
		this.scoreText.text = "" + this.score;
	},
	
	collision: function() {
		var oType = this.getBottomTrunk().obstacleType;
		var trunkLeft = oType == TrunkType.LEFT;
		var trunkRight = oType == TrunkType.RIGHT;
		if ((trunkLeft && this.playerIsLeft) || (trunkRight && !this.playerIsLeft)) {
			this.deadBy = this.BRANCH_FROM_ABOVE;
			this.gameOver();
		}
	},
	
	isTrunkHitPossible: function (isLeft) {
		var type = this.getBottomTrunk().obstacleType;
		switch (type) {
			case TrunkType.NORMAL:
				return true;
			break;
			case TrunkType.RIGHT:
				return isLeft;
			break;
			case TrunkType.LEFT:
				return !isLeft;
			break;
			case TrunkType.BOMB:
				return false;
			break;
			
		}
	},
	
	getBottomTrunk: function() {
		var childCount = this.trunks.children.length;
		var trunk = null;
		var mincount = -1;
		var index = -1;
		for (var i = 0; i < childCount; i++) {
			var nt = this.trunks.children[i];
			if (nt.isHit == false && nt.alive) {
				if (nt.counter < mincount || mincount == -1) {
					mincount = nt.counter;
					index = i;
				}
			}
		}
		return this.trunks.children[index];
	},
	
	swapPlayer: function() {
		this.player.scale.x = this.playerIsLeft ? 1 : -1;
	},
	
	getTopTrunk: function() {
		var childCount = this.trunks.children.length;
		var trunk = null;
		var maxcount = -1;
		var index = -1;
		for (var i = 0; i < childCount; i++) {
			var nt = this.trunks.children[i];
			if (nt.isHit == false && nt.alive) {
				if (nt.counter > maxcount) {
					maxcount = nt.counter;
					index = i;
				}
			}
		}
		if (index == -1) return null;
		return this.trunks.children[index];
	},
	
	
	bashTrunkAway: function(isLeft){
		var bottomTrunk = this.getBottomTrunk();
		bottomTrunk.isHit = true;
		
		this.playSound('chop');
		
		if (this.currentTween) {
			this.currentTween.stop(true);
			this.trunks.y = this.currentTween.properties.y;
		}
		
		this.currentTween = this.add.tween(this.trunks).to({y: this.trunks.y + bottomTrunk.height}, 100, Phaser.Easing.Cubic.In, true);
		//this.currentTween.onComplete.add(function(){bottomTrunk.visible = false;});
		var btween = this.add.tween(bottomTrunk).to({
			x: bottomTrunk.x + (100 * (isLeft ? 1 : -1)),
			y: bottomTrunk.y - 18,
			rotation: bottomTrunk.rotation + 0.4 * (isLeft ? 1 : -1)
		}, 300, Phaser.Easing.Cubic.Out, true);
		btween.onComplete.add(function(){bottomTrunk.kill();});
	},
	
	gameOver: function() {
		console.log("gameover");
		this.music.fadeOut(100);
		this.playSound('deadjingle');
		this.isGameOver = true;
		
		if (this.deadBy == this.BRANCH_FROM_ABOVE) {
			sendDeathByBranchFromTop();
			this.player.frameName="dead1";
		} else if (this.deadBy == this.BRANCH_FROM_SIDE) {
			this.player.frameName="dead2";
			sendDeathByBranchFromSide();
		} 
		

		gaSendScore(this.score);
		if (this.score > this.loadScore()) this.saveScore();

		var panel = new Phaser.NinePatchImage(game, "panel", 0, 30, 62, 65);
		panel.x = (game.width - panel.targetWidth) / 2;
		this.world.add(panel);
		
		game.input.onDown.remove(this.onTap, this);
		game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.remove(this.chopLeft, this);
		game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.remove(this.chopRight, this);
		
		var style = { font: "bold 13px Arial", fill: "#222222", align: "center"};

		var addText = function(x, y, text) {
			var tf = game.add.bitmapText(x,  y, "font", text, 14);
			tf.smoothed = false;
			tf.anchor.set(0.5, 1);
			panel.addChild(tf);
			return tf;
		};
		
		addText(31, 14, "Score");
		addText(31, 26, "" + this.score);
		addText(31, 40, "Best");
		addText(31, 52, "" + this.loadScore());
		
		var replay = game.add.sprite(31, 64, "atlas", "replaybutton");
		replay.anchor.set(0.5);
		panel.addChild(replay);
		replay.inputEnabled = true;
		
		var replayarrow = game.add.sprite(0, 0, "atlas", "replaybuttonarrow");
		replayarrow.anchor.set(0.5);
		replay.addChild(replayarrow);
		//replay.inputEnabled = true;
		
		timer = game.time.create(false);
    	timer.loop(300, function(){
    		replayarrow.rotation += Math.PI * 0.5;
    		if (replayarrow.rotation > 1.8 * Math.PI) replayarrow.rotation = 0;
    	}, this);
    	timer.start();

		replay.events.onInputDown.add(this.restart, this);
		game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(this.restart, this);

		panel.alpha = 0;
		this.add.tween(panel).to({y: panel.y + 10, alpha: 1}, 300, Phaser.Easing.Power1, true);
		
		if (!isMobile) {
			var space = this.add.sprite(31, 80, "atlas", "space");
			space.anchor.set(0.5, 0);
			panel.addChild(space);
			space.isUp = true;
			
			var timer = game.time.create(false);
			timer.loop(200, function(){
				space.y += space.isUp ? -1 : 1;
				space.isUp = !space.isUp;
			}, this);
			timer.start();
			space.timer = timer;
		}
	},
	
	update: function() {
		if (this.isGameOver || this.isStart) return;
		var dt = this.time.physicsElapsedMS;
		this.timeCurrent -= dt;
		if (this.timeCurrent < 0) this.timeCurrent = 0;
		this.timebarbar.width = Math.floor((this.timeCurrent / this.timeMax) * this.timebarMax);
		
		if (this.timeCurrent == 0) {
			sendDeathByTime();
			this.gameOver();
		}
		
		var m = game.width / 2;
		this.trunks.forEach(function(t){
			if (t.x < m - 90 || t.x > m + 70) t.visible = false;
		});

		if (this.animatePlayer != 0) {
			this.animationPlayerTimer += dt;
			if (this.animationPlayerTimer > 80) {
				this.animationPlayerTimer = 0;
				if (this.animatePlayer == 3) {
				this.player.frameName="oli1";
				this.animatePlayer=0;
			}
			if (this.animatePlayer == 2) {
				this.player.frameName="oli3";
				this.animatePlayer++;
			}
			if (this.animatePlayer == 1) {
				this.player.frameName="oli2";
				this.animatePlayer++;
			}
			}
			
		}
		
	},
	
	restart: function() {
		game.state.start("Game");
	},
	
	addNewTrunk: function() {
		var top = this.getTopTrunk();
		var topType = TrunkType.NORMAL;
		if (top) topType = top.obstacleType;
		var type = topType != TrunkType.NORMAL ? TrunkType.NORMAL : this.rnd.between(1, 2);
		while (type == topType && type != TrunkType.NORMAL) {
			type = this.rnd.between(1, 2);
		}
		
		if (!top) type = 0;
		
		var trunk = this.trunks.getFirstDead();
		
		
		
		if (trunk == null) {
			//console.log("new trunk");
			trunk = this.trunks.create(game.width / 2, 0, "atlas", "trunk");
		} else {
			//console.log("old trunk reuse");
			trunk.reset(game.width / 2, 0);
			trunk.children.forEach(function(c){
				c.kill();
			});
			trunk.rotation = 0;
		}
		
		trunk.x -= trunk.width / 2;
		trunk.isHit = false;
		trunk.visible = true;
		trunk.counter = trunkCounter;
		trunkCounter++;
		//console.log(top.y);
		if (top) trunk.y = top.y - top.height;
		else trunk.y = game.height - 51;
		
		trunk.obstacleType = type;
		
		switch (type) {
			case 0://none
			break;
			case 1://right
				var branch = game.add.sprite(trunk.width,trunk.height / 2, "atlas", "branch");
				branch.anchor.set(1, 0.5);
				branch.scale.x = -1;
				trunk.addChild(branch);
			break;
			case 2://left
				var branch = game.add.sprite(0,trunk.height / 2, "atlas", "branch");
				branch.anchor.set(1, 0.5);
				trunk.addChild(branch);
			break;
			case 3://bomb
			break;
		}
		
	},
	
	addSoundIU: function() {
			this.soundButton = this.add.sprite(1,1, "atlas", (this.isSoundOn ? "soundon" : "soundoff"));
			this.soundButton.inputEnabled = true;
			this.soundButton.events.onInputDown.add(this.onSoundButton, this);
			
			this.musicButton = this.add.sprite(1,14, "atlas", (this.isMusicOn ? "musicon" : "musicoff"));
			this.musicButton.inputEnabled = true;
			this.musicButton.events.onInputDown.add(this.onMusicButton, this);
		},
		
		onSoundButton: function() {
			console.log("onSoundbutton: " + this.isSoundOn);
			this.isSoundOn = !this.isSoundOn;
			this.soundButton.frameName = this.isSoundOn ? "soundon" : "soundoff";
		},
		
		onMusicButton: function() {
			this.isMusicOn = !this.isMusicOn;
			this.musicButton.frameName = this.isMusicOn ? "musicon" : "musicoff";
			if (this.isMusicOn == false) this.music.fadeOut(100);
			else this.music.fadeIn(500);
		},
		
		playSound(name) {
			if (this.isSoundOn) return game.sound.play(name);
			
		},
		
		playMusic(name) {
			if (this.isMusicOn) return game.sound.play(name, 0.6, true);
		}
};