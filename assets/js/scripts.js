//ele takes JQEURY object, appends it to target, then fills element with content. Then takes call back that acts on target
let userName = 'Dave';

let CodeCard = function(name, promptMessage, exercismFunc){
	this.fileName = name;
	this.prompt = promptMessage;
	this.inputField = "<input style='width: 10%; padding: 2px;' id='" + this.fileName + "-input'></input>";
	this.inputButton = "<button class='btn btn-success btn-sm' id='" + this.fileName + "-input-button'> _ </button>";

	this.eggTimer;
	this.delayTimer;

	this.exercismFunction = exercismFunc;

	let self = this;

	//Slow loads in cotent on target
	this.slowLoadElement = function(target, ele, content, speed){
		$(target).append(ele);
		
		let indx = 0;
		let stepper = function(){
			if(indx < content.length)
			{
				$(target).children().append(content[indx]);
				indx++;
			}
			else
			{
				self.clearIntervalTimer();
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

	this.clearIntervalTimer = function(){
		window.clearInterval(this.eggTimer);
	}

	this.clearTimoutTimer = function(){
		window.clearInterval(this.delayTimer);
	}

	this.createCard = function(){
		//Creates and inserts card
		$(".container").append("<div class='row buffer-top' id='" + self.fileName + "-row'></div>")
		$("#" + self.fileName + "-row").append("<div class='col-md-8 col-centered dark-block' id='" + self.fileName + "-col'></div>")
		$("#" + self.fileName + "-col").append("<div style='margin: 3%;' id='" + self.fileName + "-div'></div>")
		$("#" + self.fileName + "-div").append("<h3 style='margin-bottom: 3%'>" + self.fileName + " Exercism</h3>")
						.append("<button class='btn btn-success' id='" + self.fileName + "-button'>Execute Code</button>")
						.append("<code id='" + self.fileName +"'>Code appears here.</code>")
						.append("<code class='code-console' id='" + self.fileName + "-output'>Console like</code>")
						.append("<div id='" + self.fileName + "-prompt'></div>")
		self.initButtons();
	}

	this.initButtons = function(){
		console.log("initButtons");
		$("#" + self.fileName + "-button").one('click', function(){
			self.initPrompt(true);

		});
	}

	this.initPrompt = function(slow){
		if(slow)
		{
			let speed = 100;
			self.slowLoadElement("#" + self.fileName +"-prompt", $("<p>"), self.prompt, speed);

			let delayedFocus = function(){
				document.getElementById(self.fileName + "-input").focus()
				$("#" + self.fileName + "-input-button").on('click', function(){
					self.exercismFunction($("#" + self.fileName + "-input").val(), "#" + self.fileName + "-output");
				})
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
			self.delayElement("#" + self.fileName + "-prompt", self.inputField, (speed * self.prompt.length), delayedButton)
		}
		else{
			//Fast prompt
			//Change button to skip
			//Then change button to Done
		}
	}
}

let slowLoadElement = function(target, ele, content, speed){
	$(target).append(ele);
	let indx = 0;
	let eggTimer = setInterval(function(){	
		if(indx < content.length)
		{
			$(target).children().append(content[indx]);
			indx++;
		}
		else
		{
			window.clearInterval(eggTimer);
		}
	},speed)
}

let delayElement = function(target, ele, speed, func){
	let delayTimer = window.setTimeout(function(){
		$(target).append(ele);
		if (typeof func === "function") {
			func();
		}
		else{
			console.log("Failed");
		}
	},speed)
}

//Outputs user info into designated field
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

//Controls Hello World logic + styling
let helloWorld = function(){
	let str = "Hello welcome to this page, might I ask, what is your name?";
	let inp = "<input style='width: 10%; padding: 2px;' id='hello-input'></input>";
	let bt = "<button class='btn btn-success btn-sm' id='hello-button'> _ </button>";


	slowLoadElement("#hello-world-prompt", $("<p>"), str, 100);
	delayElement("#hello-world-prompt", inp, (100 * str.length));
	delayElement("#hello-world-prompt", bt, (100 * str.length) + 100, function(){
		document.getElementById("hello-input").focus()
		$("#hello-button").click(function(){
			userName = $("#hello-input").val();
			outputWorld($("#hello-input").val());
		});
		$('#hello-input').keypress(function (e) {
  			if (e.which == 13) {
  				userName = $("#hello-input").val();
    			outputWorld($("#hello-input").val());
    			return false;    //<---- Add this line
  			}
		});
	});
}

let outputLeap = function(yr, target){
	let year = Number(yr);
	console.log(year / 400);
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

let leapYear = function(slow){
	let str = "Now lets work with leap years " + name + ". What year would you like to check?";
	let inp = "<input style='width: 10%; padding: 2px;' id='leap-input'></input>";
	let bt = "<button class='btn btn-success btn-sm' id='leap-button'> _ </button>";

	if(slow){
		slowLoadElement("#leap-year-prompt", $("<p>"), str, 100);
		delayElement("#leap-year-prompt", inp, (100 * str.length));
		delayElement("#leap-year-prompt", bt, (100 * str.length) + 100, function(){
			document.getElementById("leap-input").focus()
			$("#leap-button").click(function(){
				outputLeap($("#leap-input").val());
			});
			$('#leap-input').keypress(function (e) {
	  			if (e.which == 13) {
	    			outputLeap($("#leap-input").val());
	    			return false;    //<---- Add this line
	  			}
			});
		});
	}
	else{
		$("#leap-year-prompt").empty();
	}
}

$(document).ready(function(){
	$("#hello-world-button").one('click', function(){
		helloWorld(true);
	});

	$("#leap-year-button").one('click', function(){
		leapYear(true);
	});

	let newCard = new CodeCard("hello-world", "Hello welcome to this page, might I ask, what is your name?", outputWorld);
	newCard.createCard();
});
