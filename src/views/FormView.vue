<template>
    <div class="container mt-5">
      <h1>Portfolio Builder</h1>
      <form @submit.prevent="addStock">
        <div class="form-group">
          <label for="stock">Select Stock:</label>
          <select v-model="newStock" class="form-control" required>
            <option v-for="stock in availableStocks" :key="stock" :value="stock">
              {{ stock }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="percentage">Percentage of Portfolio:</label>
          <input type="number" v-model="newPercentage" class="form-control" min="1" max="100" required />
        </div>
        <button type="submit" class="btn btn-primary mt-3">Add Stock</button>
      </form>
      <div v-if="portfolio.length > 0" class="mt-5">
        <h2>Your Portfolio</h2>
        <ul class="list-group">
          <li v-for="(stock, index) in portfolio" :key="index" class="list-group-item">
            {{ stock.name }}: {{ stock.percentage }}%
            <button @click="removeStock(index)" class="btn btn-danger btn-sm float-right">Remove</button>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        availableStocks: ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'], // Example stocks
        newStock: '',
        newPercentage: '',
        portfolio: [],
      };
    },
    methods: {
      addStock() {
        if (this.newStock && this.newPercentage) {
          // Check if the stock is already in the portfolio
          if (this.portfolio.some(stock => stock.name === this.newStock)) {
            alert('Stock already in portfolio.');
          } else {
            this.portfolio.push({
              name: this.newStock,
              percentage: this.newPercentage,
            });
            // Reset input fields
            this.newStock = '';
            this.newPercentage = '';
          }
        }
      },
      removeStock(index) {
        this.portfolio.splice(index, 1);
      },
    },
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 600px;
    margin: auto;
  }
  </style>