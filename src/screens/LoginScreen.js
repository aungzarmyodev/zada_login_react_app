import React, { useEffect, useState } from 'react';
import base64 from 'react-native-base64';
import { View, Text, Linking, ActivityIndicator, Button, Alert } from 'react-native';

const baseUrl = 'https://test.zadanetwork.com/api'; 
const tenantId = '318a987a-8408-4f5e-93c0-5644fd4c9hf5';
const tenantPassword = '!hosFS8xAmgh@b!%';

const LoginScreen = () => {
  const [loading, setLoading] = useState(true);
  const [policyId, setPolicyId] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const authToken = await authenticate();
      setToken(authToken);

      if (authToken) {
        const fetchedPolicyId = await getPolicies(authToken);
        setPolicyId(fetchedPolicyId);
      }

      setLoading(false);
    };

    init();
  }, []);

  const authenticate = async () => {
    try {
      const response = await fetch(`${baseUrl}/authenticate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId, secretPhrase: tenantPassword }),
      });

      if (response.status === 200) {
        const json = await response.json();

        if (json.success === true && json.token) {
          return json.token;
        } else {
          Alert.alert('Error', 'Authentication succeeded but no token found.');
          return null;
        }
      } else {
        const errorText = await response.text();
        Alert.alert('Error', `Authentication failed: ${errorText}`);
        return null;
      }
    } catch (e) {
      Alert.alert('Error', 'Network error during authentication.');
      return null;
    }
  };

  const getPolicies = async (token) => {
    try {
      const response = await fetch(`${baseUrl}/policy/get_all_policies`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const json = await response.json();
        if (json.success === true && json.policies?.length > 0) {
          return json.policies[0].policyId;
        } else {
          Alert.alert('Error', 'No policies found.');
          return null;
        }
      } else {
        const errorText = await response.text();
        Alert.alert('Error', `Failed to fetch policies: ${errorText}`);
        return null;
      }
    } catch (e) {
      Alert.alert('Error', 'Network error during fetching policies.');
      return null;
    }
  };

  const handleLogin = () => {
  if (policyId && token) {
    const data = {
      type: 'connectionless-verification',
      metadata: { policyId, tenantId },
      rcb: 'redirectUrl',
      wcb: 'webhookUrl',
    };

    const jsonString = JSON.stringify(data);
    const base64String = base64.encode(jsonString);  
    const deepLink = `zada://network/connectionless-verification?data=${base64String}`;

    // Open deep link
    Linking.openURL(deepLink).catch(() => {
      Alert.alert('Error', 'Could not launch Zada app.');
    });
  }
};

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
         <Text style={{ marginBottom: 12, fontSize: 16 }}>
            Would you like to open Zada Wallet.
         </Text>
         <Button title="Login with Zada" onPress={handleLogin} />
        </>
      )}
    </View>
  );
};

export default LoginScreen;
