//ele takes JQEURY object, appends it to target, then fills element with content. Then takes call back that acts on target
let userName = 'Dave';
let elementCount = 0;
let exercisesVisible = false;

let CodeCard = function(name, promptMessage, exercismFunc){
	let self = this;
	this.fileName = name;
	this.prompt = promptMessage;
	
	this.inputField;
	this.inputButton;

	if(this.prompt instanceof Array){
		this.inputField = [];
		this.inputButton = [];
		for (var i = 0; i < self.prompt.length; i++) {
			this.inputField.push("<input contenteditable='true' style='width: 10%; padding: 2px;' id='" + this.fileName + i + "-input'></input>");
			this.inputButton.push("<button class='btn btn-success btn-sm' id='" + this.fileName + i + "-input-button'> _ </button>");
		}
	}
	else{
		this.inputField = "<input contenteditable='true' style='width: 10%; padding: 2px;' id='" + this.fileName + "-input'></input>";
		this.inputButton = "<button class='btn btn-success btn-sm' id='" + this.fileName + "-input-button'> _ </button>";
	}
	this.eggTimer;
	this.delayTimer;

	this.exercismFunction = exercismFunc;
	this.storeContent;
	

	//Slow loads in content on target
	this.slowLoadElement = function(target, ele, content, speed, func){
		$(target).append(ele);
		
		let indx = 0;
		let stepper = function(){
			if(indx < content.length)
			{
				$(target).children().eq(0).append(content[indx]);
				indx++;
			}
			else
			{
				self.clearIntervalTimer();
				if(typeof func === "function"){
					func();
				}
			}
		}

		this.eggTimer = setInterval(stepper,speed)
	}

	this.delayElement = function(target, ele, speed, func){
		self.delayTimer = window.setTimeout(function(){
			self.clearTimoutTimer();
			$(target).append(ele);
			if (typeof func === "function") {
				func();
			}
			else{
				console.log("delay element did not receive a function");
			}
		},speed)
	}

	this.clearTimers = function(){
		self.clearIntervalTimer();
		self.clearTimoutTimer();
	}

	this.clearIntervalTimer = function(){
		window.clearInterval(this.eggTimer);
	}

	this.clearTimoutTimer = function(){
		window.clearInterval(this.delayTimer);
	}

	this.createCard = function(){
		//Increasing Card count on page
		elementCount++;
		defaultPage();
		//Creates and inserts card
		$(".container").append("<div class='row buffer-top' id='" + self.fileName + "-row'></div>")
		$("#" + self.fileName + "-row").append("<div class='col-md-8 col-centered dark-block' id='" + self.fileName + "-col'></div>")
		$("#" + self.fileName + "-col").append("<div style='margin: 3%;' id='" + self.fileName + "-div'></div>")
		$("#" + self.fileName + "-col").append("<div style='margin: 3%;' id='" + self.fileName + "-content-div'></div>")
		$("#" + self.fileName + "-div").append("<span class='glyphicon glyphicon-plus btn-control' id='" + self.fileName +"-close-control'>X</span>")
		$("#" + self.fileName + "-div").append("<span class='glyphicon glyphicon-minus btn-control' id='" + self.fileName +"-minmax-control'>-</span>")
		$("#" + self.fileName + "-div").append("<h3 style='margin-bottom: 3%'>" + self.fileName + " Exercism</h3>")
		$("#" + self.fileName + "-content-div").append("<button class='btn btn-success' id='" + self.fileName + "-button'>Execute Code</button>")
						.append("<code id='" + self.fileName +"'>Code appears here.</code>")
						.append("<code class='code-console' id='" + self.fileName + "-output'>Console like</code>")
		self.initButtons();
		self.initButtonsControl();
	}

	this.minimizeCard = function(){
		self.storeContent = $("#" + self.fileName + "-row");
		$("#" + self.fileName + "-minmax-control").html("+");
		$("#" + self.fileName + "-minmax-control").one('click', function(){
			self.maximizeCard();
		})
		$("#" + self.fileName + "-content-div").empty();
		self.clearTimers();
	}

	this.maximizeCard = function(){
		$("#" + self.fileName + "-minmax-control").html("-");
		$("#" + self.fileName + "-content-div").append("<button class='btn btn-success' id='" + self.fileName + "-button'>Execute Code</button>")
						.append("<code id='" + self.fileName +"'>Code appears here.</code>")
						.append("<code class='code-console' id='" + self.fileName + "-output'>Console like</code>")
						.append("<div id='" + self.fileName + "-prompt'></div>")
		self.initButtons();
		$("#" + self.fileName + "-minmax-control").one('click', function(){
			self.minimizeCard();
		})
	}

	this.exitCard = function(){
		elementCount--;
		$("#" + self.fileName + "-row").remove();
		defaultPage();
	}


	this.initButtons = function(){
		console.log("initButtons");
		$("#" + self.fileName + "-button").one('click', function(){
			self.initPrompt(true);
			$("#" + self.fileName + "-button").html("Force");
			$("#" + self.fileName + "-button").one('click', function(){
				self.clearTimers();
				$("#" + self.fileName +"-prompt").empty();
				self.initPrompt(false);
			});
		});
	}

	this.initButtonsControl = function(){
		$("#" + self.fileName + "-close-control").one('click', function(){
			self.exitCard();
		})
		$("#" + self.fileName + "-minmax-control").one('click', function(){
			self.minimizeCard();
		})
	}

	this.singleProp = function(slow)
	{
		$("#" + self.fileName + "-content-div").append("<div id='" + self.fileName + "-prompt'></div>");
		if(slow)
		{
			let speed = 100;

			let delayedFocus = function(){
				document.getElementById(self.fileName + "-input").focus()
				$("#" + self.fileName + "-input-button").on('click', function(){
					self.exercismFunction($("#" + self.fileName + "-input").val(), "#" + self.fileName + "-output");
				})
				$("#" + self.fileName + "-button").off("click");
				$("#" + self.fileName + "-button").html("Finished");
			}

			let delayedButton = function(){
				self.delayElement("#" + self.fileName + "-prompt", self.inputButton, speed * 5, delayedFocus)
					$("#" + self.fileName + "-input").keypress(function (e) {
			  			if (e.which == 13) {
			  				self.exercismFunction($("#" + self.fileName + "-input").val(), "#" + self.fileName + "-output");
			    			return false;
			  			}
					})
			}
			let delayedInput = function(){
				self.delayElement("#" + self.fileName + "-prompt", self.inputField, speed, delayedButton)
			}

			//BEGIN
			self.slowLoadElement("#" + self.fileName +"-prompt", $("<p>"), self.prompt, speed, delayedInput);
		}
		else{
			$("#" + self.fileName +"-prompt").append("<p>" + self.prompt + "</p>");
			$("#" + self.fileName +"-prompt").append(self.inputField);
			$("#" + self.fileName +"-prompt").append(self.inputButton);
			document.getElementById(self.fileName + "-input").focus();
			$("#" + self.fileName + "-input").keypress(function (e) {
	  			if (e.which == 13) {
	  				self.exercismFunction($("#" + self.fileName + "-input").val(), "#" + self.fileName + "-output");
	    			return false;
	  			}
			})
			$("#" + self.fileName + "-input-button").on('click', function(){
					self.exercismFunction($("#" + self.fileName + "-input").val(), "#" + self.fileName + "-output");
			})
			$("#" + self.fileName + "-button").off("click");
			$("#" + self.fileName + "-button").html("Finished");
		}
	}
	this.multiplePrompt = function(slow, indx)
	{
		$("#" + self.fileName + "-prompt").append("<div id='" + self.fileName + indx + "-prompt'></div>");
		let speed = 100;
		if(slow){
			let delayedFocus = function(){
				document.getElementById(self.fileName + 0 + "-input").focus()
				$("#" + self.fileName + indx + "-input-button").on('click', function(){
					self.exercismFunction(self.multipleProp(), "#" + self.fileName + "-output");
				})

				//Recursion
				indx++;
				if(indx < self.prompt.length){
					self.multiplePrompt(slow, indx);
				}
				else{
					$("#" + self.fileName + "-button").off("click");
					$("#" + self.fileName + "-button").html("Finished");
				}
			}

			let delayedButton = function(){
				self.delayElement("#" + self.fileName + indx + "-prompt", self.inputButton[indx], speed, delayedFocus)
					$("#" + self.fileName + indx + "-input").keypress(function (e) {
			  			if (e.which == 13) {
			  				self.exercismFunction(self.multipleProp(), "#" + self.fileName + "-output");
			    			return false;
			  			}
					})
			}
			
			let delayedInput = function(){
				self.delayElement("#" + self.fileName + indx + "-prompt", self.inputField[indx], speed, delayedButton)
			}

			//Begin
			self.slowLoadElement("#" + self.fileName + indx +"-prompt", $("<p>"), self.prompt[indx], speed, delayedInput);
		}
		else{
			$("#" + self.fileName + indx +"-prompt").append("<p>" + self.prompt + "</p>");
			$("#" + self.fileName + indx +"-prompt").append(self.inputField[indx]);
			$("#" + self.fileName + indx +"-prompt").append(self.inputButton[indx]);
			document.getElementById(self.fileName + 0 + "-input").focus();
			$("#" + self.fileName + indx + "-input").keypress(function (e) {
	  			if (e.which == 13) {
	  				self.exercismFunction(self.multipleProp(), "#" + self.fileName + "-output");
	    			return false;
	  			}
			})
			$("#" + self.fileName + indx + "-input-button").on('click', function(){
					self.exercismFunction(self.multipleProp(), "#" + self.fileName + "-output");
			})

			//Recursion
			indx++;
			if(indx < self.prompt.length){
					self.multiplePrompt(slow, indx);
			}
			else{
				$("#" + self.fileName + "-button").off("click");
				$("#" + self.fileName + "-button").html("Finished");
			}
		}
	}

	//Takes all input fields in current prompt and returns them as an array
	this.multipleProp = function(){
		var arr = [];
		for (var i = 0; i < self.prompt.length; i++) {
			arr.push($("#" + self.fileName + i + "-input").val());
		}
		return arr;
	}

	this.initPrompt = function(slow){
		if(self.prompt instanceof Array){
			$("#" + self.fileName + "-content-div").append("<div id='" + self.fileName + "-prompt'></div>")
			self.multiplePrompt(slow, 0);
		}
		else{
			self.singleProp(slow);
		}
	}
}

let appendDefaultPage = function(){
	let exercismLink = $("<a>").attr("href", "https://www.exercism.io").html("Exercise.io");
	let exerciseLinkExercises = $("<a>").attr("href", "http://www.exercism.io/languages/javascript/exercises").html("Exercise.io JavaScript Exercises");
	let githubLink = $("<a>").attr("href", "https://www.github.com/mtKeller/Exercise.io_Answers").html("here");

	$(".container").append("<div class='row buffer-top' id='default-row'></div>")
		$("#default-row").append("<div class='col-md-8 col-centered dark-block' id='default-col'></div>")
		$("#default-col").append("<div style='margin: 3%;' id='default-div'></div>")
		$("#default-col").append("<div style='margin: 3%;' id='default-content-div'></div>")
		$("#default-div").append("<h3 style='margin-bottom: 3%'>Exercism Answers About</h3>")
		$("#default-content-div").append("<p class='about-p'>Welcome to Exercism.io Answers. This page is built with JQuery and Bootstrap who’s purpose it to act as a wrapper site for Exercism.io JavaScript exercises. If you would like to work on these exercises on your own. Please visit <a>Exercism.io</a>, or directly their <a>JavaScript Exercise Page</a>.</p><br><br><p class='about-p'>If you would like to critique or view how this page was constructed using JQuery, you can the view the Github repository for this site <a>here</a>.</p>");
		$("#default-content-div").children("p").eq(0).children().eq(0).attr("href", "http://exercism.io");
		$("#default-content-div").children("p").eq(0).children().eq(1).attr("href", "http://exercism.io/languages/javascript/exercises");
		$("#default-content-div").children("p").eq(1).children().attr("href", "https://www.github.com/mtKeller/Exercise.io_Answers");
}

let removeDefaultPage = function(){
	$("#default-row").remove();
}

let defaultPage = function(){
	if(elementCount === 0){
		exercisesVisible = false;
		appendDefaultPage();
	}
	else if(elementCount > 0){
		removeDefaultPage();
	}
	else if(elementCount < 0){
		console.log("elementCount is less than zero");
		elementCount = 0;
		defaultPage();
	}
}

let outputWorld = function(nm, target){
	console.log("Called");
	if(nm != ''){
		userName = nm;
		$(target).html("Welcome to your exercism " + nm + "! Hope you enjoy your stay! ;)");
	}
	else{
		$(target).html("Hello Cruel World...");
	}
}

let outputLeap = function(yr, target){
	let year = Number(yr);
	if(year % 400 === 0)
	{
		$(target).html(userName + " the year " + year + " is a leap year!");
	}
	else if(year % 100 === 0){
		$(target).html(userName + " the year " + year + " is not a leap year!");
	}
	else if(year % 4 === 0){
		$(target).html(userName + " the year " + year + " is a leap year!");
	}
	else{
		$(target).html(userName+ " the year " + year + " is not a leap year!");
	}
}

let outputHammering = function(arr, target){
	let count = 0;
	for (var i = 0; i < arr.length; i++) {
		count += Number(arr[i]);
	}
	$(target).html(count);
	console.log(count);
}

let aboutLink = function(){
	$(".container").empty();
	exercisesVisible = false;
	elementCount = 0;
	appendDefaultPage();
}

let exerciseLink = function(){
	if(exercisesVisible === false){
		exercisesVisible = true;
		let worldCard = new CodeCard("hello-world", "Hello welcome to this page, might I ask, what is your name?", outputWorld);
		worldCard.createCard();
	
		let leapCard = new CodeCard("leap-year", "Ever wonder if a year is a leap year? Go on try one.", outputLeap);
		leapCard.createCard();
	
		let hammeringCard = new CodeCard("hammering", ["Test1asfsg kjdsfbakjd ngfaknj gffdng dkjfngl kfdnglkfd","Test2dsg kjnfdangjfdn vfdnknfvk fdnlkjn vfdjnvjfd"],
			outputHammering);
		hammeringCard.createCard();
	}
}

$(document).ready(function(){
	$("#exercise-page").click(exerciseLink);
	$("#about-page").click(aboutLink);
	exerciseLink();
	console.log(eval("console.log('hello')"));
});
