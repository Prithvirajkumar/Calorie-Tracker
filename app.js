// Storage Controller
const StorageCtrl = (function() {
    // public methods 
    return{
        storeItem: function(item) {
            let items;
            // check is any items in LS
            if(localStorage.getItem('items') === null){
                items = [];
                // push new item into array 
                items.push(item);
                // set LS
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                // get local storage data 
                items = JSON.parse(localStorage.getItem('items'));
                // push new item into the array 
                items.push(item);
                // reset local storage 
                localStorage.setItem('items', JSON.stringify(items));   
            }
        },
        getItemsFromStorage: function(){
            let items;
            if(localStorage.getItem('items') === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemStorage: function(updatedItem) {
            // pull from LS
            let items = JSON.parse(localStorage.getItem('items'));
            // loop through items 
            items.forEach(function(item, index) {
                if(updatedItem.id === item.id){
                    items.splice(index, 1, updatedItem);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));  
        },
        deleteItemFromStorage: function(id) {
             // pull from LS
             let items = JSON.parse(localStorage.getItem('items'));
             // loop through items 
             items.forEach(function(item, index) {
                 if(id === item.id){
                     items.splice(index, 1);
                 }
             });
             localStorage.setItem('items', JSON.stringify(items));             
        },
        clearItemsFromStorage: function() {
            localStorage.removeItem('items');
        }
    }
})();

// Item Controller 
const ItemCtrl = (function() {
    // Item Constructor 
    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data Structures / State
    const data = {
        //  items: [
        //     //  {
        //     //      id: 0,
        //     //      name: 'Steak Dinner',
        //     //      calories: 1200
        //     //  },
        //     //  {
        //     //      id: 1,
        //     //      name: 'Cookie',
        //     //      calories: 200
        //     //  },
        //     //  {
        //     //      id: 2,
        //     //      name: 'Bacon',
        //     //      calories: 900
        //     //  }
        //  ],
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

    // public methods
    return {
        getItems: function() {
            return data.items;
        },
        addItem: function(name, calories) {
            let ID;
            // create ids 
            if(data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }
            // Calories to number 
            calories = parseInt(calories);
            // create a new item
            newItem = new Item(ID, name, calories);
            // add it to the new item data structure
            data.items.push(newItem);

            return newItem;
        },
        getItemById: function(id) {
            let found = null;
            // loop through the items 
            data.items.forEach(function(item) {
                if(item.id === id) {
                    found = item;
                }
            });
            return found;
        },
        updateItem: function(name, calories) {
            // calories to number 
            calories = parseInt(calories);
            let found = null;
            // loop through iteams 
            data.items.forEach(function(item) {
                if(item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },
        deleteItem: function(id) {
            // get IDs 
            const ids = data.items.map(function(item) {
                return item.id;
            });
            // get index 
            const index = ids.indexOf(id);
            // remove item 
            data.items.splice(index, 1);
        },
        clearAllItems: function() {
            data.items = [];
        },
        setCurrentItem: function(item) {
            data.currentItem = item;
        },
        getCurrentItem: function() {
            return data.currentItem;
        },
        getTotalCalories: function() {
            let total = 0;
            // loop through items and add calories 
            data.items.forEach(function(item) {
                total += item.calories;
            });
            // set total calories in data structure 
            data.totalCalories = total;

            return data.totalCalories;
        },
        logData: function() {
            return data;
        }
    }

})();


// UI Controller 
const UICtrl = (function() {
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }

    // public methods
    return {
        // populate item lest function 
        populateItemList: function(items){
            let html = '';
            items.forEach(item => {
                html += `
                <li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
                </li> 
                `;
            });

            // insert list items in UI 
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function() {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item) {
            // show the line 
            document.querySelector(UISelectors.itemList).style.display = 'block';
            // create li element 
            const li = document.createElement('li');
            // add class 
            li.className = 'collection-item';
            // add id
            li.id = `item-${item.id}`;
            // add html 
            li.innerHTML = `
            <strong>${item.name}: </strong> <em>${item.calories} calories</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
            </a>
            `;
            // insert item 
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        updateListItem: function(item) {
            let listItems = document.querySelectorAll(UISelectors.listItems);
            // turn node list into an array to do for each 
            listItems = Array.from(listItems);
            // run for each 
            listItems.forEach(function(listItem) {
                const itemID = listItem.getAttribute('id');
                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = `
                    <strong>${item.name}: </strong> <em>${item.calories} calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>
                    `;
                }
            });
        },
        deleteListItem: function(id) {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        clearInput: function() {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addItemToForm: function() {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        removeItems: function() {
            let listItems = document.querySelectorAll(UISelectors.listItems);
            // turn node list to array
            listItems = Array.from(listItems);
            listItems.forEach(function(item) {
                item.remove();
            })
        },
        hideList: function() {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: function() {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: function() {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        getSelectors: function() {
            return UISelectors;
        }

    }
    
})();


// App Controller 
const App = (function(ItemCtrl, StorageCtrl, UICtrl) {
    // load event listeners 
    const loadEventListeners = function() {
        // get ui selectors 
        const UISelectors = UICtrl.getSelectors();
        // add item event 
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
        // disable submit on enter 
        document.addEventListener('keypress', function(e) {
            if(e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        });
        // edit event 
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);
        // update item event 
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
        // delete item event 
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);
        // Back button event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);
        // clear item event 
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
    }

    // add item submit 
    const itemAddSubmit = function(e) {
        // get form input from UI controller 
        const input = UICtrl.getItemInput();
        // check if the input is emput 
        if(input.name !== '' && input.calories !== '') {
            // add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            // add item to UI
            UICtrl.addListItem(newItem);
            // get the total calories 
            const totalCalories = ItemCtrl.getTotalCalories();
            // add total calories to the UI
            UICtrl.showTotalCalories(totalCalories);
            // store in local storage 
            StorageCtrl.storeItem(newItem);
            // clear input fields 
            UICtrl.clearInput();
        }
        e.preventDefault();
    }

    // edit click
    const itemEditClick = function(e) {
        if(e.target.classList.contains('edit-item')){
            // get the item id 
            const listID = e.target.parentNode.parentNode.id;
            console.log(listID);
            // break the listID into an array to get only the ID
            const listIDArr = listID.split('-');
            console.log(listIDArr);
            // get actual ID as int 
            const id = parseInt(listIDArr[1]);
            console.log(id);
            // get item to edit 
            const itemToEdit = ItemCtrl.getItemById(id);
            console.log(itemToEdit);
            // set current item
            ItemCtrl.setCurrentItem(itemToEdit);
            // add item to the UI
            UICtrl.addItemToForm();
        }
        e.preventDefault();
    }
    
    // item update submit
    const itemUpdateSubmit = function(e) {
        console.log('edit submit');
        // get item input 
        const input = UICtrl.getItemInput();
        // update item 
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
        // update UI
        UICtrl.updateListItem(updatedItem);
        // get the total calories 
        const totalCalories = ItemCtrl.getTotalCalories();
        // add total calories to the UI
        UICtrl.showTotalCalories(totalCalories);
        // update Local Storage 
        StorageCtrl.updateItemStorage(updatedItem);
        // clear the edit state 
        UICtrl.clearEditState();

        e.preventDefault();
    }

    // Delete button 
    const itemDeleteSubmit = function(e) {
        console.log('delete intialized');
        // get current item
        const currentItem = ItemCtrl.getCurrentItem();
        // delete from data structure 
        ItemCtrl.deleteItem(currentItem.id);
        // delete from UI
        UICtrl.deleteListItem(currentItem.id);
        // get total calories 
        const totalCalories = ItemCtrl.getTotalCalories();
        // add total calories to the UI
        UICtrl.showTotalCalories(totalCalories);
        // delete from LS
        StorageCtrl.deleteItemFromStorage(currentItem.id);
        // clear the edit state 
        UICtrl.clearEditState();

        e.preventDefault();
    }

    // clear all items 
    const clearAllItemsClick = function() {
        // Delete all items from data structure 
        ItemCtrl.clearAllItems();
        // get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // add total calories to the UI
        UICtrl.showTotalCalories(totalCalories);
        // clear the edit state 
        UICtrl.clearEditState();
        // remove from UI
        UICtrl.removeItems();
        // remove from LS
        StorageCtrl.clearItemsFromStorage();
        // hide ul
        UICtrl.hideList();
    }

    // Public methods
    return {
        init: function() {
            // set inital button state 
            UICtrl.clearEditState();
            console.log('Initializing App...');
            // fetch items from data structure
            const items = ItemCtrl.getItems();
            // check if any items exist 
            if(items.length === 0) {
                UICtrl.hideList();
            } else {
            // populate list with items 
            UICtrl.populateItemList(items);
            }
            // get the total calories 
            const totalCalories = ItemCtrl.getTotalCalories();
            // add total calories to the UI
            UICtrl.showTotalCalories(totalCalories);
            console.log(items);
            // load event listeners 
            loadEventListeners();
        }
    }
    
})(ItemCtrl, StorageCtrl, UICtrl);

// initialize app 
App.init();

