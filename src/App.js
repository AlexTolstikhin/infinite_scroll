import React from 'react';
import './App.css';
import Thumbsnails from './components/thumbsnails';

function App() {
  return (
    <div className="App">
		<Thumbsnails interval={10000}/>
    </div>
  );
}

export default App;
