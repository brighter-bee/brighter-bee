import React from 'react';
import { withStyles }  from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from "@material-ui/core/Button";
import axios from 'axios';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

var  flag = false // console.log flag

const useStyles = theme => ({
  root: {
    display: 'flex',
    fontFamily: 'Roboto',
    minWidth: 275,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  title: {
      flexGrow: 1,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
});


class Project extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
          userData:{
              person_id: localStorage.getItem('user'),
              projects: []

          }
        }
      }

      componentDidMount() {
          this.getProjects();
      }

      async getProjects() {
          await axios.get('http://localhost:8000/project-recommend/' + this.state.userData.person_id)
          .then(response => {
              if (flag) {
                console.log(response)}
              this.setState({
                userData:{

                    projects: response.data
                }
              })
              if (flag) {
                console.log(this.state.userData.projects)}
          })
          .catch(error => {
              console.log(error)
          });
      }

      state = {
        showMessage: false
      }

      onButtonClickHandler = () => {
       this.setState({showMessage: true});
      }

      onButtonClickHandler2 = () => {
       this.setState({showMessage: false});
      }

      handleEmail ({email, name,}) {
        window.location = `mailto:${email}?subject=${name}`;
      }

  render() {

    return (
    <div style={{fontFamily: 'Roboto'}}>
    <Typography variant="h4" component="h4">
    Following projects best match to your profile
    </Typography>
      <br></br>
      <br></br>

      {this.state.userData.projects.map((item, index) => (
        <div>
        <Card variant="outlined">
          <CardContent>

        <Typography >
          <h3>&nbsp; {item.name} </h3>
          <h4>&nbsp; &nbsp; Skills required: <span style={{fontWeight: "normal"}}>{item.skills} </span></h4>
          <h4>&nbsp; &nbsp; Project duration: <span style={{fontWeight: "normal"}}>{item.duration} </span></h4>
          <h4>&nbsp; &nbsp; Start date: <span style={{fontWeight: "normal"}}>{item.start_date} </span></h4>

          {this.state.showMessage && <Typography variant="body2" component="p" style={{marginLeft: "40px", textAlign: "justify", marginRight: "95px"}}>{item.desc}</Typography>}
          {this.state.showMessage ? (
            <div>
            <br></br>
            <CardActions>
            <Button variant="contained" color="primary" size="small" onClick={this.onButtonClickHandler2}>Show less</Button>
            <Button variant="contained" color="primary" size="small" onClick={() => this.handleEmail(item) }>Apply</Button>
            </CardActions>
            </div>
          ) : (
            <div>
            <h4>&nbsp; &nbsp; Brief description: </h4><Typography variant="body2" component="p" style={{marginLeft: "40px", textAlign: "justify", marginRight: "95px"}} >{item.short_desc}</Typography>
            <br></br>
            <CardActions>
            <Button variant="contained" color="primary" size="small" onClick={this.onButtonClickHandler}>More info</Button>
            <Button variant="contained" color="primary" size="small" onClick={() => this.handleEmail(item) }>Apply</Button>
            </CardActions>
            </div>
          )}

        </Typography>

        </CardContent>
        </Card>
        <br></br>
        </div>

      ))}


    </div>);
  }
};



class ProjectRecommend extends React.Component {
  constructor(props) {
     super(props);
     }

  render() {
     const { classes } = this.props;

  return (

        <div>
          {<Project />}
        </div>
  );
}
}

export default withStyles(useStyles)(ProjectRecommend);




// export default function FindProjectsPage(props){
//     return (
//         <div>
//             This is the Find Projects Page
//         </div>
//     )
//
// }
