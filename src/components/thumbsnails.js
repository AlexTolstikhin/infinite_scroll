import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const styles = ({
	imageWrapper: {
		margin: '0 10% auto',
		maxWidth: '80%'
	},
	imageStyles: (screenWidth) => ({
		display: screenWidth > 400 ? 'inline-block' : 'block',
		borderRadius: '20px',
		height: 'auto',
		margin: '1%',
		maxWidth: '98%',
		width:	screenWidth > 600 ? '30%'
			: screenWidth < 600 && screenWidth > 400 ? '45%'
			: '100%'
	}),
	mainWrapper: {
		border: '2px solid grey',
		margin: '0 10% auto'
	},
	titlesStyles: {
		textAlign: 'center'
	}
})

export default class ThumbsNails extends PureComponent {
	static propTypes = {
		allowedTimestamps: PropTypes.array,
		limit: PropTypes.number,
		interval: PropTypes.number,
		lastTimeStamp: PropTypes.number
	}

	static defaultProps = {
		allowedTimestamps: ['20', '40', '60', '80', '00'],
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
			loading: true,
			screenWidth: 0
		}

		this.generateArrayOfTimestamps = this.generateArrayOfTimestamps.bind(this);
		this.renderThumbs = this.renderThumbs.bind(this);
		this.updateScreenWidth = this.updateScreenWidth.bind(this);
	}

	componentDidMount() {
		window.addEventListener("resize", this.updateScreenWidth);
		this.generateArrayOfTimestamps();
		this.setState({
			loading: false
		})
	}

	componentWillMount() {
		const {
			props: { lastTimeStamp }
		} = this;

		this.updateScreenWidth();
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

	componentWillUnmount() {
		window.removeEventListener("resize", this.updateScreenWidth);
	}

	/**
	 * generateArrayOfTimestamps method that updates startingTimeStamp and fetchedTimestamps array in state
	 *
	 * @return  {Object} new state  
	 */
	generateArrayOfTimestamps() {
		const {
			state: {
				fetchedTimestamps,
				startingTimeStamp
			},
			props: {
				allowedTimestamps,
				limit,
				interval
			}
		} = this;
		let currentTimeStamp = startingTimeStamp;
		const arrayOfTimeStamps = Array
			.apply(null, {length: limit < 20 ? 20 : limit})
			.map(() => currentTimeStamp += interval)
			.filter((item) => allowedTimestamps.includes(item.toString().slice(-2)));
		this.setState({
			startingTimeStamp: arrayOfTimeStamps[arrayOfTimeStamps.length - 1],
			fetchedTimestamps: [...fetchedTimestamps, ...arrayOfTimeStamps]
		})

	}

	/**
	 * updateScreenWidth updates screenWidth state prop
	 *
	 * @return  {Object}  new state
	 */
	updateScreenWidth() {
		this.setState({
			screenWidth: window.innerWidth
		})
	}

	/**
	 * renderThumbs renders thumbs
	 *
	 * @return  {Node} 
	 */
	renderThumbs() {
		const {
			fetchedTimestamps,
			screenWidth
		} = this.state;
		return fetchedTimestamps.map((timeStamp) => {
			const url = `http://hiring.verkada.com/thumbs/${timeStamp}.jpg`;
			return(
				<img
					key={timeStamp}
					ref={this.imageRef}
					alt={timeStamp}
					src={url}
					style={styles.imageStyles(screenWidth)}
				/>
			);
		})
	}

	render() {
		const {
			state: {
				fetchedTimestamps,
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
				{!fetchedTimestamps.length && <h1 style={styles.titlesStyles}>No Results Found</h1>}
				{!!fetchedTimestamps.length && this.renderThumbs()}
				{startingTimeStamp >= lastTimeStamp && <h1 style={styles.titlesStyles}>End of list</h1>} 
			</div>
		);
	}
}