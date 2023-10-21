import React, {useEffect, useState} from 'react';

import {
  View,
  Text,
  StyleSheet,
  Button,
  PermissionsAndroid,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import WifiReborn from 'react-native-wifi-reborn';

function Home({navigation,route}) {
  const [data, setData] = useState('');
  const [wifiList, setWifiList] = useState([]);
  const [currentSSID, setCurrentSSID] = useState('Not found');
  const [students, setStudents] = useState([]);

  useEffect(() => {
    permission();
    getBackendData();
    getFaculty();
  }, []);

  const [faculty, setFaculty] = useState('');
  const [code, setCode] = useState(0);

  async function getFaculty() {
    const res = await fetch('http://192.168.80.110:5000/getFaculty', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    if (data.code == 1) setCode(1);
    setFaculty(data.data);
  }

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
      setData('Backend Connected !'); // Assuming the response is JSON data
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
    if (data == 'Logged Out') navigation.navigate('Details');
  }

  return (
    <ScrollView>
      <View style={styles.parent}>
        <View style={styles.inner}>
          <Text style={styles.text2}>{route.params.value}</Text>
          {code ? (
            <Button title="Logout" onPress={handleLogOut} />
          ) : (
            <Button
              title="Faculty Login"
              onPress={() => navigation.navigate('Details')}
            />
          )}
        </View>
        <View style={styles.inner}>
          <Button title="Get Wifi Data" onPress={handleButton} />
        </View>
        <View style={styles.inner}>
          <Text style={styles.text2}>Available WiFi List :</Text>
          <View style={styles.inner2}>
            {wifiList.map((a, i) => (
              <Text key={i} style={styles.text3}>
                {a.SSID}
              </Text>
            ))}
          </View>
        </View>
        <View style={styles.inner}>
          <Button title="Filter Students" onPress={handleBackendButton} />
          <Text style={styles.text2}>{data}</Text>
        </View>
        <View style={styles.inner2}>
          <Text style={styles.text2}>Recieved Data :</Text>

          {students.map((a, i) => (
            <View key={i}>
              <View style={styles.view3}>
                <Text style={styles.text4}>{a.Name}</Text>
                <Text style={styles.text4}>{a.Id}</Text>
              </View>
            </View>
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
    overflow: 'scroll',
  },
  inner: {
    // backgroundColor: 'yellow',
    // margin:10,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
  },
  inner2: {
    // backgroundColor:'yellow',
    display: 'flex',
    // flexDirection:'row',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'left',
    // borderBottomWidth:1,
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
    // marginLeft: 15,
    color: 'red',
    // backgroundColor: 'yellow',
  },
  text4: {
    fontSize: 16,
    // marginLeft: 15,
    color: 'green',
    // backgroundColor: 'yellow',
  },
  view3: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default Home;
