import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import axios from 'axios';
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/core/SvgIcon/SvgIcon";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";

class SignUpPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            password_confirm: '',
            alertOpen: false,
        };
    }

    SignUpHandler = () => {
        // register user credentials
        console.log(this.state);
        axios.post('http://localhost:8000/api/v2/accounts/register/', this.state)
            .then((response) => {
                console.log(response);
                const data = {
                    "id": response.data.id,
                    "name": this.state.username,
                    "user": response.data.id,
                };
                // create user profile
                axios.post('http://localhost:8000/api/v2/persons/new', data)
                    .then((response) => {
                        console.log(response);
                        window.location.pathname = '/login'
                    });
            }, (error) => {
                console.log(error);
                this.setState({alertOpen: true});
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
    }

    setPassword(event) {
        this.setState({password: event.target.value});
        this.setState({password_confirm: event.target.value})
    }

    HandleClose() {
        console.log(this.state);
        this.setState({alertOpen: false})
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
                            margin="dense"
                            id="user-name"
                            label="User Name"
                            type="text"
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
                <Snackbar
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    onClose={this.HandleClose.bind(this)}
                    open={this.state.alertOpen}
                    message="Please use a uncommon password (which contain at least 8 characters of both numeric and alphabetic characters)!"
                    action={
                        <React.Fragment>
                            <IconButton size="small" aria-label="close" color="inherit" onClick={this.HandleClose.bind(this)}>
                                <CloseIcon fontSize="small"/>
                            </IconButton>
                        </React.Fragment>
                    }
                />
            </div>
        );
    }
}

export default SignUpPage;
