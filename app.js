import { createLayer, createState, createForm } from './node_modules/breeze-web-framework/breeze.js';
import { createElementAndAppend } from './node_modules/breeze-web-framework/helpers.js';

const layer1 = createLayer('layer1', 10);
const formHolder = createLayer('formHolder', 20);
const list = createLayer('container', 30);

createElementAndAppend(layer1.element, 'h1', {}, 'Library');
createElementAndAppend(formHolder.element, 'br', {}, '');

const libraryState = createState({ books: [] });

const newBookForm = createForm('newBookForm', formHolder);
newBookForm.addInput('title', 'Title');
newBookForm.addInput('author', 'Author');
newBookForm.addInput('pages', 'Number of Pages');
newBookForm.addInput('description', 'Description');
newBookForm.addSubmit('submit', 'Submit');

class Book {
    constructor(title, author, pages, description) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.description = description;
        this.info = function() {
            return `${title} by ${author} is ${pages} pages long and is about: ${description}.`;
        };
    }
}

function addBookToLibrary(book) {
    const books = libraryState.getState().books;
    books.push(book);
    libraryState.setState({ books });
}

function displayBooks() {
    const container = list.element;
    container.innerHTML = '';
    const books = libraryState.getState().books;
    books.forEach((book) => {
        const content = createElementAndAppend(container, 'table', { classListAdd: 'content' }, book.info());
        content.style.width = `calc(100% / ${books.length})`;
    });
}

libraryState.addListener(displayBooks);

document.addEventListener('DOMContentLoaded', () => {
    newBookForm.element.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const formData = newBookForm.getDataOnSubmit();

        if (formData && formData.length >= 4) {
            const newBook = new Book(formData[0].value, formData[1].value, formData[2].value, formData[3].value);
            addBookToLibrary(newBook);
            newBookForm.element.reset();
        }
    });
});