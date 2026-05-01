
// function RentalSearch()
// {
//     const navigate = useNavigate();

//     const columns = [
//         {headerName: "Title", field:"title", filter:true},
//         {headerName: "Rent", field:"rent", filter: "agNumberColumnFilter"},
//         {headerName: "Property Type", field:"propertyType"},
//         {headerName: "Post Code", field:"postcode"},
//         {headerName: "State", field:"state"},
//         {headerName: "Suburb", field:"suburb"},
//         {headerName: "Bathrooms", field:"bathrooms"},
//         {headerName: "Bedrooms", field:"bedrooms"},
//         {headerName: "Parking Space", field:"parkingSpaces"},
//         {headerName: "Average Rating", field:"averageRating", Placeholder:"0"},
//     ];

//     const defaultColDef = {
//         flex: 1,
//         minWidth: 100,
//     }

//     const datasource = {
//         getRows: async (props) =>{
//             const {startRow, endRow, successCallback, failCallback, sortModel, filterModel} = props;

//             const perPage = endRow - startRow;
//             const page = Math.floor(startRow / perPage) + 1;

//             let queryParams = `page=${page}&perPage=${perPage}`;

//             if(sortModel.length > 0) {
//                 queryParams += `&sortBy=${sortModel[0].colId}&sortOrder=${sortModel[0].sort}`;
//             }

//             if(Object.keys(filterModel).length > 0){
//                 const filterKey = Object.keys(filterModel)[0];
//                 queryParams += `&${filterKey}=${filterModel[filterKey].filter}`;
//             }


//             try {
//                 const response = await fetch(`${API_URL}/rentals/search?${queryParams}`);
//                 if(!response.ok) throw new Error('Failed to fetch rentals');
                
//                 const {data, pagination} = await response.json();
//                 successCallback(data, pagination.total);
//             }catch(error){
//                 console.error("Datasource error: ",error);
//                 failCallback();
//             }

//         }
            
//     };

//     return(
//         <>
//             <div className='search-page'>
//                 <div className='search-page-header'>
//                     <p className='search-page-eyebrow'>Australia's rental listings</p>
//                     <h1 className='search-page-title'>Find your next home</h1>
//                     <p className='search-page-sub'>Browse available rentals. Click any row to view full details</p>
//                 </div>
//                 <div className='search-grid-wrapper'>
//                     <div className='ag-theme-balham' style={{height: 520}} >
//                         <AgGridReact theme={themeBalham}
//                         modules={[AllCommunityModule]}
//                         defaultColDef={defaultColDef}
//                         columnDefs={columns}
//                         rowModelType='infinite'
//                         datasource={datasource}
//                         cacheBlockSize={10}
//                         // pagination
//                         // paginationPageSize={10}
//                         onRowClicked={row => navigate(`/rentals/?id=${row.data.id}`)}    
//                         />
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }
// export default RentalSearch;