/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import type { Node } from 'react';
import {
  StyleSheet,
  Text,
  useColorScheme,
  View
} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import Details from './components/Details';

// ideally this would be in .env 
MapboxGL.setAccessToken('ADD_TOKEN_HERE')

const circle = {
  circleOpacity: 0.65,
  circleStrokeWidth: 2,
  circleStrokeOpacity: 0.85,
  circleRadius: [
    'interpolate',
    ['exponential', 1.5],
    ['zoom'],
    10, 3,
    15, 6,
    20, 9
  ]
};

const layerStyles = {
  rented: {
    ...circle,
    circleColor: 'red',
    circleStrokeColor: 'red',
  },
  notAvailable: {
    ...circle,
    circleColor: 'gray',
    circleStrokeColor: 'gray',
  },
  available: {
    ...circle,
    circleColor: 'lime',
    circleStrokeColor: 'lime',
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%"
  },
  errorView: {
    flex: 1, 
    height: "100%", 
    width: "100%"
  },
  map: {
    flex: 1
  }
})

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [selectedItem, setSelectedItem] = useState(null)
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [vehicles, setVehicles] = useState(null);
  
  useEffect(() => {
    fetch(`https://0e6e3ma6v0.execute-api.us-east-1.amazonaws.com/vehicles`)
      .then(res => res.json())
      .then(
        (result) => {
          setVehicles(result)
          setIsLoaded(true)
        },
        (error) => {
          console.error(error)
          setError(error)
          setIsLoaded(true)
        }
      )
  }, []);

  if (error) {
    return (
      <View style={ styles.errorView }>
        <Text>Uh, oh!</Text>
        <Text>
          We're having a problem getting in touch with our scooters!
          Please try again in a moment.
        </Text>
      </View>
    )
  }

  return (
    <View
      onPress={ () => { setSelectedItem(null) }}
      style={ styles.container }
    >
      {isLoaded &&
        <MapboxGL.MapView
          styleURL={ isDarkMode ? MapboxGL.StyleURL.Dark : MapboxGL.StyleURL.Streets }
          style={ styles.map }
          pitchEnabled={ false }
          zoomLevel={10}
          centerCoordinate={[-122.415, 37.752]}
        >
          <View style={{flex: 1}}>
            <MapboxGL.Camera
              zoomLevel={14}
              centerCoordinate={[-122.415, 37.752]}
            />
            <MapboxGL.ShapeSource
              id="shapes"
              shape={ vehicles }
              onPress={ (e) => {
                setSelectedItem(e.features[0])
              }}
            >
              <MapboxGL.CircleLayer
                id="circlesNotAvailable"
                sourceLayerID="shapes"
                aboveLayerId="shapes"
                style={ layerStyles.notAvailable }
                filter={['==', 'status', 'not_available']}
              />
              <MapboxGL.CircleLayer
                id="circlesRented"
                sourceLayerID="shapes"
                aboveLayerId="shapes"
                style={ layerStyles.rented }
                filter={['==', 'status', 'rented']}
              />
              <MapboxGL.CircleLayer
                id="circlesAvailable"
                sourceLayerID="shapes"
                aboveLayerId="shapes"
                style={ layerStyles.available }
                filter={['==', 'status', 'available']}
              />
            </MapboxGL.ShapeSource>
          </View>

          {selectedItem &&
            <Details
              item={ selectedItem }
            />
          }
        </MapboxGL.MapView>
      }
    </View>
  )
}

export default App;
