export const createGalleryCardTemplate = imgArr => {
    return imgArr.reduce((acc, el) => {
        return (
            acc +
            `
            <li class="gallery-card">
              <a class="gallery-img-orig" href="${el.largeImageURL}">
                <img class="gallery-img" src="${el.webformatURL}" alt="${el.tags}" />
                <div class="img-data">
                 <div class="img-data-column img-likes">
                  <p class="img-title">Likes</p>
                  <p class="img-value">${el.likes}</p>
                 </div>
                 <div class="img-data-column img-views">
                  <p class="img-title">Views</p>
                  <p class="img-value">${el.views}</p>
                 </div>
                 <div class="img-data-column img-comments">
                  <p class="img-title">Comments</p>
                  <p class="img-value">${el.comments}</p>
                 </div>
                  <div class="img-data-column img-downloads">
                  <p class="img-title">Downloads</p>
                  <p class="img-value">${el.downloads}</p>
                 </div>
                </div>
              </a>
            </li>
           `
        )
    }, '');
};
