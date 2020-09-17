import React, { useEffect, useContext } from 'react';
import Layout from './Layout';
import { useParams, Link, Redirect } from 'react-router-dom';
import Axios from 'axios';
import LoadingDotsIcon from './LoadingDotsIcon';
import { useImmerReducer } from 'use-immer';

import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';
import NotFound from './NotFound';

const EditPost = () => {
	const appState = useContext(StateContext);
	const appDispatch = useContext(DispatchContext);

	const initialState = {
		title: {
			value: '',
			hasErrors: false,
			message: '',
		},
		body: {
			value: '',
			hasErrors: false,
			message: '',
		},
		id: useParams().id,
		isFetching: true,
		isSaving: false,
		sendCount: 0, // for useEffect
		notFound: false, // for 404
		permissionProblem: false,
	};

	const ourReducer = (draft, action) => {
		switch (action.type) {
			case 'finishedFetchingPostData':
				draft.title.value = action.value.title;
				draft.body.value = action.value.body;
				draft.isFetching = false;
				if (appState.userDetails.username != action.value.author.username) draft.permissionProblem = true;
				return;
			case 'titleChange':
				draft.title.hasErrors = false;
				draft.title.value = action.value;
				return;
			case 'bodyChange':
				draft.body.hasErrors = false;
				draft.body.value = action.value;
				return;
			case 'updateRequest':
				if (!draft.title.hasErrors && !draft.body.hasErrors) {
					draft.sendCount++;
				}
				return;
			case 'updateRequestStarted':
				draft.isSaving = true;
				return;
			case 'updateRequestFinished':
				draft.isSaving = false;
				return;
			case 'titleRules':
				if (!action.value.trim()) {
					draft.title.hasErrors = true;
					draft.title.message = 'Please enter a title.';
				}
				return;
			case 'bodyRules':
				if (!action.value.trim()) {
					draft.body.hasErrors = true;
					draft.body.message = 'Please enter body content.';
				}
				return;
			case 'notFound':
				draft.notFound = true;
				return;
		}
	};

	const [state, dispatch] = useImmerReducer(ourReducer, initialState);

	const handleSubmit = (e) => {
		e.preventDefault();
		dispatch({ type: 'titleRules', value: state.title.value });
		dispatch({ type: 'bodyRules', value: state.body.value });
		dispatch({ type: 'updateRequest' });
	};

	useEffect(() => {
		const ourRequest = Axios.CancelToken.source();
		async function fetchPost() {
			try {
				const response = await Axios.get(`/post/${state.id}`, { cancelToken: ourRequest.token });
				if (response.data) {
					dispatch({ type: 'finishedFetchingPostData', value: response.data });
				} else {
					dispatch({ type: 'notFound' });
				}
			} catch (e) {
				console.log('Something went wrong.');
			}
		}
		fetchPost();
		return () => {
			ourRequest.cancel();
		};
	}, []);

	useEffect(() => {
		if (state.sendCount) {
			dispatch({ type: 'updateRequestStarted' });
			const ourRequest = Axios.CancelToken.source();
			async function updatePost() {
				try {
					// intentional delay added, just to show a loading spinner
					await new Promise((resolve) => setTimeout(resolve, 1600));

					const response = await Axios.post(
						`/post/${state.id}/edit`,
						{ title: state.title.value, body: state.body.value, token: appState.userDetails.token },
						{ cancelToken: ourRequest.token }
					);

					dispatch({ type: 'updateRequestFinished' });
					appDispatch({ type: 'flashMessage', value: 'Post Updated.' });
				} catch (e) {
					console.log('Something went wrong.');
				}
			}
			updatePost();
			return () => {
				ourRequest.cancel();
			};
		}
	}, [state.sendCount]);

	if (state.notFound) {
		return <NotFound />;
	}

	if (!appState.loggedIn) {
		appDispatch({ type: 'flashMessage', value: 'You do not have permission to edit that post.' });
		return <Redirect to="/" />;
	}

	if (state.permissionProblem) {
		appDispatch({ type: 'flashMessage', value: 'You do not have permission to edit that post.' });
		return <Redirect to="/" />;
	}

	if (state.isFetching) {
		return (
			<Layout title="...">
				<LoadingDotsIcon />
			</Layout>
		);
	}

	return (
		<Layout title="Edit Post">
			<Link className="small font-weight-bold" to={`/post/${state.id}`}>
				&laquo; Back to Post
			</Link>
			<form className="mt-3" onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="post-title" className="text-muted mb-1">
						<small>Title</small>
					</label>
					<input
						autoFocus
						onBlur={(e) => dispatch({ type: 'titleRules', value: e.target.value })}
						onChange={(e) => dispatch({ type: 'titleChange', value: e.target.value })}
						name="title"
						id="post-title"
						className="form-control form-control-lg form-control-title"
						type="text"
						placeholder=""
						autoComplete="off"
						value={state.title.value}
					/>
					{state.title.hasErrors && (
						<div className="alert alert-danger small liveValidateMessage">{state.title.message}</div>
					)}
				</div>

				<div className="form-group">
					<label htmlFor="post-body" className="text-muted mb-1 d-block">
						<small>Body Content</small>
					</label>
					<textarea
						onBlur={(e) => dispatch({ type: 'bodyRules', value: e.target.value })}
						onChange={(e) => dispatch({ type: 'bodyChange', value: e.target.value })}
						name="body"
						id="post-body"
						className="body-content tall-textarea form-control"
						type="text"
						value={state.body.value}
					/>
					{state.body.hasErrors && (
						<div className="alert alert-danger small liveValidateMessage">{state.body.message}</div>
					)}
				</div>

				<button disabled={state.isSaving} className="btn btn-primary">
					{state.isSaving ? 'Updating...' : 'Update Post'}
				</button>
			</form>
		</Layout>
	);
};

export default EditPost;
