import React from 'react';



class Meetings extends React.Component {
	handleSubmit(event) {
	    event.preventDefault();
		if (this.time != null && this.date != null && this.duration != null) {
			// send data to backend

		}

	}
	constructor(props) {
		super(props);
		this.state = {
			time: null,
			date: null,
			duration: null,
		};
	}

	state = {
		date: new Date(),
	}
 
    myChangeHandler = (event) => {
		console.log(event.target.name)
    	let nam = event.target.name;
    	let val = event.target.value;
    	this.setState({[nam]: val});
	}
  	render() {
    return (
      <div>
		Meetings Page
		<form onSubmit = {this.handleSubmit}>
			Select a date for your meeting
			<input type="date" name="Date" onChange={this.myChangeHandler}/>
			Select a time for your meeting
			<input type="time" name="Time" onChange={this.myChangeHandler}/>
			Select a duration for your meeting
			<input type="number" name="Duration" onChange={this.myChangeHandler}/>

			<input type="submit" value="Submit" onSubmit = {this.handleSubmit}/>
		</form>
      </div>
    );
  }
}
function CreateMeeting() {
	return;}

export default Meetings;
