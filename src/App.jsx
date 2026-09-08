import { useEffect, useMemo, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'todo-app-items'

function App() {
  const [todos, setTodos] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] } catch { return [] }
  })
  const [newTodo, setNewTodo] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(todos)) }, [todos])

  const visibleTodos = useMemo(() => filter === 'all' ? todos : todos.filter((todo) => filter === 'completed' ? todo.completed : !todo.completed), [filter, todos])
  const activeCount = todos.filter((todo) => !todo.completed).length

  function addTodo(event) {
    event.preventDefault()
    const text = newTodo.trim()
    if (!text) return
    setTodos((items) => [...items, { id: crypto.randomUUID(), text, completed: false }])
    setNewTodo('')
  }

  function toggleTodo(id) {
    setTodos((items) => items.map((todo) => todo.id === id ? { ...todo, completed: !todo.completed } : todo))
  }

  return (
    <main className="app-shell">
      <section className="todo-app" aria-labelledby="page-title">
        <header>
          <p>YOUR DAILY FOCUS</p>
          <h1 id="page-title">Today&apos;s list</h1>
          <span>Small steps make for meaningful days.</span>
        </header>
        <form onSubmit={addTodo}>
          <input value={newTodo} onChange={(event) => setNewTodo(event.target.value)} placeholder="What would you like to do?" aria-label="New task" maxLength="120" />
          <button aria-label="Add task">+</button>
        </form>
        <nav aria-label="Task filters">
          <span><b>{activeCount}</b> {activeCount === 1 ? 'task' : 'tasks'} left</span>
          {['all', 'active', 'completed'].map((name) => <button className={filter === name ? 'selected' : ''} onClick={() => setFilter(name)} type="button" key={name}>{name}</button>)}
        </nav>
        <ul aria-live="polite">
          {visibleTodos.length ? visibleTodos.map((todo) => <li className={todo.completed ? 'completed' : ''} key={todo.id}>
            <button className="check" onClick={() => toggleTodo(todo.id)} type="button" aria-label={`Mark ${todo.text} ${todo.completed ? 'incomplete' : 'complete'}`}>{todo.completed ? '✓' : ''}</button>
            <span>{todo.text}</span>
            <button className="delete" onClick={() => setTodos((items) => items.filter((item) => item.id !== todo.id))} type="button" aria-label={`Delete ${todo.text}`}>×</button>
          </li>) : <li className="empty">No tasks yet. Add your first focus item.</li>}
        </ul>
        <footer><button onClick={() => setTodos((items) => items.filter((todo) => !todo.completed))} type="button">Clear completed</button><span>Saved automatically</span></footer>
      </section>
    </main>
  )
}

export default App
