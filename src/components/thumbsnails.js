// @ts-check
import React, { PureComponent } from 'react';
import '../App.css';

const styles = ({
	imageWrapper: {
		margin: '0 10% auto',
		maxWidth: '80%'
	},
	imageStyles: {
		display: 'inline-block',
		borderRadius: '20px',
		height: 'auto',
		margin: '1%',
		maxWidth: '98%',
		width: '30%'
	},
	mainWrapper: {
		border: '2px solid grey',
		margin: '0 10% auto'
	},
	titlesStyles: {
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
			startingTimeStamp: 1500348260,
			loading: true
		}

		this.generateArrayOfTimestamps = this.generateArrayOfTimestamps.bind(this);
		this.renderThumbs = this.renderThumbs.bind(this);
	}

	componentDidMount() {
		this.generateArrayOfTimestamps();
		this.setState({
			loading: false
		})
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
			state: {
				loading,
				startingTimeStamp
			},
			props: {
				lastTimeStamp
			}
		} = this;
		
		if(loading) {
			return (
				<h1 style={styles.titlesStyles}>Loading...</h1>
			)
		}
		return(
			<div
				style={styles.imageWrapper}
			>
				{this.renderThumbs()}
				{startingTimeStamp >= lastTimeStamp && <h1 style={styles.titlesStyles}>End of list</h1>} 
			</div>
		);
	}
}