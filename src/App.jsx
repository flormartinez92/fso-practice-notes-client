import { useEffect, useRef, useState } from 'react'
import Note from './components/Note'
import noteService from './services/notes'
import loginService from './services/login'
import { Notification } from './components/Notification'
import { LoginForm } from './components/LoginForm'
import { NoteForm } from './components/NoteForm'
import { Footer } from './components/Footer'
import { Togglable } from './components/Togglable'

const App = () => {
  const [notes, setNotes] = useState(null)
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)
  // * el hook useRef se utiliza para crear una referencia noteFormRef, que se asigna al componente Togglable que contiene el formulario para crear la nota. La variable noteFormRef actua como referencia al componente. Este hook asegura que se mantenga la misma referencia en todas las renderizaciones del componente.
  const noteFormRef = useRef()

  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const loginUser = async (userObject) => {
    try {
      const user = await loginService.login(userObject)

      window.localStorage.setItem('loggedNoteAppUser', JSON.stringify(user))
      noteService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility()
    noteService.create(noteObject).then((returnedNote) => {
      //! El método no muta la matriz notes original, sino que crea una nueva copia de la matriz con el nuevo elemento agregado al final. Esto es importante ya que nunca debemos mutar el estado directamente en React!
      setNotes(notes.concat(returnedNote))
    })
  }

  const notesToShow = showAll ? notes : notes.filter((note) => note.important)

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        //! La función callback establece el estado del componente notes en una nueva matriz que contiene todos los elementos de la matriz notes anterior, excepto la nota anterior que se reemplaza por la versión actualizada devuelta por el servidor:
        //! El método map crea una nueva matriz al mapear cada elemento de la matriz anterior a un elemento de la nueva matriz. En nuestro ejemplo, la nueva matriz se crea de forma condicional de modo que si note.id !== id es verdadero, simplemente copiamos el elemento de la matriz anterior en la nueva matriz. Si la condición es falsa, el objeto de nota devuelto por el servidor se agrega a la matriz.
        setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)))
      })
      .catch(() => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        // * La eliminación de una nota ya eliminada del estado de la aplicación se realiza con el método de array filter, que devuelve una nueva matriz que comprende solo los elementos de la lista para los cuales la función que se pasó como parámetro devuelve verdadero:
        setNotes(notes.filter((n) => n.id !== id))
      })
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {user === null ? (
        <Togglable buttonLabel="login">
          <LoginForm login={loginUser} />
        </Togglable>
      ) : (
        <div>
          <p>{user.name} logged-in</p>
          {
            <Togglable buttonLabel="new note" ref={noteFormRef}>
              <NoteForm createNote={addNote} />
            </Togglable>
          }
        </div>
      )}

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
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
      <Footer />
    </div>
  )
}

export default App
