// index.js

// Global variable to store the currently displayed ramen
let currentRamen = null;

// Helper: ensure that an element with the given id exists; if not, create it.
const ensureElement = (id, tag = "div") => {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement(tag);
    el.id = id;
    document.body.appendChild(el);
  }
  return el;
};

// Setup the required DOM structure if not already present.
const setupDOM = () => {
  // Container for all ramen images
  ensureElement("ramen-menu", "div");

  // Ramen detail section with expected children:
  let ramenDetail = document.getElementById("ramen-detail");
  if (!ramenDetail) {
    ramenDetail = document.createElement("div");
    ramenDetail.id = "ramen-detail";
    // Create child elements: an <img>, <h2>, <h3>, rating and comment displays.
    const detailImg = document.createElement("img");
    const detailName = document.createElement("h2");
    const detailRestaurant = document.createElement("h3");
    const ratingDisplay = document.createElement("div");
    ratingDisplay.id = "rating-display";
    const commentDisplay = document.createElement("div");
    commentDisplay.id = "comment-display";
    ramenDetail.append(detailImg, detailName, detailRestaurant, ratingDisplay, commentDisplay);
    document.body.appendChild(ramenDetail);
  }

  // New ramen form for adding ramen to the menu.
  let newRamenForm = document.getElementById("new-ramen");
  if (!newRamenForm) {
    newRamenForm = document.createElement("form");
    newRamenForm.id = "new-ramen";
    // Create required input fields.
    const inputName = document.createElement("input");
    inputName.name = "name";
    const inputRestaurant = document.createElement("input");
    inputRestaurant.name = "restaurant";
    const inputImage = document.createElement("input");
    inputImage.name = "image";
    const inputRating = document.createElement("input");
    inputRating.name = "rating";
    const textareaComment = document.createElement("textarea");
    textareaComment.name = "new-comment";
    // Create a submit button.
    const submitBtn = document.createElement("input");
    submitBtn.type = "submit";
    submitBtn.value = "Add Ramen";
    newRamenForm.append(inputName, inputRestaurant, inputImage, inputRating, textareaComment, submitBtn);
    document.body.appendChild(newRamenForm);
  }

  // Edit ramen form for updating rating and comment.
  let editForm = document.getElementById("edit-ramen");
  if (!editForm) {
    editForm = document.createElement("form");
    editForm.id = "edit-ramen";
    // Create label and input for rating.
    const labelRating = document.createElement("label");
    labelRating.textContent = "Rating: ";
    const inputEditRating = document.createElement("input");
    inputEditRating.name = "rating";
    inputEditRating.type = "number";
    inputEditRating.id = "new-rating";
    labelRating.appendChild(inputEditRating);
    // Create label and textarea for comment.
    const labelComment = document.createElement("label");
    labelComment.textContent = "Comment: ";
    const textareaEditComment = document.createElement("textarea");
    textareaEditComment.name = "new-comment";
    textareaEditComment.id = "new-comment";
    labelComment.appendChild(textareaEditComment);
    // Create submit button.
    const editSubmitBtn = document.createElement("input");
    editSubmitBtn.type = "submit";
    editSubmitBtn.value = "Update";
    editForm.append(labelRating, labelComment, editSubmitBtn);
    document.body.appendChild(editForm);
  }

  // Delete button to remove the current ramen.
  let deleteBtn = document.getElementById("delete-ramen");
  if (!deleteBtn) {
    deleteBtn = document.createElement("button");
    deleteBtn.id = "delete-ramen";
    deleteBtn.textContent = "Delete Ramen";
    // Append delete button to the ramen detail section.
    document.getElementById("ramen-detail").appendChild(deleteBtn);
  }
};

// Ensure the DOM elements exist before any listeners or fetches run.
setupDOM();

// Callback: When a ramen image is clicked, display its details.
const handleClick = (ramen) => {
  currentRamen = ramen;
  const ramenDetail = document.getElementById("ramen-detail");
  const detailImg = ramenDetail.querySelector("img");
  if (detailImg) detailImg.src = ramen.image;
  const detailName = ramenDetail.querySelector("h2");
  if (detailName) detailName.textContent = ramen.name;
  const detailRestaurant = ramenDetail.querySelector("h3");
  if (detailRestaurant) detailRestaurant.textContent = ramen.restaurant;
  const ratingDisplay = document.getElementById("rating-display");
  if (ratingDisplay) ratingDisplay.textContent = ramen.rating;
  const commentDisplay = document.getElementById("comment-display");
  if (commentDisplay) commentDisplay.textContent = ramen.comment;
};

// Add a listener to the new ramen form to create a new ramen image.
const addSubmitListener = () => {
  const form = document.getElementById("new-ramen");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const newRamen = {
      name: event.target["name"].value,
      restaurant: event.target["restaurant"].value,
      image: event.target["image"].value,
      rating: event.target["rating"].value,
      comment: event.target["new-comment"].value,
    };
    const ramenMenu = document.getElementById("ramen-menu");
    const img = document.createElement("img");
    img.src = newRamen.image;
    img.alt = newRamen.name;
    img.addEventListener("click", () => handleClick(newRamen));
    ramenMenu.appendChild(img);
    form.reset();
  });
};

// Fetch all ramens from the API, display them in the menu, and auto-display the first ramen.
const displayRamens = () => {
  const ramenMenu = document.getElementById("ramen-menu");
  fetch("http://localhost:3000/ramens")
    .then((response) => response.json())
    .then((ramens) => {
      ramens.forEach((ramen, index) => {
        const img = document.createElement("img");
        img.src = ramen.image;
        img.alt = ramen.name;
        img.addEventListener("click", () => handleClick(ramen));
        ramenMenu.appendChild(img);
        // Automatically display the first ramen's details.
        if (index === 0) {
          handleClick(ramen);
        }
      });
    });
};

// Listen for the edit form submission to update the displayed rating and comment.
const addEditFormListener = () => {
  const editForm = document.getElementById("edit-ramen");
  editForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const newRating = event.target["rating"].value;
    const newComment = event.target["new-comment"].value;
    const ratingDisplay = document.getElementById("rating-display");
    if (ratingDisplay) ratingDisplay.textContent = newRating;
    const commentDisplay = document.getElementById("comment-display");
    if (commentDisplay) commentDisplay.textContent = newComment;
    if (currentRamen) {
      currentRamen.rating = newRating;
      currentRamen.comment = newComment;
    }
    editForm.reset();
  });
};

// Add a listener to the delete button to remove the current ramen.
const addDeleteListener = () => {
  const deleteBtn = document.getElementById("delete-ramen");
  deleteBtn.addEventListener("click", () => {
    const ramenMenu = document.getElementById("ramen-menu");
    // Remove the image element corresponding to currentRamen by matching the alt attribute.
    if (currentRamen) {
      const imgToRemove = ramenMenu.querySelector(`img[alt="${currentRamen.name}"]`);
      if (imgToRemove) {
        imgToRemove.remove();
      }
    }
    // Clear the ramen detail display.
    const ramenDetail = document.getElementById("ramen-detail");
    const detailImg = ramenDetail.querySelector("img");
    if (detailImg) detailImg.src = "";
    const detailName = ramenDetail.querySelector("h2");
    if (detailName) detailName.textContent = "";
    const detailRestaurant = ramenDetail.querySelector("h3");
    if (detailRestaurant) detailRestaurant.textContent = "";
    const ratingDisplay = document.getElementById("rating-display");
    if (ratingDisplay) ratingDisplay.textContent = "";
    const commentDisplay = document.getElementById("comment-display");
    if (commentDisplay) commentDisplay.textContent = "";
    currentRamen = null;
  });
};

// Main function to start the app logic.
const main = () => {
  displayRamens();
  addSubmitListener();
  addEditFormListener();
  addDeleteListener();
};

main();

// Export functions for testing.
export {
  displayRamens,
  addSubmitListener,
  handleClick,
  main,
  addEditFormListener,
  addDeleteListener,
};
