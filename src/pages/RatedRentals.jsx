
import { Alert } from "react-bootstrap";
import { AllCommunityModule, themeBalham } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";

import API_URL from "../config";
import { useAuth } from "../services/AuthProvider";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";


const token = localStorage.getItem("token");
const datasource = {
        getRows: async (props) =>{
            const {startRow, endRow, successCallback, failCallback, sortModel, filterModel} = props;

            const perPage = 20;
            const page = Math.floor(startRow / perPage) + 1;

            let queryParams = `page=${page}`;

            if(sortModel.length > 0) {
                queryParams += `&sortBy=${sortModel[0].colId}&sortOrder=${sortModel[0].sort}`;
            }

            if(Object.keys(filterModel).length > 0){
                const filterKey = Object.keys(filterModel)[0];
                queryParams += `&${filterKey}=${filterModel[filterKey].filter}`;
            }


            try {
                const response = await fetch(`${API_URL}/ratings?${queryParams}`,{
                    headers: {"Authorization": `Bearer ${token}`}
                });
                if(!response.ok) throw new Error('Failed to fetch rentals');
                
                const {data, pagination} = await response.json();
                successCallback(data, pagination.total);
            }catch(error){
                console.error("Datasource error: ",error);
                failCallback();
            }
           

        }
            
    };


export default function RatedRental() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const columns = [
        {headerName: "Rated Rental", field:"rentalId", flex:1 },
        {headerName: "rating", field:"rating", flex:1 },
        {headerName: "Date", field:"dateTime", flex:2 },
        
    ];
    

    const defaultColDef = {
        flex: 1,
        minWidth: 100,
    };
    
    
    if(!token){
        return <Navigate to="/login" replace />
    }
    

    return (
        <>
         <div className="search-page">
                    <div className='search-page-header'>
                        {error && <Alert variant="warning">{error}</Alert>}
                        <p className='search-page-eyebrow'>Australia's rental listings</p>
                        <h1 className='search-page-title'>Your Rated Rentals</h1>
                        <p className='search-page-sub'>Browse rentals. Click any row to view full details</p>
                    </div>
                    <div className='search-grid-wrapper'>
                        <div className='ag-theme-balham' style={{height: 520}}>
                            <AgGridReact theme={themeBalham}
                            modules={[AllCommunityModule]}
                            columnDefs={columns}
                            defaultColDef={defaultColDef}
                            rowModelType="infinite"
                            datasource={datasource}
                            cacheBlockSize={20}
                            pagination
                            paginationPageSize={20}
                            paginationPageSizeSelector={[10, 20, 50]}
                            onRowClicked={row => navigate(`/rentals?id=${row.data.rentalId}`)}    
                            />
                        </div>
                    </div>
                    </div>
        </>
    );
}