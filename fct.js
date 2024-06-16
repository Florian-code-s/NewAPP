// 1. APPLICATION STATE
const state = {
    todos: [],
    filterWord: "",
    nextId: 1
};

const storedData = localStorage.getItem("todos");
if (storedData) {
    state.todos = JSON.parse(storedData);
}

// 2. STATE ACCESSORS/MUTATORS FN'S
function getFilteredTodos() {
    const filterWord = state.filterWord.toLowerCase();
    const filteredTodos = [];
    for (const todo of state.todos) {
        const text = todo.text.toLowerCase();
        const startMatch = text.indexOf(filterWord);
        if (startMatch !== -1) {
            const endMatch = startMatch + filterWord.length;
            filteredTodos.push({ ...todo, startMatch, endMatch });
        }
    }
    return filteredTodos;
}

function setFilterWord(filterWord) {
    state.filterWord = filterWord;
}

function addTodo(text) {
    console.log('Next ID before adding:', state.nextId);
    state.todos.push({ id: state.nextId, text: text, completed: false });
    state.nextId++;
    console.log('Next ID after adding:', state.nextId);
    saveTodos();
}


function removeTodo(id) {
    const index = state.todos.findIndex(todo => todo.id === id);
    if (index !== -1) {
        state.todos.splice(index, 1);
        // Nach dem Entfernen eines Elements die nächste ID neu berechnen
        state.nextId = Math.max(...state.todos.map(todo => todo.id), 0) + 1;
        saveTodos();
    }
}


function toggleTodoCompleted(id) {
    const todo = state.todos.find(todo => todo.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos(); // Speichern der To-Do-Liste nach Aktualisieren eines Elements
    }
}

// Funktion zum Speichern der To-Do-Liste im Local Storage
function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(state.todos));
}

// 3. DOM Node Refs
const todoAdd$ = document.querySelector("#todo-btn");
const todoInput$ = document.querySelector("#input-first");
const todoList$ = document.querySelector("#todo-list");
const todoFilter$ = document.querySelector("#filter-input");

// 4. DOM Node Creation Fn's
function createTodoItem(todo) {
    const { id, text, completed, startMatch, endMatch } = todo;
    const highlightedText = highlightMatch(text, startMatch, endMatch);
    return `
    <li class="${completed ? 'completed' : ''}" data-id="${id}">
      ${highlightedText}
      ${createTodoCheckBox(id, completed)}
      <span class="remove-button" onclick="onRemoveTodo(${id})">x</span>
    </li>
  `;
}



function highlightMatch(text, startMatch, endMatch) {
    const beforeMatch = text.slice(0, startMatch);
    const matchText = text.slice(startMatch, endMatch);
    const afterMatch = text.slice(endMatch);
    return `${beforeMatch}<mark>${matchText}</mark>${afterMatch}`;
}

function createTodoCheckBox(id, completed) {
    return `
    <input type="checkbox" ${completed ? 'checked' : ''}
      onclick="onToggleTodoCompleted(${id})">
  `;
}

function createTodoRemoveButton(id) {
    return `
    <button onclick="onRemoveTodo(${id})">
      Remove
    </button>
  `;
}

// 5. RENDER FN
function render() {
    todoList$.innerHTML = getFilteredTodos().map(createTodoItem).join('');
}

// 6. EVENT HANDLERS
function onAddTodo() {
    const text = todoInput$.value;
    if (text.trim() !== '') {
        todoInput$.value = '';
        addTodo(text);
        render();
        console.log('state', state);
    }
}

function onRemoveTodo(id) {
    removeTodo(id);
    render();
    console.log('state', state);
}

function onToggleTodoCompleted(id) {
    toggleTodoCompleted(id);
    render();
    console.log('state', state);
}

function onFilterTodos() {
    setFilterWord(todoFilter$.value);
    render();
    console.log('state', state);
}

// 7. INIT BINDINGS
todoAdd$.addEventListener('click', onAddTodo);
todoInput$.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        onAddTodo();
    }
});
todoFilter$.addEventListener('keyup', onFilterTodos);

// 8. INITIAL RENDER
render();
console.log('state', state);
