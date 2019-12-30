import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import Login from './Login';
import RecommendCity from './RecommendCity';
import HistoricalData from './HistoricalData';
import SimilarZipcodes from './SimilarZipcodes';
import BestZipcode from './BestZipcode';
import TopEarningCities from './TopEarningCities';
import MarketPeakZipcodes from './MarketPeakZipcodes';
import BuySellAdvice from './BuySellAdvice';
import Home from './Home';
import Signup from './Signup';
import Logout from './Logout'
import '../style/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


class App extends React.Component {

  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route
              exact
              path="/"
              render={() => (
                //this.state.isLoggedIn === true
                  //? <Home />
                  //: <Redirect to="/login" />
                  <Home />
              )}
            />
            <Route
              path="/login"
              render={() => (
              //  this.state.isLoggedIn === true
               //   ? <Home />
               //   : <Login />
               <Login />
              )}
            />
            <Route
              path="/signup"
              render={() => (
                <Signup />
              )}
            />
            <Route
              path="/recommendCity"
              render={() => (
                //this.state.isLoggedIn === true
                //  ? <RecommendCity />
                //  : <RecommendCity />
                <RecommendCity />
                )}
            />
            <Route
              path="/historicalData"
              render={() => (
                //this.state.isLoggedIn === true
                 // ? <HistoricalData />
                 // : <Login />
                 <HistoricalData />
              )}
            />
            <Route
              path="/similarZipcodes"
              render={() => (
            //    this.state.isLoggedIn === true
                //  ? <SimilarZipcodes />
                //  : <Login />
                <SimilarZipcodes />
              )}
            />
            <Route
              path="/bestZipcodeInCity"
              render={() => (
              //  this.state.isLoggedIn === true
              //    ? <BestZipcode />
              //    : <Login />
              <BestZipcode />
              )}
            />
            <Route
              path="/topEarningCitiesByState"
              render={() => (
                //this.state.isLoggedIn === true
                //  ? <TopEarningCities />
                //  : <Login />
                <TopEarningCities />
              )}
            />
            <Route
              path="/marketPeakZipcodes"
              render={() => (
                //this.state.isLoggedIn === true
                //  ? <MarketPeakZipcodes />
                //  : <Login />
                <MarketPeakZipcodes />
              )}
            />
            <Route
              path="/currentPriceAndSales"
              render={() => (
                //this.state.isLoggedIn === true
                //  ? <BuySellAdvice />
                 // : <Login />
                 <BuySellAdvice />
              )}
            />
            <Route
              path='/logout'
              render={() => (
                <Logout />
               )}
            />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
