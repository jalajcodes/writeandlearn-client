import React, { useContext, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useImmer } from 'use-immer';
import io from 'socket.io-client';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';

function Chat(props) {
	const socket = useRef(null);
	const appState = useContext(StateContext);
	const appDispatch = useContext(DispatchContext);
	const chatVisible = useRef(null);
	const chatLog = useRef(null);

	const [state, setState] = useImmer({
		messageField: '',
		chatMessages: [],
	});

	useEffect(() => {
		if (appState.isChatOpen) {
			chatVisible.current.focus();
			appDispatch({ type: 'clearUnreadMessageCount' });
		}
	}, [appState.isChatOpen]);

	useEffect(() => {
		socket.current = io(process.env.BACKENDURL || 'https://backend-api-complex.herokuapp.com');

		socket.current.on('chatFromServer', (message) => {
			setState((draft) => {
				draft.chatMessages.push(message);
			});
		});

		return () => socket.current.disconnect();
	}, []);

	useEffect(() => {
		chatLog.current.scrollTop = chatLog.current.scrollHeight;

		if (state.chatMessages.length && !appState.isChatOpen) {
			appDispatch({ type: 'incrementUnreadMessageCount' });
		}
	}, [state.chatMessages]);

	const handleFieldChange = (e) => {
		const message = e.target.value;
		setState((draft) => {
			draft.messageField = message;
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (state.messageField.length) {
			// Send message to chat server
			socket.current.emit('chatFromBrowser', { message: state.messageField, token: appState.userDetails.token });

			setState((draft) => {
				draft.messageField = '';

				//add message to state's collection of messages
				draft.chatMessages.push({
					message: state.messageField,
					avatar: appState.userDetails.avatar,
					username: appState.userDetails.username,
				});
			});
		}
	};

	return (
		<>
			<div
				id="chat-wrapper"
				className={
					'chat-wrapper shadow border-top border-left border-right' +
					(appState.isChatOpen ? ' chat-wrapper--is-visible' : '')
				}
			>
				<div className="chat-title-bar bg-primary">
					Chat
					<span onClick={() => appDispatch({ type: 'closeChat' })} className="chat-title-bar-close">
						<i className="fas fa-times-circle"></i>
					</span>
				</div>
				<div id="chat" ref={chatLog} className="chat-log">
					{state.chatMessages.map((message, index) => {
						if (message.username == appState.userDetails.username) {
							return (
								<div key={index} className="chat-self">
									<div className="chat-message">
										<div className="chat-message-inner">{message.message}</div>
									</div>
									<img className="chat-avatar avatar-tiny" src={message.avatar} />
								</div>
							);
						} else {
							return (
								<div key={index} className="chat-other">
									<Link to={`/profile/${message.username}`}>
										<img className="avatar-tiny" src={message.avatar} />
									</Link>
									<div className="chat-message">
										<div className="chat-message-inner">
											<Link to={`/profile/${message.username}`}>
												<strong>{message.username}:</strong>
											</Link>{' '}
											{message.message}
										</div>
									</div>
								</div>
							);
						}
					})}
				</div>
				<form onSubmit={handleSubmit} id="chatForm" className="chat-form border-top">
					<input
						onChange={handleFieldChange}
						value={state.messageField}
						ref={chatVisible}
						type="text"
						className="chat-field"
						id="chatField"
						placeholder="Type a message…"
						autoComplete="off"
					/>
				</form>
			</div>
		</>
	);
}

export default Chat;
