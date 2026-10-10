import { useState } from 'react'
import './App.css'

function ItemForm({ onAddItem }) {
  const [itemText, setItemText] = useState('')

  return (
    <form
      className="item-form"
      onSubmit={(event) => {
        event.preventDefault()
        const trimmedText = itemText.trim()
        if (!trimmedText) return
        onAddItem(trimmedText)
        setItemText('')
      }}
    >
      <label htmlFor="new-item">Add an item</label>
      <div className="form-controls">
        <input
          id="new-item"
          value={itemText}
          onChange={(event) => setItemText(event.target.value)}
          placeholder="What needs a place on the list?"
          maxLength={100}
        />
        <button className="add-button" type="submit">Add item <span aria-hidden="true">+</span></button>
      </div>
    </form>
  )
}

function ItemList({ items, onDeleteItem }) {
  if (items.length === 0) {
    return <p className="empty-state">Nothing on the list yet. Add your first item above.</p>
  }

  return (
    <ul className="item-list">
      {items.map((item, index) => (
        <li className="item-row" key={item.id}>
          <span className="item-number">{String(index + 1).padStart(2, '0')}</span>
          <span className="item-name">{item.text}</span>
          <button
            className="delete-button"
            type="button"
            onClick={() => onDeleteItem(item.id)}
            aria-label={`Delete ${item.text}`}
          >
            Delete <span aria-hidden="true">×</span>
          </button>
        </li>
      ))}
    </ul>
  )
}

function App() {
  const [items, setItems] = useState([
    { id: 1, text: 'Sketch the first idea' },
    { id: 2, text: 'Choose a color for the cover' },
  ])

  function handleAddItem(text) {
    setItems((currentItems) => [...currentItems, { id: crypto.randomUUID(), text }])
  }

  function handleDeleteItem(itemId) {
    setItems((currentItems) => currentItems.filter((item) => item.id !== itemId))
  }

  return (
    <main className="page-shell">
      <header className="topline">
        <a className="wordmark" href="#top" aria-label="Little List home">LL<span>.</span></a>
        <span className="topline-note">A little list for big thoughts</span>
        <span className="date-stamp">NO. 01 / EVERYDAY</span>
      </header>

      <section className="intro" id="top">
        <p className="eyebrow"><span className="eyebrow-mark" /> YOUR WORKING LIST</p>
        <h1>Make room<br />for <em>what matters.</em></h1>
        <p className="intro-copy">One thought at a time. Keep the good ones close.</p>
      </section>

      <section className="list-panel" aria-labelledby="list-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE COLLECTION</p>
            <h2 id="list-heading">Things to remember</h2>
          </div>
          <span className="item-count">{String(items.length).padStart(2, '0')} ITEMS</span>
        </div>
        <ItemForm onAddItem={handleAddItem} />
        <ItemList items={items} onDeleteItem={handleDeleteItem} />
      </section>

      <footer className="page-footer">
        <span>KEEP IT SIMPLE</span>
        <span>MADE FOR THE MOMENT <span aria-hidden="true">↗</span></span>
      </footer>
    </main>
  )
}

export default App
