import React from 'react';
import Thumbsnails from './components/thumbsnails';

function App() {
  return (
    <div className="App">
		<div>
			<h1 style={{ textAlign: 'center' }}>Verkada App</h1>
		</div>
		<div style={{ margin: '0 auto', paddingTop:'100px', width: '900px', height: '600px' }}>
			<Thumbsnails
				listHeight={600}
				listWidth={900}
				numberOfRowsToRender={20}
				rowHeight={200}
			/>
		</div>
    </div>
  );
}

export default App;
