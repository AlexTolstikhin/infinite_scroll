import React from 'react';
import { shallow } from 'enzyme';
import Thumbsnails from '../components/thumbsnails';

describe('Thumbsnails', () => {
	it('should render loading', () => {
		const wrapper = shallow(<Thumbsnails />);
		wrapper.setState({
			loading: true
		});
		expect(wrapper.debug()).toMatchSnapshot()
	});
	it('should render No results', () => {
		const wrapper = shallow(<Thumbsnails />);
		wrapper.setState({
			fetchedTimestamps: []
		});
		expect(wrapper.debug()).toMatchSnapshot();
	});
	it('should render end of list', () => {
		const props = {
			lastTimeStamp: 1
		}
		const wrapper = shallow(<Thumbsnails {...props}/>);
		wrapper.setState({
			startingTimeStamp: 2,
			fetchedTimestamps: []
		});
		expect(wrapper.debug()).toMatchSnapshot();
	});
	it('should render 2 images', () => {
		const wrapper = shallow(<Thumbsnails />);
		wrapper.setState({
			fetchedTimestamps: ['foo', 'foo']
		});
		expect(wrapper.debug()).toMatchSnapshot();
	});
});
