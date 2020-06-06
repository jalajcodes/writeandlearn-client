import React, { useState, useReducer } from 'react';
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

// My Contexts
import AppContext from './AppContext';

Axios.defaults.baseURL = 'http://localhost:8080';

function Main() {
	let initialState = {
		loggedIn: Boolean(localStorage.getItem('appToken')),
		flashMessages: [],
	};

	let ourReducer = (state, action) => {
		switch (action.type) {
			case 'login':
				return { loggedIn: true, flashmessages: state.flashMessages };
			case 'logout':
				return { loggedIn: false, flashmessages: state.flashMessages };
			case 'flashmessage':
				return { loggedIn: state.loggedIn, flashmessages: state.flashMessages.concat(action.value) };
		}
	};

	const [state, dispatch] = useReducer(ourReducer, initialState);

	const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem('appToken')));
	const [flashMessages, setFlashMessages] = useState([]);

	function addFlashMessage(message) {
		setFlashMessages((prev) => prev.concat(message));
	}

	return (
		<AppContext.Provider value={{ addFlashMessage, setLoggedIn, loggedIn }}>
			<BrowserRouter>
				<FlashMessages messages={flashMessages} />
				<Header />
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
						<CreatePost />
					</Route>
					<Route path="/post/:id">
						<ViewSinglePost />
					</Route>
				</Switch>
				<Footer />
			</BrowserRouter>
		</AppContext.Provider>
	);
}

ReactDOM.render(<Main />, document.querySelector('#app'));

if (module.hot) {
	module.hot.accept();
}
