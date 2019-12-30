import React from 'react'
import Plot from 'react-plotly.js'
import Button from "react-bootstrap/Button";

class HistoricalData extends React.Component {
  constructor(props) {
		super(props);

    this.state = {
      zipcode: '',
			years: [],
			averagePriceData: [],
      populationData: []
		};

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);

	}
  handleChange(e){
    this.setState({
      zipcode: e.target.value })
    console.log(this.state.zipcode)
  }

  handleSubmit(event) {
    event.preventDefault();

    const zipcode = this.state.zipcode;

		fetch(`${process.env.REACT_APP_BACKEND_API_ROOT}`+'/priceAndSalesData/'+this.state.zipcode, {
			method: 'GET',
      credentials: 'include',
			headers: {
      			'Content-Type': 'application/json'
    		},
			mode: 'cors',
		}).then(response => {
      return response.json()
		}).then(data=>{

      if (data === "User not logged in.") {
        this.setState({errorMessage: "Must be logged in to view results."});
        return;
      }
      else if (data.length == 0){
        this.setState({
          errorMessage: "No results found.",
          years: [],
    			averagePriceData: [],
          populationData: []
        });
        return;
      }

      var newYears = []
      var newPrices = []
      var newPopulations = []
      for (var i = 0; i < data.length; i++) {
        newYears.push(data[i][0])
        newPrices.push(data[i][1])
        newPopulations.push(data[i][2])
      }

      this.setState({years: newYears, averagePriceData: newPrices, populationData: newPopulations, errorMessage: ""})
			console.log(newYears)
    });
	}

  render() {
    return (
      <div>
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
              <li class="nav-item active">
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
          <h1><b> <font face = "Verdana" size = "24" color ="#255a7b">Are the prices in your town going up?</font></b></h1>
          <br/>
          <h3><font face = "Verdana" color ="#255a7b">Check out how prices have fluctuated over time.</font></h3>

          <div class="input-group md-form form-sm form-2 pl-0">
          <input class="form-control my-0 py-1 lime-border" value={this.state.zipcode} type="number" placeholder="Zipcode" aria-label="Zipcode" onChange={this.handleChange}>
          </input>
          <div class="input-group-append">
            <form onSubmit={this.handleSubmit}>
              <Button type="submit" variant="success" onclick = "ShowAlert()">Submit</Button>
            </form>
          </div>
        </div>
        <p><font color = "red"><b>{this.state.errorMessage}</b></font></p>
        <Plot
          data={[
            {
              x: this.state.years,
              y: this.state.averagePriceData,
              type: 'scatter',
              mode: 'lines+markers',
              marker: {color: 'red'},
            },
          ]}
          layout={{width: 640, height: 480, title: {text: 'Average Housing Price per Year for Zipcode ' + this.state.zipcode, font: {size:24}},
          xaxis: {
            title: {
              text: 'Year',
              font: {
                size: 18,
              }
            },
          },
          yaxis: {
            title: {
              text: 'Average Housing Price in USD',
              font: {
                size: 18,
              }
            }
          }}}
        />

        </div>
      </div>
    );

  }
}



export default HistoricalData
