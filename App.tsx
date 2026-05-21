import { StyleSheet, PermissionsAndroid } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Home from './src/screen/Home/index.js';
import Onboarding from './src/screen/Onboarding/index.js';
import { useEffect, useState } from 'react';

function App() {
  const [showOnboarding, setShowOnboarding] = useState(true);
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

  if (showOnboarding)
    return <Onboarding onFinish={() => setShowOnboarding(false)} />;
  return (
    <SafeAreaView style={styles.container}>
      <Home />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});

export default App;
