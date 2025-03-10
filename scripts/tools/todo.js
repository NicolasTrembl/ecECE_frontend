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
    search.addEventListener('input', setTodoItem);
    search.addEventListener('change', setTodoItem);
}

function addTodoItemButton(){
    return `
        <div class="add-btn">
            <i class="material-icons">add</i>
        </div>
    `
}

function setTodoItem() {
    const todoData = JSON.parse(localStorage.getItem('todoData')) || [
        {
            title: 'Faire les courses',
            description: 'Acheter du pain, du lait et des oeufs',
            date: '2021-10-01',
            category: 'Courses',
            isDone: false,
            isImportant: true
        },
        {
            title: 'Rendre le devoir',
            description: 'Rendre le devoir de mathématiques',
            date: '2021-10-02',
            category: 'Devoirs',
            isDone: false,
            isImportant: false
        },
        {
            title: 'Appeler le médecin',
            description: 'Prendre rendez-vous pour le vaccin',
            date: '2021-10-03',
            category: 'Santé',
            isDone: true,
            isImportant: true
        }
    ];

    const todoList = document.getElementById('todo-list');
    
    if (todoData.length === 0) {
        todoList.innerHTML = '<p class="no-todo">Aucune tâche à afficher</p>' + addTodoItemButton();
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
        return;
    }

    console.log(filter_i);

    todoList.innerHTML = filter_i.map(todo => {
        return `
        <frag-todo-item>
            <i slot="todo-item-check" class="material-icons">${todo.isDone ? 'check_box' : 'check_box_outline_blank'}</i>
            <p slot="icon-todo-item">${todo.category}</p>
            <p slot="todo-item">${todo.title}</p>
            <p slot="todo-date">${todo.date}</p>
            <i slot="icon-important-todo-item" class="material-icons">${todo.isImportant ? 'bookmarks' : 'bookmark_add' }</i>
            <i slot="icon-delete-todo-item" class="material-icons">delete</i>
        </frag-todo-item>
        `
    }).join('<div class="todo-item-separator"></div>') + addTodoItemButton();


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
            // categoryPicker.classList.add('hide-complete');
            return;
        }
        selector.innerHTML = "";
        const category = getCategories(JSON.parse(localStorage.getItem('todoData')) || [
            {
                title: 'Faire les courses',
                description: 'Acheter du pain, du lait et des oeufs',
                date: '2021-10-01',
                category: 'Courses',
                isDone: false,
                isImportant: true
            },
            {
                title: 'Rendre le devoir',
                description: 'Rendre le devoir de mathématiques',
                date: '2021-10-02',
                category: 'Devoirs',
                isDone: false,
                isImportant: false
            },
            {
                title: 'Appeler le médecin',
                description: 'Prendre rendez-vous pour le vaccin',
                date: '2021-10-03',
                category: 'Santé',
                isDone: true,
                isImportant: true
            }
        ]) || ['Courses', 'Devoirs', 'Santé', 'Travail', 'Loisirs'];
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
    });

}


function setAll() {
    addBtnSelected();
    setUpTopSection();
    setTodoItem();
    setSearch();
    setDatePicker();
    setCategoryPicker();
}





setTimeout(setAll, 10);