import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce'

const styles = ({
	imageStyles: () => ({
		borderRadius: '20px',
		height: '100px',
		margin: '1%',
		maxWidth: '98%',
		width: "30%",
	}),
	listItemWrapper: (height) => ({
		width: 'auto',
		height: height, // calculate in state
		maxWidth: '100%',
		overflow: 'hidden',
		position: 'relative'
	})
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
		numberOfRowsToRender: 20
		
	}

	constructor(props){
		super(props);
		this.divRef = React.createRef();
		this.state = {
			arrayOfAllItems: [],
			arrayOfItems: [],
			listItemWrapperHeight: 0,
			loading: false,
			range: 0,
			thumbsInRow: 3
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
		let rowHeightCounter = 0;
		let currentTimeStamp = startingTimeStamp;
		const arrayOfAllTimesStamps = new Array(length)
			.fill(0)
			.map((item, index) => {
				const arrayOfThumbs = [currentTimeStamp+=interval, currentTimeStamp+=interval, currentTimeStamp+=interval];
				return {
					index: index === 0 ? rowHeightCounter : rowHeightCounter += rowHeight,
					values: arrayOfThumbs
				}
			})
		this.setState({
			arrayOfAllItems: arrayOfAllTimesStamps,
			arrayOfItems: arrayOfAllTimesStamps.slice(0, numberOfRowsToRender),
			range: rowHeight * numberOfRowsToRender,
			listItemWrapper: length * numberOfRowsToRender
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
		const { listItemWrapper, loading } = this.state;
		return(
			<div style={{ position: "relative", width: '100%' }}>
				{loading && <div style={{ position: 'absolute', top: '50%', left: '50%' }}>Loading...</div>}
				<div style={{ overflow: 'visible', width: '0px' }}>
					<div
						ref={this.divRef}
						onScroll={this.showLoading}
						style={{ 
							boxSizing: 'border-box',
							direction: 'ltr',
							height: '300px',
							position: 'relative',
							width: '589px',
							willChange: 'transform',
							overflow: 'hidden auto'
						}}>
						<div style={styles.listItemWrapper(listItemWrapper)}>
							{this.renderItems()}
						</div>
					</div>
				</div>
			</div>
		)
	}
}