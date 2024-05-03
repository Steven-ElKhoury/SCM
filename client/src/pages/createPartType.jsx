import React, {useState, useEffect} from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TextField } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { styled } from '@mui/system';
import '../css/createPartType.css';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

function CreatePartType() {
    const [categoryName, setCategoryName] = useState('');
    const [partTypes, setPartTypes] = useState([]);
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [editId, setEditId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3001/partTypes')
            .then((response) => {
                setPartTypes(response.data);
            })
            .catch((error) => {
                console.error('Error fetching part categories:', error);
            }
            );
    }, []);



    const handleCreate = (event) => {
        event.preventDefault();
        axios.post('http://localhost:3001/createPartType', { categoryName })
          .then(response => {
            axios.get('http://localhost:3001/partTypes')
              .then((response) => {
                setPartTypes(response.data);
              })
              .catch((error) => {
                console.error('Error fetching part categories:', error);
              });
              setCategoryName('');
          })
          .catch(error => {
            console.error('Error creating part type:', error);
          });
      };
      
      const handleEditRequest = (id) => {
        const partType = partTypes.find(partType => partType.part_category_id === id);
        setCategoryName(partType.category_name);
        setEditId(id);
        setIsEditing(true);
      };

      const handleEditConfirm = (event) => {
        event.preventDefault();
        axios.put(`http://localhost:3001/updatePartType/${editId}`, { categoryName })
          .then(response => {
            setIsEditing(false);
            setCategoryName('');
            axios.get('http://localhost:3001/partTypes')
              .then((response) => {
                setPartTypes(response.data);
              })
              .catch((error) => {
                console.error('Error fetching part categories:', error);
              });
          })
          .catch(error => {
            console.error('Error editing part type:', error);
          });
      };
      
      const handleDelete = (id) => {
        setDeleteId(id);
        setOpenDeleteDialog(true);
        };

        const handleConfirmDelete = (event) => {
            event.preventDefault();
            axios.delete(`http://localhost:3001/deletePartType/${deleteId}`)
              .then(response => {
                        axios.get('http://localhost:3001/partTypes')
                        .then((response) => {
                            setPartTypes(response.data);
                        })
                        .catch((error) => {
                            console.error('Error fetching part categories:', error);
                        }
                        );
                    setOpenDeleteDialog(false);
              })
              .catch(error => {
                console.error('Error deleting part type:', error);
              });
          };
    


    const handleSort = () => {
    };

    const SortableTableCell = styled(TableCell)({
        cursor: 'pointer',
        '&:hover': {
            color: 'blue',
        },
    })
    const handleCancel = () => {
        setCategoryName('');
        setIsEditing(false);
      };
      

  return (
    <>
        <div className='createPartTypeContainer'>
            <form onSubmit={handleCreate}>
                <label>
                Category Name:
                <input type="text" value={categoryName} onChange={e => setCategoryName(e.target.value)} />
                </label>
                {!isEditing ? (
                    <button type="submit" onClick={handleCreate}>Create</button>
                    ) : (
                    <>
                        <button type="button" onClick={handleEditConfirm}>Edit</button>
                        <button type="button" id= 'cancel-button' onClick={handleCancel}>Cancel</button>
                    </>
                    )}
            </form>
        </div>
 
        <Dialog
            open={openDeleteDialog}
            onClose={() => setOpenDeleteDialog(false)}
            >
            <DialogTitle>Delete Part Type</DialogTitle>
            <DialogContent>
                <DialogContentText>
                Are you sure you want to delete this part type?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)} style={{ backgroundColor: 'gray', color: 'white' }}>
                Cancel
            </Button>
            <Button onClick={handleConfirmDelete} style={{ backgroundColor: 'red', color: 'white' }} autoFocus>
                Delete
            </Button>
            </DialogActions>
            </Dialog>

  <TableContainer style={{ width: '97%', marginRight: '20px' }} component={Paper}>
  <TextField placeholder="Search" variant="outlined" value={search} onChange={e => setSearch(e.target.value)} />
    <Table>
      <TableHead>
        <TableRow>
        <SortableTableCell onClick={() => { setSortField('category_name'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); }}>
          Category Name {sortField === 'category_name' && (sortDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
        </SortableTableCell>
          <TableCell>Edit</TableCell>
          <TableCell>Delete</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {partTypes
          .filter(partType => partType.category_name.toLowerCase().includes(search.toLowerCase()))
          .sort((a, b) => {
            if (a[sortField] < b[sortField]) {
              return sortDirection === 'asc' ? -1 : 1;
            }
            if (a[sortField] > b[sortField]) {
              return sortDirection === 'asc' ? 1 : -1;
            }
            return 0;
          })
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((partType) => (
            <TableRow key={partType.part_category_id}>
              <TableCell>{partType.category_name}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleEditRequest(partType.part_category_id)}>
                  <EditIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                <IconButton onClick={() => handleDelete(partType.part_category_id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
    <TablePagination
  component="div"
  count={partTypes.length}
  page={page}
  onPageChange={(event, newPage) => setPage(newPage)}
  rowsPerPage={rowsPerPage}
  onRowsPerPageChange={(event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }}
  rowsPerPageOptions={[5, 10, 25]}
/>
  </TableContainer>
</>
  )
}

export default CreatePartType;
