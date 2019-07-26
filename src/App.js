import React from 'react';
import Thumbsnails from './components/thumbsnails';

function App() {
  return (
    <div className="App">
		<div>
			<h1 style={{ textAlign: 'center', fontFamily: 'Helvetica Neue, sans-serif' }}>Verkada App</h1>
		</div>
		<div style={{ margin: '0 auto', border: '5px solid lightgrey', borderRadius: '25px 0 0 25px', width: '800px', height: '600px', textAlign: 'center' }}>
			<Thumbsnails
				listHeight={600}
				listWidth={900}
				numberOfRowsToRender={100}
				rowHeight={200}
			/>
		</div>
    </div>
  );
}

export default App;
