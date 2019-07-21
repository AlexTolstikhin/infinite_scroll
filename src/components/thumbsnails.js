import React, { PureComponent } from 'react';

const styles = ({
	imageWrapper: {
		margin: '0 10% auto',
		maxWidth: '80%'
	},
	imageStyles: {
		display: 'inline-block',
		height: 'auto',
		margin: '1%',
		maxWidth: '98%',
		width: '30%'
	},
	mainWrapper: {
		border: '2px solid grey',
		margin: '0 10% auto'
	}
})

export default class ThumbsNails extends PureComponent {
	constructor(props){
		super(props);
		this.imageRef = React.createRef();
		this.state = {
			fetchedTimestamps: [],
			currentImageTimestamp: 1500348260
		}

		this.generateArrayOfTimestamps = this.generateArrayOfTimestamps.bind(this);
		this.renderThumbs = this.renderThumbs.bind(this);
	}

	componentDidMount() {
		this.generateArrayOfTimestamps(20, 40);
	}

	componentWillMount() {
		this.scrollListener = window.addEventListener("scroll", e => {
			const lastImgOffset = this.imageRef.current.offsetTop + this.imageRef.current.clientHeight;
			const pageOffset = window.pageYOffset + window.innerHeight;
			if(pageOffset > lastImgOffset) {
				this.generateArrayOfTimestamps(20, 40);
			}

		})
	}

	generateArrayOfTimestamps(limit = 20, interval = 20) {
		const { fetchedTimestamps, currentImageTimestamp } = this.state;
		let currentTimeStamp = currentImageTimestamp;
		const arrayOfTimeStamps = Array.apply(null, {length: limit}).map(() => currentTimeStamp += interval);
		this.setState({
			currentImageTimestamp: arrayOfTimeStamps[arrayOfTimeStamps.length - 1],
			fetchedTimestamps: [...fetchedTimestamps, ...arrayOfTimeStamps]
		})

	}

	renderThumbs() {
		const { fetchedTimestamps } = this.state;
		console.log(fetchedTimestamps);
		return fetchedTimestamps.map((timeStamp) => {
			const url = `http://hiring.verkada.com/thumbs/${timeStamp}.jpg`;
			return(
				<img
					ref={this.imageRef}
					key={timeStamp}
					alt={`thumbnail ${timeStamp}`}
					src={url}
					style={styles.imageStyles}
				/>
			);
		})
	}

	render() {
		return(
			<div
				style={styles.imageWrapper}
			>
				{this.renderThumbs()}
			</div>
		);
	}
}