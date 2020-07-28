import React from 'react';
import JobCard from './jobCard'


export default function FindJobsPage(props){
    return (
        <div>
            {props.jobs.map((job)=>
                <div key={job.adref} style={{marginTop:'1rem'}}>
                    <JobCard 
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