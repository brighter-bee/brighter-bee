import React from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom'
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const options =  [];

axios.get('http://localhost:8000/api/v2/persons').then(	res => {
	console.log(res['data']);
	var user;
	for (user in res['data']) {
		console.log(res['data'][user]['name']);
		options.push({value: res['data'][user]['id'], label: res['data'][user]['name']});
	}
})

const animatedComponents = makeAnimated();
console.log(options)
	
class Meetings extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			time: null,
			date: null,
			duration: null,
			topic: null,
			participants: null,
			meetingsList: [],
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
		console.log("Fired")
		// get user id and request meetings list from backend then serve them
		axios.get('http://localhost:8000/api/v2/meetings')//'?participant=' + localStorage.getItem("user"))
			.then((response) => {
				console.log(response);
				var index;
				for (index in response['data']['results']) {
					var res = response['data']['results'][index]
					var title = res['name'];
					var time = res['time'];
					var participants = res['participants'];
					var number = res['number']
					var id = res['id']
					var newList = this.state.meetingsList.concat({"title" : title, "time" : time, "participants" : participants, "number" : number, "id" : id});
					this.setState({meetingsList : newList})
				}
				console.log(this.state.meetingsList)
				//ReactDOM.render(<div> {response['data']['results']} </div>, document.getElementById('meetings_list'));
			}, (error) => {
				console.log(error);
			}	);
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

  	render() {
	    return (
	      <div>
			<h1> Meetings Page </h1>
			<h2> Meetings List </h2>
			<ol id="meetings_list"> 
				{this.state.meetingsList.map((item, index) => (
					<div>
						Title: {item['title']} <br></br>
						Time: {item['time']} <br></br>
						People:
						<ul>
							{item['participants']}
						</ul>
						<button>Update</button>
						<button>Get Zoom Link</button>
						<button>Cancel Attendance</button>
					</div>
					))
				}
				
			</ol>
			<h2> Create a New Meeting </h2>
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
			    <Select name="participants" onChange={this.selectChange}
			      closeMenuOnSelect={false}
			      components={animatedComponents}
			      isMulti
			      options={options}
			    /> <br></br>
				
	
				<input type="submit" value="Submit" onSubmit = {this.handleSubmit}/>
			</form>
	      </div>
	    );
  	}
}

export default Meetings;
