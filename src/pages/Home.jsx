


function Home(){
    return(
       <div className="main-wrapper">
        
            <section className="hero-page">
                <div className="hero-content">
                    <h1>Find your dream home</h1>
                    <p>Search properties in Australia</p>  
                </div>
                <div className="search-bar-wrapper">
                        <div className="search-bar mt-4">
                            <select className="form-select">
                                <option>Property Type</option>
                                <option>House</option>
                                <option>Condo</option>
                            </select>

                            <select className="form-select">
                                <option>Offer Type</option>
                                <option>Buy</option>
                                <option>Rent</option>
                            </select>

                            <select className="form-select">
                                <option>City</option>
                                <option>Brisbane</option>
                                <option>Sydney</option>
                            </select>

                            <button className="btn btn-success">Search</button>
                    </div>
                </div>
                
            </section>
            <section className="text-page">
                <div className="slides">        
                    <h2>You're welcome</h2>
                    <p>this is your new blank page</p>
                </div>
            </section>
       </div>
        );    
}
export default Home;