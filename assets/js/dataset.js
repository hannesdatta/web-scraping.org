let dataset;
let datasetResultsHolder = document.querySelector(".datasetResults");
let filters = {};
let filteredResults = [];
let page = 1;
let totalPages = 1;
const perpage = 20;
const datasetDOM = document.querySelector("#dataset");
const totalResultsString = document.querySelector(".totalResultsString");
const filterBtn = document.querySelectorAll(".filterBtn");

// pagination
const nextButton = document.querySelector("#nextBtn");
const prevButton = document.querySelector("#prevBtn");

if (datasetDOM) {
  const source = datasetDOM.dataset.source;
  datasetResultsHolder = document.querySelector(".datasetResults");

  init(source);
}

nextButton.addEventListener("click", () => {
  if (page < totalPages) {
    page++;
    render();
  }
});

prevButton.addEventListener("click", () => {
  if (page > 1) {
    page--;
    render();
  }
});

filterBtn.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const filter = e.target.dataset.type;
    const value = e.target.dataset.value;

    // check if class is already added
    if (e.target.classList.contains("btn-toggle-active")) {
      // remove filter
      e.target.classList.remove("btn-toggle-active");
    } else {
      e.target.classList.add("btn-toggle-active");
    }

    if (filters[filter]) {
      if (filters[filter].includes(value)) {
        filters[filter] = filters[filter].filter((item) => item !== value);
      } else {
        filters[filter].push(value);
      }
    } else {
      filters[filter] = [value];
    }

    filteredResults = dataset.filter((item) => {
      return Object.keys(filters).every((key) => {
        if (filters[key].length === 0) return true;
        return filters[key].includes(String(item[key]));
      });
    });

    page = 1;
    totalPages = Math.ceil(filteredResults.length / perpage);

    render();
  });
});

function init(source) {
  fetch(`/data/${source}`)
    .then((response) => response.json())
    .then((data) => {
      dataset = data;
      render();
    });
}

function render() {
  if (Object.keys(filters).length === 0) {
    filteredResults = dataset;
  }
  // paginate results
  const start = (page - 1) * perpage;
  const end = page * perpage;
  const results = filteredResults.slice(start, end);
  totalPages = Math.ceil(filteredResults.length / perpage);

  totalResultsString.innerHTML = `${filteredResults.length} results`;

  if (page === 1) {
    prevButton.classList.add("d-none");
  } else {
    prevButton.classList.remove("d-none");
  }

  if (page === totalPages) {
    nextButton.classList.add("d-none");
  } else {
    nextButton.classList.remove("d-none");
  }

  if (results.length === 0) {
    nextButton.classList.add("d-none");
    prevButton.classList.add("d-none");
  }

  window.scrollTo(0, 0);
  datasetResultsHolder.innerHTML = "";
  if (results.length === 0) {
    datasetResultsHolder.innerHTML = `<div class="alert alert-danger">No results found</div>`;
  } else {
    datasetResultsHolder.appendChild(createDatasetResults(results));
  }
}

function createDatasetResults(results) {
  results.forEach((result) => {
    const resultDOM = document.createElement("div");
    resultDOM.classList.add("datasetResult");
    resultDOM.innerHTML = `
      <div class="datasetResultTitle">
        <small class="mb-2 text-muted d-block" style="font-size: 14px; margin-bottom: 4px;">${result.type} . ${result.year}</small>
        <h6 style="margin: 0; font-weight: 500;">${result.title}</h6>
      </div>
      <div class="datasetResultDescription">
        <small class="mb-2 text-muted d-block" style="font-size: 14px; margin-top: 8px;">Authors: ${result.authors}</small>
      </div>
    `;

    datasetResultsHolder.appendChild(resultDOM);
  });
}
