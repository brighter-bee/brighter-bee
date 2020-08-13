import React from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom'
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { withStyles }  from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from "@material-ui/core/Button";

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
		axios.get('http://localhost:8000/api/v2/meetings?participants=' + localStorage.getItem("user"))
			.then((response) => {
				console.log(response);
				var index;
				for (index in response['data']) {
					var res = response['data'][index]
					var meeting_date = new Date(res['time']);
					var time = this.formatDate(meeting_date)
					var now = new Date()
					// Ensures the meeting hasn't already finished
					if (meeting_date < now.setHours(now.getHours() - 2)) {
						// meeting has already passed
						console.log("Past meeting found")
					} else {
						var title = res['name'];
						var participants = res['participants'];
						var number = res['number']
						var id = res['id']
						var newList = this.state.meetingsList.concat({"title" : title, "time" : time, "participants" : participants, "number" : number, "id" : id});
						this.setState({meetingsList : newList})
					}

				}
				console.log(this.state.meetingsList)
				//ReactDOM.render(<div> {response['data']['results']} </div>, document.getElementById('meetings_list'));
			}, (error) => {
				console.log(error);
			}	);
			// Gets the list of people
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
			window.location.reload(false)

		}, (error) => {
			alert(error)
		}
		)
	}

	// Given a userID, get the username
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

	// Changes date formatting to a more human readable form
	formatDate = (date) => {
		var options = {year : 'numeric', month :'long', day:'numeric', hour:'numeric', minute :'numeric'};
		return date.toLocaleDateString([], options);
	}

  	render() {
	    return (
			<div style={{fontFamily: 'Roboto'}}>
	    <Typography variant="h4" component="h4">
	    Your upcoming meetings
	    </Typography>

			<ol id="meetings_list">
				{this.state.meetingsList.map((item, index) => (
					<div key={item['id']}>
					<Typography>
					<p>
						Title: <b>{item['title']} </b><br></br>
						Time: {item['time']} <br></br>
						Participants:
						<ul>
							{item['participants'].map((item, index) => (
								<li key ={index}>{this.getUsername(item)}</li>
							))}
						</ul>
						<div style={{marginTop: "15px"}}>
							<Button variant="contained" color="primary" size="small" style={{marginRight: "30px"}} onClick={() => this.getZoomLink(item['id'])}>Launch Zoom</Button>
							<Button variant="contained" color="secondary" size="small" onClick={() => this.cancelMeeting(item['id'])}>Cancel Meeting</Button>
						</div>
					</p>
					</Typography>
					<hr style={{width : '50%', margin: "0"}}></hr>

					</div>
					))
				}

			</ol>
	      </div>
	    );
  	}
}

export default Meetings;
