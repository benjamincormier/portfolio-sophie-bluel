'use strict';

// HELPER FUNCTIONS
const renderWork = function ({ imageUrl, title }) {
  const HTML = `
      <figure>
          <img
          src="${imageUrl}"
          alt="${title}"
          />
          <figcaption>${title}</figcaption>
      </figure>`;
  gallery.insertAdjacentHTML('beforeend', HTML);
};

const deleteHTML = (parent) => parent.replaceChildren();

const toggleView = function () {
  /* switches between main page and login page */
  main.classList.toggle('hidden');
  loginModal.classList.toggle('hidden');
};
