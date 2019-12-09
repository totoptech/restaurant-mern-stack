import React from "react";
import clsx from "clsx";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";

import styles from "./LocationSearchInput.css";

class LocationSearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
    };
  }

  handleChange = address => {
    this.setState({ address });
    this.props.onChange(address);
  };

  handleSelect = address => {
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]).then(location => ({results, location})))
      .then(({results, location}) => {
        if(results[0].address_components.length < 2) {
          return;
        }
        const last_obj = results[0].address_components[results[0].address_components.length - 1];
        const last_sec_obj = results[0].address_components[results[0].address_components.length - 2];
        var obj = {postalCode: ""};
        if (last_obj.types[0] == "postal_code") {
          obj = {
            postalCode: last_obj.short_name
          };
          results[0].address_components.pop();
        } else if (last_sec_obj.types[0] == "postal_code") {
          obj = {
            postalCode: last_sec_obj.short_name
          };
          results[0].address_components.pop();
          results[0].address_components.pop();
        }
        var seperate_address = {
          countryCode: "",
          state: "",
          city: "",
          streetLine1: "",
          streetLine2: "",
        };
        var temp = results[0].address_components.filter(addr => addr.types[0] === "administrative_area_level_1");
        if(temp.length == 1) {
          seperate_address.state = temp[0].short_name;
        }
        temp = results[0].address_components.filter(addr => addr.types[0] === "locality");
        if(temp.length == 1) {
          seperate_address.city = temp[0].long_name;
        }
        temp = results[0].address_components.filter(addr => addr.types[0] === "route");
        if(temp.length == 1) {
          seperate_address.streetLine1 = temp[0].long_name;
        }
        temp = results[0].address_components.filter(addr => addr.types[0] === "country");
        if(temp.length == 1) {
          seperate_address.countryCode = temp[0].short_name;
        }
        obj = {
          address,
          seperate_address: seperate_address,
          location,
          ...obj
        };
        this.props.onSelect(obj);
        this.setState({ address });
      })
      .catch(error => console.log("can't find place", error));
  };

  render() {
    const { className, value, required } = this.props;

    return (
      <PlacesAutocomplete
        value={value}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div style={{position: "relative"}}>
            <input
              {...getInputProps({
                placeholder: "Search Places ...",
                className: className,
              })}
              required={required}
            />
            <div className={styles["autocomplete-dropdown-container"]} style={{display: ((loading || suggestions.length > 0) ? "block" : "none")}}>
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? styles["suggestion-item--active"]
                  : styles["suggestion-item"];
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: "#fafafa", cursor: "pointer" }
                  : { backgroundColor: "#ffffff", cursor: "pointer" };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    );
  }
}

export default LocationSearchInput;
