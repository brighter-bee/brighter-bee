import React, {Component} from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import axios from "axios";

class Profile extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
            location: '',
            desc: '',
            avatar: ''
        };
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
                    avatar: response.data[0].avatar
                });
            });
    }

    updateField(e) {
        e.preventDefault();
        const target = e.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    updateProfile(e) {
        e.preventDefault();
        axios.patch('http://localhost:8000/api/v2/persons/' + localStorage.getItem('user') + '/', this.state)
            .then((response) => {
                console.log(response);
            });
    }

    render() {
        return (
            <React.Fragment>
                <Grid container spacing={3} justify="space-between">
                    <Typography variant="h6" gutterBottom>
                        My Profile
                    </Typography>
                    <Avatar alt={this.state.name} src={this.state.avatar}/>
                    <Button
                        variant="contained"
                        component="label"
                    >
                        Upload Avatar
                        <input
                            type="file"
                            style={{display: "none"}}
                            name="avatar"
                            onChange={this.updateField}
                        />
                    </Button>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="name"
                            name="name"
                            label="Name"
                            fullWidth
                            value={this.state.name}
                            onChange={this.updateField}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="location"
                            name="location"
                            label="Location"
                            fullWidth
                            value={this.state.location}
                            onChange={this.updateField}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            id="desc"
                            name="desc"
                            label="Description"
                            fullWidth
                            value={this.state.desc}
                            onChange={this.updateField}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.updateProfile}
                        >
                            Update
                        </Button>
                    </Grid>
                </Grid>
            </React.Fragment>
        )
    }
}

export default Profile;
