import React, { useEffect, useContext } from 'react';
import { useImmer } from 'use-immer';
import Layout from './Layout';
import { useParams, NavLink, Switch, Route } from 'react-router-dom';
import Axios from 'axios';
import StateContext from '../StateContext';
import ProfilePosts from './ProfilePosts';
import ProfileFollowers from './ProfileFollowers';
import ProfileFollowing from './ProfileFollowing';

const Profile = () => {
	const { username } = useParams();
	const appState = useContext(StateContext);

	const [state, setState] = useImmer({
		followActionLoading: false,
		startFollowingRequestCount: 0,
		stopFollowingRequestCount: 0,
		profileData: {
			profileUsername: '...',
			profileAvatar: 'https://picsum.photos/200',
			isFollowing: false,
			counts: { postCount: '', followerCount: '', followingCount: '' },
		},
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
				setState((draft) => {
					draft.profileData = response.data;
				});
			} catch (e) {
				console.log('Something went wrong! "Profile.jsx');
			}
		}
		fetchData();
		return () => {
			ourRequest.cancel();
		};
	}, [username]);

	useEffect(() => {
		if (state.startFollowingRequestCount) {
			setState((draft) => {
				draft.followActionLoading = true;
			});
			const ourRequest = Axios.CancelToken.source();

			async function fetchData() {
				try {
					const response = await Axios.post(
						`/addFollow/${state.profileData.profileUsername}`,
						{
							token: appState.userDetails.token,
						},
						{ cancelToken: ourRequest.token }
					);
					setState((draft) => {
						draft.profileData.isFollowing = true;
						draft.profileData.counts.followerCount++;
						draft.followActionLoading = false;
					});
				} catch (e) {
					console.log('Something went wrong!');
				}
			}
			fetchData();
			return () => {
				ourRequest.cancel();
			};
		}
	}, [state.startFollowingRequestCount]);

	useEffect(() => {
		if (state.stopFollowingRequestCount) {
			setState((draft) => {
				draft.followActionLoading = true;
			});
			const ourRequest = Axios.CancelToken.source();

			async function fetchData() {
				try {
					const response = await Axios.post(
						`/removeFollow/${state.profileData.profileUsername}`,
						{
							token: appState.userDetails.token,
						},
						{ cancelToken: ourRequest.token }
					);
					setState((draft) => {
						draft.profileData.isFollowing = false;
						draft.profileData.counts.followerCount--;
						draft.followActionLoading = false;
					});
				} catch (e) {
					console.log('Something went wrong!');
				}
			}
			fetchData();
			return () => {
				ourRequest.cancel();
			};
		}
	}, [state.stopFollowingRequestCount]);

	const handleFollowRequest = () => {
		setState((draft) => {
			draft.startFollowingRequestCount++;
		});
	};

	const handleUnfollowRequest = () => {
		setState((draft) => {
			draft.stopFollowingRequestCount++;
		});
	};

	return (
		<Layout title="Profile" wide="true">
			<h2>
				<img className="avatar-small" src={state.profileData.profileAvatar} />{' '}
				{state.profileData.profileUsername}
				{appState.loggedIn &&
					!state.profileData.isFollowing &&
					appState.userDetails.username != state.profileData.profileUsername &&
					state.profileData.profileUsername != '...' && (
						<button
							disabled={state.followActionLoading}
							onClick={handleFollowRequest}
							className="btn btn-primary btn-sm ml-2"
						>
							Follow <i className="fas fa-user-plus"></i>
						</button>
					)}
				{appState.loggedIn &&
					state.profileData.isFollowing &&
					appState.userDetails.username != state.profileData.profileUsername &&
					state.profileData.profileUsername != '...' && (
						<button
							disabled={state.followActionLoading}
							onClick={handleUnfollowRequest}
							className="btn btn-danger btn-sm ml-2"
						>
							Unfollow <i className="fas fa-user-times"></i>
						</button>
					)}
			</h2>

			<div className="profile-nav nav nav-tabs pt-2 mb-4">
				<NavLink exact to={`/profile/${state.profileData.profileUsername}`} className="nav-item nav-link">
					Posts: {state.profileData.counts.postCount}
				</NavLink>
				<NavLink to={`/profile/${state.profileData.profileUsername}/followers`} className="nav-item nav-link">
					Followers: {state.profileData.counts.followerCount}
				</NavLink>
				<NavLink to={`/profile/${state.profileData.profileUsername}/following`} className="nav-item nav-link">
					Following: {state.profileData.counts.followingCount}
				</NavLink>
			</div>
			<Switch>
				<Route exact path="/profile/:username">
					<ProfilePosts />
				</Route>
				<Route path="/profile/:username/followers">
					<ProfileFollowers />
				</Route>
				<Route path="/profile/:username/following">
					<ProfileFollowing />
				</Route>
			</Switch>
		</Layout>
	);
};

export default Profile;
