import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Welcome Home! 🎉
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,              // Take full screen height
    justifyContent: 'center', // Vertically center
    alignItems: 'center',     // Horizontally center
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
