import React from 'react';
import JobCard from './jobCard'


export default function FindJobsPage(props){

    const refreshPage = () => {
        props.handlePageRefresh();
        console.log('hello')
    }

    return (
        <div>
            {props.jobs.map((job)=>
                <div key={job.adref} style={{marginTop:'1rem'}}>
                    {/* load job data here */}
                    <JobCard 
                    freshPage={refreshPage}
                    adref={job.adref}
                    delete={props.delete}
                    title={job.title}
                    description={job.description}
                    company={job.company.display_name}
                    location={job.location.display_name}
                    url={job.redirect_url}
                    />
                </div>
            )}
        </div>   
    )

}