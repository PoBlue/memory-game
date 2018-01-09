let symbols = ['bicycle', 'bicycle', 'leaf', 'leaf', 'cube', 'cube', 'anchor', 'anchor', 'paper-plane-o', 'paper-plane-o', 'bolt', 'bolt', 'bomb', 'bomb', 'diamond', 'diamond'],
	opened = [],
	match = 0,
	moves = 0,
	$deck = $('.deck'),
	$scorePanel = $('#score-panel'),
	$moveNum = $('.moves'),
	$ratingStars = $('.fa-star'),
	$restart = $('.restart'),
	delay = 400,
	currentTimer,
	second = 0,
	$timer = $('.timer'),
	totalCard = symbols.length / 2,
	rank3stars = 10,
	rank2stars = 16,
	rank1stars = 20;

function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

// Initial Game
function initGame() {
	var cards = shuffle(symbols);
	$deck.empty();
	match = 0;
	moves = 0;
	$moveNum.text('0');
	$ratingStars.removeClass('fa-star-o').addClass('fa-star');
	for (var i = 0; i < cards.length; i++) {
		$deck.append($('<li class="card"><i class="fa fa-' + cards[i] + '"></i></li>'))
	}
	addCardListener();

	resetTimer(currentTimer);
	second = 0;
	$timer.text(`${second}`)
	initTime();
};

// Set Rating and final Score
function setRating(moves) {
	var rating = 3;
	if (moves > rank3stars && moves < rank2stars) {
		$ratingStars.eq(2).removeClass('fa-star').addClass('fa-star-o');
		rating = 2;
	} else if (moves > rank2stars && moves < rank1stars) {
		$ratingStars.eq(1).removeClass('fa-star').addClass('fa-star-o');
		rating = 1;
	} else if (moves > rank1stars) {
		$ratingStars.eq(0).removeClass('fa-star').addClass('fa-star-o');
		rating = 0;
	}
	return { score: rating };
};

// End Game
function endGame(moves, score) {
	swal({
		allowEscapeKey: false,
		allowOutsideClick: false,
		title: 'Congratulations! You Won!',
		text: 'With ' + moves + ' Moves and ' + score + ' Stars in ' + second + ' Seconds.\n Woooooo!',
		type: 'success',
		confirmButtonColor: '#02ccba',
		confirmButtonText: 'Play again!'
	}).then(function (isConfirm) {
		if (isConfirm) {
			initGame();
		}
	})
}

// Restart Game
$restart.bind('click', function () {
	swal({
		allowEscapeKey: false,
		allowOutsideClick: false,
		title: 'Are you sure?',
		text: "Your progress will be Lost!",
		type: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#02ccba',
		cancelButtonColor: '#f95c3c',
		confirmButtonText: 'Yes, Restart Game!'
	}).then(function (isConfirm) {
		if (isConfirm) {
			initGame();
		}
	})
});

var addCardListener = function () {

	// Card flip
	$deck.find('.card').bind('click', function () {
		var $this = $(this)

		if ($this.hasClass('show') || $this.hasClass('match')) { return true; }

		var card = $this.context.innerHTML;
		$this.addClass('open show');
		opened.push(card);

		// Compare with opened card
		if (opened.length > 1) {
			if (card === opened[0]) {
				$deck.find('.open').addClass('match animated infinite rubberBand');
				setTimeout(function () {
					$deck.find('.match').removeClass('open show animated infinite rubberBand');
				}, delay);
				match++;
			} else {
				$deck.find('.open').addClass('notmatch animated infinite wobble');
				setTimeout(function () {
					$deck.find('.open').removeClass('animated infinite wobble');
				}, delay / 1.5);
				setTimeout(function () {
					$deck.find('.open').removeClass('open show notmatch animated infinite wobble');
				}, delay);
			}
			opened = [];
			moves++;
			setRating(moves);
			$moveNum.html(moves);
		}

		// End Game if match all cards
		if (totalCard === match) {
			setRating(moves);
			var score = setRating(moves).score;
			setTimeout(function () {
				endGame(moves, score);
			}, 500);
		}
	});
};


function initTime() {
	currentTimer = setInterval(function () {
		$timer.text(`${second}`)
		second = second + 1
	}, 1000);
}

function resetTimer(timer) {
	if (timer) {
		clearInterval(timer);
	}
}

initGame();