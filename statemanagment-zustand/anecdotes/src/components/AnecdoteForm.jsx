import { useAnecdoteActions } from '../store'

const AnecdoteForm = () => {
  const { create } = useAnecdoteActions()

  const add = (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value
    create(content)
    e.target.reset()
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={add}>
        <div>
          <input name="anecdote" data-testid="new" />
        </div>
        <button>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
