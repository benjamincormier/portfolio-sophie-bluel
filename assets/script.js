'use strict';

/*
sophie.bluel@test.tld
S0phie
*/

const state = {
  token: '',
  works: [],
  file: null,
};

const API_URL = 'http://localhost:5678/api';

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
const editMode = document.querySelector('.edit-mode');
const editButton = document.querySelector('.my-projects__edit-btn');
const logoutButton = document.querySelector('.logout-btn');

// Modal
const openEditModalBtn = document.querySelector('.my-projects__edit-btn');
const editOverlay = document.querySelector('.edit-overlay');
const editModal = document.querySelector('.edit-modal');
const editModalPage1 = document.querySelector('.edit-modal--1');
const editModalPage2 = document.querySelector('.edit-modal--2');
const editModalPrevBtn = document.querySelector('.edit-modal__prev-btn');
const closeEditModalBtns = document.querySelectorAll('.edit-modal__close-btn');
const modalGallery = document.querySelector('.edit-modal__gallery');

// Adding a picture
const addAPictureButton = document.querySelector('.add-picture-btn');
const addPictureForm = document.querySelector('.add-picture-form');
const pictureInput = document.getElementById('new-picture');
// const pictureInput = document.getElementById('new-picture');
const previewImg = document.querySelector('.add-image__preview');
const loadPictureButton = document.querySelector('.add-image__btn');
const addPictureFormInputs = addPictureForm.querySelectorAll('input, select');
const addPictureTitle = document.getElementById('title');
const addPictureSelect = document.getElementById('category');

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

const clearAddPictureInputs = function () {
  addPictureTitle.value = '';
  // Nettoyage photos
  state.file = null;
  // 3) Uploading UI : Rendering preview
  previewImg.classList.add('hidden');
  loadPictureButton.classList.remove('hidden');
  // loadPictureButton.remove();
};

/*********************************************************************************
 ******************** APP MAIN FUNCTIONS
 **********************************************************************************/

const renderHomeGallery = async function () {
  deleteHTML(gallery);
  try {
    state.works = await getAllWorks(); // API request
    state.works.forEach((work) => renderWork(work)); // actual rendering
  } catch (err) {
    console.error(err);
  }
};

const getAllWorks = async function () {
  // get all works
  try {
    // get data
    const res = await fetch(`${API_URL}/works`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

const logout = function () {
  state.token = '';
  logoutButton.classList.toggle('hidden');
  toggleLoginModal.classList.toggle('hidden');
  editMode.classList.toggle('hidden');
  editButton.classList.toggle('hidden');
};

const handleLoginRequest = async function (e) {
  e.preventDefault();

  // getting values entered by user
  const email = loginEmailInput.value;
  const password = loginPasswordInput.value;
  const data = { email, password };

  // log in
  try {
    const res = await fetch(`${API_URL}/users/login`, {
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
    // updating UI
    // 2) retour sur accueil

    // Afficher bouton Logout et masquer bouton login
    logoutButton.classList.toggle('hidden');
    toggleLoginModal.classList.toggle('hidden');
    toggleView();

    // 3) Afficher barre "Mode édition"
    editMode.classList.toggle('hidden');

    // 4) Afficher bouton "modifier" à côté du h2 "Mes Projets"
    editButton.classList.toggle('hidden');
  } catch (err) {
    console.error(`💥💥💥💥 ${err}`);
  }
};

const renderModalGallery = function () {
  const markup = state.works
    .map((el) => {
      return `
      <div class="edit-gallery__fig" data-id="${el.id}">
        <div class="gallery__icons-box">
          <button class="gallery__delete-button">
            <i class="fa fa-trash gallery__delete-icon"></i>
          </button>
        </div>
        <img
          class="edit-gallery__img"
          src="${el.imageUrl}"
          alt="${el.title}"
        />
        <p>éditer</p>
      </div>
  `;
    })
    .join('');

  deleteHTML(modalGallery);

  modalGallery.insertAdjacentHTML('beforeend', markup);
};

const openEditModal = function () {
  // 1) Displaying modal & overlay
  editModal.classList.remove('hidden');
  editOverlay.classList.remove('hidden');

  // 3) Rendering the gallery
  renderModalGallery();
};

const closeEditModal = function () {
  editModal.classList.add('hidden');
  editOverlay.classList.add('hidden');
  editModalPage1.classList.remove('hidden');
  editModalPage2.classList.add('hidden');
};

const toggleEditModal = function () {
  editModal.classList.toggle('hidden');
  editOverlay.classList.toggle('hidden');
};

/* DELETING A PICTURE */

const handleDeleteRequest = async function (id) {
  // 1) Delete Request
  try {
    const res = await fetch(`${API_URL}/works/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${state.token}`,
      },
    });

    console.log(`Work #${id} has been deleted!`);

    // 2) Update UI
    await renderHomeGallery();
    await renderModalGallery();
  } catch (err) {
    console.error(err);
  }
};

/* ADDING A PICTURE - FORM AND IMAGE PREVIEW */

const displayAddPictureForm = function () {
  // 1) Uploading Modal UI (page 1 -> 2)
  editModalPage1.classList.toggle('hidden');
  editModalPage2.classList.toggle('hidden');
  /*   addPictureFormInputs.forEach((input) =>
    input.addEventListener('click', function (e) {})
  ); // à uti */

  // 2) Loading the image from thml to Javascript
  pictureInput.addEventListener('change', function () {
    const files = [...pictureInput.files];
    const file = files[0];

    const reader = new FileReader();
    reader.addEventListener('load', function () {
      // Render image preview
      previewImg.src = reader.result; // src ne refait pas le rendu de la page
    });

    if (file) {
      // Read file as data URL
      reader.readAsDataURL(file); // refait le rendu de la page
      state.file = file;
      // 3) Uploading UI : Rendering preview
      previewImg.classList.remove('hidden');
      loadPictureButton.classList.add('hidden');
    }
  });
};

/* ADDING A PICTURE - FORM SUBMIT */

const handleAddPictureRequest = async function (e) {
  e.preventDefault();

  const title = addPictureTitle.value;
  const category = addPictureSelect.selectedIndex;

  // 1) Checking if everything is correct
  const data = new FormData();
  data.append('image', state.file);
  data.append('title', title);
  data.append('category', category);

  if (!state.file) {
    window.alert("Merci d'ajouter une photo avant de valider ! ");
    return;
  } // if no image uploaded, return. Titles and categories are checked via submit form

  // 2) Fetch request
  try {
    const res = await fetch(`${API_URL}/works`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${state.token}`,
      },
      body: data,
    });
    const response = await res.json();

    // 3) Update UI
    await clearAddPictureInputs();
    await renderHomeGallery();
    await renderModalGallery();
    editModalPage1.classList.toggle('hidden');
    editModalPage2.classList.toggle('hidden');
  } catch (err) {
    console.error(err);
  }
};

/*********************************************************************************
 ******************** CONTROLLER
 **********************************************************************************/

// MAIN ASYNC FUNCTION TO STORE DATA FROM FETCH CALL
async function init() {
  // DISPLAY LOGIN PAGE FUNCTIONALITY
  toggleLoginModal.addEventListener('click', function () {
    toggleView();
  });

  logoutButton.addEventListener('click', logout);

  await renderHomeGallery();

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

  [...closeEditModalBtns, editOverlay].forEach((el) =>
    el.addEventListener('click', closeEditModal)
  );

  editModalPrevBtn.addEventListener('click', function () {
    editModalPage1.classList.toggle('hidden');
    editModalPage2.classList.toggle('hidden');
  });

  // MODAL GALLERY - DELETING A PICTURE
  modalGallery.addEventListener('click', function (e) {
    if (
      e.target.classList.contains('gallery__delete-button') ||
      e.target.classList.contains('gallery__delete-icon')
    ) {
      const id = e.target.closest('.edit-gallery__fig').dataset.id;

      // Delete HTTP Request
      handleDeleteRequest(id);
    }
  });

  // MODAL GALLERY - ADDIONG A PICTURE
  addAPictureButton.addEventListener('click', displayAddPictureForm);
  addPictureForm.addEventListener('submit', handleAddPictureRequest);
}

init();
