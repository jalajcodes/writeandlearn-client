import React, { useState, useReducer } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Axios from 'axios';

// My Contexts
import StateContext from './StateContext';
import DispatchContext from './DispatchContext';

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
	const initialState = {
		loggedIn: Boolean(localStorage.getItem('appToken')),
		flashMessages: [],
	};

	function ourReducer(state, action) {
		switch (action.type) {
			case 'login':
				return { loggedIn: true, flashMessages: state.flashMessages };
			case 'logout':
				return { loggedIn: false, flashMessages: state.flashMessages };
			case 'flashMessage':
				return { loggedIn: state.loggedIn, flashMessages: state.flashMessages.concat(action.value) };
		}
	}

	const [state, dispatch] = useReducer(ourReducer, initialState);

	return (
		<StateContext.Provider value={state}>
			<DispatchContext.Provider value={dispatch}>
				<BrowserRouter>
					<FlashMessages messages={state.flashMessages} />
					<Header />
					<Switch>
						<Route path="/" exact>
							{state.loggedIn ? <Feed /> : <HomeGuest />}
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
			</DispatchContext.Provider>
		</StateContext.Provider>
	);
}

ReactDOM.render(<Main />, document.querySelector('#app'));

if (module.hot) {
	module.hot.accept();
}
