import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingScreen from '../screens/public/LandingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ProductsScreen from '../screens/public/ProductsScreen';
import SupportScreen from '../screens/public/SupportScreen';
import SubscriptionsScreen from '../screens/public/SubscriptionsScreen';
import ProductDetailScreen from '../screens/public/ProductDetailScreen';
import WishlistScreen from '../screens/public/WishlistScreen';

export type AuthStackParamList = {
  Landing: undefined;
  Login: undefined;
  Register: undefined;
  Products: undefined;
  Support: undefined;
  Subscriptions: undefined;
  ProductDetail: { productId: string };
  Wishlist: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
    <Stack.Screen name="Landing" component={LandingScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="Products" component={ProductsScreen} />
    <Stack.Screen name="Support" component={SupportScreen} />
    <Stack.Screen name="Subscriptions" component={SubscriptionsScreen} />
    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    <Stack.Screen name="Wishlist" component={WishlistScreen} />
  </Stack.Navigator>
);

export default AuthNavigator;
