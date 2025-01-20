// app.js

// Function to fetch stock data from Ollama (simulated API)
async function fetchStockData(symbol) {
    const apiKey = "C:\Users\eynesam\.ollama\id_ed25519.pub"; // Replace with your Alpha Vantage API key
    const apiUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
    const apiUrl = `https://api.ollamafinance.com/stock/${symbol}`; // Replace with actual Ollama API endpoint
  
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch stock data");
      }
      const data = await response.json();
      return data;

    } catch (error) {
      console.error("Error fetching stock data:", error);
      return null;
    }
  }
  let stockChart; // Variable to store the chart instance

// Function to create or update the chart
function updateChart(stockData) {
  const ctx = document.getElementById("stock-chart").getContext("2d");

  // If a chart already exists, destroy it
  if (stockChart) {
    stockChart.destroy();
  }

  // Create a new chart
  stockChart = new Chart(ctx, {
    type: "line", // Line chart
    data: {
      labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"], // Simulated days
      datasets: [
        {
          label: `${stockData.symbol} Price`,
          data: [
            stockData.price - 4,
            stockData.price - 2,
            stockData.price,
            stockData.price + 2,
            stockData.price + 4,
          ], // Simulated price trend
          borderColor: "#6200ee",
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    },
  });
}
  
  // Function to display stock data
  function displayStockData(stock) {
    const stockDataSection = document.getElementById("stock-data");
    stockDataSection.innerHTML = `
      <h2>${stock.symbol}</h2>
      <p>Price: $${stock.price}</p>
      <p>Change: ${stock.change} (${stock.changePercent})</p>
      <button id="add-to-favorites">Add to Favorites</button>
    `;
  
    // Add event listener to the "Add to Favorites" button
    document.getElementById("add-to-favorites").addEventListener("click", () => {
      addToFavorites(stock.symbol);
    });
    updateChart(stock);

  }
  // Function to add a stock to favorites
function addToFavorites(symbol) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!favorites.includes(symbol)) {
      favorites.push(symbol);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      displayFavorites();
    }
  }
  // Function to display the list of favorites
function displayFavorites() {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const favoritesList = document.getElementById("favorites-list");
    favoritesList.innerHTML = favorites
      .map(
        (symbol) => `
        <li>
          ${symbol}
          <button onclick="removeFromFavorites('${symbol}')">Remove</button>
        </li>
      `
      )
      .join("");
  }
  
  // Function to remove a stock from favorites
  function removeFromFavorites(symbol) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites = favorites.filter((fav) => fav !== symbol);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    displayFavorites();
  }
  
  // Function to show a loading spinner
  function showLoadingSpinner() {
    const stockDataSection = document.getElementById("stock-data");
    stockDataSection.innerHTML = `<div class="spinner">Loading...</div>`;
  }
  
  // Function to show an error message
  function showError(message) {
    const stockDataSection = document.getElementById("stock-data");
    stockDataSection.innerHTML = `<p class="error">${message}</p>`;
  }
  
  // Event listener for the search button
  document.getElementById("search-button").addEventListener("click", async () => {
    const stockSymbol = document.getElementById("stock-search").value.trim().toUpperCase();
  
    if (stockSymbol) {
      showLoadingSpinner(); // Show loading spinner while fetching data
      const stockData = await fetchStockData(stockSymbol);
  
      if (stockData) {
        displayStockData(stockData);
      } else {
        showError("Stock data not found. Please check the symbol and try again.");
      }
    } else {
      showError("Please enter a stock symbol!");
    }
  });
  // Display favorites when the page loads
displayFavorites();