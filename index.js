import * as Carousel from './Carousel.js';
//import axios from 'axios';

// Elements
const breedSelect = document.getElementById('breedSelect');
const infoDump = document.getElementById('infoDump');
const progressBar = document.getElementById('progressBar');
const getFavouritesBtn = document.getElementById('getFavouritesBtn');

// API Key and Base URL
const API_KEY = "live_YnKOLmaw0z8V1dNmYZVljOeWrMjaTDfSo4RFW5dkyaaMUbJmWJ5E8ks0NDjDVqTS"; 
axios.defaults.baseURL = "https://api.thecatapi.com/v1";
axios.defaults.headers.common["x-api-key"] = API_KEY;

// Initial Load Function - using fetch
async function initialLoad_fetch() {
  try {
    const res = await axios.get('/breeds');
    const breeds = res.data;

    // Populate dropdown
    breeds.forEach((breed) => {
      const option = document.createElement('option');
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect_fetch.append(option);
    });

    // Trigger the first selection
    //if (breeds.length > 0) {
    //  loadBreedImages_fetch(breeds[0].id); // Load the first breed's data by default
    //}
  } catch (err) {
    console.error("Failed to load breeds:", err);
    alert("Unable to load breeds. Please try again later.");
  }
}

// Start Initial Load - using axios
initialLoad_fetch();

// Initial Load Function - using axios
async function initialLoad_axios() {
  try {
    const res = await axios.get('/breeds');
    const breeds = res.data;

    // Populate dropdown
    breeds.forEach((breed) => {
      const option = document.createElement('option');
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect_axios.append(option);
    });

    //// Trigger the first selection
    //if (breeds.length > 0) {
    //  loadBreedImages_axios(breeds[0].id); // Load the first breed's data by default
    //}
  } catch (err) {
    console.error("Failed to load breeds:", err);
    alert("Unable to load breeds. Please try again later.");
  }
}

// Start Initial Load
initialLoad_axios();

/**
 * 2. Create an event handler for breedSelect that does the following:
 * - Retrieve information on the selected breed from the cat API using fetch().
 *  - Make sure your request is receiving multiple array items!
 *  - Check the API documentation if you're only getting a single object.
 * - For each object in the response array, create a new element for the carousel.
 *  - Append each of these new elements to the carousel.
 * - Use the other data you have been given to create an informational section within the infoDump element.
 *  - Be creative with how you create DOM elements and HTML.
 *  - Feel free to edit index.html and styles.css to suit your needs, but be careful!
 *  - Remember that functionality comes first, but user experience and design are important.
 * - Each new selection should clear, re-populate, and restart the Carousel.
 * - Add a call to this function to the end of your initialLoad function above to create the initial carousel.
 */
//-> ANSWER: Load breed funcionaliy for both fetch and axios functions have been implement in the same screen with two dropboxes

// LoadBreedImages when breed is selecting - using Fetch
async function loadBreedImages_fetch(breedId) {
  try {
    // Reset progress bar and clear previous content
    progressBar.style.width = "0%";
    Carousel.clear(); // Clear previous carousel items
    infoDump.innerHTML = ""; // Clear previous info section

    // Fetch images for the selected breed
    const res = await fetch(
      `https://api.thecatapi.com/v1/images/search?breed_id=${breedId}&limit=10`,
      {
        headers: {
          "x-api-key": API_KEY, // API Key for authentication
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch images");
    }

    const images = await res.json();

    if (images.length === 0) {
      alert("No images found for this breed.");
      return;
    }

    // Populate Carousel
    images.forEach((image) => {
      const carouselItem = Carousel.createCarouselItem(image.url, "Cat Image", image.id);
      Carousel.appendCarousel(carouselItem);
    });

    // Restart Carousel
    Carousel.start();

    // Populate Info Section
    const breedInfo = images[0].breeds[0]; // First image contains breed details
    const infoHTML = `
      <h3>${breedInfo.name}</h3>
      <p>${breedInfo.description}</p>
      <p><strong>Temperament:</strong> ${breedInfo.temperament}</p>
      <p><strong>Origin:</strong> ${breedInfo.origin}</p>
    `;
    infoDump.innerHTML = infoHTML;
  } catch (err) {
    console.error("Failed to load images:", err);
    alert("Unable to load images. Please try again later.");
  }
}

// Define the updateProgress function
function updateProgress(progressEvent) {
  console.log(progressEvent);

  if (progressEvent.lengthComputable) {
      const percentComplete = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      progressBar.style.width = percentComplete + "%";
  } else {
      console.log("Total size is not computable.");
      progressBar.style.width = "100%";
  }
}

// Event Handler for Breed Selection - using axios
async function loadBreedImages_axios(breedId) {
  try {
    //progressBar.style.width = "0%"; // Reset the progress bar
    Carousel.clear(); // Clear previous carousel
    infoDump.innerHTML = ""; // Clear previous info section

    const res = await axios.get('/images/search', {
      params: { breed_id: breedId, limit: 10 },
      onDownloadProgress: updateProgress // Pass updateProgress here
    });
    const images = res.data;

    if (images.length === 0) {
      alert("No images found for this breed.");
      return;
    }

    // Populate Carousel
    images.forEach((image) => {
      const carouselItem = Carousel.createCarouselItem(image.url, "Cat Image", image.id);
      Carousel.appendCarousel(carouselItem);
    });

    // Restart Carousel
    Carousel.start();

    // Populate Info Section
    const breedInfo = images[0].breeds[0]; // First image contains the breed info
    const infoHTML = `
      <h3>${breedInfo.name}</h3>
      <p>${breedInfo.description}</p>
      <p><strong>Temperament:</strong> ${breedInfo.temperament}</p>
      <p><strong>Origin:</strong> ${breedInfo.origin}</p>
    `;
    infoDump.innerHTML = infoHTML;
  } catch (err) {
    console.error("Failed to load images:", err);
    alert("Unable to load images. Please try again later.");
  }
}

// Event Listeners
breedSelect_fetch.addEventListener('change', (event) => {
  const selectedBreed = event.target.value;
  loadBreedImages_fetch(selectedBreed);
});

// Event Listeners
breedSelect_axios.addEventListener('change', (event) => {
  const selectedBreed = event.target.value;
  loadBreedImages_axios(selectedBreed);
});


/**
 * 3. Fork your own sandbox, creating a new one named "JavaScript Axios Lab."
 */
//-> ANSWER: both fetch and axios functions for loadimages have been implement in the same screen with two dropboxes

/**
 * 4. Change all of your fetch() functions to axios!
 * - axios has already been imported for you within index.js.
 * - If you've done everything correctly up to this point, this should be simple.
 * - If it is not simple, take a moment to re-evaluate your original code.
 * - Hint: Axios has the ability to set default headers. Use this to your advantage
 *   by setting a default header with your API key so that you do not have to
 *   send it manually with all of your requests! You can also set a default base URL!
 */
//-> ANSWER: both fetch and axios functions have been implement in the same screen with two dropboxes

/**
 * 5. Add axios interceptors to log the time between request and response to the console.
 * - Hint: you already have access to code that does this!
 * - Add a console.log statement to indicate when requests begin.
 * - As an added challenge, try to do this on your own without referencing the lesson material.
 */

axios.interceptors.request.use(request => {
  progressBar.style.width = "0%"; // Reset the progress bar
  //body.style.cursor = "progress";    // Set cursor to "progress" on request start
  if (document.body) { // Check if body exists before accessing its style
    document.body.style.cursor = "progress";
  }
  request.metadata = request.metadata || {};
  request.metadata.startTime = new Date().getTime();
  return request;
});

axios.interceptors.response.use(
  (response) => {
      response.config.metadata.endTime = new Date().getTime();
      response.config.metadata.durationInMS = response.config.metadata.endTime - response.config.metadata.startTime;

      console.log(`Msg From Interceptor: Success: Request took ${response.config.metadata.durationInMS} milliseconds.`)
      if (document.body) { // Check if body exists before accessing its style
        document.body.style.cursor = "default";
      }//body.style.cursor = "default"; // Remove progress cursor on error
      return response;
  },
  (error) => {
      error.config.metadata.endTime = new Date().getTime();
      error.config.metadata.durationInMS = error.config.metadata.endTime - error.config.metadata.startTime;

      console.log(`Msg From Interceptor: Error: Request took ${error.config.metadata.durationInMS} milliseconds.`)
      progressBar.style.width = "0%"; // Also reset on error
      if (document.body) { // Check if body exists before accessing its style
        document.body.style.cursor = "default";
      }      //body.style.cursor = "default"; // Remove progress cursor on error
      throw error;
});


/**
 * 6. Next, we'll create a progress bar to indicate the request is in progress.
 * - The progressBar element has already been created for you.
 *  - You need only to modify its "width" style property to align with the request progress.
 * - In your request interceptor, set the width of the progressBar element to 0%.
 *  - This is to reset the progress with each request.
 * - Research the axios onDownloadProgress config option.
 * - Create a function "updateProgress" that receives a ProgressEvent object.
 *  - Pass this function to the axios onDownloadProgress config option in your event handler.
 * - console.log your ProgressEvent object within updateProgess, and familiarize yourself with its structure.
 *  - Update the progress of the request using the properties you are given.
 * - Note that we are not downloading a lot of data, so onDownloadProgress will likely only fire
 *   once or twice per request to this API. This is still a concept worth familiarizing yourself
 *   with for future projects.
 */

// Answer: added the progress bar functionality in the above code.


/**
 * 7. As a final element of progress indication, add the following to your axios interceptors:
 * - In your request interceptor, set the body element's cursor style to "progress."
 * - In your response interceptor, remove the progress cursor style from the body element.
 */
/**/

// Answer: added the progress cursor style functionality in the above code.


  export async function favourite(imgId) {
    // your code here
    try {
      // 1. Check if the image is already favorited
      const existingFavorites = await axios.get('/favourites');
      const isFavorited = existingFavorites.data.some(fav => fav.image_id === imgId);
      let requestMethod;
      let requestUrl;
      let consoleMessage;

      if (isFavorited) {
          // 2. If already favorited, find the favorite ID and DELETE
          const favoriteToDelete = existingFavorites.data.find(fav => fav.image_id === imgId);
          if (favoriteToDelete) {
              requestMethod = 'delete';
              requestUrl = `/favourites/${favoriteToDelete.id}`;
              consoleMessage = "Unfavorited";
          } else {
              console.error("Favorite not found for deletion.");
              return; // Exit if the favorite isn't found
          }
      } else {
          // 3. If not favorited, POST to create a new favorite
          requestMethod = 'post';
          requestUrl = '/favourites';
          consoleMessage = "Favorited";
      }
      
      const response = await axios({
          method: requestMethod,
          url: requestUrl,
          data: isFavorited ? null : { image_id: imgId } // Send image_id only for POST
      });

      console.log(`Image ${imgId} ${consoleMessage} successfully:`, response.data);
  } catch (error) {
      console.error("Error favoriting/unfavoriting image:", error);
  }

  // Function to populate the carousel with images (REFACTORED)
  async function populateCarousel(images) {
    Carousel.clear(); // Clear previous carousel items

    if (images.length === 0) {
        alert("No images found.");
        return;
    }

    images.forEach((image) => {
        const carouselItem = Carousel.createCarouselItem(image.url, "Cat Image", image.id);
        Carousel.appendCarousel(carouselItem);
    });

    Carousel.start();
  }

  async function getFavourites() {
    try {
        progressBar.style.width = "0%";
        const response = await axios.get('/favourites');
        const favourites = response.data;

        if (favourites.length === 0) {
            alert("You have no favorites yet.");
            return;
        }
        const favouriteImages = favourites.map(favourite => ({url: favourite.image.url, id: favourite.image_id}))
        await populateCarousel(favouriteImages);
        progressBar.style.width = "100%";
    } catch (error) {
        console.error("Error getting favorites:", error);
        alert("Failed to retrieve favorites. Please try again later.");
        progressBar.style.width = "0%";
    }
  }

  // Event Listener for Get Favourites Button
  getFavouritesBtn.addEventListener('click', getFavourites);

  // Event Handler for Breed Selection - using axios (UPDATED to use populateCarousel)
  async function loadBreedImages_axios(breedId) {
    try {
        progressBar.style.width = "0%";
        const res = await axios.get('/images/search', {
            params: { breed_id: breedId, limit: 10 },
            onDownloadProgress: updateProgress
        });

        const images = res.data;
        await populateCarousel(images);

        const breedInfo = images[0].breeds[0];
        const infoHTML = `
            <h3>${breedInfo.name}</h3>
            <p>${breedInfo.description}</p>
            <p><strong>Temperament:</strong> ${breedInfo.temperament}</p>
            <p><strong>Origin:</strong> ${breedInfo.origin}</p>
        `;
        infoDump.innerHTML = infoHTML;
    } catch (err) {
        console.error("Failed to load images:", err);
        alert("Unable to load images. Please try again later.");
        progressBar.style.width = "0%";
    }
  }


}

// Answer: added the progress cursor style functionality in the above code.

/**
 * 8. To practice posting data, we'll create a system to "favourite" certain images.
 * - The skeleton of this function has already been created for you.
 * - This function is used within Carousel.js to add the event listener as items are created.
 *  - This is why we use the export keyword for this function.
 * - Post to the cat API's favourites endpoint with the given ID.
 * - The API documentation gives examples of this functionality using fetch(); use Axios!
 * - Add additional logic to this function such that if the image is already favourited,
 *   you delete that favourite using the API, giving this function "toggle" functionality.
 * - You can call this function by clicking on the heart at the top right of any image.
 */

// Answer: added favourites functionality to post to cat server.

/**
 * 
 * 9. Test your favourite() function by creating a getFavourites() function.
 * - Use Axios to get all of your favourites from the cat API.
 * - Clear the carousel and display your favourites when the button is clicked.
 *  - You will have to bind this event listener to getFavouritesBtn yourself.
 *  - Hint: you already have all of the logic built for building a carousel.
 *    If that isn't in its own function, maybe it should be so you don't have to
 *    repeat yourself in this section.
 */

// Answer: added favourites functionality.

/**
 * 10. Test your site, thoroughly!
 * - What happens when you try to load the Malayan breed?
 *  - If this is working, good job! If not, look for the reason why and fix it!
 * - Test other breeds as well. Not every breed has the same data available, so
 *   your code should account for this.
 */

// Answer: added favourites button functionalityr.


