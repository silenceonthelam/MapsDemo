import React from 'react';
import type { Node } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const styles = StyleSheet.create({
  details: {
    backgroundColor: "#f7f7f7",
    height: "30%",
    justifyContent: 'space-around',
    marginBottom: 80,
    padding: 20,
    paddingTop: 60
  },
  img: {
    height: 30,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  statusRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  status: {
    fontSize: 24
  }
});

const Details = ({ item }) => {

  const statusLookup = {
    'available': {
      displayStatus: 'Available',
      backgroundColor: 'lime'
    },
    'not_available': {
      displayStatus: 'Not Available',
      backgroundColor: 'gray'
    },
    'rented': {
      displayStatus: 'Rented',
      backgroundColor: 'red'
    }
  };

  return (
    <TouchableOpacity style={ styles.details }>
      <Image 
        source={ require('../img/scooter.png') }
        style={ styles.img }
      />
      <View style={ styles.statusRow }>
        <Text style={ styles.status }>
          Status:
        </Text>
          <View
            style={{
              backgroundColor: statusLookup[item.properties.status].backgroundColor, borderRadius: 15,
              height: 20,
              marginHorizontal: 5,
              width: 20
            }}
          ></View>
        <Text style={ styles.status }>
          { statusLookup[item.properties.status].displayStatus }
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default Details;