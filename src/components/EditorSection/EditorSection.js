import React, { useState, useRef, useEffect } from 'react'
import { ControlsDialog } from './ControlsDialog';
import './EditorSection.css';

const colorNumericConstants = [
  // Represents the color-code values for the syntax like ^0 ^1 ^2 ^3 and so on.
  '000000', 'ff0000', '00ff00', '0000ff', 'ffff00', 'ff00ff', '00ffff', 'ffffff', 'bfbfbf', '636363',
]

const nativePobColors = [
  'efefef', // normal
  'b97123', // fire
  'e05030', // strength
  '8888ff', // magic
  '3f6db3', // cold
  '70ff70', // dex
  'ffff77', // rare
  'adaa47', // lightning
  '7070ff', // int
  'af6025', // unique
  'd02090', // chaos
  'ffffff', // default
  ...colorNumericConstants,
]

export default function EditorSection() {
  const [startingString,] = useState('This is a ^xf99999basic example ^7of what ^x9ff99fthe UI looks like');
  const [formattedValue, setFormattedValue] = useState()
  const [controlsDialogVisible, setControlsDialogVisible] = useState(false)
  const editorRef = useRef()
  const displayRef = useRef()

  // Format the initial value
  useEffect(() => {
    setFormattedValue(formatValue(startingString))
  }, [startingString])

  const handleChange = (event) => {
    console.log(event)
    setFormattedValue(formatValue(event.target.value));
  };

  const forceFormat = () => {
    setFormattedValue(formatValue(editorRef.current.value));
  }

  const formatValue = (value) => {
    // Special logic so that the output properly matches what PoB has when styles bleed between lines
    const divBrBreakupRegex = /<div>(.*?)<\/div>/g;
    const divBrBreakupCallback = (_, contents) => {
      if (contents === "<br>") {
        return "<br>";
      } else {
        return contents + "<br>";
      }
    }

    // Parse raw text into good looking viewable values
    const newValue = value
                      .replace(divBrBreakupRegex, divBrBreakupCallback)
                      .replace(/\^x([0-9A-Fa-f]{6})/g, '</span><span style="color: #$1;">')
                      .replace(/\^([0-9])/g, (_,capture) => `</span><span style="color: #${colorNumericConstants[capture]}">`);
    return `<span>${newValue}</span>`
  }

  const insertPobColorCode = (color) => {
    const textarea = editorRef.current;

    const { selectionStart, selectionEnd } = textarea;
    let selectedText = textarea.value.substring(selectionStart, selectionEnd);

    const existingColor = selectedText.match(/.*(\^x[0-9a-fA-F]{6}|\^[0-9])/);
    let endColor = '^7';
    if (existingColor?.[1]) {
      endColor = existingColor[1];
      selectedText = selectedText.replace(/(\^x[0-9a-fA-F]{6}|\^[0-9])/, '');
    }

    const colorCode = `^x${color}`;
    const modifiedText = `${colorCode}${selectedText}${endColor}`;

    textarea.value = textarea.value.substring(0, selectionStart) + modifiedText + textarea.value.substring(selectionEnd);

    textarea.selectionStart = selectionStart + colorCode.length;
    textarea.selectionEnd = selectionStart + 2;

    forceFormat();
  }

  const handleColorControlClick = (event, color) => {
    event.preventDefault();
    insertPobColorCode(color);
  }

  const handleKeyDown = (event) => {
    if (event.ctrlKey) {

    }
  }

  const closeControlsDialog = () => setControlsDialogVisible(false);
  const openControlsDialog = () => setControlsDialogVisible(true);

  // * Sync the scroll state between both panels
  const handleEditablePanelScroll = (event) => {
    const el = event.target;
    displayRef.current.scrollTop = el.scrollTop
  }

  // * Sync the scroll state between both panels
  const handleDisplayPanelScroll = (event) => {
    const el = event.target;
    editorRef.current.scrollTop = el.scrollTop
  }

  return (
    <div className="editor-section">
      <div className="controls">
        <div className="color-controls">
          {nativePobColors.map(color => (
            <div className="color-control" onMouseDown={(e) => handleColorControlClick(e, color)} style={{backgroundColor: `#${color}`}}/>
          ))}
        </div>
        <div className="configure-hotkeys" onClick={openControlsDialog}>Configure Hotkeys</div>
      </div>
      <div className="editor-container">
        <textarea 
          ref={editorRef}
          className="editor unformatted"
          onInput={handleChange}
          onScroll={handleEditablePanelScroll}
          onKeyDown={handleKeyDown}
        >
          {startingString}
        </textarea>
        <div
          ref={displayRef}
          className="editor formatted"
          dangerouslySetInnerHTML={{ __html: formattedValue }}
          onScroll={handleDisplayPanelScroll}
        />
      </div>
      <ControlsDialog visible={controlsDialogVisible} availableColors={nativePobColors} closeDialogCallback={closeControlsDialog} />
    </div>
  );
}

  // TODO: Autosave logic
  // useEffect(() => {
  //   console.log('setup autosave')
  //   const autosave = (value) => {
  //     console.log('autosaving')
  //     window.localStorage.setItem('autosavedInput', value);
  //   }
  //   const interval = setInterval(() => {
  //     autosave(editorRef.current.innerHTML);
  //   }, 5000)

  //   return () => clearInterval(interval)
  // }, [editorRef])

          /* <div
          ref={editorRef}
          className="editor unformatted"
          contentEditable={true}
          onInput={handleChange}
          onScroll={handleEditablePanelScroll}
        >
          {startingString}
        </div> */
