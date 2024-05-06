import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/Manufacture.css';
import { Table,Typography, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, TablePagination } from '@mui/material';
import { styled } from '@mui/system';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const StyledTable = styled(Table)({
    minWidth: 650,
});

const Title = styled(Typography)({
    margin: '20px 0',
});



function Manufacture() {
    const navigate = useNavigate();
    const [models, setModels] = useState([]);
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [manufactureQuantities, setManufactureQuantities] = useState({});

    useEffect(() => {
        axios.get('http://localhost:3001/getAllModels')
            .then(response => {
                setModels(response.data);
                console.log(response.data)

            })
            .catch(error => {
                console.error('Error fetching models:', error);
            });
    }, []);
    const handleQuantityChange = (model_id, value) => {
        setManufactureQuantities(prev => ({
            ...prev,
            [model_id]: value
        }));
    };

    const SortableTableCell = styled(TableCell)({
        cursor: 'pointer',
        '&:hover': {
            color: 'blue',
        },
    })

    const filteredModels = models.filter(model => 
        (model.model_id?.toString().includes(search) || false) ||
        (model.name?.toLowerCase().includes(search.toLowerCase()) || false) ||
        (model.quantity?.toString().includes(search) || false) ||
        (model.category_name?.toLowerCase().includes(search.toLowerCase()) || false)
    );
    
    const sortedAndFilteredmodels = [...filteredModels].sort((a, b) => {
        if (a[sortField] < b[sortField]) {
            return sortDirection === 'asc' ? -1 : 1;
        }
        if (a[sortField] > b[sortField]) {
            return sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
    });

    /*
    this code has been removed because it contains a logical error (updating storage before components)
                keep for later reference
    const updateComponentStorageStock = async (component_type_id, required_quantity) => {
        try {
            const { data } = await axios.post('http://localhost:3001/updateComponentStorageStock', {
                component_type_id:component_type_id,
                required_quantity:required_quantity
            });
            console.log("data: ",data)
    
            if (data.details.unmetQuantity > 0) {
                console.log(`Could not fully meet the required quantity for component_type_id ${component_type_id}. Details:`, data.details);
            } else {
                console.log(`Stock successfully updated for component_type_id ${component_type_id}. Details:`, data.details);
                data.details.updates.forEach(update => {
                    finalizeComponentUpdates(update.component_storage_id, update.decremented, component_type_id);
                });
            }
        } catch (error) {
            console.error(`Error updating stock for component_type_id ${component_type_id}:`, error);
        }
    };
    
   
    const finalizeComponentUpdates = async (componentStorageId, numComponentsUpdated, componentTypeId) => {
        try {
            const response = await axios.post('http://localhost:3001/finalizeComponentUpdates', {
                componentStorageId:componentStorageId,
                numComponentsUpdated:numComponentsUpdated,
                componentTypeId:componentTypeId
            });
            console.log('Final update response:', response.data);
        } catch (error) {
            console.error('Failed to finalize component updates:', error);
        }
    };*/
const handleCheckComponentsAndManufacture = async (model_id, quantity) => {
    if (!quantity || isNaN(quantity) || parseInt(quantity, 10) <= 0) {
        alert("Please enter a valid quantity to manufacture.");
        return;
    }    
    try {
        const { data: componentsAvailability } = await axios.get(`http://localhost:3001/availableComponents`, { params: { model_id, quantity } });

        const allComponentsAvailable = componentsAvailability.every(component => component.isEnough);

        if (allComponentsAvailable) {
            console.log(`All components are available. Proceeding to manufacture ${quantity} units of model ${model_id}.`);
            await handleCheckSpaceAndManufacture(model_id, quantity);
        } else {
            alert("Not enough components to manufacture the requested quantity. Please restock components.");
            navigate('/main/createOrder');
        }
    } catch (error) {
        console.error("Error checking components or manufacturing", error);
    }
};
                
    const handleCheckSpaceAndManufacture = async (model_id,quantity) => {
        try {
            const { data } = await axios.get(`http://localhost:3001/availableStorage`, { params: {model_id: model_id } });
            const availableSpace = parseInt(data.availableSpace, 10);
            if (availableSpace >= quantity) {
                console.log("There is enough warehouse space to manufacture the requested quantity, proceeding with Manufacturing")
                await handleManufacture(model_id, quantity);
            }
            else{
            alert("Not enough space to manufacture the requested quantity, create a new warehouse");
            navigate('/main/createUnit');
        }

        } catch (error) {
            console.error("Error checking space or manufacturing", error);
        }
    };

    const handleManufacture = async (model_id,quantity) => {
        let available_space;
        let highestcapacity_unitID;

        const parsedQuantity = parseInt(quantity, 10);
        console.log(`Manufacturing ${parsedQuantity} units of model ${model_id}`);

        try {
            if (parsedQuantity && parsedQuantity > 0) {
                await recursiveUpdateByProductStorage(parsedQuantity);  
                async function recursiveUpdateByProductStorage(quantityLeft) {
                    try {
                        console.log("reached????????")
                        if (quantityLeft <= 0) {
                            console.log("Recursion complete, no quantity left to process.");
                            return;
                        }
                        const highest_capacity_unit_ID = await axios.get('http://localhost:3001/highest_capacity_unit_ID', { params: { modelID: model_id } })
                        available_space = highest_capacity_unit_ID.data.available_space
                        console.log("available_space of highest_capacity_unitID: ",available_space)

                        const currentQuantity = Math.min(quantityLeft, available_space);

                        highestcapacity_unitID = highest_capacity_unit_ID.data.unit_id
                        console.log("highest capacity unit id: ", highestcapacity_unitID)

                        if (highest_capacity_unit_ID.data.unit_id) {
//add stock to byproduct storage
                            await axios.post('http://localhost:3001/update_byproduct_storage', {
                                unitId: highestcapacity_unitID,
                                ByproductQuantity: -currentQuantity
                            })
                                .then(response => {
                                    console.log("byproduct_storage stock added")
                                })
                                .catch(error => {
                                    console.error('Error in update_byproduct_storage :', error);
                                });
                            console.log("update_byproduct_storage updated successfully.");
//add rows to produced_byproduct
                            for (let i = 0; i < currentQuantity; i++) {
                            await axios.post('http://localhost:3001/manufactureByproduct', {
                                ModelID: model_id, 
                                unit_id: highestcapacity_unitID
                            })
                                .then(updateResults => {
                                    console.log("updated: manufactureByproduct")
                                })
                                .catch(error => {
                                    console.error('Error in manufactureByproduct :', error);
                                });
                            }
                        }
                        else {
                            console.log("Error in recursion");
                        }
                        await recursiveUpdateByProductStorage(quantityLeft - currentQuantity);
                    } catch (error) {
                        console.error('Error during recursive byproduct stock update:', error);
                    }
                    }
                await axios.post('http://localhost:3001/updateModel', {
                    modelID: model_id,  
                    quantity: quantity
                })
                .then(modelResults => {
                    console.log("model quantity added")
                })
                .catch(error => {
                    console.error('Error in model quantity update:', error);
                });
            
                console.log("Byproduct tables Updated successfully");
                
                let blueprintDict;
                await axios.get('http://localhost:3001/getBlueprint', { params: { model_id: model_id } })
                .then(response => {
                    blueprintDict = response.data.reduce((acc, item) => {
                    acc[item.component_type_id] = item.number_of_components;
                    return acc;
                    }, {});
                }).catch(error => console.error('Error fetching blueprint data:', error));
                for (const [component_type_id, num_components] of Object.entries(blueprintDict)) {
                    await axios.post('http://localhost:3001/updateComponentQuantity', {
                        component_type_id: component_type_id,
                        decrement: num_components * parsedQuantity
                    }).then(response => {
                        console.log(`Component ${component_type_id} stock reduced by ${num_components * parsedQuantity}`);
                    }).catch(error => {
                        console.error(`Error updating component ${component_type_id}:`, error);
                    });
                }

                /* this code has been removed because it contains a logical error (updating storage before components)
                keep for later reference
                for (const [component_type_id, num_components] of Object.entries(blueprintDict)) {
                    console.log("isssiiiiiiiiiii ",[component_type_id, num_components], "hon:", blueprintDict)
                    await updateComponentStorageStock(parseInt(component_type_id, 10), num_components * parsedQuantity);
                }*/

                try {//this code changes the component rows and update the component storage for a quantity of byproducts
                    // using the blueprint to know how many items we need and how many of these items we need
                    // and for every item we reduce the stock by as much as we can/need, if demand > stock of highest storage of this item (using highest count(*)of component rows of this component type)
                    // we keep iterating through the other storages to reduce the stock from them, the condition where all stocks cannot accomodate our request is handled in the begining before entering the whole manufacturing process
                    const response = await axios.post('http://localhost:3001/startManufacturing', {
                        model_id: model_id,
                        quantity: parsedQuantity
                    });
                } catch (error) {
                    console.error('Error starting manufacturing process:', error);
                }
                //alert(`Successfully manufactured ${parsedQuantity} unit(s) of model ID ${model_id}.`);\
                toast.success(`Successfully manufactured ${parsedQuantity} units of model ID ${model_id}.`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

            } else {
                console.error("Invalid quantity");
                alert("Please enter a valid quantity to manufacture.");
            }
        } catch (error) {
            console.error("Error manufacturing bikes:", error);
        }
            };
          
    return (
        <div>
            <Title variant="h4">Models</Title> 
            <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover /> 
            <TableContainer  style={{ width: '97%', marginRight: '20px' }} component={Paper}>
            <TextField placeholder="Search" variant="outlined" value={search} onChange={e => setSearch(e.target.value)} />
                <Table>
                <TableHead>
                    <TableRow>
                        <SortableTableCell onClick={() => { setSortField('model_id'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); }}>
                            Model ID {sortField === 'model_id' && (sortDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                        </SortableTableCell>
                        <SortableTableCell onClick={() => { setSortField('name'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); }}>
                            Model Name {sortField === 'name' && (sortDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                        </SortableTableCell>
                        <SortableTableCell onClick={() => { setSortField('quantity'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); }}>
                            Quantity Available {sortField === 'quantity' && (sortDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                        </SortableTableCell>
                        <SortableTableCell onClick={() => { setSortField('category'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); }}>
                            Category {sortField === 'category' && (sortDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                        </SortableTableCell>
                        <SortableTableCell onClick={() => { setSortField('category'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); }}>
                            Quanity To Manufacture {sortField === 'Manufacture_QTY' && (sortDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                        </SortableTableCell>

                        <TableCell>Manufacture Bike</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {sortedAndFilteredmodels.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(model => (
                        <TableRow key={model.model_id}>
                            <TableCell>{model.model_id}</TableCell>
                            <TableCell>{model.name}</TableCell>
                            <TableCell style={{ color: model.quantity < 20 ? 'red' : 'inherit' }}>{model.quantity}</TableCell>
                            <TableCell>{model.category_name}</TableCell>
                            <TableCell>
                            <input 
                                type="number" 
                                value={manufactureQuantities[model.model_id] || ''} 
                                onChange={(e) => handleQuantityChange(model.model_id, e.target.value)} 
                                placeholder="Qty" 
                                min="1"
                                style={{ width: '80px' }}
                            />
                            </TableCell>
                            <TableCell>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={() => handleCheckComponentsAndManufacture(model.model_id, manufactureQuantities[model.model_id])}
                            >
                                Manufacture Bike
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={sortedAndFilteredmodels.length}
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
export default Manufacture;