import {React, useState} from 'react';
import { useTable, usePagination, useGlobalFilter, useFilters, useSortBy } from 'react-table';
import '../css/Table.css';


export default function Table({columns, data, filterColumn}){
    
    const [filterInput, setFilterInput] = useState('');
    const [searchInput, setSearchInput] = useState('');



    const handleFilterChange = e => {
        const value = e.target.value || undefined;
        setFilter(filterColumn, value);
        setFilterInput(value);
    }
    
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        setGlobalFilter,
        setFilter,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0 },
        },
        useFilters,
        useGlobalFilter,
        useSortBy, // Add this line
        usePagination
    );

    return (
    <>
    <div className="search">
    <input
        value={searchInput}
        onChange={e => {
            setSearchInput(e.target.value);
            setFilter(e.target.value);
            }
    }
        placeholder={`Search ${filterColumn}`}
        style={{ margin: '10px' }}
    />
    </div>
   <div className="pagination">
   <span className='pageSpan'>
            Page{' '}
            <strong>
                {pageIndex + 1} of {pageOptions.length}
            </strong>{' '}
        </span>
        <span>
            | Go to page:{' '}
            <input
                type="number"
                defaultValue={pageIndex + 1}
                onChange={e => {
                    const page = e.target.value ? Number(e.target.value) - 1 : 0;
                    gotoPage(page);
                }}
                style={{ width: '100px' }}
            />
        </span>{' '}
        <select 
            value={pageSize}
            onChange={e => {
                setPageSize(Number(e.target.value));
            }}
            style={{ width: '100px' }}
        >
             {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                </option>
            ))}
        </select>
        
        <button className = 'paginationButton' onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {'<<'}
        </button>{' '}
        <button className='paginationButton' onClick={() => previousPage()} disabled={!canPreviousPage}>
            {'<'}
        </button>{' '}
        <button className='paginationButton' onClick={() => nextPage()} disabled={!canNextPage}>
            {'>'}
        </button>{' '}
        <button className='paginationButton' onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {'>>'}
        </button>{' '}
    </div>
    <table {...getTableProps()} className="tables-table">
            <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()} className="tables-header-group">
                    {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps(column.getSortByToggleProps())}
                            className={
                                column.isSorted
                                    ? column.isSortedDesc
                                        ? 'sort-desc tables-header'
                                        : 'sort-asc tables-header'
                                    : 'tables-header'
                            }
                        >
                            {column.render('Header')}
                        </th>
                    ))}
                </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()} className="tables-body">
                {page.map(row => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()} className="tables-row">
                            {row.cells.map(cell => (
                                <td {...cell.getCellProps()} className="tables-cell">{cell.render('Cell')}</td>
                            ))}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    </>
    );
}