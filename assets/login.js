'use srtict';

/*
sophie.bluel@test.tld
S0phie
*/

let token; // global scope so it can be accessed by app.

const handleLoginRequest = async function (e) {
  e.preventDefault();

  // getting values entered by user
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('password').value;
  const data = { email, password };

  // log in
  try {
    const res = await fetch('http://localhost:5678/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const response = await res.json();
    token = response.token;

    // updating UI -> returning of main page
    toggleView();
    return response; // is it necessary?
  } catch (err) {
    console.error(err);
  }
};
