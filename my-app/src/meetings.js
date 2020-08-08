import React from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom'
import Select from 'react-select';
import makeAnimated from 'react-select/animated';


const options = [
	  { value: 'chocolate', label: 'Chocolate' },
	  { value: 'strawberry', label: 'Strawberry' },
	  { value: 'vanilla', label: 'Vanilla' }
]
const animatedComponents = makeAnimated();

	
class Meetings extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			time: null,
			date: null,
			duration: null,
			topic: null,
		};
	}

	handleSubmit = (event) => {
	    event.preventDefault();
		console.log(this.state)
		try {
			if (this.state.time != null && this.state.date != null && this.state.duration != null) {
				axios.post('http://localhost:8000/api/v2/meetings/new', this.state)
					.then((response) => {
						console.log(response);
						console.log("Posted")
						ReactDOM.render(<div> {response['data']} </div>, document.getElementById('meetings_list'))
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

	
 	getMeetings (event) {
		// get user id and request meetings list from backend then serve them
	}
    myChangeHandler = (event) => {
		console.log(event.target.name)
		console.log(event.target.value)

    	let nam = event.target.name;
    	let val = event.target.value;
    	this.setState({[nam]: val});
	}
  	render() {
	    return (
	      <div>
			<h1> Meetings Page </h1>
			<h2> Meetings List </h2>
			<ol onLoad={this.getMeetings} id="meetings_list"></ol>
			<form onSubmit = {this.handleSubmit}>
				Select a topic for your meeting <br></br>
				<input type="text" name="topic" onChange={this.myChangeHandler}/> <br></br>
				Select a date for your meeting <br></br>
				<input type="date" name="date" onChange={this.myChangeHandler}/> <br></br>
				Select a time for your meeting <br></br>
				<input type="time" name="time" onChange={this.myChangeHandler}/> <br></br>
				Select a duration for your meeting <br></br>
				<input type="number" name="duration" onChange={this.myChangeHandler}/> <br></br>
				Select participants
			    <Select
			      closeMenuOnSelect={false}
			      components={animatedComponents}
			      isMulti
			      options={options}
			    />
				
	
				<input type="submit" value="Submit" onSubmit = {this.handleSubmit}/>
			</form>
	      </div>
	    );
  	}
}

export default Meetings;
