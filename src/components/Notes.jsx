import React, { useState } from 'react';
import './Notes.css';
import { IconButton, ImageUploadButton } from './NoteActions';

const COLORS = [
  '#fff9b1', // yellow
  '#b1e5fc', // blue
  '#baffc9', // green
  '#ffd6e0', // pink
  '#e2c2fc', // purple
  '#ffe0b2', // orange
  '#f0f4c3', // light green
  '#f8bbd0', // light pink
];

function getRandomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [input, setInput] = useState('');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editImage, setEditImage] = useState(null);
  const [image, setImage] = useState(null);

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleEditImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => setEditImage(e.target.result);
    reader.readAsDataURL(file);
  };

  const addNote = () => {
    if (input.trim() !== '' || image) {
      setNotes([
        {
          text: input,
          id: Date.now(),
          color: getRandomColor(),
          image,
        },
        ...notes,
      ]);
      setInput('');
      setImage(null);
    }
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const startEdit = (note) => {
    setEditId(note.id);
    setEditText(note.text);
    setEditImage(note.image || null);
  };

  const saveEdit = (id) => {
    setNotes(notes.map(note =>
      note.id === id ? { ...note, text: editText, image: editImage } : note
    ));
    setEditId(null);
    setEditText('');
    setEditImage(null);
  };

  return (
    <div className="notes-board-bg">
      <div className="notes-toolbar">
        <h2>Notes</h2>
      </div>
      <div className="sticky-notes-grid">
        {/* New Note Card */}
        <div className="sticky-note new-note" style={{ background: '#fffde7' }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Write your note..."
            className="note-textarea"
          />
          {image && (
            <img src={image} alt="Note" className="note-image" />
          )}
          <div className="note-actions">
            <ImageUploadButton onImageSelect={handleImageUpload} />
            <button className="add-btn" onClick={addNote}>Add</button>
          </div>
        </div>

        {/* Existing Notes */}
        {notes.length === 0 && <p className="no-notes">No notes yet.</p>}
        {notes.map(note => (
          <div
            className="sticky-note"
            key={note.id}
            style={{ background: note.color, position: 'relative' }}
          >
            {editId === note.id ? (
              <>
                <textarea
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  className="note-textarea"
                />
                {editImage && (
                  <img src={editImage} alt="Note" className="note-image" />
                )}
                <div className="note-actions">
                  <ImageUploadButton onImageSelect={handleEditImageUpload} />
                  <button className="save-btn" onClick={() => saveEdit(note.id)}>Save</button>
                  <button className="cancel-btn" onClick={() => setEditId(null)}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <div className="note-content">
                  <span>{note.text}</span>
                  {note.image && <img src={note.image} alt="Note" className="note-image" />}
                </div>
                <div className="note-actions">
                  <IconButton icon={<span role="img" aria-label="Edit">✏️</span>} onClick={() => startEdit(note)} label="Edit" />
                  <IconButton icon={<span role="img" aria-label="Delete">🗑️</span>} onClick={() => deleteNote(note.id)} label="Delete" />
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notes;
