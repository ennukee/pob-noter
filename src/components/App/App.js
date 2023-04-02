import React, { useEffect } from 'react';
import { EditorSection, TopPanel } from '..';
import './App.css';


function App() {
  useEffect(() => {
    const eventListener = document.addEventListener('keydown', function(event) {
      if (event.ctrlKey && !isNaN(+event.key)) {
        event.preventDefault();
      }
    })
    return () => document.removeEventListener('keydown', eventListener);
  }, [])

  return (
    <div className="app-container">
      <TopPanel />
      <EditorSection />
      <div>Test footer</div>
    </div>
  );
}

export default App;
