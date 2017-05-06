import React from 'react'
import ReactDOM from 'react-dom'
import ChatRoom from './components/ChatRoom'
import './index.css';

class App extends React.Component {
    render(){
        return (
                <ChatRoom/>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'))