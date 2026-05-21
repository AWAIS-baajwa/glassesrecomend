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
import RNFS from 'react-native-fs';
import CustomModal from '../../components/CustomModel.jsx';
import ImageScanner from '../../components/ImageScanner.jsx';
import FaceResultModal from '../../components/FaceResultModel';
import UiAnimation from '../../components/Animation.jsx';
import { API_URL } from '@env';
import CusActivityIndicator from '../../components/CusActivityIndicator';

const prompt = `
      Analyze this person's face structure. 
      Identify their face shape (choose strictly from: OVAL, ROUND, SQUARE, HEART, DIAMOND).
      Provide a brief 1-sentence reason why you chose this shape.
      Provide a list of 3-4 specific styles of glasses/frames that match this face shape perfectly.
      
      You must respond ONLY with a raw JSON object matching this schema. Do not write any markdown blocks like \`\`\`json or regular text.
      {
        "faceShape": "ROUND",
        "reason": "The face has a soft jawline and roughly equal width and height dimensions.",
        "recommendedFrames": ["Square", "Rectangular", "Wayfarer"]
      }
    `;
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
  const [warning, setWarning] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalDescription, setModalDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setloading] = useState(false);

  // Face Detection
  const detectFace = async uri => {
    if (!uri) {
      setIsProcessing(false);
      return;
    }
    const path = 'file://' + uri;
    try {
      const result = await FaceDetection.detect(path, {
        performanceMode: 'accurate',
        landmarkMode: 'all',
        classificationMode: 'all',
      });
      // wait for 3 seconds
      await new Promise(resolve => setTimeout(resolve, 2500));

      if (result.length == 0) {
        console.log('no face detedcted');
        setModalTitle('No Face Detected');
        setModalDescription(
          'To calculate your exact face shape and recommend perfectly fitting eye wear frames, we need only one person in the picture.',
        );
        setIsProcessing(false);
        setWarning(true);
        return;
      }

      if (result && result.length > 1) {
        setIsProcessing(false);
        setModalTitle('Multiple Faces Detected');
        setModalDescription(
          'To calculate your exact face shape and recommend perfectly fitting eye wear frames, we need only one person in the picture.',
        );
        setWarning(true);
        setFaces([]);
        return;
      }

      if (result && result.length == 1) {
        setFaces(result);
        setIsProcessing(false);
        await analyzeFaceWithAi(path);
      }
    } catch (error) {
      console.log('Error. in detect face function ', error, error.message);
    }
  };
  // Capture Image
  const capturePhoto = async () => {
    try {
      if (camera.current !== null) {
        const photo = await camera.current.takePhoto();
        openCam === false ? setOpenCam(true) : setOpenCam(false);
        setOpenCam(false);
        setPhotoUri(photo.path);
        setIsProcessing(true);
        Image.getSize('file://' + photo.path, (width, height) => {
          setImageOriginalSize({ width, height });
        });
        // await analyzeFaceWithAi('file://' + photo.path);
        detectFace(photo.path);
      } else {
        Alert.alert('No Image');
      }
    } catch (error) {
      console.log('Error. in capture photo function ', error, error.message);
    }
  };
  // Camera Permission
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

  // Analyze face with AI
  const analyzeFaceWithAi = async url => {
    setloading(true);
    try {
      console.log('Url.    ', url);
      const base64Image = await RNFS.readFile(url, 'base64');
      const payload = {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: base64Image,
                },
              },
            ],
          },
        ],
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      console.log('Response ', response);
      const data = await response.json();
      console.log('Data ', data);
      const text = data.candidates[0].content.parts[0].text;
      console.log('Raw Text   ', text);

      const cleanJsonString = text
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      const faceAnalysisData = JSON.parse(cleanJsonString);

      console.log('Face Shape:', faceAnalysisData.faceShape);
      console.log('Recommended Frames:', faceAnalysisData.recommendedFrames);
      setAiResult(faceAnalysisData);
      setShowResult(true);
      console.log('Data. ', faceAnalysisData);
      setloading(false);
    } catch (error) {
      console.log(
        'Error in analyzeFaceWithAi function   ',
        error,
        error.message,
      );
      setloading(false);
    } finally {
      setloading(false);
    }
  };
  // for back button
  const goHome = () => {
    setOpenCam(false);
    setPhotoUri('');
    setFaces([]);
    setIsProcessing(false);
    setAiResult(null);
    setShowResult(false);
    setWarning(false);
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FaceResultModal
        isVisible={showResult}
        onClose={() => setShowResult(false)}
        aiResult={aiResult}
      />
      {!photoUri && !openCam && (
        <UiAnimation onPress={() => setOpenCam(true)} />
      )}

      {(openCam || photoUri) && (
        <View style={styles.mainContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => goHome()}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
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
                // style={{ width: '100%', height: '100%' }}
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
                {/* scanning */}
                {isProcessing && photoUri && (
                  <ImageScanner imageUri={`file://${photoUri}`} />
                )}
                {!isProcessing &&
                  faces.map((face, index) => {
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
          {/* Activity Indicator */}
          <CusActivityIndicator Loading={loading} />
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
            <Text>{openCam ? 'Photo' : 'Photo'}</Text>
          </TouchableOpacity>
        </View>
      )}
      <CustomModal
        isVisible={warning}
        onClose={() => setWarning(false)}
        title={modalTitle}
        description={modalDescription}
      />
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
    backgroundColor: '#1E88E5',
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 50,
    borderRadius: 50,
    zIndex: 10,
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
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  backButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  analyzingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 30,
  },
  analyzingBox: {
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 40,
    alignItems: 'center',
    gap: 12,
  },
  analyzingText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E88E5',
    marginTop: 12,
  },
  analyzingSubText: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
  },
});
export default Home;
