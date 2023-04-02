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
      <div className="footer">by ennukee, contact me on Twitter (<a href="https://twitter.com/PriestismJP">@PriestismJP</a>) or on Discord (ennukee#0001) with any improvements or complaints</div>
    </div>
  );
}

export default App;
