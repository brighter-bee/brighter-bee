import React from 'react';
import CardActionArea from "@material-ui/core/CardActionArea/CardActionArea";
import Card from "@material-ui/core/Card/Card";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Typography from "@material-ui/core/Typography/Typography";
import CardActions from "@material-ui/core/CardActions/CardActions";
import Button from "@material-ui/core/Button/Button";
import moment from 'moment';
import axios from "axios";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import Dialog from "@material-ui/core/Dialog/Dialog";
import TextField from "@material-ui/core/TextField/TextField";
import Divider from "@material-ui/core/Divider/Divider";
import Badge from "@material-ui/core/Badge/Badge";
import MailIcon from '@material-ui/icons/Mail';
import Pagination from "@material-ui/lab/Pagination/Pagination";


// export default function CreatePostDialog() {
class CommentList extends React.Component {
    constructor(props){
    super(props);
    this.state = {
        currentPost:[],
        open_01: false,
        commentList:[],
        currentComment: '',
        discussion_list: [],
        currentPage:1,
        count:0,
        parent_id: 0,
        replyTo_id: 0,
        post_id: 0,
        };
    }

    handleReplyClick (currentComment) {

        this.setState({
            open_01: true,
            currentComment: currentComment,
            parent_id: currentComment.id,
            replyTo_id: currentComment.id,
            post_id: currentComment.post_id
        });

        axios.get("http://127.0.0.1:8000/reply/reply/", {
            params:{
                id: currentComment.id,
            }
        }).then(res => {
            this.setState({
                discussion_list: res.data,
                count: res.data[0].count,
            });
            console.log(this.state.posts);
        }).catch(err => {
            console.log(err);
        })

        // axios.get("http://127.0.0.1:8001/forum/"+reply_id+"/").then(res => {
        //     this.setState({
        //         commentList: res.data,
        //     });
        // }).catch(err => {
        //     console.log(err);
        // })
    };

    handleClose_01 = () => {
        this.setState({
            open_01: false
        })
    };

    render() {

        //generate the post list in the forum home page
        const reply_list = this.props.data.map(reply =>
            <CardActionArea key={reply.id} component="a" onClick={()=>this.handleReplyClick(reply)}>
                <Card style={{display: 'flex',}} variant="outlined">
                    <div style={{flex: 1,}} >

                        <Typography variant="subtitle1" paragraph component="h7">
                            <div style={{marginLeft:10}}>@{reply.replyTo_id}</div>
                            <div style={{marginLeft:20}} dangerouslySetInnerHTML={{__html:reply.content.length>160 ? reply.content.substr(0, 160) + "..." : reply.content}}></div>
                        </Typography>

                        <CardActions>
                        <Button color='primary'> View all replies </Button>
                        <Badge badgeContent={4} color="primary">
                            <MailIcon />
                        </Badge>
                        <Typography variant="subtitle1" color="textSecondary" style={{position: 'relative',
                            left: '72%',}} component="h5">
                            {moment(reply.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                        </Typography>
                        </ CardActions>
                    </div>
                </Card>
            </CardActionArea>
        );

        const reply_reply = this.state.discussion_list.map(reply_reply =>
            <CardActionArea component="a">
                <Card style={{display: 'flex',}} variant="outlined">
                    <div style={{flex: 1,}} >
                        <CardContent>
                        <Typography variant="subtitle1" paragraph component="h7">
                            <div>@{reply_reply.replyTo_id}</div>
                            <div style={{marginLeft:20}} dangerouslySetInnerHTML={{__html:reply_reply.content}}></div>
                        </Typography>
                        </CardContent>
                        <CardActions>
                            <Button color="primary">reply</Button>
                            <div style={{position: 'relative', left: '80%'}}>author</div>
                        </ CardActions>
                    </div>
                </Card>
            </CardActionArea>
        );


        return (
            <div>
                {reply_list}
                <div>
                    <Dialog open={this.state.open_01} onClose={this.handleClose_01}
                            maxWidth='xl' aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">Replies box</DialogTitle>
                        <Divider />
                        <div style={{marginLeft:20, marginTop:10}}>{this.state.currentComment.id}</div>
                        <div style={{marginLeft:20}} dangerouslySetInnerHTML={{__html:this.state.currentComment.content}}></div>
                        <Divider />

                        <DialogContent style={{width: 1000, height: 400}}>
                            {reply_reply}
                            <Pagination count={this.state.count} color="primary" style={{position: 'relative',
                                left: '65%', marginTop:10}} page={this.state.currentPage} onChange={this.handlePageChange}
                                    showFirstButton showLastButton />
                        </DialogContent>
                        <Divider />

                        <form>
                            <TextField label={"@@"} style={{width:100}} disabled={true} placeholder="@" multiline/>
                            <TextField label="Reply here" style={{width:800}} placeholder="" multiline/>
                            <Button color="primary" style={{marginTop:10}}>reply</Button>
                        </form>

                    </Dialog>
                </div>
            </div>
        );
    }
}

export default (CommentList);
