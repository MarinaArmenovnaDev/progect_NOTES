
const noteColors = {
  blue: '#7de1f3',
  green: '#c2f37d',
  red: '#f37d7d',
  yellow: '#f3db7d',
  purple: '#e77df3',
};

const model = {
  notes: [],

  addNote(title, content, color) {
      const note = { id: Math.random(), title, content, color: noteColors[color], isFavorite: false };
      this.notes.unshift(note);
      this.updateNotesView();
  },

  updateNotesView() {
      const notesToRender = this.isShowOnlyFavorite ? this.notes.filter(note => note.isFavorite) : this.notes;
      view.renderNotes(notesToRender);
      view.renderNotesCount(notesToRender.length);
  },

  isShowOnlyFavorite: false,

  toggleShowOnlyFavorite(isShowOnlyFavorite) {
      this.isShowOnlyFavorite = isShowOnlyFavorite;
      this.updateNotesView();
  }
};

const view = {
  init() {
      this.noteForm = document.querySelector('.note-form'); // form
      this.noteTitleInput = document.getElementById('note-title'); // input title notes
      this.noteDescriptionInput = document.getElementById('note-description'); // description of notes
      this.addNoteBtn = document.getElementById('add-note-btn'); // add button
      this.notesList = document.getElementById('notes-list'); // куда будут отрисовываться задачи
      this.noteCount = document.getElementById('note-count'); // span количество задач
      this.messagesBox = document.getElementById('messages-box');
      this.textMessage = document.querySelector('.text-message'); // информационные сообщения js

      this.noteForm.addEventListener('submit', (event) => {
          event.preventDefault();
          const title = this.noteTitleInput.value;
          const content = this.noteDescriptionInput.value;
          const color = document.querySelector('input[name="color"]:checked').value;

          controller.addNote(title, content, color);
      });

      // обработчики событий на радиокнопки
      const colorRadios = document.querySelectorAll('input[name="color"]');
      colorRadios.forEach(radio => {
        radio.addEventListener('change', () => {
          const selectedColor = document.querySelector('input[name="color"]:checked').value;
          this.updateNoteTitleColor(selectedColor);
        });
      });

      //обработчик событий для фильтра
      const filterRow = document.getElementById('filter-row');
      const filterIcon = document.getElementById('filter-icon');
      filterRow.addEventListener('click', () => {
          model.toggleShowOnlyFavorite(!model.isShowOnlyFavorite);
          filterIcon.src = model.isShowOnlyFavorite ? './assets/checkbox active.png' : './assets/checkbox inactive.png';
      });

      this.renderNotes(model.notes);
  },

  renderNotes(notes) {
    this.notesList.innerHTML = ''; 

      if (notes.length === 0) {
          this.notesList.innerHTML = '<p>У вас нет еще ни одной заметки <br> Заполните поля выше и создайте свою первую заметку!</p>';
          document.getElementById('filter-row').style.display = 'none'; // Скрываем строку фильтрации
      } else {
          document.getElementById('filter-row').style.display = 'flex'; // Показываем строку фильтрации
          notes.forEach(note => {
            const li = document.createElement('li');
            li.classList.add('note-item');
            const h3 = document.createElement('h3');
            h3.textContent = note.title;
            h3.style.backgroundColor = note.color;
            const p = document.createElement('p');
            p.textContent = note.content;
            li.appendChild(h3);
            li.appendChild(p);
            this.notesList.appendChild(li);

            // Добавляем кнопки "избранное" и "удалить"
            const buttons = document.createElement('div');
            buttons.classList.add('buttons');

            //фукнция для кнопки избранное
            const favoriteButton = document.createElement('button');
            const heart = document.createElement('img');
            heart.src = note.isFavorite ? './assets/heart active.png' : './assets/heart inactive.png';
            heart.classList.add('heart');
            favoriteButton.appendChild(heart);

            favoriteButton.addEventListener('click', () => {
              note.isFavorite = !note.isFavorite;
              model.updateNotesView();
            });

            //функция для кнопки удалить заметку
            const deleteButton = document.createElement('img');
            deleteButton.src = './assets/trash.png';

            deleteButton.addEventListener('click', () => {
              model.notes = model.notes.filter(n => n.id !== note.id);
              model.updateNotesView();
            });

            buttons.appendChild(favoriteButton);
            buttons.appendChild(deleteButton);
            h3.appendChild(buttons);
          });
      }
  },

  renderNotesCount(count) {
      this.noteCount.textContent = count;
  },

  showMessage(imgSrc, message, color) {
    // Скрываем предыдущее сообщение, если оно есть
    this.messagesBox.style.display = 'none';
    this.messagesBox.innerHTML = ''; // Очищаем сообщения
    
    const img = document.createElement('img');
    img.src = imgSrc;
    img.style.color = color;
    img.style.marginRight = '10px';
    this.messagesBox.appendChild(img);
    
    const text = document.createElement('span');
    text.textContent = message;
    text.style.backgroundColor = color;
    text.style.color = '#fff';
    text.style.font = '500 14px / 1.71429';
    this.messagesBox.appendChild(text);
    this.messagesBox.style.backgroundColor = color;

    // Позиционируем сообщение в правом нижнем углу экрана
    this.messagesBox.style.position = 'fixed';
    this.messagesBox.style.right = '64px';
    this.messagesBox.style.bottom = '20px';
    this.messagesBox.style.zIndex = '1000'; 

    // Показываем сообщение
    this.messagesBox.style.display = 'block';

    // Скрываем сообщение через 3 секунды
    setTimeout(() => {
      this.messagesBox.style.display = 'none';
    }, 3000);
  },

  updateNoteTitleColor(color, noteTitleElement) {
    // Проверяем существует ли элемент
    if (noteTitleElement) {
      // Применяем выбранный цвет к фону заголовка
      noteTitleElement.style.backgroundColor = color;
    }
  },

  clearForm() {
    this.noteTitleInput.value = '';
    this.noteDescriptionInput.value = '';
  },

};

const controller = {
addNote(title, content, color) {
    // проверка полей
    if (!title || !content) {
        view.showMessage('./assets/warning.png', 'Заполните все поля', '#1174dd');
        return;
    }
    // проверка длины заголовка
    if (title.length > 50) {
      view.showMessage('./assets/warning.png', 'Максимальная длина заголовка - 50 символов', '#f23d5b');
      return;
  }

    // вызываем метод модели
    model.addNote(title, content, color);
    view.showMessage('./assets/Done.png', 'Заметка добавлена', '#47b27d');
    view.clearForm(); // Очищаем поля формы после добавления заметки
},
};

function init() {
view.init();
}

init();


