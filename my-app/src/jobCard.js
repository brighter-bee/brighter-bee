import React,{useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

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
  let string1;

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          {props.company}
        </Typography>
        <Typography variant="h5" component="h2">
         {props.title.replace('<strong>','').replace('</strong>','')}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {props.location}
        </Typography>
        <Typography variant="body2" component="p">
          {props.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button variant="contained" color="primary" href={props.url} size="small">Apply</Button>
        <Button  variant="contained" color="primary" size="small">Save</Button>
      </CardActions>
    </Card>
  );
}