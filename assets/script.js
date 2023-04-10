'use strict';

// A SUPPRIMZER
const testButton = document.querySelector('.test');

// SELECTORS
const main = document.getElementById('main');
const gallery = document.querySelector('.gallery');
const filters = document.querySelectorAll('.filter-btn');
const toggleLoginModal = document.querySelector('.show-login-modal');
const loginModal = document.querySelector('.login');
const loginButton = document.querySelector('.login-btn');

// DISPLAY LOGIN PAGE (MODAL) FUNCTIONALITY :
toggleLoginModal.addEventListener('click', function () {
  toggleView();
});

// MAIN ASYNC FUNCTION TO STORE DATA FROM FETCH CALL
async function app() {
  const data = await getAllWorks();

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

  // LOGIN FUNCTIONALITY
  loginButton.addEventListener('click', handleLoginRequest);

  // CHECKING IF TOKEN CAN BE ACCESSED ASYNCHRONOUSLY TO MAKE SURE THE LOGIN HAS RETURNED :
  window.addEventListener('keydown', function (e) {
    if (e.key === 't') console.log(`Token = ${token}`);
  });
}

app();
