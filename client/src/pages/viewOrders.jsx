import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table,Typography, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, TablePagination } from '@mui/material';
import { styled } from '@mui/system';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';



const StyledTable = styled(Table)({
    minWidth: 650,
});

const Title = styled(Typography)({
    margin: '20px 0',
});

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US');
};

function Orders() {
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);


    useEffect(() => {
        axios.get('http://localhost:3001/getAllOrders')
            .then(response => {
                setOrders(response.data);
            })
            .catch(error => {
                console.error('Error fetching orders:', error);
            });
    }, []);

    function handleStatusChange(orderId) {
        axios.put(`http://localhost:3001/orders/${orderId}`)
          .then(response => {
            axios.get('http://localhost:3001/getAllOrders')
            .then(response => {
                setOrders(response.data);
            })  
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
        order.component_type_name && order.component_type_name.toLowerCase().includes(search.toLowerCase()) ||
        order.supplier_name && order.supplier_name.toLowerCase().includes(search.toLowerCase()) ||
        order.pending.toString().includes(search) ||
        order.quantity.toString().includes(search) ||
        order.date_ordered && order.date_ordered.toLowerCase().includes(search.toLowerCase()) ||
        order.date_arrived && order.date_arrived.toLowerCase().includes(search.toLowerCase()) ||
        order.lead_time.toString().includes(search)||
        order.pending.toString().includes(search)
        // Add more fields as needed
      );
      const sortedAndFilteredOrders = [...filteredOrders].sort((a, b) => {
        let aValue = a[sortField] || '';
        let bValue = b[sortField] || '';
      
        if (aValue < bValue) {
          return sortDirection === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
      });
    return (
        <div>
            <Title variant="h4">Orders</Title>  
            <TableContainer  style={{ width: '97%', marginRight: '20px' }} component={Paper}>
            <TextField placeholder="Search" variant="outlined" value={search} onChange={e => setSearch(e.target.value)} />
                <Table>
                <TableHead>
                    <TableRow>
                        <SortableTableCell onClick={() => { setSortField('component_order_id'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); }}>
                            Order ID {sortField === 'component_order_id' && (sortDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                        </SortableTableCell>
                        <SortableTableCell onClick={() => { setSortField('component_type_name'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); }}>
                            Component {sortField === 'component_type_name' && (sortDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
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
                        <SortableTableCell onClick={() => { setSortField('pending'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); }}>
                            Status {sortField === 'pending' && (sortDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                        </SortableTableCell>
                        <TableCell>Change Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {sortedAndFilteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(order => (
                        <TableRow key={order.order_id}>
                            <TableCell>{order.component_order_id}</TableCell>
                            <TableCell>{order.component_type_name}</TableCell>
                            <TableCell>{order.supplier_name}</TableCell>
                            <TableCell>{order.quantity}</TableCell>
                            <TableCell>{formatDate(order.date_ordered)}</TableCell>
                            <TableCell style={{ color: new Date(formatDate(order.date_arrived)) - new Date(formatDate(order.date_ordered)) > order.lead_time ? 'red' : 'inherit' }}>{formatDate(order.date_arrived)}</TableCell>
                            <TableCell>{order.lead_time}</TableCell>
                            <TableCell>{order.pending}</TableCell>
                            <TableCell>
                                <Button variant="contained" color="primary" onClick={() => handleStatusChange(order.component_order_id, 'Arrived')}>Mark as Arrived</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={sortedAndFilteredOrders.length}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(event) => {
                    setRowsPerPage(parseInt(event.target.value, 10));
                    setPage(0);
                }}
                />
        </TableContainer>
        </div>
      
    );
}

export default Orders;