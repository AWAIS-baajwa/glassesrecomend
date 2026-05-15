import {
  View,
  Text,
  StyleSheet,
  Alert,
  Image,
  PermissionsAndroid,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import FaceDetection from '@react-native-ml-kit/face-detection';

const Home = () => {
  const device = useCameraDevice('back');
  const camera = useRef(null);
  const [openCam, setOpenCam] = useState(false);
  const [photoUri, setPhotoUri] = useState('');
  const [faces, setFaces] = useState([]);
  const [imageLayout, setImageLayout] = useState({ width: 0, height: 0 });
  const [imageOriginalSize, setImageOriginalSize] = useState({
    width: 0,
    height: 0,
  });
  // Face Detection
  const detectFace = async uri => {
    try {
      const result = await FaceDetection.detect('file://' + uri, {
        performanceMode: 'accurate',
        landmarkMode: 'all',
        classificationMode: 'all',
      });
      if (result.length > 0) {
        setFaces(result);
      } else {
        console.log('No Face Detected');
      }
    } catch (error) {
      console.log('Error. ', error.message);
    }
  };
  const capturePhoto = async () => {
    try {
      if (camera.current !== null) {
        const photo = await camera.current.takePhoto();
        openCam === false ? setOpenCam(true) : setOpenCam(false);
        setPhotoUri(photo.path);
        detectFace(photo.path);
        Image.getSize('file://' + photo.path, (width, height) => {
          setImageOriginalSize({ width, height });
        });
      } else {
        Alert.alert('No Image');
      }
    } catch (error) {
      console.log('Error. ', error);
    }
  };
  const checkAndRequestCameraPermission = async () => {
    const status = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    if (status) {
      return true;
    } else if (!status) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      if (granted) {
        return true;
      } else {
      }
    }
  };
  useEffect(() => {
    checkAndRequestCameraPermission();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.mainContainer}>
        <View style={styles.cameraContainer}>
          {openCam ? (
            <Camera
              ref={camera}
              device={device}
              isActive={openCam}
              photo={true}
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          ) : (
            <View
              onLayout={e => {
                const { width, height } = e.nativeEvent.layout;
                setImageLayout({ width, height });
              }}
            >
              {photoUri && (
                <Image
                  source={{ uri: `file://${photoUri}` }}
                  width="100%"
                  height="100%"
                  resizeMode="cover"
                />
              )}
              {faces.map((face, index) => {
                return (
                  <View
                    key={index}
                    style={[
                      styles.faceBox,
                      {
                        top:
                          face.frame.top *
                          (imageLayout.height / imageOriginalSize.height),

                        left:
                          face.frame.left *
                          (imageLayout.width / imageOriginalSize.width),
                        width:
                          face.frame.width *
                          (imageLayout.width / imageOriginalSize.width),
                        height:
                          face.frame.height *
                          (imageLayout.height / imageOriginalSize.height),
                      },
                    ]}
                  />
                );
              })}
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.camera_button}
          onPress={() => {
            if (openCam) {
              capturePhoto();
              return;
            }
            openCam === false ? setOpenCam(true) : setOpenCam(false);
          }}
        >
          <Text>{openCam ? 'Close' : 'Capture'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  cameraContainer: {
    width: '100%',
    height: '100%',
    // flex: 1,
    overflow: 'hidden',
  },
  camera_button: {
    backgroundColor: 'skyblue',
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 50,
    borderRadius: 50,
  },
  button_text: {
    color: 'white',
  },
  faceBox: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#00FF00',
    borderStyle: 'dashed',
    borderRadius: 4,
    zIndex: 2,
  },
});
export default Home;
