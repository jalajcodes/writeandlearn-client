import React, { useEffect, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { useImmerReducer } from 'use-immer';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Axios from 'axios';
import { CSSTransition } from 'react-transition-group';

// My Contexts
import StateContext from './StateContext';
import DispatchContext from './DispatchContext';

// My Components
import LoadingDotsIcon from './components/LoadingDotsIcon';
import Header from './components/Header';
import HomeGuest from './components/HomeGuest';
import Feed from './components/Feed';
import Footer from './components/Footer';
import About from './components/About';
import Terms from './components/Terms';
import FlashMessages from './components/FlashMessages';
import Profile from './components/Profile';
import EditPost from './components/EditPost';
import NotFound from './components/NotFound';
const CreatePost = React.lazy(() => import('./components/CreatePost'));
const ViewSinglePost = React.lazy(() => import('./components/ViewSinglePost'));
const Search = React.lazy(() => import('./components/Search'));
const Chat = React.lazy(() => import('./components/Chat'));

Axios.defaults.baseURL = process.env.BACKENDURL || 'https://backend-api-complex.herokuapp.com';

function Main() {
	const initialState = {
		loggedIn: Boolean(localStorage.getItem('appToken')),
		flashMessages: [],
		userDetails: {
			token: localStorage.getItem('appToken'),
			avatar: localStorage.getItem('appAvatar'),
			username: localStorage.getItem('appUsername'),
		},
		isSearchOpen: false,
		isChatOpen: false,
		unreadMessageCount: 0,
	};

	function ourReducer(draft, action) {
		switch (action.type) {
			case 'login':
				draft.loggedIn = true;
				draft.userDetails = action.data;
				return;
			case 'logout':
				draft.loggedIn = false;
				return;
			case 'flashMessage':
				draft.flashMessages.push(action.value);
				return;
			case 'openSearch':
				draft.isSearchOpen = true;
				return;
			case 'closeSearch':
				draft.isSearchOpen = false;
				return;
			case 'toggleChat':
				draft.isChatOpen = !draft.isChatOpen;
				return;
			case 'closeChat':
				draft.isChatOpen = false;
				return;
			case 'incrementUnreadMessageCount':
				draft.unreadMessageCount++;
				return;
			case 'clearUnreadMessageCount':
				draft.unreadMessageCount = 0;
				return;
		}
	}

	const [state, dispatch] = useImmerReducer(ourReducer, initialState);

	useEffect(() => {
		if (state.loggedIn === true) {
			localStorage.setItem('appToken', state.userDetails.token);
			localStorage.setItem('appAvatar', state.userDetails.avatar);
			localStorage.setItem('appUsername', state.userDetails.username);
		} else {
			localStorage.removeItem('appToken');
			localStorage.removeItem('appAvatar');
			localStorage.removeItem('appUsername');
		}
	}, [state.loggedIn]);

	useEffect(() => {
		if (state.loggedIn) {
			const ourRequest = Axios.CancelToken.source();
			async function checkToken() {
				try {
					const response = await Axios.post(
						'/checkToken',
						{ token: state.userDetails.token },
						{ cancelToken: ourRequest.token }
					);
					if (!response.data) {
						dispatch({ type: 'logout' });
						dispatch({ type: 'flashMessage', value: 'Your session is expired. Please login again.' });
					}
				} catch (e) {
					console.log(e);
				}
			}
			checkToken();

			return () => ourRequest.cancel();
		}
	}, []);

	return (
		<StateContext.Provider value={state}>
			<DispatchContext.Provider value={dispatch}>
				<BrowserRouter>
					<FlashMessages messages={state.flashMessages} />
					<Header />
					<Suspense fallback={<LoadingDotsIcon />}>
						<Switch>
							<Route path="/" exact>
								{state.loggedIn ? <Feed /> : <HomeGuest />}
							</Route>
							<Route path="/profile/:username">
								<Profile />
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
							<Route path="/post/:id" exact>
								<ViewSinglePost />
							</Route>
							<Route path="/post/:id/edit" exact>
								<EditPost />
							</Route>
							<Route>
								<NotFound />
							</Route>
						</Switch>
					</Suspense>
					<CSSTransition timeout={330} in={state.isSearchOpen} classNames="search-overlay" unmountOnExit>
						<Suspense fallback="">
							<div className="search-overlay">
								<Search />
							</div>
						</Suspense>
					</CSSTransition>
					<Suspense fallback="">{state.loggedIn && <Chat />}</Suspense>
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
