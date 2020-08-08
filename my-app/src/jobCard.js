import React,{useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

export default function JobCard(props) {
  const classes = useStyles();
  var sanitizeHtml = require('sanitize-html');

  
  const handleSaveJob = () =>{
    // add job to opportunity table
    let item = {
        "type": "J",
        "name": sanitizeHtml(props.title,{allowedTags: []}),
        "company_name":  props.company,
        "location": props.location,
        "desc": sanitizeHtml(props.description,{allowedTags:[]}),
        "link": props.url,
        "skills": []
    }
    axios.post('http://localhost:8000/api/opportunity/',item)
    .then((resp)=>{
      console.log(resp);
      // add opportunity id to list of opportunities for that user
    }).catch((err)=>{
      console.log(err);
    })
  }

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
         {props.company}
        </Typography>
        <Typography variant="h5" component="h2">
         {sanitizeHtml(props.title,{allowedTags: []})}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {props.location}
        </Typography>
        <Typography variant="body2" component="p">
          {sanitizeHtml(props.description,{allowedTags:[]})}
        </Typography>
      </CardContent>
      <CardActions>
        <Button variant="contained" color="primary" href={props.url} size="small">Apply</Button>
        <Button  variant="contained" color="primary" size="small" onClick={handleSaveJob}>Save</Button>
      </CardActions>
    </Card>
  );
}
