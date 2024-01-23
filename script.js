/** @format */

const apiKey = "AIzaSyDGCWZu84Wo1O7MmVU6sHP67CzIOQyaz_E";
const historyButtons = $(".history");
var youtubeSection = $("#youtube-section");
var wikipediaSection = $("#wikipedia-section");
var currentSearch = "";
var searchHistory = [];

// Display Modal
var modal = new bootstrap.Modal(document.getElementById("exampleModal"));
modal.show();

// Event listener to get the search value from the page
$(".search-button-class").on("click", function (e) {
  e.preventDefault();
  currentSearch = $("#search-input").val();
  if (searchHistory.includes(currentSearch) || currentSearch === "") {
    $("header#container").addClass("hide");
    wikipediaSection.empty();
    youtubeSection.empty();
    $(".footer").hide();
    location.reload();
    return;
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
$(".search-button-modal").on("click", function (e) {
  e.preventDefault();
  currentSearch = $("#search-input-modal").val();
  if (searchHistory.includes(currentSearch) || currentSearch === "") {
    location.reload();
    return;
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
  }
});

// Function to get YouTube videos using the YouTube API
function fetchYouTubeVideo() {
  var queryURL =
    "https://www.googleapis.com/youtube/v3/search?key=" +
    apiKey +
    "&q=" +
    currentSearch +
    "&part=snippet&type=video&regionCode=uk";
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (youtubeData) {
    for (let i = 0; i < youtubeData.items.length; i++) {
      var videoId = youtubeData.items[i].id.videoId;
      youtubeSection
        .append(
          `
                <div class="video" id="video${i + 1}">
                    <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
            `
        )
        .hide()
        .fadeIn(500);
    }
  });
}

// Function to get Wikipedia articles using the Wikipedia API
function fetchWikiArticles() {
  var queryURL =
    "https://en.wikipedia.org/w/api.php?action=query&list=allimages&aifrom=B&generator=search&links&gsrsearch=" +
    currentSearch +
    "&gsrlimit=1&prop=info|pageimages|extracts&exintro&exlimit=max&inprop=url&format=json&origin=*&pithumbsize=1000";
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (wikiData) {
    var results = wikiData.query.pages;
    Object.keys(results).forEach((key) => {
      const id = key;
      const title = results[key].title;
      const text = results[key].extract;
      const image = results[key].thumbnail.source;
      const wikiLink = results[key].fullurl;
      wikipediaSection
        .append(
          `
                <h2>${title}</h2>
                <img src="${image}" alt="${title}">
                <p>${text}</p>
                <p>For more information, visit <a href="${wikiLink}" target="_blank">Wikipedia</a>.</p>
            `
        )
        .hide()
        .fadeIn(500);
    });
  });
}

// Adds a click event to all the buttons with a class of past-search
$(document).on("click", ".past-search", historyOfSearches);

// Function to re-display the current weather based on the click of past-searches buttons
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
          `<button class="past-search btn btn-outline-dark mb-2" data-search="${element}" data-bs-dismiss="modal">`
        ).text(element)
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
