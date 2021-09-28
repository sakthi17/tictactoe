/* Tic-Tac-Toe Game using MiniMax Algorithm*/

var board = {
	1: '',
	2: '',
	3: '',
	4: '',
	5: '',
	6: '',
	7: '',
	8: '',
	9: ''
};

var boardAtStart = {
	1: 'T',
	2: 'I',
	3: 'C',
	4: 'T',
	5: 'A',
	6: 'C',
	7: 'T',
	8: 'O',
	9: 'E'
};

playerIcon ="x";
cpuIcon = "o";
winningLine = null;

$(document).ready(function(){	
	startingPageDisplay()
});

function startingPageDisplay(){
	displayBoard(boardAtStart);
	$("td:odd").addClass("x-marker");
	$("td:even").addClass("o-marker");
	
	$("#start-btn").click(function(){
		$("#start-btn").hide();
		optForSymbol();
	});
}

function optForSymbol(){
	InitializeTheboard(board);
	displayBoard(board);
	$("div#optsymbol").fadeIn("slow");
	
	$("div#optsymbol button").click(function(){
		playerIcon = $(this).text();
		cpuIcon = ( playerIcon === "x" ? "o" : "x" );
		
		setTimeout(
			function(){
				$("div#optsymbol").fadeOut("slow");
				playTicTacToe();
				}
			 ,100);
	});
}

function playTicTacToe(){
	showCaptionFor("player");
	waitForPlayerMove();	
}

function waitForPlayerMove(){
/* off("click") to prevent event bubbling
   $("td:empty") selector doesnt work here 
*/
	$("td").hover(function onMouseEnter(){
		if($(this).text() === "")
			$(this).css("background","rgba(47, 182, 182, 0.2)");
	}
	,function onMouseLeave(){
		if($(this).text() === "")
			$(this).css("background","rgb(0,56,77)");
	});
	
	$("td").click(function(){  
		if($(this).text() === '')
		{
			hideCaptionFor("player");
			$(this).css("background","rgb(0,56,77)");
			$("td").off();
			processPlayerMove(this.id);
		}	
	});	
}

function processPlayerMove(clickedSquareId){
	updateDisplay(clickedSquareId,playerIcon);
	updateBoard(clickedSquareId,playerIcon);
	
	var gamestatus = getGameStatus(board);
	if( gamestatus === "playgame")
	{	
		showCaptionFor("cpu");
		setTimeout(computerTurn,1000);
	}	
	else
		displayGameEnd(gamestatus);
}

function computerTurn(){
	var bestAIMove = findBestMove(board);
	updateDisplay(bestAIMove,cpuIcon);
	updateBoard(bestAIMove,cpuIcon);
	hideCaptionFor("cpu");
	
	var gamestatus = getGameStatus(board);
	if( gamestatus=== "playgame")
	{	
		showCaptionFor("player");
		waitForPlayerMove();
	}	
	else
		displayGameEnd(gamestatus);
}

function findBestMove(board){
	var boardScores = [];
	var boardMoves = [];
	
	var depth =0;
	var isMax = true;
	var availableMoves = getAvailableMoves(board);
	
	availableMoves.forEach(function(currentMove){
		board[currentMove]	= cpuIcon; 
		var currentScore = minimax(depth,!isMax,board);
		board[currentMove]	= ""; 
		boardScores.push(currentScore);
		boardMoves.push(currentMove);
	});
	
	var bestAIMoveIndex = boardScores.indexOf(Math.max.apply(Math,boardScores));
	var bestAIMove = boardMoves[bestAIMoveIndex];
	return bestAIMove;
}

function minimax(depth, isMax, board){
	var gameStatus = getGameStatus(board);
	
	if( gameStatus !== "playgame")
	{
		if(gameStatus === cpuIcon +"_win")
			return 10;
	
		if(gameStatus === playerIcon +"_win")
			return -10;
	
		if(gameStatus === "draw")
			return 0;
	}
	else
	{	
		var bestScore ;
		var currentLevelScores = [];
		
		var availableMoves = getAvailableMoves(board);
		var currPlayer = (isMax === true) ? cpuIcon : playerIcon;
		
		availableMoves.forEach(function(currentMove){
			board[currentMove] = currPlayer;
			var currentScore   = minimax(depth+1,!isMax,board);
			board[currentMove] = "";
			currentLevelScores.push(currentScore);
		});
		
		if(currPlayer === cpuIcon)
			bestScore = Math.max.apply(Math,currentLevelScores);	
		else if(currPlayer === playerIcon)
			bestScore = Math.min.apply(Math,currentLevelScores);					
		
		return bestScore;
	}		
}

function getAvailableMoves(board){
	var emptyCells = Object.keys(board).filter(function(key){ 
		return board[key]==="" ; });
	return emptyCells;
}

function InitializeTheboard(currboard){
	Object.keys(currboard).forEach(function(key){
		currboard[key] = '';
	});
	$("td").removeClass();	
}

function displayBoard(currentBoard){
	Object.keys(currentBoard).forEach(function(key){
		var cellid= "#" + key.toString();
		$(cellid).text(currentBoard[key]);
	});
}

function showCaptionFor(who){
	var targetspan = "." + who + "-turn"; 
	$(targetspan).fadeIn("slow");
}	

function hideCaptionFor(who){
	var targetspan = "." + who + "-turn"; 
	$(targetspan).fadeOut("fast");
}

function updateDisplay(cellid,symbol){
	var addclass = symbol ==="x" ? "x-marker" : "o-marker";
	symbol 	 = symbol === "x" ? "X" : "O";
	$("#"+cellid).text(symbol).attr("class",addclass);
}	
	
function updateBoard(cellid,symbol){
	board[cellid] = symbol;
}

function getGameStatus(board){
	
	var winningIndex = [
				  [1,2,3],
				  [4,5,6],
				  [7,8,9],
				  [1,4,7],
				  [2,5,8],
				  [3,6,9],
				  [1,5,9],
				  [3,5,7]
				 ];
	
	winningLine = null;
	var allSquaresMarked = Object.keys(board).every(function(key){
					return board[key] !== "" ;
          				});
	
	var symbolOutcome = winningIndex.map(function(arr){
      				return arr.reduce(function(str,curr){
                       				return str + board[curr];
                        			},"");
      				});
      

	if( symbolOutcome.indexOf("xxx") !== -1)
	{	
		winningLine = winningIndex[symbolOutcome.indexOf("xxx")];
    		return "x_win" ;
	}	
    	else if( symbolOutcome.indexOf("ooo") !== -1)
	{	
		winningLine = winningIndex[symbolOutcome.indexOf("ooo")];
        	return "o_win" ;
	}	
      else if(allSquaresMarked)
		return "draw" ;  
	else	
		return "playgame";
}

function displayGameEnd(endTxt){

	if(endTxt === "draw")
		endTxt = "Its a DRAW";
	else 
		endTxt = endTxt === (playerIcon + "_win") ? "Hurray You WON!!" : "Oops!! You LOST";
	
	//drawWinningLine(); TODO: strike out the winning line 
	
	$("div#endgame span").text(endTxt);
	$("div#endgame").fadeIn("slow");
	$("td").off();
	$("div#endgame button").click(function(){
		$("div#endgame").fadeOut("slow");
		setTimeout(optForSymbol,500);
	});
}

function drawWinningLine(){
	if(winningLine === null)
		return ;
	
	//alert(winningLine);
	var rowLine = [[1,2,3],[4,5,6],[7,8,9]];
	var colLine = [[1,4,7],[2,5,8],[3,6,9]];
	var diagonalLine = [[1,5,9],[3,5,7]];
	
	winningLine.forEach(function(index){
//	$("td#"+index).html('<canvas id="strikeout" height="100%" width="100%"></canvas>');	
	})
	
//	alert($("td").child("canvas#strikeout").getContext("2d"));

/*	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	ctx.strokeStyle="red";
	ctx.moveTo(0,100);
	ctx.lineTo(200,0);
	ctx.stroke();
	ctx.moveTo(0,0);
	ctx.lineTo(200,100);
	ctx.stroke();
*/	
	
}