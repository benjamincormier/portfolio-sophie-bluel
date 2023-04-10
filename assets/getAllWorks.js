'use strict';

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
