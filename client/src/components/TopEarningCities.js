import React from 'react'
import Button from "react-bootstrap/Button";
import CustomTable from './Table.js';
import MapDisplay from './MapDisplay.js'


class TopEarningCities extends React.Component {
  constructor(props) {
		super(props);

    this.state = {
      state: '',
      keys: ["City", "Zipcode", "Median Income"],
      data: [],
      zipcodes1: [],
      labels1: [],
      zipcodes: [],
      labels: [],

		};

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);

	}

  handleChange(e) {

    this.setState({
      state: e.target.value })
    console.log(this.state.state)
  }

  handleSubmit(event) {
    event.preventDefault();

    const state = this.state.state;
    fetch(`${process.env.REACT_APP_BACKEND_API_ROOT}`+'/topEarningCitiesByState', {
			method: 'POST',
      credentials: 'include',
			headers: {
      			'Content-Type': 'application/json'
    		},
			mode: 'cors',
			body: JSON.stringify({
				state: state
			})
		}).then(response => {
      return response.json()
		}).then(data =>{
      if (data === "User not logged in.") {
        this.setState({errorMessage: "Must be logged in to view results."});
        return;
      }
      else if (data.length === 0){
        this.setState({
          errorMessage: "No results found.",
          data: [],
          zipcodes: [],
          labels: [],
          zipcodes1: [],
          labels1: [],
        });
        return;
      }
      var zipcodes = []
      var labels = []
      var i;
      for(i = 0; i < data.length; i++) {
        zipcodes.push(data[i][1])
        labels.push(data[i][0]+": $"+data[i][2])
      }
      this.setState({
			     data: data,
           labels: labels,
           zipcodes: zipcodes,
           errorMessage: ""
		   });
       this.setState({
         zipcodes1: this.state.zipcodes,
         labels1: this.state.labels,
       });
    })
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
              <li class="nav-item active">
                <a class="nav-link" href="topEarningCitiesByState">Top Cities</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="login">Login</a>
              </li>
              <li>
                <a class="nav-link" href="signup">Signup</a>
              </li>
              <li>
                <a class="nav-link" href="logout">Logout</a>
              </li>
            </ul>
          </div>
        </nav>

        <div class="jumbotron text-center  ">
            <h1><b> <font face = "Verdana" size = "24" color ="#255a7b"> Settle for nothing but the best?</font></b></h1>
            <br/>
            <h3><font face = "Verdana" color ="#255a7b"> Let us help you choose the ideal city for you. </font></h3>
              <div class="input-group md-form form-sm form-2 pl-0">
                <input class="form-control my-0 py-1 lime-border" value={this.state.state} type="text" placeholder="State" aria-label="State" onChange={this.handleChange}></input>
                <div class="input-group-append">
                  <form onSubmit={this.handleSubmit}>
                    <Button type="submit" variant="success" onclick = "ShowAlert()">Submit</Button>
                  </form>
                </div>
              </div>
            <p><font color = "red"><b>{this.state.errorMessage}</b></font></p>

            <br></br>
          <CustomTable data={this.state.data} keys={this.state.keys}/>
          <br></br>
          <br></br>
          <h4> Google Maps Visualization </h4>
          <br></br>
          <div class=".center-div">
              <MapDisplay zipcodes={this.state.zipcodes1} labels={this.state.labels1}/>
          </div>
        </div>
      </React.Fragment>
    );

  }
}



export default TopEarningCities
