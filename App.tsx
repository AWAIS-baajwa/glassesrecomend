import { StyleSheet, PermissionsAndroid } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Home from './src/screen/Home/index.js';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    const handleCameraPermission = async () => {
      const status = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      // console.log(status);
      if (status) {
        // console.log('Permission already granted');
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED)
          console.log('Permission for Camera has been granted');
      }
    };

    handleCameraPermission();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <Home />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
