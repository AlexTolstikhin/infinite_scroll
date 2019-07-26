import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce'

const styles = ({
	imageStyles: (rowHeight) => ({
		borderRadius: '20px',
		height: `${rowHeight - 15}px`,
		margin: '1%',
		maxWidth: '98%',
		width: "30%"
	}),
	listItemWrapper: (height) => ({
		height: height,
		maxWidth: '100%',
		overflow: 'hidden',
		position: 'relative',
		width: 'auto'
	}),
	listItemStyles: (height) => ({
		height: '50px',
		left: '0px',
		position: 'absolute',
		top: `${height}px`,
		width: '100%'
	}),
	listStyles: (listHeight) => ({
		boxSizing: 'border-box',
		direction: 'ltr',
		height: `${listHeight}px`,
		overflow: 'hidden auto',
		position: 'relative',
		width: '100%',
		willChange: 'transform'
	})
})

export default class Thumbsnails extends PureComponent {
	static propTypes = {
		allowedTimestampsIntervals: PropTypes.array,
		interval: PropTypes.number,
		lastTimeStamp: PropTypes.number,
		listHeight: PropTypes.number.isRequired,
		numberOfRowsToRender: PropTypes.number.isRequired,
		rowHeight: PropTypes.number.isRequired,
		startingTimeStamp: PropTypes.number,
		thumbExtension: PropTypes.string,
		urlPath: PropTypes.string,
	}

	static defaultProps = {
		allowedTimestampsIntervals: ['20', '40', '60', '80', '00'],
		interval: 20,
		lastTimeStamp: 1503031520,
		rowHeight: 100,
		startingTimeStamp: 1500348260,
		thumbExtension: '.jpg',
		urlPath: 'http://hiring.verkada.com/thumbs/'
	}

	constructor(props){
		super(props);
		this.divRef = React.createRef();
		this.state = {
			arrayOfAllItems: [],
			arrayOfItems: [],
			clientWidth: window.innerWidth,
			listItemWrapperHeight: 0,
			range: 0,
			thumbsInRow: 3
		}
		this.onScroll = debounce(this.onScroll.bind(this), 100);
		this.renderThumbs = this.renderThumbs.bind(this);
	}

	componentWillMount() {
		const {
			props: {
				allowedTimestampsIntervals,
				interval,
				lastTimeStamp,
				numberOfRowsToRender,
				rowHeight,
				startingTimeStamp
			},
			state: {
				thumbsInRow
			}
		} = this;

		// Count all timestamps
		const length = Math.floor((lastTimeStamp - startingTimeStamp) / interval);
		// Create array of all timestamps and items through validation;
		let currentTimeStamp = startingTimeStamp;
		const arrayOfAllTimestamps = new Array(length)
			.fill(0)
			.map(() => currentTimeStamp+=interval)
			.filter(timestamp => allowedTimestampsIntervals.includes(timestamp.toString().slice(-2)));
		
		// Create array of object that we will use to render timestamps
		// { index: index is the absolute heigth of the row; values: array of timestamps}
		let indexToStartSlice = 0;
		let indexToEndSlice = thumbsInRow;
		let rowHeightCounter = 0;
		const arrayOfObjectsToRender = new Array(length)
			.fill(0)
			.map((item, index) => {
				const arrayOfThumbs = arrayOfAllTimestamps.slice(indexToStartSlice, indexToEndSlice);
				indexToStartSlice = indexToEndSlice;
				indexToEndSlice += thumbsInRow;
				return {
					index: index === 0 ? rowHeightCounter : rowHeightCounter += rowHeight,
					values: arrayOfThumbs
				}
			});
		this.setState({
			arrayOfAllItems: arrayOfObjectsToRender,
			arrayOfItems: arrayOfObjectsToRender.slice(0, numberOfRowsToRender),
			range: rowHeight * numberOfRowsToRender,
			listItemWrapperHeight: (length / thumbsInRow) * rowHeight
		})
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.resize)
	}

	// Method that filters the array of items and determines what should be rendered
	onScroll() {
		const {
			arrayOfAllItems,
			range
		} = this.state;
		this.setState({
			arrayOfItems: arrayOfAllItems.filter(item => item.index > this.divRef.current.scrollTop - range && item.index < this.divRef.current.scrollTop + range)
		})
	}

	updateWidth() {
		this.setState({
			clientWidth: window.innerWidth
		})
	}


	renderThumbs(thumbsArray) {
		const {
			rowHeight,
			thumbExtension,
			urlPath
		} = this.props;

		return thumbsArray.map((timestamp) => {
			const url = `${urlPath}${timestamp}${thumbExtension}`;
			return(
				<img
					ref={this.imageRef}
					key={timestamp}
					alt={timestamp}
					src={url}
					style={styles.imageStyles(rowHeight)}
				/>
			);
		})

	}

	renderItems() {
		const { arrayOfItems } = this.state;
		return arrayOfItems.map(item =>
			<div
				key={item.index}
				style={styles.listItemStyles(item.index)}
			>
				{this.renderThumbs(item.values)}
			</div>
		);
	}

	render() {
		const {
			props: {
				listHeight,
				listWidth
			},
			state: {
				listItemWrapperHeight,
				loading
			}
			} = this;
		return(
			<div>
				{loading && <div style={styles.loadingMsgStyles(listWidth)}>Searching for thumbs...</div>}
				<div
					ref={this.divRef}
					onScroll={this.onScroll}
					style={styles.listStyles(listHeight)}>
					<div style={styles.listItemWrapper(listItemWrapperHeight)}>
						{this.renderItems()}
					</div>
				</div>
			</div>
		)
	}
}