import React from 'react';
import ReactDOM from 'react-dom';

import Home from './Home'

class Logout extends React.Component {
	contructor(props) {

		this.setState({
			textMessage: ''
		})

		this.handleSubmit = this.handleSumbit.bind(this);
	}

	handleSubmit(event) {
		event.preventDefault();

		fetch(`${process.env.REACT_APP_BACKEND_API_ROOT}`+'/logout', {
			method: 'POST',
			credentials: "include",
			headers: {
				'Content-Type': 'application/json'
			},
			mode: 'cors',
			body: JSON.stringify({})
		}).then(response => {
			console.log("RESP")
			ReactDOM.render(
				<Home />,
				document.getElementById('root')
			);
		});
	}

	render() {
		return (
			<React.Fragment>
				<nav class="navbar navbar-expand-lg navbar-light bg-light">
          <a class="navbar-brand" href="/">Home</a>
					<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
						<span class="navbar-toggler-icon"></span>
					</button>
					<div class="collapse navbar-collapse" id="navbarSupportedContent">
						<ul class="navbar-nav mr-auto">
							<li class="nav-item">
								<a class="nav-link" href="currentPriceAndSales">Buy Sell Advice </a>
							</li>
							<li class="nav-item">
								<a class="nav-link" href="historicalData">Historic Data</a>
							</li>
							<li class="nav-item">
								<a class="nav-link" href="recommendCity">City Recommendation</a>
							</li>
							<li class="nav-item">
								<a class="nav-link" href="similarZipcodes">Similar Zipcodes</a>
							</li>
							<li class="nav-item">
								<a class="nav-link" href="bestZipcodeInCity">Best Zipcodes</a>
							</li>
							<li class="nav-item">
								<a class="nav-link" href="marketPeakZipcodes">Hot Zipcodes</a>
							</li>
							<li class="nav-item">
								<a class="nav-link" href="topEarningCitiesByState">Top Cities</a>
							</li>
							<li class="nav-item">
								<a class="nav-link" href="login">Login</a>
							</li>
							<li  class="nav-item">
								<a class="nav-link" href="signup">Signup</a>
							</li>
							<li class="nav-item active">
								<a class="nav-link" href="logout">Logout</a>
							</li>
						</ul>
					</div>
				</nav>

				<div class="jumbotron text-center  ">
					<div class="login" onSubmit={this.handleSubmit}>
						<form class="login-container">
							<p><input type="submit" value="Log out"></input></p>
						</form>
					</div>
				</div>
			</React.Fragment>
		)
	}
}

export default Logout;
