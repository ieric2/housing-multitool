import React from 'react';
import { Map, InfoWindow, GoogleApiWrapper, Marker } from 'google-maps-react';

export class MapDisplay extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        zipcodes: this.props.zipcodes,
        labels: this.props.labels,
        latLng: [],
        activeMarker: {},
        selectedPlace: {},
        showingInfoWindow: false
      }

    }

    componentWillReceiveProps(nextProps) {
      this.getZipcodeCoords()
      this.forceUpdate()

      this.setState({zipcodes:nextProps.zipcodes, labels:nextProps.labels})
      this.getZipcodeCoords(nextProps.zipcodes)
      this.forceUpdate()

    }

    getZipcodeCoords(zipcodeList) {
      if (!zipcodeList) {
        return
      }

      var newLatLng = []
      var i;
      var promiseList = []

      for (i = 0; i < zipcodeList.length; i++) {
        var zipcode_param = zipcodeList[i].toString(10)

        while (zipcode_param.length < 5) {
          zipcode_param = "0" + zipcode_param
        }
        promiseList.push(fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + zipcode_param + `&key=${process.env.REACT_APP_MAPS_KEY}`, {
      			method: 'GET'
      		}).then(response => {
            return response.json();
          }).then(data => {
            if (data.results.length > 0){
              newLatLng.push([data.results[0].geometry.location, data.results[0].address_components[0].long_name])
            }
          })
        )
      }
      Promise.all(promiseList).then(_ => {
          this.setState({latLng:newLatLng})
        }

      )

    }

    onMarkerClick = (props, marker) =>
    this.setState({
      activeMarker: marker,
      selectedPlace: props,
      showingInfoWindow: true
    });

  onInfoWindowClose = () =>
    this.setState({
      activeMarker: null,
      showingInfoWindow: false
    });

    onMapClicked = () => {
      if (this.state.showingInfoWindow)
        this.setState({
          activeMarker: null,
          showingInfoWindow: false
        });
    };


    displayMarkers = () => {
    return this.state.latLng.map((store, index) => {
      return <Marker onClick={this.onMarkerClick} name={this.state.labels[this.state.zipcodes.indexOf(parseInt(store[1]))]} key={index} id={index} position={{
          lat: store[0].lat,
          lng: store[0].lng}}/>

    })
  }

    componentWillMount(){
      this.getZipcodeCoords()
    }

    render() {
      return (
        <div>
          <Map
            google={this.props.google}
            zoom={4}
            onClick={this.onMapClicked}
            initialCenter={{ lat: 40, lng: -96}}
          >
            {this.displayMarkers()}
            <InfoWindow marker={this.state.activeMarker} onClose={this.onInfoWindowClose} visible={this.state.showingInfoWindow}>
               <div>
                 <h1>{this.state.selectedPlace.name}</h1>
               </div>
            </InfoWindow>
          </Map>
        </div>
      );
    }

}

export default GoogleApiWrapper({
  apiKey: `${process.env.REACT_APP_MAPS_KEY}`
})(MapDisplay);
