import React from 'react';
import { shallow } from 'enzyme';
import Thumbsnails from '../components/thumbsnails';

describe('Thumbsnails', () => {
	it('should match snapshot', () => {
		const props = {
			listHeight: 600,
			listWidth: 900,
			numberOfRowsToRender: 10,
			rowHeight: 350,
			thumbsInRow: 10
		}
		const wrapper = shallow(<Thumbsnails {...props}/>)
		expect(wrapper.debug()).toMatchSnapshot();
	});
});