var dateRangeSelected = null;
var categoriesSelected = null;

function addBtnSelected() {
    const btns = document.getElementsByClassName('todo-btn');

    for (let i = 0; i < btns.length; i++) {

        btns[i].addEventListener('click', function() {
            if (this.classList.contains('btn-selected')) {
                this.classList.remove('btn-selected');
                if (this.classList.contains('radio')) {
                    const rad = document.getElementsByClassName('radio');
                    const radS = Array.from(rad).filter(r => r !== this)[0];
                    radS.classList.add('btn-selected');
                }
            }
            else {
                this.classList.add('btn-selected');
                if (this.classList.contains('radio')) {
                    const rad = document.getElementsByClassName('radio');
                    const radS = Array.from(rad).filter(r => r !== this)[0];
                    radS.classList.remove('btn-selected');
                }
            }
            if (!this.classList.contains('radio')) {
                setTodoItem();
                populateKanban();
            }
        });
    }
}

function setUpTopSection() {
    const toggleButton = document.getElementById("toggle-menu");
    const topOptions = document.querySelector(".top-options");

    let isHidden = true;

    toggleButton.addEventListener("click", () => {
        if (!isHidden) {
            // Masquer avec animation
            topOptions.classList.add("hidden");
            setTimeout(() => {
                topOptions.classList.add("hide-complete"); // Supprime de l'affichage après animation
            }, 300);
            toggleButton.textContent = "Afficher";
        } else {
            // Afficher avec animation
            topOptions.classList.remove("hide-complete");
            setTimeout(() => {
                topOptions.classList.remove("hidden");
            }, 10);
            toggleButton.textContent = "Masquer";
        }
        isHidden = !isHidden;
    });
}

function setSearch() {
    const search = document.getElementById('search');
    const update = () => {
        populateKanban();
        setTodoItem();
    }
    search.addEventListener('input', update);
    search.addEventListener('change', update);
}

function addTodoItemButton(){
    return `
        <div class="add-btn">
            <i class="material-icons">add</i>
        </div>
    `
}

function setTodoItem() {
    const todoData = JSON.parse(localStorage.getItem('todoData')) || [];

    const todoList = document.getElementById('todo-list');
    
    if (todoData.length === 0) {
        todoList.innerHTML = '<p class="no-todo">Aucune tâche à afficher</p>' + addTodoItemButton();
        setAddButton();

        return;
    }
    
    const search = document.getElementById('search');
    const value = search.value.toLowerCase();
    const filter_s = todoData.filter(todo => todo.title.toLowerCase().includes(value));

    const isDone = document.getElementById('isDoneBtn').classList.contains('btn-selected');
    const filter_d = filter_s.filter(todo => todo.isDone === isDone);

    const isImportant = document.getElementById('isImportantBtn').classList.contains('btn-selected');
    var filter_i = isImportant ? filter_d.filter(todo => todo.isImportant === isImportant) : filter_d;

    if (dateRangeSelected) {
        const filter_date = filter_i.filter(todo => {
            const date = new Date(todo.date);
            return date >= dateRangeSelected[0] && date <= dateRangeSelected[1];
        });
        filter_i = filter_date;
    }

    if (categoriesSelected) {
        const filter_cat = filter_i.filter(todo => categoriesSelected.includes(todo.category));
        filter_i = filter_cat;
    }

    if (filter_i.length === 0) {
        todoList.innerHTML = '<p class="no-todo">Aucune tâche ne corresponds</p>' + addTodoItemButton();
        setAddButton();
        return;
    }


    todoList.innerHTML = filter_i.map(todo => {
        return `
        <frag-todo-item class="todoItem" id="${todo.id}">
            <i class="isDoneTodo material-icons" id="isDone${todo.id}" slot="todo-item-check">${todo.isDone ? 'check_box' : 'check_box_outline_blank'}</i>
            <p slot="icon-todo-item">${todo.category}</p>
            <p slot="todo-item">${todo.title}</p>
            <p slot="todo-date">${todo.date}</p>
            <i class="isImportantTodo material-icons" id="isImportant${todo.id}" slot="icon-important-todo-item">${todo.isImportant ? 'bookmarks' : 'bookmark_add' }</i>
            <i class="deleteTodo material-icons" id="deleteTodo${todo.id}" slot="icon-delete-todo-item">delete</i>
        </frag-todo-item>
        `
    }).join('<div class="todo-item-separator"></div>') + addTodoItemButton();


    setAddButton();

    
    filter_i.forEach(element => {
        const isDone = document.getElementById(`isDone${element.id}`);
        isDone.addEventListener('click', (e) => {
            var id = e.originalTarget.id.split("isDone")[1];
            var el = todoData.filter((e2) => e2.id == id)[0];
            el.isDone = !el.isDone;
            localStorage.setItem('todoData', JSON.stringify(todoData));
            setTodoItem();
            populateKanban();
        });
    });

    
    
    filter_i.forEach(element => {
        const isImportant = document.getElementById(`isImportant${element.id}`);
        isImportant.addEventListener('click', (e) => {
            var id = e.originalTarget.id.split("isImportant")[1];
            var el = todoData.filter((e2) => e2.id == id)[0];
            el.isImportant = !el.isImportant;
            localStorage.setItem('todoData', JSON.stringify(todoData));
            setTodoItem();
            populateKanban();

        });
    });

       
    filter_i.forEach(element => {
        const deleteTodo = document.getElementById(`deleteTodo${element.id}`);
        deleteTodo.addEventListener('click', (e) => {
            var id = e.originalTarget.id.split("deleteTodo")[1];
            var el = todoData.filter((e2) => e2.id == id)[0];
            todoData.splice(todoData.indexOf(el), 1)
            localStorage.setItem('todoData', JSON.stringify(todoData));
            setTodoItem();
            populateKanban();

        });
    });

}

function setDatePicker() {
    const datePicker = document.getElementById('dateRangePicker');
    const minDate = document.getElementById("dateStart");
    const maxDate = document.getElementById("dateEnd");
    const datePickerShowBtn = document.getElementById('dateRangeBtn');
    const datePickerConfirmBtn = document.getElementById('dateRangeConfirmBtn');

    datePickerShowBtn.addEventListener('click', () => {
        if (dateRangeSelected != null && dateRangeSelected.length === 2) {
            dateRangeSelected = null;
            setTodoItem();
            populateKanban();

            datePicker.classList.add('hide-complete');
            return;
        }
        datePicker.classList.remove('hide-complete');
    });

    datePickerConfirmBtn.addEventListener('click', () => {
        if (!minDate.value || !maxDate.value) {
            return;
        }
        datePicker.classList.add('hide-complete');
        dateRangeSelected = [
            new Date(minDate.value),
            new Date(maxDate.value)
        ];

        setTodoItem();
        populateKanban();

    });


}

function getCategories(todoData) {
    if (!todoData) return null;
    var out = [];
    todoData.forEach(todo => {
        if (!out.includes(todo.category)) {
            out.push(todo.category);
        }
    });

    return out;
}

function setCategoryPicker() {
    const categoryPicker = document.getElementById('categoryPicker');
    const selector = document.getElementById('categorySelect');
    const categoryPickerShowBtn = document.getElementById('categoryBtn');
    const categoryPickerConfirmBtn = document.getElementById('categoryConfirmBtn');



    categoryPickerShowBtn.addEventListener('click', () => {
        if (categoriesSelected != null && categoriesSelected.length > 0) {
            categoriesSelected = null;
            setTodoItem();
            populateKanban();
            // categoryPicker.classList.add('hide-complete');
            return;
        }
        selector.innerHTML = "";
        const category = getCategories(JSON.parse(localStorage.getItem('todoData'))) || [] ;
        selector.innerHTML = category.map(cat => `<option value="${cat}">${cat}</option>`).join('');
        categoryPicker.classList.remove('hide-complete');
    });

    categoryPickerConfirmBtn.addEventListener('click', () => {
        var options = selector.options;
        var selectedValue = [];
        for (var i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedValue.push(options[i].value);
            }
        }
        console.log(selectedValue);
        categoriesSelected = selectedValue.length > 0 ? selectedValue : null;
        categoryPicker.classList.add('hide-complete');
        setTodoItem();
        populateKanban();

    });


}

function setAddButton(){
    const addButton = document.querySelector('.add-btn');
    addButton.addEventListener('click', () => {
        
        const addTodoPanel = document.getElementById('addTodoItem');
        addTodoPanel.classList.remove('hide-complete');
    });

}

function setAddScreen() {
    const confirm = document.getElementById("addTodoItemBtn");
    const title = document.getElementById("todoTitle");
    const description = document.getElementById("todoDescription");
    const date = document.getElementById("todoDate");
    const category = document.getElementById("todoCategory");
    const important = document.getElementById("todoImportant");
    
    confirm.addEventListener('click', () => {
        const todoData = JSON.parse(localStorage.getItem('todoData')) || [];
        todoData.push({
            id: todoData.length,
            title: title.value,
            description: description.value,
            date: date.value,
            category: category.value,
            isDone: false,
            isImportant: important.classList.contains('btn-selected')
        });
        localStorage.setItem('todoData', JSON.stringify(todoData));
        setTodoItem();
        populateKanban();
        title.value = "";
        description.value = "";
        date.value = "";
        category.value = "";
        important.classList.remove('btn-selected');
        const addTodoPanel = document.getElementById('addTodoItem');
        addTodoPanel.classList.add('hide-complete');
    });
}

function setModeSelect() {
    const kbn = document.getElementsByClassName("todo-list-kanban")[0];
    const lst = document.getElementsByClassName("todo-list-list")[0];

    const listModeBtn = document.getElementById("listModeBtn");
    const kanbanModeBtn = document.getElementById("kanbanModeBtn");

    listModeBtn.addEventListener('click', () => {
        kbn.style = "display: none;";
        lst.style = "display: block;";
    });

    
    kanbanModeBtn.addEventListener('click', () => {
        lst.style = "display: none;";
        kbn.style = "display: flex;";
    });

}

function populateKanban() {
    const todoData = JSON.parse(localStorage.getItem('todoData')) || [];
    const kanban = document.getElementById('todo-kanban');

    const search = document.getElementById('search');
    const value = search.value.toLowerCase();
    const filter_s = todoData.filter(todo => todo.title.toLowerCase().includes(value));

    const isDone = document.getElementById('isDoneBtn').classList.contains('btn-selected');
    const filter_d = filter_s.filter(todo => todo.isDone === isDone);

    const isImportant = document.getElementById('isImportantBtn').classList.contains('btn-selected');
    var filter_i = isImportant ? filter_d.filter(todo => todo.isImportant === isImportant) : filter_d;

    if (dateRangeSelected) {
        const filter_date = filter_i.filter(todo => {
            const date = new Date(todo.date);
            return date >= dateRangeSelected[0] && date <= dateRangeSelected[1];
        });
        filter_i = filter_date;
    }

    if (categoriesSelected) {
        const filter_cat = filter_i.filter(todo => categoriesSelected.includes(todo.category));
        filter_i = filter_cat;
    }


    if (filter_i.length === 0) {
        kanban.innerHTML = '<p class="no-todo">Aucune tâche à afficher</p>';
        return;
    }

    const categories = getCategories(filter_i);
    const todoByCategory = categories.map(cat => {
        return {
            category: cat,
            todos: filter_i.filter(todo => todo.category === cat)
        }
    });

    let n = 0;
    kanban.innerHTML = todoByCategory.map(cat => {
        return `
        <div class="todo-list-kanban-column" id="todo-list-kanban-column-${n++}">
            <h2>${cat.category}</h2>
            ${cat.todos.map(todo => {
                return `
                <div id="kCard${todo.id}" class="kanban-card" draggable="true">
                    <p>${todo.title}</p>
                </div>
                `
            }).join('')}
        </div>
        `
    }).join('');
}

function setKanbanDragnDrop(){
    function allowDrop(ev) {
        ev.preventDefault();
    }
    
    function drag(ev) {
        ev.dataTransfer.setData("text", ev.target.id);
    }
    
    function drop(ev) {
        // prevent card from being dropped on another card
        if (!ev.target.classList.contains('todo-list-kanban-column')) {
            return;
        }
        ev.preventDefault();
        var data = ev.dataTransfer.getData("text");
        ev.target.appendChild(document.getElementById(data));
        console.log(data);
        const todoData = JSON.parse(localStorage.getItem('todoData')) || [];
        const id = data.split("kCard")[1];
        const todo = todoData.filter(todo => todo.id == id)[0];
        const category = ev.target.querySelector('h2').textContent;
        todo.category = category;
        console.log(todo);
        console.log(category);
        localStorage.setItem('todoData', JSON.stringify(todoData));
        setTodoItem();
    }

    const kanban = document.getElementById('todo-kanban');
    const columns = kanban.getElementsByClassName('todo-list-kanban-column');
    for (let i = 0; i < columns.length; i++) {
        columns[i].addEventListener('drop', drop);
        columns[i].addEventListener('dragover', allowDrop);
    }

    const cards = kanban.getElementsByClassName('kanban-card');
    for (let i = 0; i < cards.length; i++) {
        cards[i].addEventListener('dragstart', drag);
    }
}


function setAll() {
    addBtnSelected();
    setModeSelect();
    setUpTopSection();
    setTodoItem();
    setSearch();
    setDatePicker();
    setCategoryPicker();
    setAddScreen();
    populateKanban();
    setKanbanDragnDrop();
}





setTimeout(setAll, 10);