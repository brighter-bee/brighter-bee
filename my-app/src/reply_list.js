import React from 'react';
import CardActionArea from "@material-ui/core/CardActionArea/CardActionArea";
import Card from "@material-ui/core/Card/Card";
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
            parent_id: 0,
            replyTo_id: 0,
            post_id: 0,
            content: '',
            reply_currentPage:1,
            reply_count:0,
            replyToChange: '@'
        };

        this.handleContentChange = this.handleContentChange.bind(this);
        this.handleReplyPageChange= this.handleReplyPageChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReplyToChange = this.handleReplyToChange.bind(this);
    }

    handleReplyClick (currentComment) {
        this.setState({
            content: '',
            open_01: true,
            currentComment: currentComment,
            parent_id: currentComment.id,
            replyTo_id: currentComment.poster,
            post_id: currentComment.post,

            replyToChange: '@' + currentComment.currentName,
        });

        axios.get("http://127.0.0.1:8000/reply/reply/", {
            params:{
                id: currentComment.id,
            }
        }).then(res => {
            this.setState({
                discussion_list: res.data,
                reply_count: res.data[0].count,
            });
            console.log(this.state.posts);
        }).catch(err => {
            console.log(err);
        })
    };

    handleClose_01 = () => {
        this.setState({
            open_01: false,
            discussion_list:[],
            reply_currentPage: 1,
            reply_count:0

        })
    };

    handleContentChange (event){
        this.setState({
            content:  event.target.value
        })
    };

    handleSubmit = () => {
        axios.post("http://127.0.0.1:8000/reply/reply/", {
            content: this.state.content,
            parent_id: this.state.parent_id,
            replyTo_id: this.state.replyTo_id,
            poster: localStorage.getItem('user'),
            post: this.state.post_id
        }).then(res => {
            console.log(res);
            alert('post successfully');
            this.handleReplyClick(this.state.currentComment);
            // this.handleClose_01();
            // this.componentDidMount();
        }).catch(err => {
            console.log(err);
            alert('error!!!')
        });

        axios.get("http://127.0.0.1:8000/reply/reply/", {
            params:{
                id: this.state.currentPost.id,
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
    };


    componentDidMount () {
        axios.get("http://127.0.0.1:8000/reply/reply/", {
            params:{
                id: this.state.currentComment.id,
                page: this.state.reply_currentPage
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
    }

    handleReplyPageChange(event, value){
        this.setState({
            reply_currentPage: value,
        }
        ,()=>{
            this.componentDidMount ();
        })
    }

    handleReplyToChange (commentDetail) {
        this.setState({
            replyToChange: '@' + commentDetail.replyReplyCurrentName,
            replyTo_id: commentDetail.poster
        });
    }

    render() {

        //for generating the replying list with the current post
        const reply_list = this.props.data.map(reply =>
            <CardActionArea key={reply.id} component="a"
                            style={{marginBottom:10}}
                            onClick={()=>this.handleReplyClick(reply)}>
                <Card style={{display: 'flex',}} variant="outlined">
                    <div style={{flex: 1,}} >

                        <Typography variant="subtitle1" paragraph component="h7">
                            <div style={{marginLeft:10}}>{reply.currentName} @{reply.replyToName}</div>
                            <div style={{marginLeft:20}} dangerouslySetInnerHTML={{__html:reply.content.length>160 ? reply.content.substr(0, 160) + "..." : reply.content}}></div>
                        </Typography>

                        <CardActions>
                        <Button color='primary'> View all replies in this thread </Button>
                        <Badge badgeContent={reply.replyNumber} color="primary">
                            <MailIcon />
                        </Badge>
                        <Typography variant="subtitle1" color="textSecondary" style={{position: 'relative',
                            left: '58%',}} component="h5">
                            commented at {moment(reply.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                        </Typography>
                        </ CardActions>
                    </div>
                </Card>
            </CardActionArea>
        );

        const reply_reply_list = this.state.discussion_list.map(reply_reply =>

                <Card style={{display: 'flex',}} variant="outlined">
                    <div style={{flex: 1}} >
                        <Typography variant="subtitle1" component="h7">
                            <div style={{marginTop:5, marginLeft:10}}>{reply_reply.replyReplyCurrentName} @{reply_reply.replyReplyToName}</div>
                            <div style={{marginLeft:20}} dangerouslySetInnerHTML={{__html:reply_reply.content}}></div>
                        </Typography>
                        <CardActions>
                            <Button color="primary"
                                    onClick={()=>this.handleReplyToChange(reply_reply)}>
                                reply
                            </Button>
                            <div style={{position: 'relative', left: '60%'}}>
                                 replied at {moment(reply_reply.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                            </div>
                        </ CardActions>
                    </div>
                </Card>
        );


        return (
            <div style={{overflow:'hidden'}}>
                {reply_list}
                <div style={{overflow:'hidden'}}>
                    <Dialog open={this.state.open_01} onClose={this.handleClose_01}
                            maxWidth='xl' aria-labelledby="form-dialog-title"
                            style={{overflow:'hidden'}} >
                        <DialogTitle id="form-dialog-title">Replies box</DialogTitle>
                        <Divider />
                        <div style={{marginLeft:25, marginTop:10}}>{this.state.currentComment.currentName}</div>
                        <div style={{marginLeft:25}} dangerouslySetInnerHTML={{__html:this.state.currentComment.content}}></div>
                        <div style={{position: 'relative', left:"80%", marginBottom:5}} >
                            {moment(this.state.currentComment.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                        </div>
                        <Divider />

                        <DialogContent style={{width: 1000, height: 400 ,overflow:'hidden'}} >
                            {reply_reply_list}
                            <Pagination count={this.state.reply_count} color="primary"
                                        style={{position: 'relative', left: '65%', marginTop:10}}
                                        page={this.state.reply_currentPage} onChange={this.handleReplyPageChange}
                                    showFirstButton showLastButton />
                        </DialogContent>
                        <Divider />

                        <form>
                            <TextField label={this.state.replyToChange} style={{width:100}} disabled={true} placeholder="@" multiline/>
                            <TextField style={{width:800}} label={'reply here'} value={this.state.content} onChange={this.handleContentChange} multiline/>
                            <Button color="primary" style={{marginTop:10}} onClick={this.handleSubmit} >
                                reply
                            </Button>
                        </form>

                    </Dialog>
                </div>
            </div>
        );
    }
}

export default (CommentList);
