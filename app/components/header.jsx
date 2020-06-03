import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import HeaderLoggedInForm from './HeaderLoggedInForm';
import HeaderLoggedOutForm from './HeaderLoggedOutForm';

function Header({ loggedIn, setLoggedIn }) {
	return (
		<header className="header-bar bg-primary mb-3">
			<div className="container d-flex flex-column flex-md-row align-items-center p-3">
				<h4 className="my-0 mr-md-auto font-weight-normal">
					<Link to="/" className="text-white">
						ComplexApp
					</Link>
				</h4>
				{loggedIn ? (
					<HeaderLoggedInForm setLoggedIn={setLoggedIn} />
				) : (
					<HeaderLoggedOutForm setLoggedIn={setLoggedIn} />
				)}
			</div>
		</header>
	);
}

export default Header;
