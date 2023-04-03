'use strict';

// SELECTORS
const gallery = document.querySelector('.gallery');
const filters = document.querySelectorAll('.filter-btn');

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

const getAllWorks = async function () {
  // get all works
  try {
    // get data
    const res = await fetch('http://localhost:5678/api/works');
    return await res.json();
  } catch (err) {
    console.error(err);
  }
};

// MAIN ASYNC FUNCTION TO STORE DATA FROM FETCH CALL
async function app() {
  const data = await getAllWorks();
  console.log(data);

  // render all works on first loading
  data.forEach((work) => renderWork(work));

  // FILTERS EVENT LISTENERS
  filters.forEach((filterButton) =>
    filterButton.addEventListener('click', (e) => {
      const clickedFilter = e.target;

      // UI update
      //1. removing active class on all filter buttons
      filters.forEach((filter) => {
        filter.classList.remove('filter-btn--active');
      });

      // 2. adding active class on clicked filter
      clickedFilter.classList.add('filter-btn--active');

      // 3. delete HTML :
      deleteHTML(gallery);

      // Filter functionality
      if (e.target.id === 'tous') {
        data.forEach((work) => renderWork(work));
      } else {
        data
          .filter((el) => el.categoryId === +clickedFilter.dataset.category)
          .forEach((work) => renderWork(work));
      }
    })
  );
}

app();
