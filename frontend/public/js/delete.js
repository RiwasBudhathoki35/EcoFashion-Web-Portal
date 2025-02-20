const trashcans = document.querySelectorAll("a.delete");

// Loop over each 'delete' link and add an event listener
trashcans.forEach((trashcan) => {
  trashcan.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent default anchor click behavior
    console.log("Deleting order with ID:", trashcan.dataset.doc);
    const endpoint = `/users/${trashcan.dataset.endpoint}/${trashcan.dataset.doc}`;

    fetch(endpoint, {
      method: "DELETE", // Use DELETE method for delete requests
    })
      .then((response) => response.json()) // Parse JSON response
      .then((data) => {
        const flashMessageBox = document.getElementById("flash-message-box");
        if (data.message) {
          flashMessageBox.innerText = data.message;
          flashMessageBox.style.display = "block";
        }
        setTimeout(() => {
          window.location.href = data.redirect; // redirect after successful delete after displaying the flash
        }, 1000);
      })
      .catch((err) => console.log(err));
  });
});
