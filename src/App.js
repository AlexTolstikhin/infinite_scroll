import React, { PureComponent } from 'react';
import Thumbsnails from './components/thumbsnails';

const styles = {
	titleStyles: {
		fontFamily: 'Helvetica Neue, sans-serif',
		textAlign: 'center'
	},
	listFrameStyles: {
		height: '600px',
		margin: '0 auto',
		width: '80%'
	},
	listWrapperStyles: {
		border: '5px solid lightgrey',
		borderRadius: '25px 0 0 25px',
		height: '100%',
		margin: '0 auto',
		textAlign: 'center',
		width: '100%'
	}
}

export default class App extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			thumbsInRow: 3
		}
	}

	componentWillMount() {
		let rows = window.innerWidth < 400 ? 1 : window.innerWidth < 800 ? 2 : 3;
		this.setState({
			thumbsInRow: rows
		});
	}


	render() {
		const { thumbsInRow } = this.state;
		return (
			<div className="App">
				<div>
					<h1 style={styles.titleStyles}>Verkada App</h1>
				</div>
				<div style={styles.listFrameStyles}>
					<div style={styles.listWrapperStyles}>
						<Thumbsnails
							listHeight={600}
							listWidth={900}
							numberOfRowsToRender={10}
							rowHeight={350}
							thumbsInRow={thumbsInRow}
						/>
					</div>
				</div>
			</div>
		);
	}
}
