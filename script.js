document.addEventListener("DOMContentLoaded", function () {
  // Local storage keys
  const STORAGE_KEY = "budget_entries";
  const descriptionInput = document.getElementById("description");
  const amountInput = document.getElementById("amount");
  const addEntryButton = document.getElementById("add-entry");
  const resetButton = document.getElementById("reset-fields");
  const entriesList = document.getElementById("entries");
  const filterAll = document.getElementById("filter-all");
  const filterIncome = document.getElementById("filter-income");
  const filterExpense = document.getElementById("filter-expense");

  let entries = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  // Add new entry
  addEntryButton.addEventListener("click", function () {
    const description = descriptionInput.value;
    const amount = parseFloat(amountInput.value);
    const type = document.querySelector('input[name="type"]:checked').value;

    if (!description || isNaN(amount) || amount <= 0) {
      alert("Please fill out all fields correctly.");
      return;
    }

    const entry = {
      id: Date.now(),
      description,
      amount,
      type,
    };

    entries.push(entry);
    saveToLocalStorage();
    renderEntries();
    clearInputs();
  });

  // Reset form fields
  resetButton.addEventListener("click", clearInputs);

  // Render entries
  function renderEntries() {
    entriesList.innerHTML = "";
    const filter = document.querySelector('input[name="filter"]:checked').value;
    const filteredEntries = entries.filter((entry) => {
      if (filter === "all") return true;
      return entry.type === filter;
    });

    filteredEntries.forEach((entry) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${entry.description}: $${entry.amount.toFixed(2)}</span>
        <div class="edit-delete-btns">
          <button onclick="editEntry(${entry.id})">Edit</button>
          <button onclick="deleteEntry(${entry.id})">Delete</button>
        </div>
      `;
      entriesList.appendChild(li);
    });

    updateSummary();
  }

  // Save to localStorage
  function saveToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }

  // Update totals and balance
  function updateSummary() {
    const totalIncome = entries
      .filter((entry) => entry.type === "income")
      .reduce((acc, entry) => acc + entry.amount, 0);
    const totalExpenses = entries
      .filter((entry) => entry.type === "expense")
      .reduce((acc, entry) => acc + entry.amount, 0);
    const netBalance = totalIncome - totalExpenses;

    document.getElementById(
      "total-income"
    ).textContent = `$${totalIncome.toFixed(2)}`;
    document.getElementById(
      "total-expenses"
    ).textContent = `$${totalExpenses.toFixed(2)}`;
    document.getElementById("net-balance").textContent = `$${netBalance.toFixed(
      2
    )}`;
  }

  // Clear form inputs
  function clearInputs() {
    descriptionInput.value = "";
    amountInput.value = "";
  }

  // Edit entry
  window.editEntry = function (id) {
    const entry = entries.find((entry) => entry.id === id);
    descriptionInput.value = entry.description;
    amountInput.value = entry.amount;
    document.querySelector(
      `input[name="type"][value="${entry.type}"]`
    ).checked = true;

    deleteEntry(id); // Remove entry after editing
  };

  // Delete entry
  window.deleteEntry = function (id) {
    entries = entries.filter((entry) => entry.id !== id);
    saveToLocalStorage();
    renderEntries();
  };

  // Filter entries
  filterAll.addEventListener("change", renderEntries);
  filterIncome.addEventListener("change", renderEntries);
  filterExpense.addEventListener("change", renderEntries);

  // Initial render
  renderEntries();
});
