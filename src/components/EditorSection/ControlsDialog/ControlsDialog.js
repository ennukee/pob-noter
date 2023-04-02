import React, { useContext } from 'react'
import './ControlsDialog.css';
import { AppContext } from '../../../context';

export default function ControlsDialog({ visible, availableColors, closeDialogCallback }) {
  const { setColor, checkColorForKey } = useContext(AppContext)

  const handleKeybindSet = (event, color) => {
    if (event.ctrlKey && !isNaN(+event.key)) {
      setColor(event.key, color);
    }
  }

  return (
    <div
      className={`controls-dialog ${visible ? 'visible' : ''}`}
    >
      <div className="dialog-title">Hotkeys</div>
      <div className="dialog-subtitle">Click the box next to any color, then use Ctrl + any number to bind it (letters will not work). All changes are saved to browser.</div>
      <div className="color-list">
        {availableColors.map(color => (
          <div className="color-row">
            <div className="color-bubble" style={{ backgroundColor: `#${color}` }} />
            <input
              className="color-hotkey-input"
              type="text"
              value={checkColorForKey(color) ? `Ctrl${checkColorForKey(color)}` : ''}
              onKeyDown={(e) => handleKeybindSet(e, color)} />
          </div>
        ))}
      </div>
      <div className="close-button" onClick={closeDialogCallback}>Close</div>
    </div>
  )
}
