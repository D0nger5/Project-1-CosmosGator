/** @format */

const youtubeKey = "AIzaSyAW8bra2KSM3jLNLTbuQ9Fv41rZv_H7aEQ";
// var unsplashKey = "Dgn0FqGJ_j60hIKKUIpXXYynWjdooCKTetpXroOF2Wc"; 
const historyButtons = $(".history");
var youtubeSection = $("#youtube-section");
var wikipediaSection = $("#wikipedia-section");
var currentSearch = "";
var searchHistory = [];

// Display Modal
var modal = new bootstrap.Modal(document.getElementById("exampleModal"));
modal.show();

// Function to get Unsplash API images
function fetchUnsplashImages() {
	var queryURL =
		"https://api.unsplash.com/photos/random?client_id=" +
		unsplashKey +
		"&query=outer+space&orientation=landscape";
	fetch(queryURL)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			$(".modal").css({ backgroundImage: `url(${data.urls.regular})` });
		});
}
fetchUnsplashImages();

// Event listener to get the search value from the page
$(".search-button-class").on("click", function (e) {
	e.preventDefault();
	currentSearch = $("#search-input").val().trim().toUpperCase();
	if (searchHistory.includes(currentSearch)) {
		$("#search-form").prepend(
			$("<h4>")
				.text(currentSearch + " has already been searched...")
				.css({ color: "red", textAlign: "center" })
				.fadeOut(2500),
		);
		$("#search-input").val("");
		return;
	} else if (currentSearch === "") {
		$("#search-form").prepend(
			$("<h4>")
				.text(currentSearch + " Please enter a query to search...")
				.css({ color: "red", textAlign: "center" })
				.fadeOut(2500),
		);
	} else {
		searchHistory.push(currentSearch);
		localStorage.setItem("search-history", JSON.stringify(searchHistory));
		localSearchHistory();
		fetchWikiArticles();
		wikipediaSection.empty();
		fetchYouTubeVideo();
		youtubeSection.empty();
		$("header#container").removeClass("hide");
		$(".footer").hide().fadeIn(3000);
	}
});
``;
// Event listener to get the search value from the modal
$(".modal-body").on("click", "#search-button-modal", function (e) {
	e.preventDefault();
	currentSearch = $("#search-input-modal").val().trim().toUpperCase();
	if (searchHistory.includes(currentSearch)) {
		$(".modal-body")
			.children("p")
			.text(currentSearch + " has already been searched...")
			.css({ color: "red", border: "3px dotted aqua" });
		$("#search-input-modal").val("");
		return;
	} else if (currentSearch === "") {
		$(".modal-body")
			.children("p")
			.text("Please enter a query to search...")
			.css({ color: "red", border: "3px dotted aqua" });
	} else {
		searchHistory.push(currentSearch);
		localStorage.setItem("search-history", JSON.stringify(searchHistory));
		wikipediaSection.fadeOut();
		$("header#container").removeClass("hide");
		$(".footer").hide().fadeIn(3000);
		fetchWikiArticles();
		fetchYouTubeVideo();
		youtubeSection.empty();
		localSearchHistory();
		modal.hide();
	}
});

// Function to get YouTube videos using the YouTube API
function fetchYouTubeVideo() {
	var queryURL =
		"https://www.googleapis.com/youtube/v3/search?key=" +
		youtubeKey +
		"&q=" +
		currentSearch +
		"&part=snippet&type=video&regionCode=uk";
	$.ajax({
		url: queryURL,
		method: "GET",
	}).then(function (data) {
		console.log(data);
		for (let i = 0; i < data.items.length; i++) {
			var videoId = data.items[i].id.videoId;
			youtubeSection
				.append(
					`
                <div class="video" id="video${i + 1}">
                    <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
            `,
				)
				.hide()
				.fadeIn(500);
		}
	});
}

// Function to get Wikipedia articles using the Wikipedia API
function fetchWikiArticles() {
	var queryURL =
		"https://en.wikipedia.org/w/api.php?action=query&origin=*&prop=info|pageimages|extracts&exintro&exlimit=max&inprop=url&pithumbsize=1000&gsrlimit=1&generator=search&format=json&gsrsearch=" +
		currentSearch;
	fetch(queryURL)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			console.log(data);
			var pageID = Object.keys(data.query.pages)[0];
			var title = $("<h2></h2>").text(data.query.pages[pageID].title);
			var img = $("<img>").attr(
				"src",
				data.query.pages[pageID].thumbnail.source,
			);
			var para = $("<p></p>").html(data.query.pages[pageID].extract);
			var link = data.query.pages[pageID].fullurl;
			var linkText = $(
				`<p>For a full breakdown on this search, please refer to <a href="${link}" target="_blank">Wikipedia</a>.</p>`,
			);
			wikipediaSection
				.append(title, img, para, linkText)
				.hide()
				.fadeIn(500);
		});
}

// Adds a click event to all the buttons with a class of past-search
$(document).on("click", ".past-search", historyOfSearches);

// Function to re-display the information based on the past-searches buttons
function historyOfSearches() {
	currentSearch = $(this).attr("data-search");
	$("header#container").removeClass("hide");
	$(".footer").hide().fadeIn(3000);
	fetchWikiArticles();
	wikipediaSection.empty().fadeOut();
	fetchYouTubeVideo();
	youtubeSection.empty();
}

// Function to get past searches from local storage
function localSearchHistory() {
	var storedHistory = localStorage.getItem("search-history");
	if (storedHistory) {
		searchHistory = JSON.parse(storedHistory);
		renderSearchHistory(searchHistory);
	}
}

// Function to render past searches buttons
function renderSearchHistory(searchHistory) {
	for (let i = 0; i < searchHistory.length; i++) {
		const element = searchHistory[i];
		if (searchHistory[i].includes(currentSearch)) {
			historyButtons.prepend(
				$(
					`<button class="past-search btn btn-outline-dark mb-2" data-search="${element}" data-bs-dismiss="modal">`,
				).text(element),
			);
		}
	}
}
localSearchHistory();

// Clear searches event listener
$(".clear-search").on("click", function () {
	location.reload();
	localStorage.clear();
	searchHistory = "";
});
