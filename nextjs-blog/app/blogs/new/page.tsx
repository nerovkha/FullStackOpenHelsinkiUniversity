"use client"

import { useActionState } from "react"
import { createBlog, type BlogFormState } from "@/app/actions"

const initialState: BlogFormState = { errors: {} }

const NewBlog = () => {
  const [state, formAction] = useActionState(createBlog, initialState)

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">create a new blog</h1>

      <form action={formAction} className="space-y-3">
        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            defaultValue={state.values?.title ?? ""}
            className="w-full rounded border border-slate-300 px-3 py-1.5"
          />
          {state.errors?.title && (
            <p data-testid="title-error" className="text-sm text-red-600">
              {state.errors.title}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="author">Author</label>
          <input
            id="author"
            name="author"
            defaultValue={state.values?.author ?? ""}
            className="w-full rounded border border-slate-300 px-3 py-1.5"
          />
          {state.errors?.author && (
            <p data-testid="author-error" className="text-sm text-red-600">
              {state.errors.author}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="url">URL</label>
          <input
            id="url"
            name="url"
            defaultValue={state.values?.url ?? ""}
            className="w-full rounded border border-slate-300 px-3 py-1.5"
          />
          {state.errors?.url && (
            <p data-testid="url-error" className="text-sm text-red-600">
              {state.errors.url}
            </p>
          )}
        </div>
        <button
          data-testid="create-blog-button"
          type="submit"
          className="rounded bg-slate-800 px-4 py-1.5 text-slate-100"
        >
          Create
        </button>
      </form>
    </div>
  )
}

export default NewBlog
