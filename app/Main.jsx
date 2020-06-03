import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Axios from 'axios';

// My Components
import Header from './components/header';
import HomeGuest from './components/HomeGuest';
import Feed from './components/Feed';
import Footer from './components/footer';
import About from './components/About';
import Terms from './components/Terms';
import CreatePost from './components/CreatePost';
import ViewSinglePost from './components/ViewSinglePost';
import FlashMessages from './components/FlashMessages';

Axios.defaults.baseURL = 'http://localhost:8080';

function Main() {
	const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem('appToken')));
	const [flashMessages, setFlashMessages] = useState([]);

	function addFlashMessage(message) {
		setFlashMessages((prev) => prev.concat(message));
	}

	return (
		<BrowserRouter>
			<FlashMessages messages={flashMessages} />
			<Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
			<Switch>
				<Route path="/" exact>
					{loggedIn ? <Feed /> : <HomeGuest />}
				</Route>
				<Route path="/about-us">
					<About />
				</Route>
				<Route path="/terms">
					<Terms />
				</Route>
				<Route path="/create-post">
					<CreatePost addFlashMessage={addFlashMessage} />
				</Route>
				<Route path="/post/:id">
					<ViewSinglePost />
				</Route>
			</Switch>
			<Footer />
		</BrowserRouter>
	);
}

ReactDOM.render(<Main />, document.querySelector('#app'));

if (module.hot) {
	module.hot.accept();
}
