import { useEffect, useState } from "react";
import Note from "./components/Note";
import noteService from "./services/notes";
import { Notification } from "./components/Notification";
import { Footer } from "./components/Footer";

const App = () => {
  const [notes, setNotes] = useState(null);
  const [newNote, setNewNote] = useState("a new note...");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState("some error happened...");

  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes);
    });
  }, []);

  const addNote = (e) => {
    e.preventDefault();
    const noteObj = {
      content: newNote,
      important: Math.random() < 0.5,
    };

    noteService.create(noteObj).then((returnedNote) => {
      //! El método no muta la matriz notes original, sino que crea una nueva copia de la matriz con el nuevo elemento agregado al final. Esto es importante ya que nunca debemos mutar el estado directamente en React!
      setNotes(notes.concat(returnedNote));
      setNewNote("");
    });
  };

  //* Se llama al controlador de eventos cada vez que ocurre un cambio en el elemento input. La función del controlador de eventos recibe el objeto de evento como su parámetro event (e):
  const handleNoteChange = (e) => {
    setNewNote(e.target.value);
  };

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };
    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        //! La función callback establece el estado del componente notes en una nueva matriz que contiene todos los elementos de la matriz notes anterior, excepto la nota anterior que se reemplaza por la versión actualizada devuelta por el servidor:
        //! El método map crea una nueva matriz al mapear cada elemento de la matriz anterior a un elemento de la nueva matriz. En nuestro ejemplo, la nueva matriz se crea de forma condicional de modo que si note.id !== id es verdadero, simplemente copiamos el elemento de la matriz anterior en la nueva matriz. Si la condición es falsa, el objeto de nota devuelto por el servidor se agrega a la matriz.
        setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)));
      })
      .catch((error) => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        // * La eliminación de una nota ya eliminada del estado de la aplicación se realiza con el método de array filter, que devuelve una nueva matriz que comprende solo los elementos de la lista para los cuales la función que se pasó como parámetro devuelve verdadero:
        setNotes(notes.filter((n) => n.id !== id));
      });
  };

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow?.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  );
};

export default App;
