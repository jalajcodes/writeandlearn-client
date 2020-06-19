import React, { useEffect, useState, useContext } from 'react';
import Axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import LoadingDotsIcon from './LoadingDotsIcon';
import StateContext from '../StateContext';

const ProfileFollowing = () => {
	const appState = useContext(StateContext);
	const [isLoading, setisLoading] = useState(true);
	const [following, setFollowing] = useState([]);

	const { username } = useParams();

	useEffect(() => {
		const ourRequest = Axios.CancelToken.source();

		async function getFollowing() {
			try {
				const response = await Axios.get(`/profile/${username}/following`, { cancelToken: ourRequest.token });
				setFollowing(response.data);
				setisLoading(false);
			} catch (e) {
				console.log('There was an error.');
			}
		}
		getFollowing();

		return () => {
			ourRequest.cancel();
		};
	}, [username]);

	if (isLoading) return <LoadingDotsIcon />;

	return (
		<div className="list-group">
			{following.length > 0 &&
				following.map((follower, index) => {
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
			{following.length == 0 && appState.userDetails.username == username && (
				<p className="lead text-muted text-center">You aren&rsquo;t following anyone yet.</p>
			)}
			{following.length == 0 && appState.userDetails.username != username && (
				<p className="lead text-muted text-center">{username} isn&rsquo;t following anyone yet.</p>
			)}
		</div>
	);
};

export default ProfileFollowing;
