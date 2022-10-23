import './css/styles.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import PicturesSearchApiService from './fetchPictures.js';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const picturesSearchApiService = new PicturesSearchApiService();
loadMoreBtn.classList.add('is-hidden');
form.addEventListener('submit', onForm);
loadMoreBtn.addEventListener('click', onLoadMore);
gallery.addEventListener('click', onGalleryClick);
let lightbox;

function onForm(evt) {
  evt.preventDefault();
  clearGallery();
  loadMoreBtn.classList.add('is-hidden');
  picturesSearchApiService.query = evt.currentTarget.elements.searchQuery.value
    .toLowerCase()
    .trim();
  if (picturesSearchApiService.query === '') {
    return;
  }
  picturesSearchApiService.resetPage();

  picturesSearchApiService.getPictures().then(hits => {
    if (hits.length === 0) {
      loadMoreBtn.classList.add('is-hidden');
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else if (hits.length < picturesSearchApiService.perPage) {
      console.log(hits.length);
      gallery.insertAdjacentHTML('beforeend', createGalleryMarkup(hits));
      loadMoreBtn.classList.add('is-hidden');
      setTimeout(() => {
        Notiflix.Notify.info(`Sorry, but these are all results.`);
      }, 3000);
    } else {
      gallery.insertAdjacentHTML('beforeend', createGalleryMarkup(hits));
      loadMoreBtn.classList.remove('is-hidden');
    }
  });
}

function onLoadMore() {
  picturesSearchApiService.getPictures().then(hits => {
    if (hits.length < picturesSearchApiService.perPage) {
      loadMoreBtn.classList.add('is-hidden');
      gallery.insertAdjacentHTML('beforeend', createGalleryMarkup(hits));
      setTimeout(() => {
        Notiflix.Notify.info(
          `We're sorry, but you've reached the end of search results.`
        );
      }, 3000);
    } else {
      gallery.insertAdjacentHTML('beforeend', createGalleryMarkup(hits));
    }
  });
  lightbox.refresh();
}

function clearGallery() {
  gallery.innerHTML = '';
}

function onGalleryClick(event) {
  event.preventDefault();

  const isItemGallery = event.target.classList.contains('gallery__image');

  if (!isItemGallery) {
    return;
  }
  lightbox = new SimpleLightbox('.gallery__item', {
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
  });
}

function createGalleryMarkup(galleryItems) {
  return galleryItems
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a class="gallery__item" href="${largeImageURL}">
      <div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" class="gallery__image", loading="lazy"  />
        <div class="info">
          <p class="info-item">
            <b>Likes: ${likes} </b>
          </p>
         <p class="info-item">
           <b>Views:${views}</b>
         </p>
        <p class="info-item">
          <b>Comments: ${comments}</b>
        </p>
        <p class="info-item">
          <b>Downloads: ${downloads}</b>
        </p>
      </div>
      </div>
    </a>`;
      }
    )
    .join('');
}
