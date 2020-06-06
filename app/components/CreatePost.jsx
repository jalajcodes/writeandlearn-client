import React, { useEffect, useState, useContext } from 'react';
import Layout from './Layout';
import Axios from 'axios';
import { Redirect } from 'react-router-dom';
import AppContext from '../AppContext';

const CreatePost = (props) => {
	const [title, setTitle] = useState();
	const [body, setBody] = useState();
	const [wasSuccessfull, setWasSuccessfull] = useState(false);
	const { addFlashMessage } = useContext(AppContext);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await Axios.post('/create-post', { title, body, token: localStorage.getItem('appToken') });
			console.log('Post Created!');
			setWasSuccessfull(response.data);
		} catch (e) {
			console.log('Something wrong from the server');
		}
	};

	if (wasSuccessfull) {
		addFlashMessage('Post Successfully Created!');
		return <Redirect to={`/post/${wasSuccessfull}`} />;
	}
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
