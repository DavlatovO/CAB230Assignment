import { AllCommunityModule, themeBalham } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import {useState, useEffect } from 'react'
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function RentalSearch()
{
    const [rowData, setRowData] = useState(null);
    const navigate = useNavigate();

    const columns = [
        {headerName: "Title", field:"title"},
        {headerName: "Rent", field:"rent"},
        {headerName: "Property Type", field:"propertyType"},
        {headerName: "Post Code", field:"postcode"},
        {headerName: "State", field:"state"},
        {headerName: "Suburb", field:"suburb"},
        {headerName: "Bathrooms", field:"bathrooms"},
        {headerName: "Bedrooms", field:"bedrooms"},
        {headerName: "Parking Space", field:"parkingSpaces"},
        {headerName: "Average Rating", field:"averageRating"},
    ]

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await fetch(`http://4.237.58.241:3000/rentals/search`);
                if(!response.ok){
                    throw new Error("No rentals");
                }
                const data = await response.json();
                setRowData(data.data);
            } catch (error) {
                console("An error occured: ", error)
            }
        }
        fetchData();
    }, [])

    return(
        <div search-page>
            <div className='search-page-header'>
                <p className='search-page-eyebrow'>Australia's rental listings</p>
                <h1 className='search-page-title'>Find your next home</h1>
                <p className='search-page-sub'>Browse available rentals. Click any row to view full details</p>
            </div>
            <div className='search-grid-wrapper'>
                <div className='ag-theme-balham' style={{height: 520}}>
                    <AgGridReact theme={themeBalham}
                    modules={[AllCommunityModule]}
                    columnDefs={columns}
                    rowData={rowData}
                    pagination
                    paginationPageSize={20}
                    onRowClicked={row => navigate(`/rentals/?id=${row.data.id}`)}    
                    />
                </div>
            </div>
            </div>
    );
}
export default RentalSearch;