import React, {useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";


// Mentor card component
const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});

export default function MentorCard(props) {
    const classes = useStyles();

    function renderSwitch(param) {
        switch (param) {
            case 'S':
                return 'Student';
            case 'A':
                return 'Academic Mentor';
            case 'I':
                return 'Industry Mentor';
            case 'Z':
                return 'Organization Representative';
            case 'O':
                return 'Admin';
            default:
                return 'User';
        }
    }

    return (
        <Grid>
            <Card className={classes.root} variant="outlined">
                <CardContent>
                    <Typography className={classes.title} gutterBottom>
                        {renderSwitch(props.type)}
                    </Typography>
                    <Typography variant="h5" component="h2">
                        {props.title}
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                        {props.location}
                    </Typography>
                    <Typography variant="body2" component="p" style={{textAlign: "justify"}}>
                        {props.description}
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    );
}
