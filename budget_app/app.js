// BUDGET CONTROLLER
var budgetController = (function() {

  var Expense = function(id, description, val) {
    this.id = id;
    this.description = description;
    this.val = val;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.val / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
  };

  var Income = function(id, description, val) {
    this.id = id;
    this.description = description;
    this.val = val;
  };

  var calculateTotal = function(type) {
    var sum = 0;

    data.allItems[type].forEach(function(curr) {
      sum += curr.val;
    });

    data.totals[type] = sum;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };

  return {
    addItem: function(type, description, value) {
      var item, ID;

      // Create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Create new item based on 'inc' or 'exp' type
      if (type === 'inc') {
        item = new Income(ID, description, value);
      } else if (type === 'exp') {
        item = new Expense(ID, description, value);
      }

      // Push it into our data structure
      data.allItems[type].push(item);

      // Return the new element
      return item;
    },
    calculateBudget: function() {

      // calculate total income and expenses
      calculateTotal('inc');
      calculateTotal('exp');

    	// calculate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;

    	// calculate the percentage of income that we spent
      if (data.totals.inc > 0) {
        data.percentage = (data.totals.exp / data.totals.inc) * 100;
      } else {
        data.percentage = -1;
      }

    },
    getBudget: function() {
      return {
        totals: data.totals,
        budget: data.budget,
        percentage: data.percentage
      };
    },
    deleteItem: function(type, ID) {

      var idsArray, index;

      idsArray = data.allItems[type].map(function(curr) {
        return curr.id;
      });

      index = idsArray.indexOf(ID);

      if (index !== -1) {
          data.allItems[type].splice(index, 1);
      }

    },
    calculatePercentages: function() {
      data.allItems.exp.forEach(function(curr) {
        curr.calcPercentage(data.totals.inc);
      });
    },
    getPercentages: function() {
      var percentagesList;

      percentagesList = data.allItems.exp.map(function(curr) {
        return curr.getPercentage();
      });

      return percentagesList;
    },
    testing: function() {
      console.log(data);
    }
  }

})();


// UI CONTROLLER
var UIController = (function() {

  var DOMStrings = {
    type: '.add__type',
    description: '.add__description',
    val: '.add__value',
    button: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    itemPercentageLabel: '.item__percentage',
    month: '.budget__title--month'
  }

  var formatNumber = function(num, type) {
    var intNum, decNum, sign;

    num = Math.abs(num);
    num = num.toFixed(2);
    num = num.split('.');

    intNum = num[0];
    decNum = num[1];

    if (intNum.length > 3) {
      intNum = intNum.substr(0, intNum.length - 3) + ',' + intNum.substr(intNum.length - 3, 3);
    };

    if (type === 'inc') {
      sign = '+';
    } else if (type === 'exp') {
      sign = '-';
    } else {
      sign = '';
    }

    return sign + intNum + '.' + decNum;
  };

  var nodeListForEach = function(list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    };
  };

  return {
    getDOMStrings: function() {
      return DOMStrings;
    },
    getInputValues: function() {
      return {
        type: document.querySelector(DOMStrings.type).value, // inc or exp
        description: document.querySelector(DOMStrings.description).value,
        val: parseFloat(document.querySelector(DOMStrings.val).value),
      };
    },
    addListItem: function(obj, type) {

      var html, newHtml, element;

      // Create HTML string with placeholder text
      if (type === 'inc') {

        element = DOMStrings.incomeContainer;

        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%val%</div><div class="item__delete"><button class="item__delete--btn">x</button></div></div></div>';

      } else if (type === 'exp') {

        element = DOMStrings.expensesContainer;

        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%val%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn">x</button></div></div></div>';

      }

      // Replace the placeholder text with some actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%val%', formatNumber(obj.val, type));

      // Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

    },
    deleteListItem: function(ID) {

      var el = document.getElementById(ID);

      el.parentNode.removeChild(el);

    },
    clearFields: function() {

      var fields, fieldsArr;

      fields = document.querySelectorAll(DOMStrings.description + ', ' + DOMStrings.val);

      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function(curr) {
        curr.value = '';
      });

      fieldsArr[0].focus();

    },
    displayBudget: function(obj) {

      var type;

      if (obj.budget > 0) {
        type = 'inc';
      } else if (obj.budget < 0) {
        type = 'exp';
      }

      document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totals.inc, 'inc');
      document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totals.exp, 'exp');

      if (obj.percentage > 0) {
        document.querySelector(DOMStrings.percentageLabel).textContent = Math.round(obj.percentage) + '%';
      } else {
        document.querySelector(DOMStrings.percentageLabel).textContent = '---';
      }

    },
    displayPercentages: function(percentages) {

      var fields;

      fields = document.querySelectorAll(DOMStrings.itemPercentageLabel);

      nodeListForEach(fields, function(curr, index) {
        if (percentages[index] > 0) {
          curr.textContent = percentages[index] + '%';
        } else {
          curr.textContent = '---';
        }
      });

    },
    displayDate: function() {

      var currentDate, months, month, year;

      currentDate = new Date();

      months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

      month = currentDate.getMonth();
      month = months[month];

      year = currentDate.getFullYear();

      document.querySelector(DOMStrings.month).textContent = month + ' ' + year;

    },
    changeType: function() {

      var fields;

      fields = document.querySelectorAll(DOMStrings.type + ', ' + DOMStrings.description + ', ' + DOMStrings.val);

      nodeListForEach(fields, function(curr) {
        curr.classList.toggle('red-focus');
      });

      document.querySelector(DOMStrings.button).classList.toggle('red');

    }
  }

})();


// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

  function setupEventListeners() {

    var DOMStrings;

    DOMStrings = UICtrl.getDOMStrings();

    document.querySelector(DOMStrings.button).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event) {

      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }

    });

    document.querySelector('.container').addEventListener('click', ctrlDeleteItem);

    document.querySelector(DOMStrings.type).addEventListener('change', UICtrl.changeType);

  }


  var ctrlAddItem = function() {

    var inputValues, newItem;

    // 1. Get the field input data
    inputValues = UICtrl.getInputValues();

    if (inputValues.description !== '' && !isNaN(inputValues.val) && inputValues.val > 0) {
      // 2. Add the item to the budget controller
      newItem = budgetCtrl.addItem(inputValues.type, inputValues.description, inputValues.val);

      // 3. Add the item to the UI
      UICtrl.addListItem(newItem, inputValues.type);

      // 4. Clear the fields
      UICtrl.clearFields();

      // 5. Calculate the budget
      updateBudget();

      // 6. Calculate and update percentages
      updatePercentages();
    }

  };

  var ctrlDeleteItem = function(event) {

    var ID, splitID, type, itemID;

    ID = event.target.parentNode.parentNode.parentNode.id;

    if (ID) {

      splitID = ID.split('-');

      type = splitID[0];

      itemID = parseInt(splitID[1]);

      // 1. Delete the item from the data structure
      budgetCtrl.deleteItem(type, itemID);

      // 2. Update the UI
      UICtrl.deleteListItem(ID);

      // 3. Update and show the new budget
      updateBudget();

      // 4. Calculate and update percentages
      updatePercentages();
    }

  };

  function updateBudget() {

    var budget;

    // 1. Calculate the budget
    budgetCtrl.calculateBudget();

    // 2. Return the budget
    budget = budgetCtrl.getBudget();

    // 3. Display the budget on the UI
    UICtrl.displayBudget(budget);

  };

  function updatePercentages() {
    var percentages;

    // 1. Calculate percentages
    budgetCtrl.calculatePercentages();

    // 2. Read percentages from the budget controller
    percentages = budgetCtrl.getPercentages();

    // 3. Update UI with the new percentages
    UICtrl.displayPercentages(percentages);

  };

  return {
    init: function() {

      UICtrl.displayDate();

      UICtrl.displayBudget({
        totals: {
          exp: 0,
          inc: 0
        },
        budget: 0,
        percentage: -1
      });

      setupEventListeners();
    }
  };

})(budgetController, UIController);


controller.init();
