// Make Navbar bg black 



const baseURL = 'https://api.themoviedb.org/3';
const apiKey = '872c96244e26b3c9c16fa6d4ebb11c69';
const imgPath = 'https://image.tmdb.org./t/p/original';
const youtubeBaseURL = 'https://youtube.googleapis.com/youtube/v3';
const youtubeApiKey = 'AIzaSyDIPW-8Lgmoa7WHtL-s93JnvwGOWkEvH4E';
const youtubeBaseSearch = 'https://www.youtube.com/watch?v=';
let apiPaths = {
    genreListAPI: `${baseURL}/genre/movie/list?api_key=${apiKey}&language=en-US`,
    movieListAPI: (id) => `${baseURL}/discover/movie?api_key=${apiKey}&language=en-US&with_genres=${id}`,
    trendingMovieAPI: `${baseURL}/trending/all/day?api_key=${apiKey}&language=en-US`,
    youtubeSearchAPI: (query) => `${youtubeBaseURL}/search?q=${query}&key=${youtubeApiKey}`
}
window.addEventListener('load', function() {
    init();
    this.window.addEventListener('scroll', function(){
        const headerDiv = document.getElementById('header');
        if(window.scrollY>5){
            headerDiv.classList.add('bg-black');
        }
        else{
            headerDiv.classList.remove('bg-black');
        }
    })
})
function init(){
    fetchTrendingMovies();
    fetchGenres();
}

function fetchTrendingMovies(){
    fetchMoviesForGenres(apiPaths.trendingMovieAPI, 'Trending Now')
    .then(movies => {
        // console.log(movies[0]);
        let index = parseInt(Math.random()*movies.length)
        buildBannerSection(movies[index]);
    })
    .catch(err => console.log(err));
}
function buildBannerSection(movie){
    const bannerHTML = `
        <div class="banner-title">${movie.title}</div>
        <div class="banner-type">Trending in Movies</div>
        <div class="banner-desc">${movie.overview}</div>
        <div class="banner-btns">
            <button class="btn-play"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 2.69127C4 1.93067 4.81547 1.44851 5.48192 1.81506L22.4069 11.1238C23.0977 11.5037 23.0977 12.4963 22.4069 12.8762L5.48192 22.1849C4.81546 22.5515 4 22.0693 4 21.3087V2.69127Z" fill="currentColor"></path></svg> &nbsp;&nbsp; Play</button>
            <button class="btn-info"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3ZM1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM13 10V18H11V10H13ZM12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z" fill="currentColor"></path></svg> &nbsp;&nbsp; More Info</button>
        </div>
        <div class="banner-fade-bottom"></div>
        `

        const div = document.createElement('div');
        div.className = 'banner-content';
        div.innerHTML = bannerHTML;
        const bannerDiv = document.getElementById('banner-sec-id');
        bannerDiv.style.backgroundImage = "url("+imgPath+movie.backdrop_path+")";
        bannerDiv.append(div);
}

function fetchGenres(){
    fetch(apiPaths.genreListAPI)
    .then(res => res.json())
    .then(res => {
        const categories = res.genres;
        // console.log(categories);
        categories.forEach(category => {
            // console.log(apiPaths.movieListAPI(category.id));
            fetchMoviesForGenres(apiPaths.movieListAPI(category.id), category.name);
        });
    })
    .catch(err => console.log(err))
}
function fetchMoviesForGenres(fetchURL, categoryName){
    return fetch(fetchURL)
    .then(res => res.json())
    .then(res => {
        // console.log(category.name);
        // console.log(res.results);
        const moviesList = res.results;
        buildMovieSection(moviesList, categoryName);
        return moviesList;
    })
    .catch(err => console.log(err))
}
function buildMovieSection(moviesList, categoryName){
    // console.log(moviesList[0].title);
    const movieListHTML = moviesList.map(item => {
        return `
        <img src="${imgPath}${item.backdrop_path}" alt="${item.title}" class="movie-item" onclick = "searchMovieTrailer('${item.title}')">
        `
    }).join('');
    const MovieSectionhtml = `
    <h2 class="genre">${categoryName} <span class="explore">Explore All ></span></h2>
    <div class="movie-category">
        ${movieListHTML}
    </div>
    `
    // console.log(MovieSectionhtml);

    let div = document.createElement('div');
    div.className = 'moviesSectionList'
    div.innerHTML = MovieSectionhtml;

    let doc2 = document.getElementById('movies-section');
    // console.log(doc2);
    // console.log(div);
    doc2.append(div);

}

// Fetch movie trailers
function searchMovieTrailer(movieName){
    if(!movieName) return;

    // console.log(movieName);
    fetch(apiPaths.youtubeSearchAPI(movieName))
    .then(res => res.json())
    .then(res => {
        // console.log(res.items[0].id.videoId);
        const bestSearch = res.items[0].id.videoId;
        window.open(`${youtubeBaseSearch}${bestSearch}`, '_blank');
        // console.log(res);
    })
    .catch(err => console.log(err));
}