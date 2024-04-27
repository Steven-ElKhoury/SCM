import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table,Typography, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField } from '@mui/material';
import { styled } from '@mui/system';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';



const StyledTable = styled(Table)({
    minWidth: 650,
});

const Title = styled(Typography)({
    margin: '20px 0',
});



function Orders() {
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');


    useEffect(() => {
        axios.get('http://localhost:3001/getOrders')
            .then(response => {
                setOrders(response.data);
            })
            .catch(error => {
                console.error('Error fetching orders:', error);
            });
    }, []);

    function handleStatusChange(orderId, newStatus) {
        axios.put(`http://localhost:3001/orders/${orderId}`, { status: newStatus })
            .then(response => {
                setOrders(orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
            })
            .catch(error => {
                console.error('Error updating order status:', error);
            });
    }

    const SortableTableCell = styled(TableCell)({
        cursor: 'pointer',
        '&:hover': {
            color: 'blue',
        },
    })

    const filteredOrders = orders.filter(order => 
        order.component_type && order.component_type.toLowerCase().includes(search.toLowerCase()) ||
        order.supplier_name && order.supplier_name.toLowerCase().includes(search.toLowerCase())
    ); 

    const sortedAndFilteredOrders = [...filteredOrders].sort((a, b) => {
        if (a[sortField] < b[sortField]) {
            return sortDirection === 'asc' ? -1 : 1;
        }
        if (a[sortField] > b[sortField]) {
            return sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
    });
   
    return (
        <div>
            <Title variant="h4">Orders</Title>  
            <TableContainer style= {{overflow:'visible'}} component={Paper}>
            <TextField label="Search" variant="outlined" value={search} onChange={e => setSearch(e.target.value)} />
            <StyledTable>
                <Table>
                <TableHead>
    <TableRow>
        <SortableTableCell onClick={() => { setSortField('order_id'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); }}>
            Order ID {sortField === 'order_id' && (sortDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
        </SortableTableCell>
        <SortableTableCell onClick={() => { setSortField('component_type'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); }}>
            Component {sortField === 'component_type' && (sortDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
        </SortableTableCell>
        <SortableTableCell onClick={() => { setSortField('supplier_name'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); }}>
            Supplier {sortField === 'supplier_name' && (sortDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
        </SortableTableCell>
        <SortableTableCell onClick={() => { setSortField('quantity'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); }}>
            Quantity {sortField === 'quantity' && (sortDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
        </SortableTableCell>
        <SortableTableCell onClick={() => { setSortField('date_ordered'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); }}>
            Date Ordered {sortField === 'date_ordered' && (sortDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
        </SortableTableCell>
        <SortableTableCell onClick={() => { setSortField('date_arrived'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); }}>
            Date Arrived {sortField === 'date_arrived' && (sortDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
        </SortableTableCell>
        <SortableTableCell onClick={() => { setSortField('lead_time'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); }}>
            Lead Time {sortField === 'lead_time' && (sortDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
        </SortableTableCell>
        <SortableTableCell onClick={() => { setSortField('status'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); }}>
            Status {sortField === 'status' && (sortDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
        </SortableTableCell>
        <TableCell>Change Status</TableCell>
    </TableRow>
</TableHead>
                <TableBody>
                    {sortedAndFilteredOrders.map(order => (
                        
                        <TableRow key={order.order_id}>
                            <TableCell>{order.order_id}</TableCell>
                            <TableCell>{order.component_type}</TableCell>
                            <TableCell>{order.supplier_name}</TableCell>
                            <TableCell>{order.quantity}</TableCell>
                            <TableCell>{order.date_ordered}</TableCell>
                            <TableCell style={{ color: new Date(order.date_arrived) - new Date(order.date_ordered) > order.lead_time ? 'red' : 'inherit' }}>{order.date_arrived}</TableCell>
                            <TableCell>{order.lead_time}</TableCell>
                            <TableCell>{order.status}</TableCell>
                            <TableCell>
                                <Button variant="contained" color="primary" onClick={() => handleStatusChange(order.order_id, 'Arrived')}>Mark as Arrived</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </StyledTable>
        </TableContainer>
        </div>
      
    );
}

export default Orders;