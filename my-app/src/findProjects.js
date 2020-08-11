import React from 'react';
import { withStyles }  from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from "@material-ui/core/Button";
import axios from 'axios';

var  flag = false // console.log flag

const useStyles = theme => ({
  root: {
    display: 'flex',
    fontFamily: 'Roboto'
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

      handleEmail ({email, name}) {
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
        <Typography >
          <h3>&nbsp; {item.name} </h3>
          <h4>&nbsp; &nbsp; Skills required: <span style={{fontWeight: "normal"}}>{item.skills} </span></h4>
          <h4>&nbsp; &nbsp; Project duration: <span style={{fontWeight: "normal"}}>{item.duration} </span></h4>
          <h4>&nbsp; &nbsp; Start date: <span style={{fontWeight: "normal"}}>{item.start_date} </span></h4>
          <h4>&nbsp; &nbsp; Brief description: </h4><p style={{marginLeft: "40px", textAlign: "justify", marginRight: "95px"}} >{item.short_desc}</p>
          <Button style={{marginLeft: "40px"}} variant="contained" color="primary" size="small" onClick={() => this.handleEmail(item) }>Apply</Button><br></br>
          <br></br>
          <hr style={{margin: "0"}}></hr>
        </Typography>
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
