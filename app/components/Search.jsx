import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import DispatchContext from '../DispatchContext';
import { useImmer } from 'use-immer';
import Axios from 'axios';
import Post from './Post';

const Search = () => {
	const [state, setState] = useImmer({
		searchTerm: '',
		display: 'neither',
		results: [],
		requestCount: 0,
	});

	const appDispatch = useContext(DispatchContext);

	useEffect(() => {
		document.addEventListener('keyup', keyHandler);

		return () => document.removeEventListener('keyup', keyHandler);
	}, []);

	/* this useEffect runs whenever user types something in the search.

	We store the refernece to the setTimeout call in the delay variable
	 because we want to clear it when the dependency array changes
	or component unmounts.

	Suppose if user types a character, so the useEffect will run first time
	   and without waiting he types another character then useEffect will run again while the clear function
	   of first useEffect runs and clear the timeout. So the setTimeout function will not run until the
	   user waits the amount of time specified in the setTimeout.


	*/
	useEffect(() => {
		if (state.searchTerm.trim()) {
			setState((draft) => {
				// as soon as user types something show the loading css.
				draft.display = 'loading';
			});

			const delay = setTimeout(() => {
				setState((draft) => {
					draft.requestCount++;
				});
			}, 750);

			return () => clearTimeout(delay);
		} else {
			setState((draft) => {
				draft.display = 'neither';
			});
		}
	}, [state.searchTerm]);

	/*
		This useEffect watches the requestCount variable and send the axios request when it changes.
		We don't send the request in the above useEffect to keep things seperate.
   */
	useEffect(() => {
		if (state.requestCount) {
			const ourRequest = Axios.CancelToken.source();
			async function fetchResults() {
				try {
					const response = await Axios.post(
						'/search',
						{ searchTerm: state.searchTerm },
						{ cancelToken: ourRequest.token }
					);

					setState((draft) => {
						draft.results = response.data;
						draft.display = 'results';
					});
				} catch (e) {
					console.log(e);
				}
			}
			fetchResults();

			return () => ourRequest.cancel();
		}
	}, [state.requestCount]);

	function keyHandler(e) {
		if (e.keyCode == 27) {
			appDispatch({ type: 'closeSearch' });
		}
	}

	function handleChange(e) {
		const value = e.target.value;
		setState((draft) => {
			draft.searchTerm = value;
		});
	}

	return (
		<div className="search-overlay">
			<div className="search-overlay-top shadow-sm">
				<div className="container container--narrow">
					<label htmlFor="live-search-field" className="search-overlay-icon">
						<i className="fas fa-search"></i>
					</label>
					<input
						onChange={handleChange}
						autoFocus
						type="text"
						autoComplete="off"
						id="live-search-field"
						className="live-search-field"
						placeholder="What are you interested in?"
					/>
					<span onClick={(e) => appDispatch({ type: 'closeSearch' })} className="close-live-search">
						<i className="fas fa-times-circle"></i>
					</span>
				</div>
			</div>

			<div className="search-overlay-bottom">
				<div className="container container--narrow py-3">
					<div
						className={'circle-loader ' + (state.display == 'loading' ? 'circle-loader--visible' : '')}
					></div>
					<div
						className={
							'live-search-results ' + (state.display == 'results' ? 'live-search-results--visible' : '')
						}
					>
						{Boolean(state.results.length) && (
							<div className="list-group shadow-sm">
								<div className="list-group-item active">
									<strong>Search Results</strong> ({state.results.length}{' '}
									{'item' + (state.results.length > 1 ? 's' : '')} found)
								</div>

								{state.results.map((result) => {
									return (
										<Post
											post={result}
											key={result._id}
											onClick={() => appDispatch({ type: 'closeSearch' })}
										/>
									);
								})}
							</div>
						)}

						{!Boolean(state.results.length) && (
							<p className="alert alert-danger shadow-sm text-center">
								Sorry, no post matched that search query.
							</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Search;
