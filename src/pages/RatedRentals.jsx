
import { Alert } from "react-bootstrap";
import { AllCommunityModule, CellRangeType, themeBalham } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";

import API_URL from "../config";
import { useAuth } from "../services/AuthProvider";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";



// Custom renderer to display numeric rating values as star icons
const StarRenderer = (p) => {
    const stars = p.value || 0;
    return (
        <span style={{color:'#f5a623', fontSize: '16px', letterSpacing: '2px'}}>
            {'★'.repeat(stars)}{'☆'.repeat(5-stars)} ({p.value})
        </span>
    )
};

// Fetch rental title for the grid cell when only rentalId is available
const RentalName = (p) => {
    const [name, setName] = useState('Loading...');

    useEffect(() => {
        if (!p.value) return;
        fetch(`${API_URL}/rentals/${p.value}`)
        .then(r => r.json())
        .then(data => setName(data.title || data.address || p.value))
        .catch(() => setName(p.value));
    }, [p.value]);
    return <span>{name}</span>
}

const gridTheme = themeBalham.withParams({
    headerTextColor: '#888',
    headerFontSize: 11,
    headerFontWeight: 600,
    headerBackgroundColor: '#fafafa',
    rowHoverColor: '#f7f7f5',
    borderColor: '#f0f0f0',
    fontFamily: 'inherit',
    fontSize: 13,
});

export default function RatedRental() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0);

    // Column definitions for the rated rentals AG Grid view
    const columns = [
        {headerName: "Rated Rental", field:"rentalId", flex:2, filter:true, cellRenderer: RentalName },
        {headerName: "rating", field:"rating", flex:1, cellRenderer: StarRenderer },
        {headerName: "Date", field:"dateTime", flex:1,
            valueFormatter: p => p.value 
            ? new Date(p.value).toLocaleDateString('en-AU', {hour:'numeric', minute:'numeric', day:'numeric', month: 'short', year: 'numeric'})
            :''
        },
        
    ];

    
    const token = localStorage.getItem("token");
    if(!token){
        return <Navigate to="/login" />
    }
    // AG Grid datasource used for infinite scrolling and server-side pagination
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
                    setTotal(pagination.total);
                }catch(error){
                    console.error("Datasource error: ",error);
                    failCallback();
                }
            }
        };
    
    const defaultColDef = {
        flex: 1,
        minWidth: 100,
        headerClass: 'ag-header-center',
    };
    

    return (
        <>
         <div className="search-page">
                    <div className='search-page-header'>
                        {error && <Alert variant="warning">{error}</Alert>}
                        <p className='search-page-eyebrow'>Your Activity</p>
                        <h1 className='search-page-title'>Rated Rentals</h1>
                        <p className='search-page-sub'>Your rental history. Click any row to view full details</p>
                    </div>
                    <div className="rated-stats">
                        <div className="rated-stat">
                            <span className="rated-stat-number">{ total === null ? '–' : total}</span>
                            <span className="rated-stat-label">Rentals Rated</span>
                        </div>
                    </div>
                    <div className='search-grid-wrapper'>
                        <div className='ag-theme-balham' style={{height: 620}}>
                            <AgGridReact theme={gridTheme}
                            modules={[AllCommunityModule]}
                            columnDefs={columns}
                            defaultColDef={defaultColDef}
                            rowModelType="infinite"
                            datasource={datasource}
                            cacheBlockSize={20}
                            pagination
                            paginationPageSize={20}
                            paginationPageSizeSelector={[10, 20, 50]}
                            onRowClicked={row => navigate(`/rentals/${row.data.rentalId}`)}    
                            />
                        </div>
                    </div>
                    </div>
        </>
    );
}