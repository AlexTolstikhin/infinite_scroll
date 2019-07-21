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
			startingTimeStamp: 1500348260
		}

		this.generateArrayOfTimestamps = this.generateArrayOfTimestamps.bind(this);
		this.renderThumbs = this.renderThumbs.bind(this);
	}

	componentWillMount() {
		this.generateArrayOfTimestamps(20, 40);
		this.scrollListener = window.addEventListener("scroll", e => {
			const lastImgOffset = this.imageRef.current.offsetTop + this.imageRef.current.clientHeight;
			const pageOffset = window.pageYOffset + window.innerHeight;
			if(pageOffset > lastImgOffset) {
				this.generateArrayOfTimestamps(20, 40);
			}

		})
	}

	generateArrayOfTimestamps(limit = 20, interval = 20) {
		const { fetchedTimestamps, startingTimeStamp } = this.state;
		let currentTimeStamp = startingTimeStamp;
		const arrayOfTimeStamps = Array.apply(null, {length: limit}).map(() => currentTimeStamp += interval);
		this.setState({
			startingTimeStamp: arrayOfTimeStamps[arrayOfTimeStamps.length - 1],
			fetchedTimestamps: [...fetchedTimestamps, ...arrayOfTimeStamps]
		})

	}

	renderThumbs() {
		const { fetchedTimestamps } = this.state;

		return fetchedTimestamps.map((timeStamp) => {
			const date = new Date(timeStamp*1000).toUTCString();
			const url = `http://hiring.verkada.com/thumbs/${timeStamp}.jpg`;

			return(
				<img
					key={timeStamp}
					ref={this.imageRef}
					alt={date}
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