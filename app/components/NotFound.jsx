import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';

const NotFound = () => {
	return (
		<Layout wide="true" title="Not Found">
			<div className="text-center">
				<h2>Whoops! We can't find the page you are looking for.</h2>
				<p className="lead text-muted">
					You can always go back to <Link to="/">homepage</Link> for a fresh start.
				</p>
			</div>
		</Layout>
	);
};

export default NotFound;
