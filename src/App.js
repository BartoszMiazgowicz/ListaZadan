// Importowanie potrzebnych modułów z Reacta
import React, { useState, useEffect } from 'react';

// Importowanie funkcji generującej unikalne identyfikatory
import { v4 as uuidv4 } from 'uuid';

// Importowanie stylów z pliku App.css
import './App.css';

// Utworzenie przykładowej daty
const sampleDate = new Date('2024-02-07T16:06:06.454Z');
console.log(typeof sampleDate);
console.log(sampleDate.toISOString());

// Funkcja formatująca datę
const formatDate = (date) => {
  if (date instanceof Date && !isNaN(date)) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Intl.DateTimeFormat('pl-PL', options).format(date);
  } else if (date) {
    return 'Invalid Date';
  } else {
    return 'Brak daty';
  }
};

// Komponent główny - TaskApp
const TaskApp = () => {
  // Stan przechowujący listę zadań
  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
  });

  // Stany dla nowego zadania, statusu filtra, kryterium sortowania, priorytetu oraz edytowanego zadania
  const [newTask, setNewTask] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortCriterion, setSortCriterion] = useState('date');
  const [priority, setPriority] = useState('normal');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTaskTitle, setEditedTaskTitle] = useState('');
  const [editedTaskPriority, setEditedTaskPriority] = useState('normal');

  // Efekt useEffect dla zapisywania zadań w localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Funkcja dodająca nowe zadanie
  const addTask = () => {
    if (newTask.trim() !== '') {
      setTasks([
        ...tasks,
        { id: uuidv4(), title: newTask, completed: false, createdAt: new Date(), priority },
      ]);
      setNewTask('');
    }
  };

  // Funkcja rozpoczynająca edycję zadania
  const startEditingTask = (taskId, taskTitle, taskPriority) => {
    setEditingTaskId(taskId);
    setEditedTaskTitle(taskTitle);
    setEditedTaskPriority(taskPriority);
  };

  // Funkcja zapisująca edytowane zadanie
  const saveEditedTask = () => {
    const updatedTasks = tasks.map((task) =>
      task.id === editingTaskId
        ? { ...task, title: editedTaskTitle, priority: editedTaskPriority }
        : task
    );
    setTasks(updatedTasks);
    setEditingTaskId(null);
    setEditedTaskTitle('');
    setEditedTaskPriority('normal');
  };

  // Funkcja anulująca edycję zadania
  const cancelEditingTask = () => {
    setEditingTaskId(null);
    setEditedTaskTitle('');
    setEditedTaskPriority('normal');
  };

  // Funkcja usuwająca zadanie
  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    cancelEditingTask();
  };

  // Funkcja zmieniająca status zadania (ukończone/nieukończone)
  const toggleTaskStatus = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  // Funkcja zwracająca posortowane i przefiltrowane zadania
  const filteredAndSortedTasks = () => {
    const filtered = filterTasks();
    const sorted = [...filtered];

    sorted.sort((a, b) => {
      switch (sortCriterion) {
        case 'date':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'priority':
          const priorityOrder = { high: 0, normal: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'name':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return sorted;
  };

  // Funkcja przefiltrowująca zadania zgodnie z wybranym statusem
  const filterTasks = () => {
    switch (filterStatus) {
      case 'completed':
        return tasks.filter((task) => task.completed);
      case 'uncompleted':
        return tasks.filter((task) => !task.completed);
      default:
        return tasks;
    }
  };

  // Renderowanie komponentu
  return (
    <div>
      <h1>Lista Zadań</h1>
      <input
        type="text"
        placeholder="Dodaj nowe zadanie"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
      />
      <div>
        <label>Wybierz priorytet: </label>
        <select onChange={(e) => setPriority(e.target.value)} value={priority}>
          <option value="high">High</option>
          <option value="normal">Normal</option>
          <option value="low">Low</option>
        </select>
      </div>
      <button onClick={addTask}>Dodaj</button>

      <div>
        <label>Filtruj zadania: </label>
        <select onChange={(e) => setFilterStatus(e.target.value)} value={filterStatus}>
          <option value="all">Wszystkie</option>
          <option value="completed">Ukończone</option>
          <option value="uncompleted">Nieukończone</option>
        </select>
      </div>

      <div>
        <label>Sortuj zadania: </label>
        <select onChange={(e) => setSortCriterion(e.target.value)} value={sortCriterion}>
          <option value="date">Data</option>
          <option value="priority">Priorytet</option>
          <option value="name">Nazwa</option>
        </select>
      </div>
      <h4>Jesli chcesz zedytowac zadanie kliknij podwójnie na nazwe zadania.</h4>
      <ul>
        {filteredAndSortedTasks().map((task) => (
          <li key={task.id}>
            {editingTaskId === task.id ? (
              <>
                <input
                  type="text"
                  value={editedTaskTitle}
                  onChange={(e) => setEditedTaskTitle(e.target.value)}
                />
                <select
                  onChange={(e) => setEditedTaskPriority(e.target.value)}
                  value={editedTaskPriority}
                >
                  <option value="high">High</option>
                  <option value="normal">Normal</option>
                  <option value="low">Low</option>
                </select>
                <button onClick={saveEditedTask}>Zapisz</button>
                <button onClick={cancelEditingTask}>Anuluj</button>
              </>
            ) : (
              <>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskStatus(task.id)}
                />
                <span
                style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
                onClick={() => startEditingTask(task.id, task.title, task.priority)}
                dangerouslySetInnerHTML={{ __html: task.title }}>
                </span>
                <span style={{ marginLeft: '10px', color: '#888' }}>
                  Dodano: {formatDate(task.createdAt)}
                </span>
                <span style={{ marginLeft: '10px', color: '#888' }}>
                  Priorytet: {task.priority}
                </span>
                <button onClick={() => deleteTask(task.id)}>Usuń</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Eksportowanie komponentu TaskApp
export default TaskApp;
