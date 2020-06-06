import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import HeaderLoggedInForm from './HeaderLoggedInForm';
import HeaderLoggedOutForm from './HeaderLoggedOutForm';
import AppContext from '../AppContext';

function Header() {
	const { loggedIn } = useContext(AppContext);
	return (
		<header className="header-bar bg-primary mb-3">
			<div className="container d-flex flex-column flex-md-row align-items-center p-3">
				<h4 className="my-0 mr-md-auto font-weight-normal">
					<Link to="/" className="text-white">
						ComplexApp
					</Link>
				</h4>
				{loggedIn ? <HeaderLoggedInForm /> : <HeaderLoggedOutForm />}
			</div>
		</header>
	);
}

export default Header;
