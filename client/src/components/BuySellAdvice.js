import React from 'react'
import Button from "react-bootstrap/Button";

class BuySellAdvice extends React.Component {
  constructor(props) {
		super(props);

    this.state = {
      zipcode: '',
      keys: ["Zipcode", "Num Sales", "Avg Price"],
      data: [[]],
      buySell: '',
      errorMessage: ''
		};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

	}

  ShowAlert() {
    document.getElementById("alert").style.display = "";
}

  handleChange(e){
    this.setState({
      zipcode: e.target.value })
    console.log(this.state.zipcode)
  }


  handleSubmit(event) {
    event.preventDefault();

    const zipcode = this.state.zipcode;

    fetch(`${process.env.REACT_APP_BACKEND_API_ROOT}`+'/currentPriceAndSales', {
			method: 'POST',
      credentials: 'include',
			headers: {
      			'Content-Type': 'application/json'
    		},
			mode: 'cors',
      body: JSON.stringify({
        zipcode: zipcode
      })
		}).then(response => {
      return response.json()
		}).then(data =>{
      console.log("HERE");
      if (data === "User not logged in.") {
        this.setState({errorMessage: "Must be logged in to view results."});
        return;
      }
      else if (data.length === 0){
        this.setState({
          errorMessage: "No results found.",
          data: [[]],
          buySell: '',
        });
        return;
      }
      this.setState({
			     data: data,
           errorMessage: ""
		   });

      //avg price < curr price && avg sales < curr sales
      if (!(this.state.data && this.state.data[0])) {
        this.setState({
             buySell: "Our Market Indicators are NEUTRAL"
         });
      } else if (this.state.data[0][0] < this.state.data[0][1] && this.state.data[0][2] < this.state.data[0][3]){
        this.setState({
             buySell: "Our Market Indicators suggest you should SELL"
         });
      }
      else if (this.state.data[0][0] > this.state.data[0][1] && this.state.data[0][2] < this.state.data[0][3]){
        this.setState({
             buySell: "Our Market Indicators suggest you should BUY"
         });
      }
      else{
        this.setState({
             buySell: "Our Market Indicators are NEUTRAL"
         });
      }
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
              <li class="nav-item active">
                <a class="nav-link" href="currentPriceAndSales">Buy Sell Advice</a>
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
          <h1><b> <font face = "Verdana" size = "24" color ="#255a7b">Sell? Buy? Let Us Help.</font></b></h1>
          <br/>
          <h3><font face = "Verdana" color ="#255a7b">Where in the US would you like to buy or sell a home?</font></h3>

          <div class="input-group md-form form-sm form-2 pl-0">
            <input class="form-control my-0 py-1 lime-border" value={this.state.zipcode} type="number" placeholder="Zipcode" aria-label="Zipcode" onChange={this.handleChange}></input>
              <div class="input-group-append">
                <form onSubmit={this.handleSubmit}>
                  <Button type="submit" variant="success" onclick = "ShowAlert()">Submit</Button>
                </form>
              </div>
          </div>
          <p><font color = "red"><b>{this.state.errorMessage}</b></font></p>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <h2>
            {this.state.buySell}
          </h2>
        </div>


      </React.Fragment>
    );

  }
}



export default BuySellAdvice
