// Todo: Add validation

import React, { useEffect, useState, useContext } from 'react';
import Layout from './Layout';
import Axios from 'axios';
import { Redirect } from 'react-router-dom';
import DispatchContext from '../DispatchContext';
import StateContext from '../StateContext';

const CreatePost = () => {
	const [title, setTitle] = useState();
	const [body, setBody] = useState();
	const [mount, setMount] = useState(false); // this state is for knowing if the compontent has rendered the first time
	const [wasSuccessful, setWasSuccessful] = useState(false);
	const appDispatch = useContext(DispatchContext);
	const appState = useContext(StateContext);

	useEffect(() => setMount(true), []); // upon initial render we set mount to true

	/*
	    Inside this useEffect we check if mount is true, if it is
		then it means that it is not the initial render of the component and the function will run
		and show the passed flashMessage.

		This useEffect hooks runs when the wasSuccessFull state changes. This was initially written
		below in the if condition but moved above here because it was giving a warning in console
		saying "We can not update a component from another component"
	*/
	useEffect(() => (mount ? appDispatch({ type: 'flashMessage', value: 'Post created successfully.' }) : undefined), [
		wasSuccessful,
	]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await Axios.post('/create-post', { title, body, token: appState.userDetails.token });

			setWasSuccessful(response.data);
		} catch (e) {
			console.log('Something wrong from the server');
		}
	};

	if (wasSuccessful) {
		return <Redirect to={`/post/${wasSuccessful}`} />;
	} else
		return (
			<Layout title="Create Post" wide="true">
				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="post-title" className="text-muted mb-1">
							<small>Title</small>
						</label>
						<input
							onChange={(e) => setTitle(e.target.value)}
							autoFocus
							name="title"
							id="post-title"
							className="form-control form-control-lg form-control-title"
							type="text"
							placeholder=""
							autoComplete="off"
						/>
					</div>

					<div className="form-group">
						<label htmlFor="post-body" className="text-muted mb-1 d-block">
							<small>Body Content</small>
						</label>
						<textarea
							onChange={(e) => setBody(e.target.value)}
							name="body"
							id="post-body"
							className="body-content tall-textarea form-control"
							type="text"
						></textarea>
					</div>

					<button className="btn btn-primary">Save New Post</button>
				</form>
			</Layout>
		);
};

export default CreatePost;
