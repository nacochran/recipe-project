//Search.jsx
import React from 'react';

async function get_recipes() {
  try {
    const response = await fetch('/get-recipes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tags: [''], // test tags
        search_query: "Recipes...",
        cookTime: 25,
        average_rating: 4.5
      })
    });

    const result = await response.json();
    if (result.error) {
      alert('Error: ' + result.error);
    } else {
      console.log(result);
    }
  } catch (err) {
    console.error('Error getting recipes: ', err);
  }
}