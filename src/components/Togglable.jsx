import React, { useState, forwardRef, useImperativeHandle } from 'react'

// forwardRef le permite a un componente exponer un nodo DOM al componente padre con una ref.
export const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  // este hook sirve para que la funcion que estoy retornando (toggleVisibility) este disponible fuera del componente.
  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {/* props.children se utiliza para hacer referencia a los componentes hijos del componente. Los componentes hijos son los elementos de React que definimos entre las etiquetas de apertura y cierre de un componente. */}
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})
