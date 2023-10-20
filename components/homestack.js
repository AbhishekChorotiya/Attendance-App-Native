import React, {useEffect, useState} from 'react';

import {View, Text, StyleSheet, Button, PermissionsAndroid,ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import WifiReborn from 'react-native-wifi-reborn';

function Home({navigation}) {
  const [data, setData] = useState('');
  const [wifiList, setWifiList] = useState([]);
  const [currentSSID, setCurrentSSID] = useState('Not found');
  const [students, setStudents] = useState([]);

  useEffect(() => {
    permission();
    getBackendData();
  }, []);

  const getWifi = () => {
    WifiReborn.getCurrentWifiSSID().then(
      ssid => {
        console.log('your current connected wifi SSID is ' + ssid);
        setCurrentSSID(ssid);
      },
      () => {
        console.log('cannot get current SSID!');
      },
    );
    WifiReborn.loadWifiList().then(List => {
      console.log(List);
      setWifiList(List);
    });
  };

  const permission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location permission is required for wifi connections',
        message:
          'This app needs location permissin as this is required ' +
          'to scan for wifi networks',
        buttonNegative: 'DENY',
        buttonPositive: 'ALLOW',
      },
    );
    if (granted == PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Granted');
    } else {
      console.log('not granted');
    }
  };

  async function getBackendData() {
    try {
      const response = await fetch('http://192.168.80.110:5000/test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const jsonData = await response.json();
      setData(jsonData); // Assuming the response is JSON data
      console.log(jsonData);
    } catch (error) {
      setData('Cannot connect to server !');
      console.error('Error fetching data:', error);
    }
  }

  function handleButton() {
    getWifi();
  }

  async function handleBackendButton() {
    const post_data = wifiList.map(a => a.SSID);
    console.log(post_data);

    const res = await fetch('http://192.168.80.110:5000/test2', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post_data),
    });

    const data = await res.json();
    setStudents(data.data);
    console.log(data);
  }
  async function handleLogOut() {

    const res = await fetch('http://192.168.80.110:5000/logout', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    console.log(data);
    if(data=="Logged Out") navigation.navigate('Details')
  }

  return (
    <ScrollView>
    <View style={styles.parent}>
      <View style={styles.inner}>
        <Text style={styles.text}>ATTENDANCE APP</Text>
      </View>
      <View style={styles.inner}>
        <Button title="Get Wifi Data" onPress={handleButton} />
        <Text>{''}</Text>
        <Button title="Logout" onPress={handleLogOut} />
      </View>
      <View style={styles.inner}>
        <Button
          title="Faculty Login"
          onPress={() => navigation.navigate('Details')}
        />
        <Text style={styles.text2}>{''}</Text>
        <Text style={styles.text2}>{data}</Text>
        <Text style={styles.text2}>{currentSSID}</Text>
      </View>
      <View style={styles.inner2}>
        {wifiList.map((a, i) => (
          <Text key={i} style={styles.text3}>
            {a.SSID}
          </Text>
        ))}
      </View>
      <Button title="Filter Students" onPress={handleBackendButton} />
      <View style={styles.inner2}>
        <Text style={styles.text2}>Recieved Data</Text>

        {students.map((a, i) => (
          <Text key={i} style={styles.text3}>
            {a.Name + " " + a.Id}
          </Text>
        ))}
      </View>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    // backgroundColor:'wheat',
    overflow:'scroll'
  },
  inner: {
    // backgroundColor:'yellow',
    display: 'flex',
    alignItems: 'center',
    // borderBottomWidth:1,
    marginBottom: 50,
  },
  inner2: {
    // backgroundColor:'red',
    display: 'flex',
    alignItems: 'left',
    // borderBottomWidth:1,
    marginBottom: 50,
  },
  text: {
    fontSize: 25,
    margin: 10,
  },
  text2: {
    fontSize: 15,
    margin: 10,
  },
  text3: {
    fontSize: 16,
    marginLeft: 15,
    color: 'red',
    // backgroundColor: 'yellow',
  },
});

export default Home;
