import { useState } from 'react'

export default function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Read a book', done: false },
    { id: 2, text: 'Go for a walk', done: true },
    { id: 3, text: 'Write some code', done: false },
  ])
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState('all')
  const [editingId, setEditingId] = useState(null)
  const [editingText, setEditingText] = useState('')

  const addTodo = () => {
    const text = input.trim()
    if (!text) return
    setTodos([...todos, { id: Date.now(), text, done: false }])
    setInput('')
  }

  const toggleTodo = (id) =>
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))

  const deleteTodo = (id) => {
    setTodos(todos.filter((t) => t.id !== id))

    if (editingId === id) {
      setEditingId(null)
      setEditingText('')
    }
  }

  const startEditing = (todo) => {
    setEditingId(todo.id)
    setEditingText(todo.text)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditingText('')
  }

  const saveTodo = (id) => {
    const text = editingText.trim()

    if (!text) {
      deleteTodo(id)
      return
    }

    setTodos(todos.map((t) => (t.id === id ? { ...t, text } : t)))
    setEditingId(null)
    setEditingText('')
  }

  const visible = todos.filter((t) =>
    filter === 'active' ? !t.done : filter === 'completed' ? t.done : true,
  )

  const remaining = todos.filter((t) => !t.done).length

  const tabClass = (name) =>
    `px-3 py-1 rounded-md text-sm font-medium transition ${
      filter === name
        ? 'bg-indigo-600 text-white'
        : 'text-slate-600 hover:bg-slate-200'
    }`

  return (
    <div className="min-h-screen bg-slate-100 flex items-start justify-center py-16 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Todo List</h1>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
            placeholder="What needs doing?"
            className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={addTodo}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition"
          >
            Add
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <button onClick={() => setFilter('all')} className={tabClass('all')}>
            All
          </button>
          <button onClick={() => setFilter('active')} className={tabClass('active')}>
            Active
          </button>
          <button onClick={() => setFilter('completed')} className={tabClass('completed')}>
            Completed
          </button>
        </div>

        <ul className="space-y-2">
          {visible.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-3 px-3 py-2 rounded-md border border-slate-200 hover:bg-slate-50"
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`h-5 w-5 shrink-0 rounded-full border flex items-center justify-center text-xs transition ${
                  todo.done
                    ? 'border-indigo-600 bg-indigo-600 text-white'
                    : 'border-slate-300 text-transparent hover:border-indigo-400'
                }`}
                aria-label={todo.done ? 'Mark todo as active' : 'Mark todo as completed'}
              >
                x
              </button>

              {editingId === todo.id ? (
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onBlur={() => saveTodo(todo.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      saveTodo(todo.id)
                    }

                    if (e.key === 'Escape') {
                      cancelEditing()
                    }
                  }}
                  autoFocus
                  className="flex-1 px-2 py-1 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Edit todo"
                />
              ) : (
                <button
                  onDoubleClick={() => startEditing(todo)}
                  className={`flex-1 text-left ${
                    todo.done ? 'line-through text-slate-400' : 'text-slate-800'
                  }`}
                >
                  {todo.text}
                </button>
              )}

              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-slate-400 hover:text-red-500 text-lg font-bold px-2"
                aria-label="Delete todo"
              >
                &times;
              </button>
            </li>
          ))}
          {visible.length === 0 && (
            <li className="text-center text-slate-400 py-4 text-sm">
              Nothing here.
            </li>
          )}
        </ul>

        <div className="mt-4 text-sm text-slate-500">
          {remaining} {remaining === 1 ? 'item' : 'items'} left
        </div>
      </div>
    </div>
  )
}
