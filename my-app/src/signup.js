import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import axios from 'axios';

class SignUpPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            password: '',
            password_confirm: '',
            first_name: '',
            last_name: ''
        };
    }

    SignUpHandler = () => {
        // check if entry exists in database
        console.log(this.state);
        axios.post('http://localhost:8000/api/v2/accounts/register/', this.state)
            .then((response) => {
                console.log(response);
                const data = {
                    "name": this.state.username,
                    "user": response.data.id,
                };
                axios.post('http://localhost:8000/api/v2/persons/new', data)
                    .then((response) => {
                        console.log(response);
                        window.location.pathname = '/login'
                    });
            }, (error) => {
                console.log(error);
            });
        // if it does throw error

        // if it does not create entry in user table in the database
        // axios.post('http://localhost:4000/api/user',this.state)
        //     .then(res=>{
        //         console.log(res)
        //         console.log(res.data)
        //     })
        //     .catch(error=>{
        //         console.log(error.response)
        //     })
        // //console.log(this.state)
        // console.log("Sign up is done")
        // redirect to login page
    };

    setUserName(event) {
        this.setState({username: event.target.value});
        this.setState({email: event.target.value});
    }

    setPassword(event) {
        this.setState({password: event.target.value});
        this.setState({password_confirm: event.target.value})
    }


    setFirstName(event) {
        this.setState({first_name: event.target.value})
    }

    setLastName(event) {
        this.setState({last_name: event.target.value})
    }

    render() {

        return (
            <div>
                <Dialog open={true}>
                    <DialogTitle id="form-dialog-title">Sign Up</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please enter your details down below.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="first-name"
                            label="First Name"
                            type="text"
                            fullWidth
                            onBlur={this.setFirstName.bind(this)}
                        />
                        <TextField
                            margin="dense"
                            id="last-name"
                            label="Last Name"
                            type="text"
                            fullWidth
                            onBlur={this.setLastName.bind(this)}
                        />
                        <TextField
                            margin="dense"
                            id="user-name"
                            label="User Name"
                            type="email"
                            fullWidth
                            onBlur={this.setUserName.bind(this)}
                        />
                        <TextField
                            margin="dense"
                            id="pswd"
                            label="Password"
                            type="password"
                            fullWidth
                            onBlur={this.setPassword.bind(this)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button href='/login'>
                            Back
                        </Button>
                        <Button onClick={this.SignUpHandler}>
                            Done
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default SignUpPage;
