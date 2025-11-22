let wordsData = {};
let draggedElement = null;
let sourceContainer = null;
let offsetX = 0;
let offsetY = 0;

const inputText = document.getElementById('inputText');
const parseBtn = document.getElementById('parseBtn');
const wordContainer = document.getElementById('wordContainer');
const dropZone1 = document.getElementById('dropZone1');
const displayWord = document.getElementById('displayWord');

parseBtn.addEventListener('click', parseWords);

document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
        if (document.activeElement !== inputText) {
            e.preventDefault();
            parseWords();
        }
    }
});

function parseWords() {
    const text = inputText.value.trim();
    if (!text) return;

    wordContainer.innerHTML = '';
    dropZone1.innerHTML = '';
    displayWord.textContent = '';
    wordsData = {};

    const words = text.split('-').map(w => w.trim()).filter(w => w);

    const lowercase = [];
    const uppercase = [];
    const numbers = [];

    words.forEach(word => {
        if (/^\d+$/.test(word)) {
            numbers.push(word);
        } else if (word[0] === word[0].toLowerCase()) {
            lowercase.push(word);
        } else {
            uppercase.push(word);
        }
    });

    lowercase.sort((a, b) => a.localeCompare(b, 'ru'));
    uppercase.sort((a, b) => a.localeCompare(b, 'ru'));
    numbers.sort((a, b) => parseInt(a) - parseInt(b));

    let index = 1;
    lowercase.forEach(word => {
        const key = `a${index}`;
        wordsData[key] = { word, originalColor: '#90EE90', index: Object.keys(wordsData).length };
        index++;
    });

    index = 1;
    uppercase.forEach(word => {
        const key = `b${index}`;
        wordsData[key] = { word, originalColor: '#90EE90', index: Object.keys(wordsData).length };
        index++;
    });

    index = 1;
    numbers.forEach(word => {
        const key = `n${index}`;
        wordsData[key] = { word, originalColor: '#90EE90', index: Object.keys(wordsData).length };
        index++;
    });

    createWordElements();
}

function createWordElements() {
    Object.keys(wordsData).forEach(key => {
        const element = createWordElement(key, wordsData[key].word, wordsData[key].originalColor);
        wordContainer.appendChild(element);
    });
}

function createWordElement(key, word, color) {
    const div = document.createElement('div');
    div.className = 'word-element';
    div.textContent = `${key} ${word}`;
    div.draggable = true;
    div.dataset.key = key;
    div.dataset.word = word;
    div.style.backgroundColor = color;

    div.addEventListener('dragstart', handleDragStart);
    div.addEventListener('dragend', handleDragEnd);
    div.addEventListener('click', handleClick);

    div.addEventListener('dragover', handleDragOverElement);
    div.addEventListener('drop', handleDropOnElement);

    return div;
}

function handleDragStart(e) {
    draggedElement = e.target;
    sourceContainer = e.target.parentElement;

    if (sourceContainer === dropZone1) {
        const rect = e.target.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
    } else {
        offsetX = e.offsetX;
        offsetY = e.offsetY;
    }

    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    document.querySelectorAll('.drop-indicator').forEach(el => el.classList.remove('drop-indicator'));
}

function handleClick(e) {
    if (e.target.classList.contains('in-block1')) {
        const word = e.target.dataset.word;
        displayWord.textContent = word;
    }
}

function handleDragOverElement(e) {
    if (e.target.classList.contains('word-element') &&
        e.target !== draggedElement) {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'move';
    }
}

function handleDropOnElement(e) {
    e.preventDefault();
    e.stopPropagation();

    const targetElement = e.target;

    if (targetElement.classList.contains('word-element') &&
        targetElement !== draggedElement &&
        draggedElement &&
        targetElement.classList.contains('in-block1')) {

        const zoneRect = dropZone1.getBoundingClientRect();
        let x = e.clientX - zoneRect.left - offsetX;
        let y = e.clientY - zoneRect.top - offsetY;

        x = Math.max(0, Math.min(x, dropZone1.offsetWidth - 100));
        y = Math.max(0, Math.min(y, dropZone1.offsetHeight - 40));

        if (sourceContainer !== dropZone1) {
            draggedElement.style.background = getRandomColor();
            draggedElement.classList.add('in-block1');
            dropZone1.appendChild(draggedElement);
        }

        draggedElement.style.left = x + 'px';
        draggedElement.style.top = y + 'px';
    }
}

[dropZone1, wordContainer].forEach(zone => {
    zone.addEventListener('dragover', handleDragOver);
    zone.addEventListener('drop', handleDrop);
    zone.addEventListener('dragleave', handleDragLeave);
});

function handleDragOver(e) {
    if (e.target === dropZone1 || e.target === wordContainer) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        e.currentTarget.classList.add('drag-over');
    }
}

function handleDragLeave(e) {
    if (e.currentTarget === e.target) {
        e.currentTarget.classList.remove('drag-over');
    }
}

function handleDrop(e) {
    if (e.target !== dropZone1 && e.target !== wordContainer) {
        return;
    }

    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');

    if (!draggedElement) return;

    const targetZone = e.currentTarget;
    const key = draggedElement.dataset.key;

    if (targetZone === dropZone1) {
        if (sourceContainer !== dropZone1) {
            draggedElement.style.background = getRandomColor();
            draggedElement.classList.add('in-block1');
            dropZone1.appendChild(draggedElement);
        }

        const rect = dropZone1.getBoundingClientRect();
        let x = e.clientX - rect.left - offsetX;
        let y = e.clientY - rect.top - offsetY;

        x = Math.max(0, Math.min(x, dropZone1.offsetWidth - draggedElement.offsetWidth));
        y = Math.max(0, Math.min(y, dropZone1.offsetHeight - draggedElement.offsetHeight));

        draggedElement.style.left = x + 'px';
        draggedElement.style.top = y + 'px';
    }
    else if (targetZone === wordContainer) {
        draggedElement.style.background = 'linear-gradient(135deg, #48c774 0%, #3ec46d 100%)';
        draggedElement.classList.remove('in-block1');

        draggedElement.style.position = '';
        draggedElement.style.left = '';
        draggedElement.style.top = '';

        if (displayWord.textContent === draggedElement.dataset.word) {
            displayWord.textContent = '';
        }

        insertInSortedOrder(draggedElement, key);
    }

    draggedElement = null;
    sourceContainer = null;
}

function insertInSortedOrder(element, key) {
    const targetIndex = wordsData[key].index;
    const children = Array.from(wordContainer.children);

    let inserted = false;
    for (let child of children) {
        const childKey = child.dataset.key;
        const childIndex = wordsData[childKey].index;

        if (targetIndex < childIndex) {
            wordContainer.insertBefore(element, child);
            inserted = true;
            break;
        }
    }

    if (!inserted) {
        wordContainer.appendChild(element);
    }
}

function getRandomColor() {
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
        '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
        '#F8B88B', '#FAD7A0', '#A9CCE3', '#D7BDE2',
        '#F9E79F', '#82E0AA', '#F5B7B1', '#AED6F1',
        '#E74C3C', '#3498DB', '#9B59B6', '#1ABC9C',
        '#F39C12', '#E91E63', '#00BCD4', '#FF5722'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}
