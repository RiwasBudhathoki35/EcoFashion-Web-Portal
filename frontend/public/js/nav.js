document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Loaded");

  // Get elements
  const login = document.getElementById("login");
  const logout = document.getElementById("logout");
  const addOutlet = document.getElementById("add_outlet");
  const cart = document.getElementById("cart");
  const ecoScore = document.getElementById("ecoScore");

  // Check if elements exist before changing styles
  if (!login || !logout || !addOutlet || !cart || !ecoScore) {
    console.error("One or more elements not found!");
    return;
  }

  fetch("/session-status")
    .then((response) => response.json())
    .then((data) => {
      console.log("Session Data:", data); // Debugging

      if (data.loggedIn) {
        login.style.display = "none";
        logout.style.display = "block";
        ecoScore.style.display = "block";
      } else {
        login.style.display = "block";
        logout.style.display = "none";
        ecoScore.style.display = "none";
      }

      // Role-based display
      if (data.role === "customers") {
        cart.style.display = "block";
        addOutlet.style.display = "none";
      } else if (data.role === "suppliers") {
        // Fixed typo: suppliers → supplier
        cart.style.display = "none";
        addOutlet.style.display = "block";
      } else {
        cart.style.display = "none";
        addOutlet.style.display = "none";
      }
    })
    .catch((error) => console.error("Fetch error:", error));
});
