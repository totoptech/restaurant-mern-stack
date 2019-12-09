/* global google */
import React from "react";
import {
  withGoogleMap,
  GoogleMap,
  withScriptjs,
  Marker,
  DirectionsRenderer
} from "react-google-maps";
import guest from '../../../../asset/guest.svg';
import restaurant from '../../../../asset/restaurant.png';

class MapDirectionsRenderer extends React.Component {
  state = {
    directions: null,
    error: null
  };

  componentDidMount() {
    const { places, travelMode } = this.props;
    
    const waypoints = places.map(p =>({
        location: {lat: p.lat, lng:p.lng},
        stopover: true,
    }))
    const origin = waypoints.shift().location;
    const destination = waypoints.pop().location;
    
    
    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: travelMode,
        waypoints: waypoints
      },
      (result, status) => {
        console.log(origin,destination);
        if (status === google.maps.DirectionsStatus.OK) {
          this.setState({
            directions: result
          });
        } else {
          this.setState({ error: result });
        }
      }
    );
  }

  render() {
    // if (this.state.error) {
    //   return <h1>{this.state.error}</h1>;
    // }
    console.log(this.state);
    
    const options = {
        suppressMarkers:true,
        polylineOptions:{
            strokeColor:'#00CABE',
            strokeWeight:'4.5'
        }
    };
    return (this.state.directions && <DirectionsRenderer options={options} directions={this.state.directions} />)
  }
}

const Map = withScriptjs(
  withGoogleMap(props => (
    <GoogleMap
      defaultCenter={props.defaultCenter}
      defaultZoom={props.defaultZoom}
      options={{
          disableDefaultUI: true
      }}
    >
      {props.markers.map((marker, index) => {
        var position;
        var lat = marker.lat - 0.000207;
        var lon = marker.lng - 0.000916;
        if(index === 0)
            position = { lat: lat, lng: lon };
        else
            position = { lat: marker.lat , lng: marker.lng };
        // console.log(position);
        if(index === 0)
            return <Marker key={index} position={position} icon = {{url: guest,
                }} />;
        if(index === 1)
            return <Marker key={index} position={position} icon = {{url: restaurant,
                }}/>;
      })}
      <MapDirectionsRenderer
        places={props.markers}
        travelMode={google.maps.TravelMode.DRIVING}
      />
    </GoogleMap>
  ))
);

export default Map;
