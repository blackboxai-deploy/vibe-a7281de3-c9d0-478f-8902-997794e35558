'use client'

import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: Date
}

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [inputValue, setInputValue] = useState('')

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos).map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt)
        }))
        setTodos(parsedTodos)
      } catch (error) {
        console.error('Error loading todos from localStorage:', error)
      }
    }
  }, [])

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (inputValue.trim() !== '') {
      const newTodo: Todo = {
        id: uuidv4(),
        text: inputValue.trim(),
        completed: false,
        createdAt: new Date()
      }
      setTodos([newTodo, ...todos])
      setInputValue('')
    }
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

  const completedCount = todos.filter(todo => todo.completed).length
  const activeCount = todos.length - completedCount

  return (
    <div className="container">
      <header className="header">
        <h1>Todo List</h1>
        <p>Keep track of your tasks</p>
      </header>

      <div className="add-todo">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new todo..."
          autoFocus
        />
        <button onClick={addTodo} disabled={!inputValue.trim()}>
          Add Todo
        </button>
      </div>

      {todos.length === 0 ? (
        <div className="empty-state">
          <p>No todos yet. Add one above to get started!</p>
        </div>
      ) : (
        <>
          <ul className="todo-list">
            {todos.map((todo) => (
              <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />
                <span className="todo-text">{todo.text}</span>
                <button
                  className="delete-button"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>

          <div className="stats">
            <div className="stat">
              <span className="stat-number">{todos.length}</span>
              <div className="stat-label">Total</div>
            </div>
            <div className="stat">
              <span className="stat-number">{activeCount}</span>
              <div className="stat-label">Active</div>
            </div>
            <div className="stat">
              <span className="stat-number">{completedCount}</span>
              <div className="stat-label">Completed</div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}