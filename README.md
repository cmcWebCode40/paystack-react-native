# paystack-react-native

Paystack React Native SDK enables easy integration of Paystack payments into your React Native applications.

[demo](https://www.loom.com/share/a368f65a0b2641b69e4fce1d74fcbbd8)

## Features

Paystack component used for accepting payment in your react native applications

- TypeScript to ensure type-safe code and better DX
- Support for Expo and React native CLI
- Flexible implement following [paystack docs](https://paystack.com/docs/payments/accept-payments/)

credits to the [React-Native-Paystack-WebView](https://github.com/just1and0/React-Native-Paystack-WebView) by [just1and0](https://github.com/just1and0) for inspiration.

## Installation

##### Npm

```sh
npm install paystack-react-native
```

##### Yarn

```sh
yarn  paystack-react-native
```

##### Expo

```sh
expo  install paystack-react-native
```

> **_Important_**: This package has a peer dependency `react-native-webview` which is requred for this package to work coorrectly

## Example 1

```js
import * as React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import PayStackWebView, {
  TransactionSuccessResponse,
  CancelResponse,
} from 'paystack-react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <PayStackWebView
        autoStart={true}
        amount={300}
        customer={{
          email: 'info@gmail.com',
        }}
        publicKey="pk_test_xxxxxx"
        channels={[
          'bank',
          'bank_transfer',
          'card',
          'mobile_money',
          'qr',
          'ussd',
        ]}
        ref={PayStackWebViewRef}
        onCancel={(data: CancelResponse) => {
          // handle cancel response
        }}
        onSuccess={(data: TransactionSuccessResponse) => {
          // handle success response
        }}
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
```

## Exmaple 2

#### Use with Ref to trigger using a button

```js
import * as React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import PayStackWebView, {
  TransactionSuccessResponse,
  CancelResponse,
} from 'paystack-react-native';

// Note: For typescript  support
type TPayStackWebViewRef = React.ElementRef<typeof PayStackWebView>;

export default function App() {
  const PayStackWebViewRef = React.useRef < TPayStackWebViewRef > null;

  return (
    <View style={styles.container}>
      <PayStackWebView
        amount={300}
        customer={{
          email: 'info@gmail.com',
        }}
        publicKey="pk_test_xxxxxx"
        ref={PayStackWebViewRef}
        onCancel={(data: CancelResponse) => {
          // handle cancel response
        }}
        onSuccess={(data: TransactionSuccessResponse) => {
          // handle success response
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
```

### Props

| Name           | Description                                                                                                                          | Required | Value                                   | type     |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------ | -------- | --------------------------------------- | -------- |
| publicKey      | Your public key from Paystack. Use test key for test mode and live key for live mode.                                                | yes      |                                         | string   |
| customer       | Customer information e.g email (Required) ,label, first name, last name                                                              | no       |                                         | object   |
| trnxRef        | Unique case sensitive transaction reference.<br>If you do not pass this parameter, Paystack will generate a unique reference for you | no       |                                         | string   |
| amount         | Amount in the subunit of the supported currency you are debiting the customer.<br>Do not pass this if creating subscriptions.        | no       |                                         | number   |
| channels       | An array of payment channels to control what channels you want to make available to the user to make a payment with.                 | no       | ['bank','card',<br>'bank_transfer'<br>] | Array[]  |
| autoStart      | to auto initialize transaction                                                                                                       | no       | fasle                                   | boolean  |
| indicatorColor | activitiy indicator color                                                                                                            | no       | #3bb75e                                 | string   |
| metaData       | Object containing any extra information you want recorded with the transaction.                                                      | no       |                                         | object   |
| currency       | On of the supported currency the charge should be performed in.<br>It defaults to your integration currency.                         | no       | NGN                                     | string   |
| subscriptions  | Plan code generated from creating a plan. This makes the payment become a subscription payment.                                      | no       |                                         | object   |
| onSuccess      | callback that triggers when webview close or cancels                                                                                 | yes      |                                         | Function |
| onCancel       | callback that triggers when webview close or cancels                                                                                 | yes      |                                         | Function |
| onWebMessage   | callback to handle web view message event                                                                                            | no       |                                         | Function |

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
