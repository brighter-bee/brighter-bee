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


	handleSubmit = (event) => {
	    event.preventDefault();
		console.log(this.state)
		this.setState({participants : this.state.participants.concat(localStorage.getItem("user"))})
		try {
			if (this.state.time != null && this.state.date != null && this.state.duration != null) {
				axios.post('http://localhost:8000/api/v2/meetings/new', this.state)
					.then((response) => {
						console.log(response);
						console.log("Posted")
						alert("Success! Refresh to see the new meeting")
						//ReactDOM.render(<div> {response['data']} </div>, document.getElementById('meetings_list'))
					}, (error) => {
						console.log(error);
					});
			} else {
				console.log("else?")
			}
		} catch (exception) {
			console.log("g")
		}

	}


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

	getZoomLink = (meetingId) => {
		console.log(meetingId)
		axios.get('http://localhost:8000/api/v2/meetings/' + meetingId)
		.then((response) => {
			console.log(response)
			window.open(response['data']['url'], "_blank")
		})
	}

	cancelMeeting = (meetingId) => {
		axios.delete('http://localhost:8000/api/v2/meetings/' + meetingId)
		.then((response) => {
			console.log(response)
		})
		window.location.reload(false)
	}

	getUsername = (userID) => {
		var index;
		console.log(this.state.options)
		for (index in this.state.options) {
			if (userID == this.state.options[index]['value']) {
				console.log("MATCHED")
				return this.state.options[index]['label']
			}
		}
		return "Not found"

	}

  	render() {
	    return (
	      <div>
			<Typography>
			<h1> Plan your meetings </h1>
			<h3> Create a New Meeting </h3>
			<FormControl>
			<form onSubmit = {this.handleSubmit}>
				Select a topic for your meeting <br></br>
				<input type="text" name="topic" onChange={this.myChangeHandler}/> <br></br>

				Select a date for your meeting <br></br>
				<input type="date" name="date" onChange={this.myChangeHandler}/> <br></br>

				Select a time for your meeting <br></br>
				<input type="time" name="time" onChange={this.myChangeHandler}/> <br></br>

				Select a duration for your meeting (in minutes)<br></br>
				<input type="number" name="duration" onChange={this.myChangeHandler}/> <br></br>

				Select participants (including yourself)
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
