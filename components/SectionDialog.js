import Modal from 'react-modal';
import { useState } from 'react';

Modal.setAppElement('#__next'); // For accessibility

export default function SectionDialog({ section, onClose }) {
  const [dialogContent, setDialogContent] = useState(''); // Store AI/user chat
  const [userInput, setUserInput] = useState('');

  const handleSubmit = () => {
    // Mock: Append user input to dialog; in real, call Grok API
    setDialogContent((prev) => `${prev}\nUser: ${userInput}\nAI: Suggested ${section}...`);
    setUserInput('');
  };

  const handleClose = () => {
    onClose(dialogContent); // Pass back to editor for insertion
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={handleClose}
      style={{
        content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)' },
      }}
    >
      <h2>Dialog for {section}</h2>
      <div style={{ height: '200px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>{dialogContent}</div>
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Engage with AI..."
      />
      <button onClick={handleSubmit}>Send</button>
      <button onClick={handleClose}>Close</button>
    </Modal>
  );
}
