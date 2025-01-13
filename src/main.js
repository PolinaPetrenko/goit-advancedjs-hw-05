import iziToast from "izitoast";
import SimpleLightbox from "simplelightbox";
import { createGalleryCardTemplate } from "./js/render-functions";
import { fetchPhotosByQuery } from "./js/pixabay-api";

const searchFormEl = document.querySelector('.js-search-form');
const galleryEl = document.querySelector('.js-gallery');
const loaderEl = document.querySelector('.js-loader'); // Елемент з текстом "Loading images, please wait..."

function showLoader() {
    loaderEl.textContent = "Loading images, please wait..."; 
    loaderEl.classList.remove('is-hidden');
}

function hideLoader() {
    loaderEl.classList.add('is-hidden'); 
    loaderEl.textContent = ""; 
}

const loadMoreButton = document.querySelector('.js-load-more-btn');
let page = 1;
let inputValue = '';

let simplelightbox = new SimpleLightbox('.gallery-card a', {
    captionsData: 'alt',
    captionDelay: 250,
});

const onSearchFormSubmit = async event => {
    try {
        event.preventDefault();
    
        inputValue = event.currentTarget.elements.user_query.value.trim();
    
        if (inputValue === '') {
            iziToast.error({
                message: "Search value should not be empty!",
                position: "topRight",
            });
            return;
        }

        searchFormEl.reset();

        galleryEl.innerHTML = ''; // Очищаємо галерею
        loadMoreButton.classList.add('is-hidden'); // Ховаємо кнопку "Load More"
        showLoader(); // Показуємо текстовий лоадер
    
        page = 1;

        const response = await fetchPhotosByQuery(inputValue, page);
         
        hideLoader(); // Ховаємо текстовий лоадер
    
        if (response.data.totalHits === 0) {
            iziToast.error({
                message: "Sorry, there are no images matching your search query. Please try again!",
                position: "topRight",
            });
            galleryEl.innerHTML = ''; // Якщо немає результатів, очищаємо галерею
            searchFormEl.reset();
            return;
        }

        if (response.data.totalHits > 15) {
            loadMoreButton.classList.remove('is-hidden'); // Показуємо кнопку 
            loadMoreButton.addEventListener('click', onLoadMoreButtonClick);
        }

        galleryEl.innerHTML = createGalleryCardTemplate(response.data.hits); 
        smoothScroll();
        simplelightbox.refresh();
    } catch (err) {
        console.log(err);
    }
};

searchFormEl.addEventListener('submit', onSearchFormSubmit);

const onLoadMoreButtonClick = async event => {
    try {
        loadMoreButton.classList.add('is-hidden'); // Ховаємо кнопку 
        showLoader(); 

        page++;
        const response = await fetchPhotosByQuery(inputValue, page);

        hideLoader(); 
        loadMoreButton.classList.remove('is-hidden'); // Показуємо кнопку 

        galleryEl.insertAdjacentHTML('beforeend', createGalleryCardTemplate(response.data.hits)); // Додаємо нові зображення в галерею
        smoothScroll();
        simplelightbox.refresh();

        if (response.data.totalHits <= page * 15) {
            loadMoreButton.classList.add('is-hidden'); 
            loadMoreButton.removeEventListener('click', onLoadMoreButtonClick);

            iziToast.info({
                message: "We're sorry, but you've reached the end of search results.",
                position: "topRight",
            });
        }
    } catch (err) {
        console.log(err);
    }
};

function smoothScroll() {
    const galleryCardEl = document.querySelector('.gallery-card');
    if (!galleryCardEl) return; 

    const rect = galleryCardEl.getBoundingClientRect();
    const cardHeight = rect.height;

    window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
    });
}