import React, {useEffect, useState} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';

import {
  View,
  Text,
  StyleSheet,
  Button,
  PermissionsAndroid,
  ScrollView,
} from 'react-native';

function CreateAttendance({navigation}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([{label: 'Loading...', value: null}]);

  useEffect(() => {
    getItems();
  }, []);

  async function getItems() {
    const data = await fetch('http://192.168.80.110:5000/getCourseId', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const res = await data.json();
    console.log(res);
    setItems(res);
  }

  return (
    <View style={styles.parent}>
      <View style={styles.inner}>
        <Text style={styles.text}>Select Course : </Text>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
        />
        <View style={styles.button}>
          <Button
            title="Create Attendance"
            onPress={() => navigation.navigate('Home', {value})}></Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  parent: {
    display: 'flex',
    flex: 1,
  },
  inner: {
    display: 'flex',
    margin: 20,
    flex: 1,
  },
  text: {
    color: 'black',
    margin: 10,
  },
  button: {
    margin: 10,
  },
});

export default CreateAttendance;
