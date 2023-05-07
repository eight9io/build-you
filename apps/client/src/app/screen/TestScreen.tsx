import { View, Text } from 'react-native';

function InnerScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Inner</Text>
    </View>
  );
}

export default InnerScreen;
