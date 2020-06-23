import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';
import StateContext from '../StateContext';
import { useImmer } from 'use-immer';
import Axios from 'axios';
import LoadingDotsIcon from './LoadingDotsIcon';
import Post from './Post';

const Feed = () => {
	const appState = useContext(StateContext);
	const [state, setState] = useImmer({
		isLoading: true,
		feed: [],
	});

	useEffect(() => {
		const ourRequest = Axios.CancelToken.source();

		async function fetchFeed() {
			const response = await Axios.post(
				'/getHomeFeed',
				{ token: appState.userDetails.token },
				{ cancelToken: ourRequest.token }
			);
			setState((draft) => {
				draft.feed = response.data;
				draft.isLoading = false;
			});
		}
		fetchFeed();

		return () => {
			ourRequest.cancel();
		};
	}, []);

	if (state.isLoading) {
		return <LoadingDotsIcon />;
	}

	return (
		<Layout title="Feed">
			{state.feed.length > 0 && (
				<>
					<h2 className="text-center mb-4">The Latest From Those You Follow</h2>
					<div className="list-group">
						{state.feed.map((post) => {
							return <Post post={post} key={post._id} />;
						})}
					</div>
				</>
			)}
			{state.feed.length == 0 && (
				<>
					<h2 className="text-center">
						Hello <strong>{appState.userDetails.username}</strong>, your feed is empty.
					</h2>
					<p className="lead text-muted text-center">
						Your feed displays the latest posts from the people you follow. If you don&rsquo;t have any
						friends to follow that&rsquo;s okay; you can use the &ldquo;Search&rdquo; feature in the top
						menu bar to find content written by people with similar interests and then follow them.
					</p>
				</>
			)}
		</Layout>
	);
};

export default Feed;
