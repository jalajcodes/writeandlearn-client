import React, { useEffect, useState, useContext } from 'react';
import Layout from './Layout';
import { useParams, Link, Redirect } from 'react-router-dom';
import Axios from 'axios';
import LoadingDotsIcon from './LoadingDotsIcon';
import ReactMarkdown from 'react-markdown';
import ReactTooltip from 'react-tooltip';
import NotFound from './NotFound';

import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';

const ViewSinglePost = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [post, setPost] = useState();
	const [deleteAttemptCount, setDeleteAttemptCount] = useState(0);
	const [deleteWasSuccessful, setDeleteWasSuccessful] = useState(false);
	const { id } = useParams();

	const appState = useContext(StateContext);
	const appDispatch = useContext(DispatchContext);

	useEffect(() => {
		const ourRequest = Axios.CancelToken.source();
		async function fetchPost() {
			try {
				const response = await Axios.get(`/post/${id}`, { cancelToken: ourRequest.token });
				setPost(response.data);
				setIsLoading(false);
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
		if (deleteAttemptCount) {
			const ourRequest = Axios.CancelToken.source();
			async function deletePost() {
				try {
					const response = await Axios.delete(
						`/post/${id}`,
						{ data: { token: appState.userDetails.token } },
						{ cancelToken: ourRequest.token }
					);
					setDeleteWasSuccessful(true);
				} catch (e) {
					console.log('Something went wrong.');
				}
			}
			deletePost();
			return () => {
				ourRequest.cancel();
			};
		}
	}, [deleteAttemptCount]);

	if (!isLoading && !post) {
		return <NotFound />;
	}

	if (deleteWasSuccessful) {
		appDispatch({ type: 'flashMessage', value: 'Post Successfully Deleted.' });
		return <Redirect to={`/profile/${appState.userDetails.username}`} />;
	}

	if (isLoading) {
		return (
			<Layout title="...">
				<LoadingDotsIcon />
			</Layout>
		);
	}

	const date = new Date(post.createdDate);
	const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

	function isOwner() {
		if (appState.loggedIn) {
			return appState.userDetails.username === post.author.username;
		} else {
			return false;
		}
	}

	function deleteHandler() {
		const areYouSure = window.confirm('Are you sure?');
		if (areYouSure) {
			setDeleteAttemptCount((prev) => prev + 1);
		}
	}

	return (
		<Layout title={post.title} wide="true">
			<div className="d-flex justify-content-between">
				<h1>{post.title}</h1>
				{isOwner() && (
					<span className="pt-2">
						<Link
							data-tip="Edit Post"
							data-for="edit"
							to={`/post/${id}/edit`}
							className="text-primary mr-2"
							title="Edit"
						>
							<i className="fas fa-edit"></i>
						</Link>
						<ReactTooltip id="edit" className="custom-tooltip" />{' '}
						<a
							onClick={deleteHandler}
							data-tip="Delete Post"
							data-for="delete"
							className="delete-post-button text-danger"
							title="Delete"
						>
							<i className="fas fa-trash"></i>
						</a>
						<ReactTooltip id="delete" className="custom-tooltip" />
					</span>
				)}
			</div>

			<p className="text-muted small mb-4">
				<Link to={`/profile/${post.author.username}`}>
					<img className="avatar-tiny" src={post.author.avatar} />
				</Link>
				Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> on {formattedDate}
			</p>

			<div className="body-content">
				<ReactMarkdown source={post.body} />
			</div>
		</Layout>
	);
};

export default ViewSinglePost;
