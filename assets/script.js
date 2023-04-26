'use strict';

/*
sophie.bluel@test.tld
S0phie
*/

const state = {
  token: '',
  works: [],
};

// SELECTORS
const main = document.getElementById('main');
const gallery = document.querySelector('.gallery');
const filters = document.querySelectorAll('.filter-btn');

// Login
const toggleLoginModal = document.querySelector('.show-login-modal');
const loginModal = document.querySelector('.login');
const loginForm = document.querySelector('.login-form');
const loginEmailInput = document.getElementById('loginEmail');
const loginPasswordInput = document.getElementById('password');

// Modal
const openEditModalBtn = document.querySelector('.my-projects__edit-btn');
const editOverlay = document.querySelector('.edit-overlay');
const editModal = document.querySelector('.edit-modal');
const closeEditModalBtn = document.querySelector('.edit-modal__close-btn');
const modalGallery = document.querySelector('.edit-modal__gallery');

/*********************************************************************************
 ******************** HELPERS FUNCTIONS
 **********************************************************************************/
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

const clearLoginInputs = function () {
  // loginEmailInput.value = '';
  loginPasswordInput.value = '';
};

/*********************************************************************************
 ******************** APP CORE FUNCTIONS
 **********************************************************************************/

const getAllWorks = async function () {
  // get all works
  try {
    // get data
    const res = await fetch('http://localhost:5678/api/works');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

// SELECTORS
const editMode = document.querySelector('.edit-mode');
const editButton = document.querySelector('.my-projects__edit-btn');

const handleLoginRequest = async function (e) {
  e.preventDefault();

  // getting values entered by user
  const email = loginEmailInput.value;
  const password = loginPasswordInput.value;
  const data = { email, password };
  console.log(data);

  // log in
  try {
    const res = await fetch('http://localhost:5678/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (res.status !== 200) {
      window.alert(
        "L'e-mail et/ou mot de passe sont incorrect(s) ! Veuillez réassayer !"
      );
      clearLoginInputs();
      return;
    }

    const response = await res.json();
    state.token = response.token;

    /* const abc = new FormData();
    abc.append('image', img)
    abc.append('title', "titre de l'image")
    abc.append('image', img) 
    
    dans fetch:
   -H 'accept: application/json' \
    -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY4MjAyMTA3MywiZXhwIjoxNjgyMTA3NDczfQ.Jde-op7P2lRVWVo1B-zoAjDs-EJK_xfNnXLtLsNt5L4' \
    -H 'Content-Type: multipart/form-data'
    
    */
    // updating UI
    // 2) retour sur accueil
    toggleView();

    // 3) Afficher barre "Mode édition"
    editMode.classList.remove('hidden');

    // 4) Afficher bouton "modifier" à côté du h2 "Mes Projets"
    editButton.classList.remove('hidden');
  } catch (err) {
    console.error(`💥💥💥💥 ${err}`);
  }
};

const openEditModal = function () {
  // 1) Displaying modal & overlay
  toggleEditModal();

  // 2) Rendering the gallery
  const markup = state.works
    .map((el) => {
      return `
        <figure class="edit-gallery__fig" data-id="${el.id}">
          <img
            class="edit-gallery__img"
            src="${el.imageUrl}"
            alt="${el.title}"
          />
        </figure>
    `;
    })
    .join('');

  console.log(markup);

  deleteHTML(modalGallery);

  modalGallery.insertAdjacentHTML('beforeend', markup);
};

const toggleEditModal = function () {
  editModal.classList.toggle('hidden');
  editOverlay.classList.toggle('hidden');
};

/*********************************************************************************
 ******************** EVENT LISTENERS
 **********************************************************************************/

// MAIN ASYNC FUNCTION TO STORE DATA FROM FETCH CALL
async function init() {
  console.log('init started');

  // DISPLAY LOGIN PAGE (MODAL) FUNCTIONALITY (METTRE DANS INIT)
  toggleLoginModal.addEventListener('click', function () {
    toggleView();
  });

  state.works = await getAllWorks();
  console.log(state.works);

  // render all works on first loading
  state.works.forEach((work) => renderWork(work));

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
        state.works.forEach((work) => renderWork(work));
      } else {
        state.works
          .filter((el) => el.categoryId === +clickedFilter.dataset.category)
          .forEach((work) => renderWork(work));
      }
    })
  );

  // LOGIN FUNCTIONALITY
  loginForm.addEventListener('submit', handleLoginRequest);

  // EDIT FUNCTIONALITY

  openEditModalBtn.addEventListener('click', openEditModal);

  [closeEditModalBtn, editOverlay].forEach((el) =>
    el.addEventListener('click', toggleEditModal)
  );
}

init();
