import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import axios from "axios";
import MentorCard from "./MentorCard";
import Grid from "@material-ui/core/Grid";

class Mentors extends Component {
    constructor() {
        super();
        this.state = {
            persons: []
        };
    }

    componentDidMount() {
        axios.get('http://localhost:8000/api/v2/persons')
            .then((response) => {
                console.log(response);
                this.setState({
                    persons: response.data,
                });
            });
    }

    render() {
        return (
            <div>
                <Typography variant="h4" component="h4">
                    Meet Mentors
                </Typography>
                <Grid container spacing={3}>
                    {this.state.persons.map((person) =>
                        <Grid item xs={12} sm={6} md={4} lg={3} key={person.id} style={{marginTop: '1rem'}}>
                            <MentorCard
                                title={person.name}
                                description={person.desc}
                                type={person.type}
                                location={person.location}
                            />
                        </Grid>
                    )}
                </Grid>
            </div>
        )
    }
}

export default Mentors;
