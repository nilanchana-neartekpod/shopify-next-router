import React, { useState } from 'react'

const Footer = () => {
  const [openModal, setOpenModal] = useState();

  const openAssistant = () =>{
    setOpenModal(true);
  }

  const closeAssistant = () =>{
    setOpenModal(false);
  }

  return (
    <div className='site-footer'>
      <button onClick={openAssistant}>Open Voice Assistant</button>
      <div className={`voice-assistant-modal ${openModal ? 'active': ''}`}>
        Welcome to voice Assistant
        <button onClick={closeAssistant}>CloseModal</button>
      </div>
    </div>
  )
}

export default Footer