const createAutoComplete = ({
  root,
  renderOption,
  onOptionSelect,
  inputValue,
  fetchData,
}) => {
  root.innerHTML = `
<label><b>Search</b></label>
<input class="input" />
<div class="dropdown">
  <div class="dropdown-menu">
    <div class="dropdown-content results"></div>
  </div>
</div>
`;

  //find input,dropdown and results inside root
  const input = root.querySelector("input");
  const dropdown = root.querySelector(".dropdown");
  const resultsWrapper = root.querySelector(".results");

  const onInput = async (event) => {
    //array of movies
    const items = await fetchData(event.target.value);

    //if no results so movies array is empty do not show dropdown
    if (!items.length) {
      dropdown.classList.remove("is-active");
      return;
    }

    //clear older results before displaying new
    resultsWrapper.innerHTML = "";

    dropdown.classList.add("is-active");
    for (let item of items) {
      const option = document.createElement("a");
      //handling image errors
      //const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
      option.classList.add("dropdown-item");
      option.innerHTML = renderOption(item);
      //   option.innerHTML = `
      // <img src="${imgSrc}" />
      // <h1>${movie.Title}</h1>
      // `;
      //document.querySelector("#target").appendChild(div);
      resultsWrapper.appendChild(option);

      //add event listener to option
      option.addEventListener("click", (event) => {
        dropdown.classList.remove("is-active");
        //still in for loop so still have reference to movie object
        //no need to use const with input
        input.value = inputValue(item);
        //onMovieSelect(movie);
        onOptionSelect(item);
      });
    }
  };

  input.addEventListener("input", debounce(onInput, 500));

  //global event listener
  document.addEventListener("click", (event) => {
    //event.target will give you h1, input tag clicked
    //anything clicked outside autocomplete class will need to close the dropdown
    //autocomplete class is contained inside the 'root' JS element
    //event.target will return an element, if root contains that element that don't close else exit dropdown
    if (!root.contains(event.target)) {
      //removing is-active class removes the dropdown
      dropdown.classList.remove("is-active");
    }
  });
};
