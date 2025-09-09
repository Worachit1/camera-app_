import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
//import for camera permission
import { CameraView, useCameraPermissions } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import * as MediaLibrary from "expo-media-library";

export default function App() {
  //Permission
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [hasMediaLibraryPermission, requestMediaLibraryPermission] = useState<
    boolean | null
  >(false);
  const [image, setImage] = useState<string | null>(null);
  //camera reference
  const cameraRef = useRef<CameraView | null>(null);
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [flashMode, setFlashMode] = useState<'off' | 'on'>('off');

  useEffect(() => {
    const requestPermission = async () => {
      const mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync();
      requestMediaLibraryPermission(mediaLibraryStatus.status === "granted");
    };
    requestPermission();
  }, []);

  if (!cameraPermission) {
    //Camera permission is still loading
    return (
      <View>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!hasMediaLibraryPermission) {
    return (
      <View>
        <Text>Requesting media library permission...</Text>
      </View>
    );
  }

  if (image) {
    // Have image then show it
    return (
      <View style={styles.container}>
        <View style={styles.previewContainer}>
          <Image source={{ uri: image }} style={styles.previewImage} />
            <View style={styles.buttonRowPreview}>
              <TouchableOpacity style={[styles.iconButton, styles.shutterButton]} onPress={() => setImage(null)}>
                <Text style={styles.icon}>🔄</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.iconButton, styles.saveButton, styles.shutterButton]}
              onPress={async () => {
                if (image) {
                  await MediaLibrary.saveToLibraryAsync(image);
                  setImage(null);
                }
              }}
            >
                <Text style={styles.icon}>💾</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  const handleTakePicture = async () => {
    if (cameraRef.current) {
      try {
        const options = { quality: 1, base64: true, exif: false };
        const newPhoto = await cameraRef.current.takePictureAsync(options);
        setImage(newPhoto.uri);
      } catch (err) {
        console.error(err);
      }
    }
  };

  //no image then show button to take image
  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          flash={flashMode}
        />
        <View style={styles.buttonBarCamera}>
          <TouchableOpacity
            style={[styles.iconButton, styles.sideButton, styles.flashButton, flashMode === 'on' && styles.flashButtonActive]}
            onPress={() => setFlashMode(flashMode === 'off' ? 'on' : 'off')}
          >
            <Text style={styles.icon}>{flashMode === 'on' ? '⚡' : '❌'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconButton, styles.shutterButton]} onPress={handleTakePicture}>
            <Text style={styles.icon}>📸</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, styles.sideButton, styles.switchButton]}
            onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
          >
            <Text style={styles.icon}>🔄</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraContainer: {
    flex: 1,
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    overflow: "hidden",
    marginVertical: 24,
    backgroundColor: "#222f3e",
    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
  },
  camera: {
    flex: 1,
    width: "100%",
    aspectRatio: 3/4,
    borderRadius: 24,
    backgroundColor: "#000",
  },
  buttonBarCamera: {
    position: "absolute",
    bottom: 32,
    left: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 32,
    zIndex: 10,
  },
  shutterButton: {
    backgroundColor: "#fff",
    borderColor: "#2196F3",
    borderWidth: 4,
    width: 80,
    height: 80,
    borderRadius: 40,
    marginHorizontal: 0,
    marginBottom: 0,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#2196F3",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  sideButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginHorizontal: 0,
    backgroundColor: "#2196F3",
    borderWidth: 2,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 2,
  },
  // button: {
  //   ... (ลบ style ที่ไม่ได้ใช้) ...
  // },
  iconButton: {
    backgroundColor: "#2196F3",
    width: 64,
    height: 64,
    borderRadius: 32,
    marginHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 3,
    borderWidth: 2,
    borderColor: "#fff",
  },
  saveButton: {
    backgroundColor: "#4cd137",
    borderColor: "#fff",
    borderWidth: 4,
  },
  buttonRowPreview: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    gap: 32,
  },
  icon: {
    fontSize: 34,
    color: "#fff",
    textAlign: "center",
    textShadowColor: "#000",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  switchButton: {
    backgroundColor: "#fbc531",
  },
  flashButton: {
    backgroundColor: "#353b48",
  },
  flashButtonActive: {
    backgroundColor: "#e84118",
  },
  previewContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  previewImage: {
    width: 320,
    height: 420,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#2196F3",
    backgroundColor: "#eee",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
