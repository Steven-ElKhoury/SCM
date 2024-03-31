import React, { useMemo, useState } from 'react';
import { useTable,usePagination, useGlobalFilter } from 'react-table';
import "../css/Employee.css";
import Table from '../Components/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

function Employees() {

    const navigate = useNavigate();

    const employees = useMemo(() => Array.from({ length:100 }, (_, i) => ({
        id: i + 1,
        email: `employee${i + 1}@example.com`,
        name: `Employee ${i + 1}`,
        position: `Position ${i % 5 + 1}`,
        role: i % 2 === 0 ? 'Employee' : 'Manager',
    })), []);

    const editEmployee =()=>{

    }


    const deleteEmployee =()=>{
    }

    const columns = useMemo(() => [
        {
            Header: 'Email',
            accessor: 'email',
        },
        {
            Header: 'Name',
            accessor: 'name',
        },
        {
            Header: 'Position',
            accessor: 'position',
        },
        {
            Header: 'Role',
            accessor: 'role',
        },
        {
            Header: 'Edit',
            id: 'edit',
            Cell: ({ row }) => (
                <button onClick={() => editEmployee(row.original.id)}>
                    Edit
                </button>
            ),
        },
        {
            Header: 'Delete',
            id: 'delete',
            Cell: ({ row }) => (
                <button onClick={() => deleteEmployee(row.original.id)}>
                    Delete
                </button>
            ),
        },
    ], []);

    return (
        <> 
            <div  className = 'createEmployees'>
                <button onClick={()=>navigate('/main/acceptemployee')}><FontAwesomeIcon icon = {faPlus}></FontAwesomeIcon>   Create Employee</button>
            </div>
        <Table  columns={columns} data={employees} filterColumn={'Email'}/>
        </>
    );
}

export default Employees;