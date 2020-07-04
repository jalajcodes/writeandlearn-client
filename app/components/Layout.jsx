import React, { useEffect } from 'react';
import Container from './Container';

const Layout = (props) => {
	useEffect(() => {
		document.title = `${props.title} | Write & Learn`;
		window.scrollTo(0, 0);
	}, [props.title]);
	return (
		<>
			<Container wide={props.wide}>{props.children}</Container>
		</>
	);
};

export default Layout;
