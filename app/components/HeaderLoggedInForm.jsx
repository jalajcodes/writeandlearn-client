import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import DispatchContext from '../DispatchContext';
import StateContext from '../StateContext';
import ReactTooltip from 'react-tooltip';

const HeaderLoggedInForm = () => {
	const appDispatch = useContext(DispatchContext);
	const appState = useContext(StateContext);

	const handleLogOut = () => {
		appDispatch({ type: 'logout' });
		appDispatch({ type: 'flashMessage', value: 'Successfully logged out.' });
	};

	const handleClick = (e) => {
		e.preventDefault();
		appDispatch({ type: 'openSearch' });
	};

	return (
		<>
			<div className="flex-row my-3 my-md-0">
				<a
					data-tip="Search"
					data-for="search"
					onClick={handleClick}
					href="#"
					className="text-white mr-2 header-search-icon"
				>
					<i className="fas fa-search"></i>
				</a>{' '}
				<ReactTooltip id="search" className="custom-tooltip" />{' '}
				<span
					onClick={() => appDispatch({ type: 'toggleChat' })}
					data-tip="Live Chat"
					data-for="chat"
					className={'mr-2 header-chat-icon ' + (appState.unreadMessageCount ? 'text-danger' : 'text-white')}
				>
					<i className="fas fa-comment"></i>
					{appState.unreadMessageCount ? (
						<span className="chat-count-badge text-white">
							{' '}
							{appState.unreadMessageCount >= 10 ? '9+' : appState.unreadMessageCount}{' '}
						</span>
					) : (
						''
					)}
				</span>{' '}
				<ReactTooltip id="chat" className="custom-tooltip" />{' '}
				<Link
					data-tip="Profile"
					data-for="profile"
					to={`/profile/${appState.userDetails.username}`}
					className="mr-2"
				>
					<img className="small-header-avatar" src={appState.userDetails.avatar} />
				</Link>{' '}
				<ReactTooltip id="profile" className="custom-tooltip" />{' '}
				<Link className="btn btn-sm btn-success mr-2" to="/create-post">
					Create Post
				</Link>{' '}
				<button onClick={handleLogOut} className="btn btn-sm btn-secondary">
					Sign Out
				</button>
			</div>
		</>
	);
};

export default HeaderLoggedInForm;
