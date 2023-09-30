import * as React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import PayStackWebView, {
  TransactionSuccessResponse,
  CancelResponse,
} from 'react-native-paystack-webview-sdk';

// Note: For type support
type TPayStackWebViewRef = React.ElementRef<typeof PayStackWebView>;

export default function App() {
  const PayStackWebViewRef = React.useRef<TPayStackWebViewRef>(null);

  return (
    <View style={styles.container}>
      <PayStackWebView
        amount={300}
        customer={{
          email: 'info@gmail.com',
        }}
        publicKey="pk_test_4cda233b9729ce3fa014151bd1ad5b2f0d585ee5"
        ref={PayStackWebViewRef}
        onCancel={(data: CancelResponse) => {
          console.log(data);
        }}
        onSuccess={(data: TransactionSuccessResponse) => {
          console.log(data.data);
        }}
      />
      <Button
        onPress={() => {
          PayStackWebViewRef.current?.start();
        }}
        title={'Pay Now'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
