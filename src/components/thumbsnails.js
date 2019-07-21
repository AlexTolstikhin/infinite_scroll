// @ts-check
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
	},
	endOfList: {
		textAlign: 'center'
	}
})

export default class ThumbsNails extends PureComponent {
	static defaultProps = {
		limit: 20,
		interval: 20,
		lastTimeStamp: 1503031520
	}

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

	componentDidMount() {
		this.generateArrayOfTimestamps();
	}

	componentWillMount() {
		const {
			props: { lastTimeStamp }
		} = this;
		this.scrollListener = window.addEventListener("scroll", e => {
			const currentImage = this.imageRef.current;
			const imageTimeStamp = currentImage ? parseInt(currentImage.alt) : lastTimeStamp;
			if (imageTimeStamp < lastTimeStamp){
				const lastImgOffset = currentImage.offsetTop + currentImage.clientHeight;
				const pageOffset = window.pageYOffset + window.innerHeight;
				if(pageOffset > lastImgOffset) {
					this.generateArrayOfTimestamps();
				}
			}
		});
	}

	generateArrayOfTimestamps() {
		const {
			state: {
				fetchedTimestamps,
				startingTimeStamp
			},
			props: {
				limit,
				interval
			}
		} = this;
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
			const url = `http://hiring.verkada.com/thumbs/${timeStamp}.jpg`;
			return(
				<img
					key={timeStamp}
					ref={this.imageRef}
					alt={timeStamp}
					src={url}
					style={styles.imageStyles}
				/>
			);
		})
	}

	render() {
		const {
			state: { startingTimeStamp },
			props: { lastTimeStamp }
		} = this;
		console.log("startingTimeStamp", startingTimeStamp);
		console.log("lastTimeStamp", lastTimeStamp)
		return(
			<div
				style={styles.imageWrapper}
			>
				{this.renderThumbs()}
				{startingTimeStamp >= lastTimeStamp && <h1 style={styles.endOfList}>End of list</h1>} 
			</div>
		);
	}
}