import React, {Component} from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import axios from "axios";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Chip from "@material-ui/core/Chip";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import InputAdornment from "@material-ui/core/InputAdornment";
import {Build, Create, DescriptionOutlined, Person, PersonPin, Work} from "@material-ui/icons";

class Profile extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
            location: '',
            desc: '',
            type: '',
            skills: [],
            success: false
        };
        this.resume = '';
        this.updateField = this.updateField.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
    }

    componentDidMount() {
        axios.get('http://localhost:8000/api/v2/persons?user=' + localStorage.getItem('user'))
            .then((response) => {
                console.log(response);
                this.setState({
                    name: response.data[0].name,
                    location: response.data[0].location,
                    desc: response.data[0].desc,
                    type: response.data[0].type,
                    skills: response.data[0].skills,
                });
                this.resume = response.data[0].resume;
            });
    }

    updateField(e) {
        e.preventDefault();
        const target = e.target;
        const name = target.name;

        if (name === 'resume') {
            this.resume = target.files[0];
            return;
        }

        let value = target.value;

        this.setState({
            [name]: value
        });
    }

    updateProfile(e) {
        e.preventDefault();
        axios.patch('http://localhost:8000/api/v2/persons/' + localStorage.getItem('user') + '/', this.state)
            .then((response) => {
                    console.log(response);
                    this.setState({
                        success: true
                    });
                }, (error) => {
                    console.log(error);
                }
            );
        let data = new FormData();
        data.append(
            "resume",
            this.resume
        );
        axios.patch('http://localhost:8000/api/v2/persons/' + localStorage.getItem('user') + '/', data)
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

    render() {
        return (
            <React.Fragment>
                <Grid container spacing={3} justify="space-between">
                    <Typography variant="h6" gutterBottom>
                        My Profile
                    </Typography>
                    <Avatar>{this.state.name}</Avatar>
                </Grid>
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
                                        <Person/>
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
                            id="location"
                            name="location"
                            label="Location"
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonPin/>
                                    </InputAdornment>
                                ),
                            }}
                            value={this.state.location}
                            onChange={this.updateField}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl style={{width: "100%"}}>
                            <InputLabel id="demo-simple-select-label">Role</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                name="type"
                                startAdornment={
                                    <InputAdornment position="start">
                                        <Work/>
                                    </InputAdornment>
                                }
                                value={this.state.type}
                                onChange={this.updateField}
                            >
                                <MenuItem value="S">Student</MenuItem>
                                <MenuItem value="A">Academic Mentor</MenuItem>
                                <MenuItem value="I">Industry Mentor</MenuItem>
                                <MenuItem value="Z">Organization</MenuItem>
                                <MenuItem value="O">Others</MenuItem>
                            </Select>
                        </FormControl>
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
                    <Grid item xs={12} sm={6}>
                        <div>Skills:</div>
                        <Build/>
                        {this.state.skills.map((item, index) => (
                            <Chip key={index} label={item}/>
                        ))}
                    </Grid>
                    <Grid item xs={12} style={{marginBottom: "50px"}}>
                        <InputLabel id="demo-simple-select-label" style={{marginBottom: "10px"}}>Resume</InputLabel>
                        <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            component="label"
                        >
                            <DescriptionOutlined/>
                            Upload
                            <input
                                type="file"
                                name="resume"
                                style={{display: "none"}}
                                onChange={this.updateField}
                            />
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={this.updateProfile}
                        >
                            Update
                        </Button>
                    </Grid>
                    <Snackbar open={this.state.success} autoHideDuration={6000} anchorOrigin={{horizontal: 'center', vertical: 'top'}} onClose={() => this.setState({success: false})}>
                        <Alert severity="success">
                            You have updated your profile!
                        </Alert>
                    </Snackbar>
                </Grid>
            </React.Fragment>
        )
    }
}

export default Profile;
