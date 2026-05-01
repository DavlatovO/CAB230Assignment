import { AllCommunityModule, themeBalham } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import {useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';



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
    
    const columns = [
        {headerName: "Title",           field: "title",          flex:2},
        { headerName: "Rent",           field: "rent",           flex: 1 },
        { headerName: "Property Type",  field: "propertyType",   flex: 1 },
        { headerName: "Post Code",      field: "postcode",       flex: 1 },
        { headerName: "State",          field: "state",          flex: 1 },
        { headerName: "Suburb",         field: "suburb",         flex: 1 },
        { headerName: "Bathrooms",      field: "bathrooms",      flex: 1 },
        { headerName: "Bedrooms",       field: "bedrooms",       flex: 1 },
        { headerName: "Parking",        field: "parkingSpaces",  flex: 1 },
        { headerName: "Avg Rating",     field: "averageRating",  flex: 1 },
    ];
    
    const defaultColDef = {flex:1, minWidth: 100};
    
    const datasource = {
        getRows: async ({ startRow, successCallback, failCallback, sortModel }) => {
            const perPage = 20;
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
            }
        
        
        }
    };

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

    const applyFilters = () =>{
        gridRef.current?.api.purgeInfiniteCache();
    };

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
                <div className='ag-theme-balham' style={{height:600}}>
                    <AgGridReact
                        ref={gridRef}
                        theme={themeBalham}
                        modules={[AllCommunityModule]}
                        columnDefs={columns}
                        defaultColDef={defaultColDef}
                        rowModelType='infinite'
                        datasource={datasource}
                        cacheBlockSize={10}
                        maxBlocksInCache={5}
                        // pagination
                        // paginationPageSize={20}
                        // paginationPageSizeSelector={[20]}
                        overlayNoRowsTemplate='No rentals found matching your filters'
                        onRowClicked={row => navigate(`/rentals/?id=${row.data.id}`)}
                    />
                </div>
            </div>
        </div>
    );

}
export default RentalSearch;

