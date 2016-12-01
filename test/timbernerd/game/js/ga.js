  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-69115892-1', 'auto');
  ga('send', 'pageview');
	
	function gaEvent(category, action, label, value) {
		ga('send', 'event', { eventCategory: category, eventAction: action, eventLabel: label, eventValue: value});
	}
	
	function gaSendScore(value) {
		var changed = addZeros(3, value);
		gaEvent("Score", "" + changed, "" + changed, 1);
	}
	
	function sendDeathByBranchFromTop() {
		gaEvent("InGame", "dead", "From Top");
	}
	
	function sendDeathByBranchFromSide() {
		gaEvent("InGame", "dead", "From Side");
	}
	
	function sendDeathByTime() {
		gaEvent("InGame", "dead", "Time");
	}
	
	function addZeros(digitsMax, value) {
		var count = digitsMax - ("" + value).length;
		var out = "" + value;
		for (var i = 0; i < count; i++) out = "0" + out;
		return out;
	}
