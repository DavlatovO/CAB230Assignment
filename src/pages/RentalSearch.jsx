import { AllCommunityModule, themeBalham } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import {useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';
import Spinner from 'react-bootstrap/Spinner';


// Render average ratings as stars with a decimal value label
const StarRenderer = (p) => {
    if (p.value == null) return <span style={{ color: '#ccc' }}>☆☆☆☆☆</span>;
    const full = Math.floor(p.value);
    const empty = 5 - full;
    return (
        <span style={{ color: '#f5a623', fontSize: '14px', letterSpacing: '2px' }}>
            {'★'.repeat(full)}{'☆'.repeat(empty)}
            <span style={{ color: '#aaa', fontSize: '11px', marginLeft: '5px' }}>
                ({Number(p.value).toFixed(1)})
            </span>
        </span>
    );
};


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



// Build URL query parameters for search requests using current filters and sort state
function buildQueryParams(page, filters, sortModel = []) {
    const params = new URLSearchParams();

    params.set('page', page);

    if (filters.suburb)          params.set('suburb', filters.suburb);
    if (filters.state)           params.set('state', filters.state);
    if (filters.postcode)        params.set('postcode', filters.postcode);
    if (filters.minimumRent)     params.set('minimumRent', filters.minimumRent);
    if (filters.maximumRent)     params.set('maximumRent', filters.maximumRent);
    if (filters.minimumBedrooms) params.set('minimumBedrooms', filters.minimumBedrooms);
    if (filters.maximumBedrooms) params.set('maximumBedrooms', filters.maximumBedrooms);
    if (filters.minimumBathrooms)params.set('minimumBathrooms', filters.minimumBathrooms);
    if (filters.maximumBathrooms)params.set('maximumBathrooms', filters.maximumBathrooms);
    if (filters.minimumParking)  params.set('minimumParking', filters.minimumParking);
    if (filters.maximumParking)  params.set('maximumParking', filters.maximumParking);
    if (filters.minimumRating)   params.set('minimumRating', filters.minimumRating);
    if (filters.maximumRating)   params.set('maximumRating', filters.maximumRating);

    filters.propertyTypes.forEach(t => params.append('propertyTypes', t));
    if(sortModel.length > 0){
        params.set('sortBy', sortModel[0].colId);
        params.set('sortOrder', sortModel[0].sort);
    }
    return params.toString();
}

function RentalSearch(){
    const navigate = useNavigate();
    const gridRef = useRef(null);
    const [states, setStates] = useState([]);
    const [propertyTypes, setPropertyTypes] = useState([]);

    
    
    const [filters, setFilters] = useState({
        suburb:'', state:'', postcode:'',
        minimumRent: '', maximumRent: '',
        minimumBedrooms: '', maximumBedrooms: '',
        minimumBathrooms: '', maximumBathrooms: '',
        minimumParking: '', maximumParking: '',
        minimumRating: '', maximumRating: '',
        propertyTypes: [],
    });
    
    const filtersRef = useRef(filters);

    useEffect(() => {
        Promise.all([
            fetch(`${API_URL}/rentals/states`).then(r =>r.json()),
            fetch(`${API_URL}/rentals/property-types`).then(r =>r.json()), 
        ]).then(([statesData, typesData])=>{
            setStates(statesData);
            setPropertyTypes(typesData);
        }).catch(err => console.error('Failed to load filter options:', err));
    }, []);
    
    // Grid column configuration for rental search results
    const columns = [
        { headerName: "Title", field: "title", flex: 3, minWidth: 200,
        cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'flex-start' } },
        { headerName: "Rent/wk",       field: "rent",          flex: 1, minWidth: 90,
        valueFormatter: p => p.value ? `$${p.value.toLocaleString()}` : '' },
        { headerName: "Type",          field: "propertyType",  flex: 1, minWidth: 90 },
        { headerName: "Suburb",        field: "suburb",        flex: 1, minWidth: 100 },
        { headerName: "State",         field: "state",         flex: 0.6, minWidth: 70 },
        { headerName: "Postcode",      field: "postcode",      flex: 0.7, minWidth: 80 },
        { headerName: "Beds",          field: "bedrooms",      flex: 0.6, minWidth: 60 },
        { headerName: "Baths",         field: "bathrooms",     flex: 0.6, minWidth: 60 },
        { headerName: "Parking",       field: "parkingSpaces", flex: 0.6, minWidth: 70 },
        { headerName: "Avg Rating",    field: "averageRating", flex: 1.2, minWidth: 120,
        cellRenderer: StarRenderer },
    ];
    
    const defaultColDef = {
        flex:1,
        minWidth: 100,
        cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center'},
    };
    
    // Infinite row datasource for AG Grid using server-side search results
    const datasource = useRef({
        getRows: async ({ startRow, successCallback, failCallback, sortModel }) => {
            gridRef.current?.api.setGridOption("loading", true);
            const perPage = 10;
            const page = Math.floor(startRow / perPage) + 1;
            const query = buildQueryParams(page, filtersRef.current, sortModel);
            
            try {
                const response = await fetch(`${API_URL}/rentals/search?${query}`);
                if(!response.ok) throw new Error("failed to fetch");
                const { data, pagination } = await response.json();
                successCallback(data, pagination.total);
            } catch(error){
                console.error(error);
                failCallback();
            } finally {
                gridRef.current?.api.setGridOption("loading", false);
            }
        
        
        }
    }).current;

    const update = (field, value) => {
        const updated = {...filters, [field]: value};
        setFilters(updated);
        filtersRef.current = updated;
    };

    const togglePropertyType = (type) => {
        const updated = {
            ...filters,
            propertyTypes: filters.propertyTypes.includes(type)
                ? filters.propertyTypes.filter(t => t !== type)
                : [...filters.propertyTypes, type]
        };
        setFilters(updated);
        filtersRef.current = updated;
    };

    // Refresh grid with the current filters applied
    const applyFilters = () =>{
        gridRef.current?.api.purgeInfiniteCache();
    };

    // Reset all filters to their default empty state and reload the grid
    const clearFilters = () => {
        const cleared = {
            suburb: '', state: '', postcode: '',
            minimumRent: '', maximumRent: '',
            minimumBedrooms: '', maximumBedrooms: '',
            minimumBathrooms: '', maximumBathrooms: '',
            minimumParking: '', maximumParking: '',
            minimumRating: '', maximumRating: '',
            propertyTypes: [],
        };
        setFilters(cleared);
        filtersRef.current = cleared;
        gridRef.current?.api.purgeInfiniteCache();
    };

    return (
        <div className='search-page'>
            <div className='search-page-header'>
                <p className='search-page-eyebrow'>Australia's rental listings</p>
                <h1 className='search-page-title'>Find your next home</h1>
                <p className='search-page-sub'>Browse available rentals. Click any row to view full details</p>
            </div>

            {/* Filter Panel */}
            <div className='search-filters'>

                {/* Row 1 — location */}
                <div className='filter-row'>
                    <div className='filter-field'>
                        <label>Suburb</label>
                        <input value={filters.suburb} onChange={e => update('suburb', e.target.value)} placeholder='e.g. Herston' />
                    </div>
                    <div className='filter-field'>
                        <label>State</label>
                        <select value={filters.state} onChange={e => update('state', e.target.value)}>
                            <option value=''>Any</option>
                            {states.map(s => <option key={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className='filter-field'>
                        <label>Postcode</label>
                        <input value={filters.postcode} onChange={e => update('postcode', e.target.value)} placeholder='e.g. 4006' />
                    </div>
                </div>

                {/* Row 2 — ranges */}
                <div className='filter-row'>
                    <div className='filter-field'>
                        <label>Rent ($/wk)</label>
                        <div className='range-pair'>
                            <input type='number' value={filters.minimumRent} onChange={e => update('minimumRent', e.target.value)} placeholder='Min' />
                            <span>–</span>
                            <input type='number' value={filters.maximumRent} onChange={e => update('maximumRent', e.target.value)} placeholder='Max' />
                        </div>
                    </div>
                    <div className='filter-field'>
                        <label>Bedrooms</label>
                        <div className='range-pair'>
                            <input type='number' value={filters.minimumBedrooms} onChange={e => update('minimumBedrooms', e.target.value)} placeholder='Min' />
                            <span>–</span>
                            <input type='number' value={filters.maximumBedrooms} onChange={e => update('maximumBedrooms', e.target.value)} placeholder='Max' />
                        </div>
                    </div>
                    <div className='filter-field'>
                        <label>Bathrooms</label>
                        <div className='range-pair'>
                            <input type='number' value={filters.minimumBathrooms} onChange={e => update('minimumBathrooms', e.target.value)} placeholder='Min' />
                            <span>–</span>
                            <input type='number' value={filters.maximumBathrooms} onChange={e => update('maximumBathrooms', e.target.value)} placeholder='Max' />
                        </div>
                    </div>
                    <div className='filter-field'>
                        <label>Parking</label>
                        <div className='range-pair'>
                            <input type='number' value={filters.minimumParking} onChange={e => update('minimumParking', e.target.value)} placeholder='Min' />
                            <span>–</span>
                            <input type='number' value={filters.maximumParking} onChange={e => update('maximumParking', e.target.value)} placeholder='Max' />
                        </div>
                    </div>
                    <div className='filter-field'>
                        <label>Rating</label>
                        <div className='range-pair'>
                            <input type='number' value={filters.minimumRating} onChange={e => update('minimumRating', e.target.value)} placeholder='Min' min='1' max='5' />
                            <span>–</span>
                            <input type='number' value={filters.maximumRating} onChange={e => update('maximumRating', e.target.value)} placeholder='Max' min='1' max='5' />
                        </div>
                    </div>
                </div>

                {/* Row 3 — property types */}
                <div className='filter-row'>
                    <div className='filter-field filter-field--full'>
                        <label>Property types</label>
                        <div className='type-chips'>
                            {propertyTypes.map(type => (
                                <button
                                    key={type}
                                    className={`chip ${filters.propertyTypes.includes(type) ? 'chip--active' : ''}`}
                                    onClick={() => togglePropertyType(type)}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className='filter-actions'>
                    <button className='btn-clear' onClick={clearFilters}>Clear all</button>
                    <button className='btn-search' onClick={applyFilters}>Search</button>
                </div>
            </div>

            {/* Grid */}
            <div className='search-grid-wrapper'>
                <div className='ag-theme-balham' style={{height:620}}>
                    <AgGridReact
                        ref={gridRef}
                        theme={gridTheme}
                        modules={[AllCommunityModule]}
                        columnDefs={columns}
                        defaultColDef={defaultColDef}
                        rowModelType='infinite'
                        datasource={datasource}
                        cacheBlockSize={10}
                        maxBlocksInCache={5}
                        overlayLoadingTemplate=' <div style="display:flex; align-items:center; gap:8px; color:#888; font-size:13px">
                                                    <div style="width:16px; height:16px; border:2px solid #ccc; border-top-color:#555; border-radius:50%; animation:spin 0.7s linear infinite"></div>
                                                    Loading...
                                                </div>'
                        overlayNoRowsTemplate='<span style="padding:12px; color:#888; font-size:13px"> No rentals found matching</span>'
                        // pagination
                        // paginationPageSize={20}
                        // paginationPageSizeSelector={[20]}
                        onRowClicked={row => navigate(`/rentals/${row.data.id}`)}
                    />
                </div>
            </div>
        </div>
    );

}
export default RentalSearch;
