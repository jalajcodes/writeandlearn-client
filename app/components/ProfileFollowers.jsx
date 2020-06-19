import React, { useEffect, useState, useContext } from 'react';
import Axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import LoadingDotsIcon from './LoadingDotsIcon';
import StateContext from '../StateContext';

const ProfileFollowers = () => {
	const appState = useContext(StateContext);
	const [isLoading, setisLoading] = useState(true);
	const [followers, setFollowers] = useState([]);

	const { username } = useParams();

	useEffect(() => {
		const ourRequest = Axios.CancelToken.source();

		async function getFollowers() {
			try {
				const response = await Axios.get(`/profile/${username}/followers`, { cancelToken: ourRequest.token });
				setFollowers(response.data);
				setisLoading(false);
			} catch (e) {
				console.log('There was an error.');
			}
		}
		getFollowers();

		return () => {
			ourRequest.cancel();
		};
	}, [username]);

	if (isLoading) return <LoadingDotsIcon />;

	return (
		<div className="list-group">
			{followers.length > 0 &&
				followers.map((follower, index) => {
					return (
						<Link
							key={index}
							to={`/profile/${follower.username}`}
							className="list-group-item list-group-item-action"
						>
							<img className="avatar-tiny" src={follower.avatar} /> {follower.username}
						</Link>
					);
				})}
			{followers.length == 0 && appState.userDetails.username == username && (
				<p className="lead text-muted text-center">You don&rsquo;t have any followers yet.</p>
			)}
			{followers.length == 0 && appState.userDetails.username != username && (
				<p className="lead text-muted text-center">
					{username} doesn&rsquo;t have any followers yet.
					{appState.loggedIn && ' Be the first to follow them!'}
					{!appState.loggedIn && (
						<>
							{' '}
							If you want to follow them you need to <Link to="/">sign up</Link> for an account first.{' '}
						</>
					)}
				</p>
			)}
		</div>
	);
};

export default ProfileFollowers;
