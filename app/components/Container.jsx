import React from 'react';

const Container = (props) => {
	return (
		<>
			<div className={'mainpage container py-md-5' + (props.wide ? '' : ' container--narrow')}>
				{props.children}
			</div>
		</>
	);
};

export default Container;
