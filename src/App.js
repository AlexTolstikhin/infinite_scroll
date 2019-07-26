import React from 'react';
import Thumbsnails from './components/thumbsnails';

function App() {
  return (
    <div className="App">
		<div>
			<h1 style={{ textAlign: 'center' }}>Verkada App</h1>
		</div>
		<div style={{ margin: '0 auto', paddingTop:'200px', width: '600px', height: '600px' }}>
			<Thumbsnails />
		</div>
    </div>
  );
}

export default App;
