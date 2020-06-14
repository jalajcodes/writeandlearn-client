import React, { useEffect, useContext, useState } from 'react';
import Layout from './Layout';
import { useParams } from 'react-router-dom';
import Axios from 'axios';
import StateContext from '../StateContext';
import ProfilePosts from './ProfilePosts';

const Profile = () => {
	const { username } = useParams();
	const appState = useContext(StateContext);

	const [profileData, setProfileData] = useState({
		profileUsername: '...',
		profileAvatar: 'https://picsum.photos/200',
		isFollowing: false,
		counts: { postCount: '', followerCount: '', followingCount: '' },
	});

	useEffect(() => {
		const ourRequest = Axios.CancelToken.source();

		async function fetchData() {
			try {
				const response = await Axios.post(
					`/profile/${username}`,
					{
						token: appState.userDetails.token,
					},
					{ cancelToken: ourRequest.token }
				);
				setProfileData(response.data);
			} catch (e) {
				console.log('Something went wrong! "Profile.jsx');
			}
		}
		fetchData();
		return () => {
			ourRequest.cancel();
		};
	}, []);

	return (
		<Layout title="Profile" wide="true">
			<h2>
				<img className="avatar-small" src={profileData.profileAvatar} /> {profileData.profileUsername}
				<button className="btn btn-primary btn-sm ml-2">
					Follow <i className="fas fa-user-plus"></i>
				</button>
			</h2>

			<div className="profile-nav nav nav-tabs pt-2 mb-4">
				<a href="#" className="active nav-item nav-link">
					Posts: {profileData.counts.postCount}
				</a>
				<a href="#" className="nav-item nav-link">
					Followers: {profileData.counts.followerCount}
				</a>
				<a href="#" className="nav-item nav-link">
					Following: {profileData.counts.followingCount}
				</a>
			</div>

			<ProfilePosts />
		</Layout>
	);
};

export default Profile;
