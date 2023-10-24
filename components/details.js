import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const DetailsScreen = ({navigation, route}) => {
  const [faculty, setFaculty] = useState('');
  const [status, setStatus] = useState('Log In');
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    navigation.addListener('focus', () => {
      setLoader(true)
      getFaculty();
    });
  }, []);

  async function getFaculty() {
    const res = await fetch('https://ruby-hippopotamus-veil.cyclic.app/getFaculty', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    if (data.code == 1) {
      navigation.navigate('Create-Attendance');
    }
    setFaculty(data.data);
    setLoginState('Login State : ' + data.message);
    setLoader(false);
  }

  const onPressLogin = async () => {
    // Do something about login operation
    setLoader(true)
    const state = {email, password: pass};
    console.log(state);

    const res = await fetch('https://ruby-hippopotamus-veil.cyclic.app/facultyLogin', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(state),
    });

    const data = await res.json();
    setLoginState(data.message);
    console.log(data);
    if (data.code == 1) navigation.navigate('Create-Attendance');
    if (data.code == 0) {
      setLoader(false)
      setStatus('Wrong Credentials...');
      setTimeout(() => {
        setStatus('Log In');
      }, 2000);
    }
  };
  const onPressForgotPassword = () => {
    // Do something about forgot password operation
  };
  const onPressSignUp = () => {
    // Do something about signup operation
  };

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const [LoginState, setLoginState] = useState('Login State : No info...');

  return loader ? (
    <View style={styles.loader}>
      <ActivityIndicator size="large" />
    </View>
  ) : (
    <View style={styles.container}>
      <Text style={styles.title}> Faculty Login</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Email"
          placeholderTextColor="#003f5c"
          onChangeText={text => setEmail(text)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Password"
          placeholderTextColor="#003f5c"
          onChangeText={text => setPass(text)}
        />
      </View>
      <TouchableOpacity onPress={onPressLogin} style={styles.loginBtn}>
        <Text style={styles.loginText}>{status}</Text>
      </TouchableOpacity>

    </View>
  );
};
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
  container: {
    flex: 1,
    // backgroundColor: '#4FD3DA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 50,
    // color: '#fb5b5a',
    marginBottom: 40,
  },
  title2: {
    fontWeight: 'bold',
    fontSize: 20,
    // color: '#fb5b5a',
    marginBottom: 40,
  },
  inputView: {
    width: '80%',
    backgroundColor: '#3AB4BA',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
  },
  inputText: {
    height: 50,
    color: 'white',
  },
  loginText:{
    color:'white',
    fontWeight:'bold'
  },
  forgotAndSignUpText: {
    // color: 'white',
    fontSize: 11,
  },
  loginBtn: {
    width: '60%',
    backgroundColor: '#fb5b5a',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
});
export default DetailsScreen;
