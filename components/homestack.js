import React, {useEffect, useState} from 'react';

import {
  View,
  Text,
  StyleSheet,
  Button,
  PermissionsAndroid,
  ScrollView,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import WifiReborn from 'react-native-wifi-reborn';

function Home({navigation, route}) {
  const [data, setData] = useState('');
  const [wifiList, setWifiList] = useState([]);
  const [currentSSID, setCurrentSSID] = useState('Not found');
  const [students, setStudents] = useState([]);
  const [loader, setLoader] = useState(true);
  const [loader2, setLoader2] = useState(false);
  const [wifiStatus, setWifiStatus] = useState(false);
  const [mark, setMark] = useState(false);

  const showToast = () => {
    ToastAndroid.show('Please! Select a Course', ToastAndroid.SHORT);
  };
  const showToast2 = () => {
    ToastAndroid.show('Please! Turn On Wifi', ToastAndroid.SHORT);
  };
  const AttendanceToast = () => {
    ToastAndroid.show('Attendance Taken !', ToastAndroid.LONG);
  };
  const AttendanceErrorToast = () => {
    ToastAndroid.show('Server Error... Please try Again!', ToastAndroid.SHORT);
  };

  useEffect(() => {
    navigation.addListener('focus', () => {
      setLoader(true);
      permission();
      getBackendData();
      getFaculty();
      checkWifi();
      if (route.params.value == null) {
        showToast();
        navigation.navigate('Create-Attendance');
      }
    });
  }, []);

  const [faculty, setFaculty] = useState('');
  const [code, setCode] = useState(0);

  async function checkWifi() {
    const check = await WifiReborn.isEnabled();
    if (check) {
      setWifiStatus(true);
      console.log('Wifi Enabled');
    } else {
      showToast2;
      console.log('Please ! Enable WiFi...');
    }
  }

  async function getFaculty() {
    const res = await fetch(
      'https://ruby-hippopotamus-veil.cyclic.app/getFaculty',
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

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
      const response = await fetch(
        'https://ruby-hippopotamus-veil.cyclic.app/test',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const jsonData = await response.json();
      setData('Backend Connected !'); // Assuming the response is JSON data
      setLoader(false);
      console.log(jsonData);
    } catch (error) {
      setData('Cannot connect to server !');
      console.error('Error fetching data:', error);
    }
  }

  function handleButton() {
    if (WifiReborn.isEnabled()) {
      getWifi();
    } else {
      showToast2();
    }
  }

  async function handleBackendButton() {
    setMark(false)
    setLoader2(true)
    const post_data = wifiList.map(a => a.SSID);
    console.log(post_data);

    const res = await fetch('https://ruby-hippopotamus-veil.cyclic.app/test2', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post_data),
    });

    const data = await res.json();
    setStudents(data.data);
    if (data.data.length != 0) setMark(true);
    console.log(data);
    setLoader2(false)
  }
  async function handleLogOut() {
    const res = await fetch(
      'https://ruby-hippopotamus-veil.cyclic.app/logout',
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const data = await res.json();
    console.log(data);
    if (data == 'Logged Out') navigation.navigate('Details');
  }

  async function handleMarkAttendance() {
    // console.log(students)
    setLoader(true);
    setMark(false);
    const post_data = [];
    for (let val of students) {
      post_data.push({id: val.Id});
    }

    const res = await fetch(
      'https://ruby-hippopotamus-veil.cyclic.app/markAttendance',
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({data: post_data, course: route.params.value}),
      },
    );

    const data = await res.json();
    console.log(data);
    if (data.code == 1) {
      AttendanceToast();
      setLoader(false);
      setMark(false);
    } else {
      AttendanceErrorToast();
      setMark(true);
      setLoader(false);
    }
  }

  return (
    <ScrollView>
      {loader ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <View style={styles.parent}>
          <View style={styles.inner}>
            <Text style={styles.text1}>Course : {route.params.value}</Text>
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
            {mark ? (
              <Button
                color={'green'}
                title="Mark Attendance"
                onPress={handleMarkAttendance}
              />
            ) : (
              <Text style={styles.text2}>{data}</Text>
            )}
          </View>
          <View style={styles.inner3}>
            <Text style={styles.text2}>Recieved Data :</Text>
            {loader2 ? (
              <ActivityIndicator size={'large'} />
            ) : (
              <View>
                {students.map((a, i) => (
                  <View key={i}>
                    <View style={styles.view3}>
                      <View>
                        <Text style={styles.text4}>{a.Name}</Text>
                      </View>
                      <View>
                        <Text style={styles.text5}>{a.Id}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loader: {
    display: 'flex',
    // backgroundColor:'yellow',
    flexDirection: 'column',
    flex: 1,
    height: 665,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  inner3: {
    // backgroundColor: 'yellow',
    display: 'flex',
    // minHeight: 380,
    // flexDirection:'row',
    // justifyContent: 'space-between',
    padding: 10,
    alignItems: 'left',
    // borderBottomWidth:1,
  },
  text: {
    fontSize: 25,
    margin: 10,
  },
  text1: {
    fontSize: 17,
    margin: 10,
    color: 'black',
    fontWeight: 'bold',
  },
  text2: {
    fontSize: 15,
    margin: 10,
    // color:'black'
  },
  text3: {
    fontSize: 16,
    // marginLeft: 15,
    color: 'red',
    // backgroundColor: 'yellow',
  },
  text4: {
    width: 200,
    fontSize: 16,
    // marginLeft: 15,
    color: 'green',
    // backgroundColor: 'yellow',
  },
  text5: {
    width: 200,
    fontSize: 16,
    marginLeft: 30,
    alignSelf: 'center',
    color: 'green',
    // backgroundColor: 'yellow',
  },
  view3: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    borderBottomWidth: 1,
  },
});

export default Home;
