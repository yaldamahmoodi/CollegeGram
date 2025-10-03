import { createFileRoute } from '@tanstack/react-router'

function WordAssistant() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Word Assistant</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-medium">AI Writing Assistant</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Get help with writing, editing, and document creation.
          </p>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/word-assistant')({
  component: WordAssistant,
})