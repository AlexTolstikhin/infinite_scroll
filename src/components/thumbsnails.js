import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce'

const styles = ({
	imageWrapper: {
		margin: '0 10% auto',
		maxWidth: '80%',
		height: '100%',
		position: 'relative'
	},
	imageStyles: () => ({
		borderRadius: '20px',
		height: '100px',
		margin: '1%',
		maxWidth: '98%',
		width: "30%",
	}),
	mainWrapper: {
		border: '2px solid grey',
		margin: '0 10% auto'
	},
	titlesStyles: {
		textAlign: 'center'
	}
})

export default class Thumbsnails extends PureComponent {
	static propTypes = {
		allowedTimestampsIntervals: PropTypes.array,
		endOfListText: PropTypes.string,
		interval: PropTypes.number,
		lastTimeStamp: PropTypes.number,
		limit: PropTypes.number,
		loadingText: PropTypes.string,
		noResultsText: PropTypes.string,
		startingTimeStamp: PropTypes.number,
		thumbExtension: PropTypes.string,
		urlPath: PropTypes.string
	}

	static defaultProps = {
		allowedTimestampsIntervals: ['20', '40', '60', '80', '00'],
		endOfListText: 'End of List',
		interval: 20,
		lastTimeStamp: 1503031520,
		limit: 20,
		loadingText: 'Loading...',
		noResultsText: 'No Results Found',
		startingTimeStamp: 1500348260,
		thumbExtension: '.jpg',
		urlPath: 'http://hiring.verkada.com/thumbs/',
		rowHeight: 100,
		numberOfRowsToRender: 10
		
	}

	constructor(props){
		super(props);
		this.divRef = React.createRef();
		this.state = {
			thumbsInRow: 3,
			arrayOfItems: [],
			arrayOfAllItems: [],
			range: 0,
			loading: false
		}
		this.showLoading = this.showLoading.bind(this);
		this.onScroll = debounce(this.onScroll.bind(this), 100);
		this.renderThumbs = this.renderThumbs.bind(this);
	}

	componentDidMount() {
		
	}

	componentWillMount() {
		const { startingTimeStamp, lastTimeStamp, interval, rowHeight, numberOfRowsToRender } = this.props;
		const { thumbsInRow } = this.state
		const length = (lastTimeStamp - startingTimeStamp) / interval;
		let rowCounter = 0;
		let rowHeightCounter = 0;
		let sliceFrom = 0;
		let sliceTo = 0;
		const arrayOfThumbs = [];
		let currentTimeStamp = startingTimeStamp;
		const arrayOfAllTimesStamps = new Array(length)
			.fill(0)
			.map((item) => {
				const arrayOfThumbs = [currentTimeStamp+=interval, currentTimeStamp+=interval, currentTimeStamp+=interval];
				return {
					index: rowHeightCounter += rowHeight,
					values: arrayOfThumbs

				}
			})
		this.setState({
			arrayOfAllItems: arrayOfAllTimesStamps,
			arrayOfItems: arrayOfAllTimesStamps.slice(0, numberOfRowsToRender),
			range: rowHeight * numberOfRowsToRender
		})
	}

	showLoading () {
		this.setState({
			loading: true
		});
		this.onScroll();
	}

	onScroll() {
		const { arrayOfAllItems } = this.state;
		const { range } = this.state;
		this.setState({
			loading: false
		});
		this.setState({
			arrayOfItems: arrayOfAllItems.filter(item => item.index > this.divRef.current.scrollTop - range && item.index < this.divRef.current.scrollTop + range)
		})
	}

	renderThumbs(thumbsArray) {
		const { urlPath, thumbExtension } = this.props;
		return thumbsArray.map((timeStamp) => {
			const url = `${urlPath}${timeStamp}${thumbExtension}`;
			return(
				<img
					key={timeStamp}
					ref={this.imageRef}
					alt={timeStamp}
					src={url}
					style={styles.imageStyles()}
				/>
			);
		})

	}

	renderItems() {
		const { arrayOfItems } = this.state;

		return arrayOfItems.map(item => <div key={item.index} style={{ height: '50px', left: '0px', position: 'absolute', top: `${item.index}px`, width: '100%' }}>{this.renderThumbs(item.values)}</div>)
	}

	render() {
		const { loading } = this.state;
		return(
			<div style={{ position: "relative", width: '589px' }}>
				{loading && <div style={{ position: 'absolute', top: '50%', left: '50%' }}>Loading</div>}
				<div style={{ overflow: 'visible', width: '0px' }}>
					<div onScroll={this.showLoading} ref={this.divRef} style={{ boxSizing: 'border-box', direction: 'ltr', height: '300px', position: 'relative', width: '589px', willChange: 'transform', overflow: 'hidden auto' }} >
						<div style={{ width: 'auto', height: '50000px', maxWidth: '100%', maxHeight: '50000px', overflow: 'hidden', position: 'relative' }}>
							{this.renderItems()}
						</div>
					</div>
				</div>
			</div>
		)
	}
}