const APIs = (() => {
  const URL = "http://localhost:4232/movies";

  const getMovies = () => {
    return fetch(`${URL}`).then((res) => res.json());
  };

  const addMovieList = (movies) => {
    return fetch(URL, {
      method: "POST",
      body: JSON.stringify(movies),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
  };

  return {
    getMovies,
    addMovieList,
  };
})();

const Model = (() => {
  class State {
    #movies;
    #onChangeCb;
    constructor() {
      this.#movies = [];
      this.#onChangeCb = () => {};
    }
    get movies() {
      return this.#movies;
    }

    set movies(newMovies) {
      this.#movies = newMovies;
      this.#onChangeCb();
    }

    subscribe = (cb) => {
      this.#onChangeCb = cb;
    };
  }
  return {
    State,
  };
})();

const View = (() => {
  const carouselEl = document.querySelector(".carousel-container");
  const renderMovieList = (movies) => {
    let template = "";
    movies
      .sort((a, b) => b.id - a.id)
      .forEach((movie) => {
        template += `
              <img id="${movie.id}" src="${movie.imgUrl}"/>
              <p id="${movie.id}">${movie.name}</p>
              <p id="${movie.id}">${movie.outlineInfo}</p>
          `;
      });
    carouselEl.innerHTML = template;
  };
  return {
    carouselEl,
    renderMovieList,
  };
})();

const ViewModel = ((Model, View) => {
  const state = new Model.State();

  const getMovies = () => {
    APIs.getMovies().then((res) => {
      state.movies = res;
    });
  };

  const bootstrap = () => {
    getMovies();
    state.subscribe(() => {
      View.renderMovieList(state.movies);
    });
  };
  return {
    bootstrap,
  };
})(Model, View);

ViewModel.bootstrap();
