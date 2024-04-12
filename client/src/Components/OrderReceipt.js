import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import logo from '../pictures/bicycle.png';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: '10pt',
  },
   image: {
    width: '50pt',
    height: '50pt',
    objectFit: 'contain',
  },
  section: {
    margin: '10pt',
    padding: '10pt',
  },
  header: {
    fontSize: '24pt', // Adjust as needed
    textAlign: 'center',
    marginBottom: '10pt',
  },
  subheader: {
    fontSize: '18pt', // Adjust as needed
    marginBottom: '5pt',
  },
  text: {
    fontSize: '14pt', // Adjust as needed
    marginBottom: '5pt',
  },
  price: {
    fontSize: '18pt', // Adjust as needed
    position: 'absolute',
    right: '10pt',
    bottom: '200pt',
  },
});
  
  // Create Document Component
  const OrderReceipt = ({ order }) => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.header}>Order Receipt</Text>
          <Text style={styles.subheader}>Order ID: {order.order_id}</Text>
          <Text style={styles.text}>Supplier Name: {order.supplier_name}</Text>
          <Text style={styles.text}>Component Type: {order.component_type}</Text>
          <Text style={styles.text}>Quantity: {order.quantity}</Text>
          <Text style={styles.text}>Date Ordered: {order.date_ordered}</Text>
          <Text style={styles.text}>Date Arrived: {order.date_arrived}</Text>
          <Text style={styles.text}>Lead Time: {order.lead_time} days</Text>
        </View>
        <Text style={styles.price}>Price: ${order.price}</Text>
      </Page>
    </Document>
  );
  
  export default OrderReceipt;