import React, { useEffect } from 'react';
import Container from './Container';

const Layout = (props) => {
	useEffect(() => {
		document.title = `${props.title} | Complex App`;
		window.scrollTo(0, 0);
	}, []);
	return (
		<>
			<Container wide={props.wide}>{props.children}</Container>
		</>
	);
};

export default Layout;
