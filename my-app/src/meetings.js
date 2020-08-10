import React from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom'
import Select from 'react-select';
import makeAnimated from 'react-select/animated';



const animatedComponents = makeAnimated();

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
			options: [],
		};
	}
	
 	componentDidMount() {
		console.log(localStorage.getItem("user"))
		// get user id and request meetings list from backend then serve them
		axios.get('http://localhost:8000/api/v2/meetings?participant=' + localStorage.getItem("user"))
			.then((response) => {
				console.log(response);
				var index;
				for (index in response['data']) {
					var res = response['data'][index]
					var title = res['name'];
					var time = res['time'];
					var participants = res['participants'];
					var i;
					var part = []
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
			axios.get('http://localhost:8000/api/v2/persons').then(	res => {
				var user;
				for (user in res['data']) {
					var newList = this.state.options.concat({value: res['data'][user]['id'], label: res['data'][user]['name']});
					this.setState({options : newList});
				}
			});
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
			<h1> Meetings Page </h1>
			<h2> Meetings List </h2>
			<ol id="meetings_list"> 
				{this.state.meetingsList.map((item, index) => (
					<div key={item['id']}>
						Title: {item['title']} <br></br>
						Time: {item['time']} <br></br>
						People:
						<ul>
							{item['participants'].map((item, index) => (
								<li key ={index}>{this.getUsername(item)}</li>
							))}
						</ul>

						<button onClick={() => this.getZoomLink(item['id'])}>Get Zoom Link</button>
						<button onClick={() => this.cancelMeeting(item['id'])}>Cancel Meeting</button>
					</div>
					))
				}
				
			</ol>
	      </div>
	    );
  	}
}

export default Meetings;
