import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  Modal,
  View,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {
  WebView,
  WebViewNavigation,
  WebViewMessageEvent,
} from 'react-native-webview';
import { getAmountValueInKobo, PAYSTACK_CLOSE_URL } from './helpers';
import {
  AcceptPaymentChannels,
  CancelResponse,
  Customer,
  PaymentCurrency,
  Subscriptions,
  TransactionSuccessResponse,
} from './types';

interface PayStackWebViewProps {
  /**
   * Your public key from Paystack. Use test key for test mode and live key for live mode.
   */
  publicKey: string;

  /**
   * Customer information e.g email, first name, last name
   */
  customer: Customer;

  /**
   * Unique case sensitive transaction reference.
   * If you do not pass this parameter, Paystack will generate a unique reference for you
   */
  trnxRef?: string;

  /**
   * Amount in the subunit of the supported currency you are debiting customer.
   *  Do not pass this if creating subscriptions.
   */
  amount?: number;

  /**
   * An array of payment channels to control what channels you want to make available to the user to make a payment with.
   *
   */
  channels?: AcceptPaymentChannels[];

  /**
   * to auto initialize transaction
   */
  autoStart?: boolean;

  /**
   * callback that is triggered for succesful transaction
   *
   */
  onSuccess: (response: TransactionSuccessResponse) => void;

  /**
   * callback that triggers when webview close or cancels
   */
  onCancel: (response: CancelResponse) => void;

  /**
   * callback to handle web view message event
   */
  onWebMessage?: (data: string) => void;

  /**
   * activitiy indicator color
   * default : #3bb75e
   */
  indicatorColor?: string;

  /**
   * Object containing any extra information you want recorded with the transaction.
   */
  metaData?: object;

  /**
   * Plan code generated from creating a plan. This makes the payment become a subscription payment.
   */
  subscriptions?: Subscriptions;

  /**
   * 	On of the supported currency the charge should be performed in.
   *  It defaults to your integration currency.
   */
  currency?: PaymentCurrency;
}

type PayStackWebViewRefMethods = {
  start: () => void;
  end: () => void;
};

const PayStackWebView: React.ForwardRefRenderFunction<
  PayStackWebViewRefMethods,
  PayStackWebViewProps
> = (
  {
    trnxRef,
    channels = ['bank', 'card', 'bank_transfer'],
    publicKey,
    amount,
    autoStart,
    currency = 'NGN',
    customer,
    indicatorColor = '#3bb75e',
    metaData,
    onCancel,
    onSuccess,
    subscriptions,
    onWebMessage,
  },
  ref
) => {
  const [isLoading, setIsLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const webViewRef = useRef(null);

  useEffect(() => {
    if (autoStart) {
      setOpenModal(true);
    }

    if (subscriptions?.plan && amount) {
      throw new Error(`Paystack Error: Do not pass the amount if you already provided subscription plan see docs https://paystack.com/docs/payments/accept-payments/
        `);
    }
  }, [autoStart, amount, subscriptions?.plan]);

  useImperativeHandle(ref, () => ({
    start() {
      setOpenModal(true);
    },
    end() {
      setOpenModal(false);
    },
  }));

  const plan = subscriptions?.plan ? `plan : '${subscriptions.plan}',` : '';
  const quantity = subscriptions?.quantity
    ? `quantity : '${subscriptions.quantity}',`
    : '';
  const paymentChannels = channels
    ? `channels : ${JSON.stringify(channels)},`
    : '';
  const paymentReference = trnxRef ? `ref: '${trnxRef}',` : '';
  const metadata = metaData ? `metadata: ${JSON.stringify(metaData)},` : '';
  const firstName = customer.firstName
    ? `firstname:'${customer.firstName}',`
    : '';
  const lastName = customer.lastName ? `lastName:'${customer.lastName}',` : '';

  const amountInKobo = amount ? `amount: ${getAmountValueInKobo(amount)},` : '';

  const amountCurrency = currency ? `currency:'${currency}',` : '';

  const Paystackcontent = `   
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Paystack</title>
    </head>
      <body  onload="payWithPaystack()" style="background-color:#fff;height:100vh">
        <script src="https://js.paystack.co/v2/inline.js"></script>
        <script type="text/javascript">
          window.onload = payWithPaystack;
          function payWithPaystack(){
          const paystack = new PaystackPop();
          var handler =  paystack.newTransaction({ 
            key: '${publicKey}',
            email: '${customer.email}',
            ${amountInKobo}
            ${plan}
            ${metadata}
            ${firstName}
            ${lastName}
            ${quantity}
            ${amountCurrency}
            ${paymentChannels}
            ${paymentReference}
            onSuccess: (response) => {
                  var resp = {event:'successful', transaction:response};
                  window.ReactNativeWebView.postMessage(JSON.stringify(resp))
            },
            onCancel: () => {
                var resp = {event:'cancelled'};
                window.ReactNativeWebView.postMessage(JSON.stringify(resp))
            }
            });
            }
        </script> 
      </body>
  </html> 
  `;

  console.log(Paystackcontent);

  const onMessageHandler = (event: WebViewMessageEvent) => {
    const data = event.nativeEvent?.data;
    const webResponse = JSON.parse(data);

    if (onWebMessage) {
      onWebMessage(data);
    }
    switch (webResponse.event) {
      case 'cancelled':
        setOpenModal(false);
        onCancel({ status: 'cancelled' });
        break;

      case 'successful':
        setOpenModal(false);
        if (onSuccess) {
          onSuccess({
            status: 'success',
            data: webResponse.transaction,
            transactionRef: webResponse?.transaction?.reference,
          });
        }
        break;

      default:
        if (onWebMessage) {
          onWebMessage(data);
        }
        break;
    }
  };

  const handleNavigationStateChange = (state: WebViewNavigation) => {
    const { url } = state;
    if (url === PAYSTACK_CLOSE_URL) {
      setOpenModal(false);
    }
  };

  return (
    <Modal
      style={style.flex}
      visible={openModal}
      animationType="slide"
      transparent={false}
    >
      <SafeAreaView style={style.flex}>
        <WebView
          ref={webViewRef}
          cacheEnabled={false}
          style={[style.flex]}
          cacheMode={'LOAD_NO_CACHE'}
          onMessage={onMessageHandler}
          source={{ html: Paystackcontent }}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          onNavigationStateChange={handleNavigationStateChange}
        />
        {isLoading && (
          <View style={style.loaderContainer}>
            <ActivityIndicator color={indicatorColor} />
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

export default forwardRef(PayStackWebView);

const style = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {
    flex: 1,
  },
});
