import React from 'react'
import moment from 'moment'
import { Grid, Panel, Jumbotron, Button, PageHeader, ListGroup, ListGroupItem, Form, FormControl, FormGroup, InputGroup, ControlLabel, Glyphicon } from 'react-bootstrap';

export default class ChatRoom extends React.Component {
    constructor(props, context) {
        super(props, context)
        this.updateMessage = this.updateMessage.bind(this)
        this.submitMessage = this.submitMessage.bind(this)
        this.state = {
            message: {
                user: 'anonymous',
                text: '',
                date: moment().format('MMMM Do YYYY, h:mm:ss a')
            },
            messages: [
            ]
        }
    }

    componentDidMount() {
        //var test = process.env
        console.log(process.env.apiKey)
        console.log(process.env)
        // connect to firebase when components mount
        firebase.database().ref('messages/').on('value', (snapshot) => {
            const currentMessages = snapshot.val()
            if (currentMessages != null) {
                this.setState({
                    messages: currentMessages.reverse()
                })
            }
        })
    }

    updateMessage(event) {
        event.preventDefault();
        //console.log('updateMessage: ' + event.target.name + ' value: ' + event.target.value)
        if (event.target.name === 'text') {
            this.setState({
                text: event.target.value
            })
        }

        let newMessage = Object.assign({}, this.state.message)
        newMessage[event.target.name] = event.target.value
        this.setState({
            message: newMessage
        })
    }
    submitMessage(event) {
        console.log('submitMessage: ' + this.state.message)
        const nextMessage = {
            id: this.state.messages.length,
            text: this.state.message.text,
            user: this.state.message.user,
            date: this.state.message.date,
        }

        firebase.database().ref('messages/' + nextMessage.id).set(nextMessage)
        // var list = Object.assign([], this.state.messages)
        // list.push(nextMessage)
        let newMessage = Object.assign({}, this.state.message)
        newMessage['text'] = ''
        this.setState({
            message: newMessage
        })

    }
    render() {
        const currentMessage = this.state.messages.map((message, i) => {
            return (
                <ListGroupItem key={message.id}><b>{message.user}</b>: {message.text} <br />
                    <em style={{ fontSize: '10px' }}>{message.date}</em></ListGroupItem>
            )
        })

        return (
            <Grid>
                <PageHeader>
                    <Glyphicon glyph="blackboard" /> REACHAT <small>Reach out and Chat</small>
                </PageHeader>

                <Panel collapsible defaultExpanded header="Chat Room" bsStyle="danger" style={{maxHeight: 300, overflow: 'scroll'}}>
                    <ListGroup fill>
                        {currentMessage}
                    </ListGroup>
                </Panel>

                <Panel collapsible defaultExpanded header="Your Input" bsStyle="info">
                    <Form>
                        <FormGroup controlId="formInlineName">
                            <ControlLabel>Username</ControlLabel>
                            <FormControl type="text" placeholder="username" name="user" onChange={this.updateMessage} />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>Message</ControlLabel>
                            <InputGroup>

                                <FormControl type="text" name="text" onChange={this.updateMessage} placeholder='message' value={this.state.message.text} />
                                <InputGroup.Button>
                                    <Button bsStyle="primary" onClick={this.submitMessage}>Send</Button>
                                </InputGroup.Button>
                            </InputGroup>
                        </FormGroup>
                    </Form>
                </Panel>


            </Grid>
        )
    }
}