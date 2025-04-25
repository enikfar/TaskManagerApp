import React from 'react';
import { 
  TouchableWithoutFeedback, 
  Keyboard, 
  View, 
  StyleSheet, 
  ViewProps 
} from 'react-native';

interface KeyboardDismissViewProps extends ViewProps {
  children: React.ReactNode;
}

const KeyboardDismissView: React.FC<KeyboardDismissViewProps> = ({ 
  children, 
  style, 
  ...rest 
}) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={[styles.container, style]} {...rest}>
        {children}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default KeyboardDismissView; 