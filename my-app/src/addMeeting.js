import React from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom'
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { withStyles }  from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from "@material-ui/core/Button";
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from "@material-ui/core/FormControl";
import TextField from '@material-ui/core/TextField';


// Create meeting page
const animatedComponents = makeAnimated();
class AddMeeting extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			time: null,
			date: null,
			duration: null,
			topic: null,
			participants: null,
			meetingsList: [],
			options: [],
		};
	}

	// Post request to backend to create the meeting
	handleSubmit = (event) => {
	    event.preventDefault();
		console.log(this.state)
		try {
			if (this.state.participants != null && this.state.time != null && this.state.date != null && this.state.duration != null) {
				axios.post('http://localhost:8000/api/v2/meetings/new', this.state)
					.then((response) => {
						this.setState({participants : this.state.participants.concat(localStorage.getItem("user"))})
						console.log(response);
						console.log("Posted")
						window.location = '/home/meetings';
						//ReactDOM.render(<div> {response['data']} </div>, document.getElementById('meetings_list'))
					}, (error) => {
						console.log(error);
						alert("Too many requests, please try again!");
					});
			} else {
				console.log("else?")
				alert("Invalid inputs")
			}
		} catch (exception) {
			console.log("g")
		}

	}

	// Gets all the users and their usernames
 	componentDidMount() {
		console.log(localStorage.getItem("user"))
		axios.get('http://localhost:8000/api/v2/persons').then(	res => {
				var user;
				for (user in res['data']) {
					var newList = this.state.options.concat({value: res['data'][user]['id'], label: res['data'][user]['name']});
					this.setState({options : newList});
				}
		});
	}

    myChangeHandler = (event) => {
		console.log(event.target.name)
		console.log(event.target.value)

    	let nam = event.target.name;
    	let val = event.target.value;
    	this.setState({[nam]: val});
	}

	selectChange = (selected) => {
		this.setState({participants: selected});
	}

	// Given a user ID, finds the username in the user options list
	getUsername = (userID) => {
		var index;
		console.log(this.state.options)
		for (index in this.state.options) {
			if (userID == this.state.options[index]['value']) {
				return this.state.options[index]['label']
			}
		}
		return "Not found"

	}

  	render() {
	    return (
			<div style={{fontFamily: 'Roboto'}}>
			<Typography variant="h4" component="h4">
			Plan your meetings
			</Typography>
			<Typography>
			<FormControl>
			<form onSubmit = {this.handleSubmit}>
				<h3> Pick a topic </h3>
				<TextField required id="topic" name="topic" onChange={this.myChangeHandler} label="Topic"/>
				<h3> Select a time and date </h3>
				<TextField required id="date" type="date" name="date" onChange={this.myChangeHandler}/> <br></br>
				<TextField required id="time" type="time" name="time" onChange={this.myChangeHandler}/>
				<h3> How many minutes do you want to meet for? </h3>
				<TextField required id="duration" name="duration" onChange={this.myChangeHandler} label="Duration"/>
				<h3> Who do you want to meet with? </h3>
				<h6 style={{marginTop: '-20px'}}> *Please include yourself if required </h6>

			    <Select name="participants" onChange={this.selectChange}
			      closeMenuOnSelect={false}
			      components={animatedComponents}
			      isMulti
			      options={this.state.options}
						autoWidth
			    /><br></br>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={this.handleSubmit}
                        >
                            Create Meeting
                        </Button>
			</form>
			</FormControl>
			</Typography>
	      </div>
	    );
  	}
}

export default AddMeeting;

// <TextField id="standard-basic" type="number" label="duration" onChange={this.myChangeHandler}/> <br></br>
