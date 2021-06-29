import React, { useEffect, useState } from 'react'
import TodoItem from './components/TodoItem'
import AddTodo from './components/AddTodo'
import { getTodos, getFilteredTodos, addTodo, updateTodo, deleteTodo } from './API'

const App: React.FC = () => {
  const [todos, setTodos] = useState<ITodo[]>([])
  const [status, setStatus] = useState(false);

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = (): void => {
    getTodos()
    .then(({ data: { todos } }: ITodo[] | any) => setTodos(todos))
    .catch((err: Error) => console.log(err))
  }

  const fetchFilteredTodos = (status: boolean): void => {
    getFilteredTodos(status)
    .then(({ data: { todos } }: ITodo[] | any) => setTodos(todos))
    .catch((err: Error) => console.log(err))
  }

 const handleSaveTodo = (e: React.FormEvent, formData: ITodo): void => {
   e.preventDefault()
   addTodo(formData)
   .then(({ status, data }) => {
    if (status !== 201) {
      throw new Error('Error! Todo not saved')
    }
    setTodos(data.todos)
  })
  .catch((err) => console.log(err))
}

  const handleUpdateTodo = (todo: ITodo): void => {
    updateTodo(todo)
    .then(({ status, data }) => {
        if (status !== 200) {
          throw new Error('Error! Todo not updated')
        }
        setTodos(data.todos)
      })
      .catch((err) => console.log(err))
  }

  const handleDeleteTodo = (_id: string): void => {
    deleteTodo(_id)
    .then(({ status, data }) => {
        if (status !== 200) {
          throw new Error('Error! Todo not deleted')
        }
        setTodos(data.todos)
      })
      .catch((err) => console.log(err))
  }

  const handleStatusChange = (): void => {
    const newStatus = !status
    setStatus(newStatus)
    fetchFilteredTodos(newStatus)
  }

  return (
    <main className='App'>
      <h1>Todo List</h1>
      <AddTodo saveTodo={handleSaveTodo} />
      <div>
        <input type="checkbox" defaultChecked={status} onChange={handleStatusChange}/>
        <label>  Completed</label>
      </div>
    
      {todos.map((todo: ITodo) => (
        <TodoItem
          key={todo._id}
          updateTodo={handleUpdateTodo}
          deleteTodo={handleDeleteTodo}
          todo={todo}
        />
      ))}
    </main>
  )
}

export default App
