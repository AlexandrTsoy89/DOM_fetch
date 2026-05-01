function debounce(fn, delay) {
  let timeout;

  return function (...args) {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

async function fetchRepos(query) {
  const response = await fetch(
    `https://api.github.com/search/repositories?q=${query}&per_page=5`,
  );

  const data = await response.json();
  return data.items;
}

const input = document.getElementById("search");
const autocomplete = document.getElementById("autocomplete");
const reposContainer = document.getElementById("repos");

function renderAutocomplete(repos) {
  autocomplete.innerHTML = "";

  repos.forEach((repo) => {
    const div = document.createElement("div");
    div.classList.add("autocomplete-item");
    div.textContent = repo.name;

    div.addEventListener("click", () => {
      addRepo(repo);
      autocomplete.innerHTML = "";
      input.value = "";
    });

    autocomplete.appendChild(div);
  });
}

function addRepo(repo) {
  const div = document.createElement("div");
  div.classList.add("repo");

  div.innerHTML = `
    <div>
      <div>Name: ${repo.name}</div>
      <div>Owner: ${repo.owner.login}</div>
      <div>Stars: ${repo.stargazers_count}</div>
    </div>
    <button>Delete</button>
  `;

  div.querySelector("button").addEventListener("click", () => {
    div.remove();
  });

  reposContainer.appendChild(div);
}

const handleInput = debounce(async (event) => {
  const value = event.target.value.trim();

  if (!value) {
    autocomplete.innerHTML = "";
    return;
  }

  const repos = await fetchRepos(value);
  renderAutocomplete(repos);
}, 500);

input.addEventListener("input", handleInput);
