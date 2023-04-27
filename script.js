import { api_key } from "./api_key.js";

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const resultDiv = document.getElementById("search-results");

function lazyLoadImages() {
  const lazyImages = document.querySelectorAll(".lazyload");

  const options = {
    rootMargin: "0px",
    threshold: 0.9,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const lazyImage = entry.target;
        lazyImage.src = lazyImage.dataset.src;
        lazyImage.classList.remove("lazyload");
        observer.unobserve(lazyImage);
      }
    });
  }, options);

  lazyImages.forEach((lazyImage) => {
    observer.observe(lazyImage);
  });
}

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const searchQuery = searchInput.value;
  const apiUrl = `https://www.omdbapi.com/?s=${searchQuery}&apikey=${api_key}`;

  const response = await fetch(apiUrl);
  const data = await response.json();
  console.log(data);

  const searchResults = data.Search;

  let output = "";

  searchResults.forEach((movie) => {
    output += `
    <div class="col-lg-4 col-md-6 col-sm-12 mb-3">
      <div class="card">
        <img src="https://media2.giphy.com/media/Vuw9m5wXviFIQ/200.webp?cid=ecf05e47mj7ag0ujb2592jq7vizzubol3cnk0b7vkbcy2mbr&ep=v1_gifs_search&rid=200.webp&ct=g" data-src="${movie.Poster}" class="card-img-top lazyload" alt="${movie.Title}">
        <div class="card-body">
          <h5 class="card-title">${movie.Title}</h5>
          <p class="card-text">Year: ${movie.Year}</p>
          <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" data-movieid="${movie.imdbID}">Plus d'informations...</button>
        </div>
      </div>
    </div>
  `;
  });

  resultDiv.innerHTML = `
  <div class="row row-cols-1 row-cols-md-3 g-3">
    ${output}
  </div>
`;

lazyLoadImages();

  // Add a modal for showing movie details
  resultDiv.insertAdjacentHTML(
    "afterend",
    `
  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel"></h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-md-4">
              <img src="" class="img-fluid rounded" alt="">
            </div>
            <div class="col-md-8">
              <p><strong>Year:</strong> <span id="year"></span></p>
              <p><strong>Plot:</strong> <span id="plot"></span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `
  );

  // Add an event listener for showing the movie details when the button is clicked
  const detailButtons = document.querySelectorAll("[data-movieid]");
  detailButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const movieId = button.getAttribute("data-movieid");
      const modalTitle = document.querySelector(".modal-title");
      const modalImage = document.querySelector(".modal-body img");
      const modalYear = document.querySelector("#year");
      const modalPlot = document.querySelector("#plot");

      fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=${api_key}`)
        .then((response) => response.json())
        .then((data) => {
          modalTitle.textContent = data.Title;
          modalImage.src = data.Poster;
          modalYear.textContent = data.Year;
          modalPlot.textContent = data.Plot;
        })
        .catch((error) => console.error(error));
    });
  });
});
