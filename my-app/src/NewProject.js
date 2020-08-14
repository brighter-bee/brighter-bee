import React, {Component} from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from "axios";
import Chip from "@material-ui/core/Chip";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import InputAdornment from "@material-ui/core/InputAdornment";
import {Book, Build, Create, Email, Timelapse, Timer} from "@material-ui/icons";
import Skills from "./Skills";
import Typography from '@material-ui/core/Typography';


// Add project page
class NewProject extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
            desc: '',
            start_date: '2020-08-15T08:00',
            duration: '',
            skills: [],
            success: false
        };
        this.updateField = this.updateField.bind(this);
        this.addProject = this.addProject.bind(this);
    }

    updateField(e) {
        e.preventDefault();
        const target = e.target;
        const name = target.name;

        let value = target.value;

        this.setState({
            [name]: value
        });
    }

    addProject(e) {
        e.preventDefault();
        axios.post('http://localhost:8000/api/project/', this.state)
            .then((response) => {
                    console.log(response);
                    this.setState({
                        success: true
                    });
                }, (error) => {
                    console.log(error);
                }
            );
    }

    updateSkills(skills) {
        this.setState({
            skills: skills
        });
        console.log(this.state);
    }

    render() {
        return (
          <div>
          <Typography variant="h4" component="h4">
          Add a new project
          </Typography>
          <br></br>
          <br></br>
            <React.Fragment>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            required
                            id="name"
                            name="name"
                            label="Name"
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Book/>
                                    </InputAdornment>
                                ),
                            }}
                            value={this.state.name}
                            onChange={this.updateField}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            required
                            id="start_date"
                            name="start_date"
                            label="Start Date"
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Timer/>
                                    </InputAdornment>
                                ),
                            }}
                            value={this.state.start_date}
                            onChange={this.updateField}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            required
                            id="duration"
                            name="duration"
                            label="Duration"
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Timelapse/>
                                    </InputAdornment>
                                ),
                            }}
                            value={this.state.duration}
                            onChange={this.updateField}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            required
                            id="email"
                            name="email"
                            label="Contact Email"
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email/>
                                    </InputAdornment>
                                ),
                            }}
                            value={this.state.email}
                            onChange={this.updateField}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="desc"
                            name="desc"
                            label="Description"
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Create/>
                                    </InputAdornment>
                                ),
                            }}
                            value={this.state.desc}
                            onChange={this.updateField}
                        />
                    </Grid>
                    <Skills handleSkills={this.updateSkills.bind(this)} skills={this.state.skills}/>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={this.addProject}
                        >
                            Post
                        </Button>
                    </Grid>
                    <Snackbar open={this.state.success} autoHideDuration={6000} anchorOrigin={{horizontal: 'center', vertical: 'top'}} onClose={() => this.setState({success: false})}>
                        <Alert severity="success">
                            You have posted a project!
                        </Alert>
                    </Snackbar>
                </Grid>
            </React.Fragment>
            </div>
        )
    }
}

export default NewProject;
