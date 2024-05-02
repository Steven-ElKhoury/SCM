import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import logo from '../pictures/bicycle.png';

const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#FFFFFF',
      padding: 20,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    logo: {
      width: 50,
      height: 50,
    },
    header: {
      fontSize: 24,
      marginLeft: 150,
    },
    section: {
      padding: 10,
      marginBottom: 10,
    },
    subheader: {
      fontSize: 18,
      marginBottom: 5,
    },
    text: {
      fontSize: 14,
      marginBottom: 3,
    },
    price: {
        marginTop: 5,
        fontSize: 14,
        fontStyle: 'italic',
        textAlign: 'right',
      },
    totalPrice: {
        marginTop: 5,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'right',
      },
    lineItem: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 3,
    },
    lineLabel: {
        fontSize: 11,
        width: 180,  
        marginRight: 10,  
        textAlign: 'right',
    },
    lineValue: {
        fontSize: 11,
        width: 100,  
        textAlign: 'right',
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#f0f0f0',  
        borderTop: '2 solid #000',  
        borderBottom: '2 solid #000',
        paddingVertical: 5,  
        paddingHorizontal: 20,
    },
    valueRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 3,
        paddingHorizontal: 20,
    },
    detailItem: {
        flex: 1, 
    },
    detailLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'left',
    },
    detailValue: {
        fontSize: 12,
        textAlign: 'left',
    },
    footer: {
      position: 'absolute',
      bottom: 10,
      left: 20,
      right: 20,
      textAlign: 'center',
      fontSize: 12,
      borderTop: '1 solid #AAA',
      paddingTop: 5,
    },
    signatures: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,

      paddingTop: 5,
    },
    signature: {
      flex: 1,
      fontSize: 12,
      fontStyle: 'italic',
      marginTop: 90,
    },

    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#D3D3D3',  
        borderTop: '2 solid #000',  
        borderBottom: '2 solid #000',
        paddingVertical: 5,  
        paddingHorizontal: 20,
    },
    valueRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 270,
        paddingHorizontal: 20,
    },
    detailItem: {
        flex: 1, 
    },
    column: {
        width: '20%', 
        flexShrink: 1, 
        marginRight: 4, 
    },
    detailLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'left',
    },
    detailValue: {
        fontSize: 12,
        textAlign: 'left',
        wordWrap: 'break-word', 
        maxWidth: '100%', 
    },

});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US');
};

const calculateArrivalDate = (dateString) => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + 5);
  return formatDate(date.toISOString());
};

const PurchaseReceipt = ({ order }) => {
    const vatAmount = (parseFloat(order.total_price) * 0.11).toFixed(2);
    const totalAmount = ((parseFloat(order.total_price) + parseFloat(order.total_price) * 0.11) || 0).toFixed(2);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.headerRow}>
                    <Image style={styles.logo} src={logo} />
                    <Text style={styles.header}>Purchase Receipt</Text>
                </View>

                <View style={styles.lineItem}>
                        <Text style={styles.lineLabel}>Date Ordered: </Text>
                        <Text style={styles.lineValue}>{formatDate(order.date)}</Text>
                </View>
                <View style={styles.lineItem}>
                        <Text style={[styles.lineLabel,{marginBottom:20}]}>Estimated Arrival Date: </Text>
                        <Text style={styles.lineValue}>{calculateArrivalDate(order.date)}</Text>
                </View>

                <View style={styles.section}>
                    <View style={styles.labelRow}>
                        <View style={styles.column}><Text style={styles.detailLabel}>Order ID</Text></View>
                        <View style={styles.column}><Text style={styles.detailLabel}>Bike Model</Text></View>
                        <View style={styles.column}><Text style={styles.detailLabel}>Product Name</Text></View>
                        <View style={styles.column}><Text style={styles.detailLabel}>Product Type</Text></View>
                        <View style={styles.column}><Text style={styles.detailLabel}>Quantity</Text></View>
                    </View>
                    <View style={styles.valueRow}>
                        <View style={styles.column}><Text style={styles.detailValue}>#{order.cust_order_id}</Text></View>
                        <View style={styles.column}><Text style={styles.detailValue}>#{order.modelID}</Text></View>
                        <View style={styles.column}><Text style={styles.detailValue}>{order.name}</Text></View>
                        <View style={styles.column}><Text style={styles.detailValue}>{order.type}</Text></View>
                        <View style={styles.column}><Text style={styles.detailValue}>{order.quantity}</Text></View>
                    </View>



                    <View style={styles.lineItem}>
                        <Text style={[styles.lineLabel,{borderTop: '1 solid #AAA'}]}>Sub-Total:</Text>
                        <Text style={[styles.lineValue,{borderTop: '1 solid #AAA'}]}>${parseFloat(order.total_price).toFixed(2)}</Text>
                    </View>
                    <View style={styles.lineItem}>
                        <Text style={styles.lineLabel}>VAT (11%):</Text>
                        <Text style={styles.lineValue}>${vatAmount}</Text>
                    </View>
                    <View style={styles.lineItem}>
                        <Text style={styles.lineLabel}>Total:</Text>
                        <Text style={styles.lineValue}>${totalAmount}</Text>
                    </View>
                    </View>



                <View style={styles.signatures}>
                    <Text style={[styles.signature, { textAlign: 'left' }]}>Company Signature: _______________</Text>
                    <Text style={[styles.signature, { textAlign: 'right' }]}>Client Signature: _______________</Text>
                </View>
                <Text style={styles.footer}>Thank you for Ordering from us!</Text>
            </Page>
        </Document>
    );
};

export default PurchaseReceipt;