import './App.css';
import { Component } from 'react';
import randomQuote from "./quote";

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      mystring: '', //current string the user is typing
      indexInQuote: 0, //keeps track of index to know which child node to alter class
      quote: '', //original quote rendered
      totalChars: 0, //total amount of characters
      totalMistakes: 0, //total amount of mistakes the user made despite correcting
      startedTyping: false,
      time: 1,
      start: 0
    }
    this.refresh = this.refresh.bind(this);
    this.onKeyPressed = this.onKeyPressed.bind(this);
    this.ticker = this.ticker.bind(this);

  }

  ticker(){
    this.setState({
      start: Date.now()
    })
    let timePara = document.getElementById("time");
    setInterval( () => {
      if (this.state.time === 0){
        return;
      }
      let realtime = Date.now() - this.state.start;
      realtime /= 1000;
      realtime = Math.floor(realtime);
      timePara.innerHTML = `0:${60-realtime}`;
      this.setState({time: 60 - realtime});
      console.log(this.state.time);
    }, 1000);
    console.log("test");

  }
  
  onKeyPressed(e){
    if (this.state.time === 0) return;
    let counter = this.state.indexInQuote;
    let quoteSpan = document.getElementById('quote');
    let currNode = quoteSpan.childNodes[counter];
    let prevNode = quoteSpan.childNodes[counter-1];
    let nextNode = quoteSpan.childNodes[counter+1];
    
    if (this.state.indexInQuote + 1 === this.state.quote.length){
      this.refresh();
      return;
    }

    if (e.key==="Backspace"){
      //need to remove the correct or wrong class on each span
      if (this.state.indexInQuote !== 0){
        prevNode.innerText = this.state.quote[counter-1];
        counter--;
        currNode.classList.remove("underline", "correct", "wrong");
        prevNode.classList.remove("correct", "wrong");
        prevNode.classList.add("underline");

      }
    } 
    else if (e.key.length===1) {
      currNode.innerText === e.key ? currNode.classList.add("correct") : currNode.classList.add("wrong");
      e.key === " " ? currNode.innerText = this.state.quote[counter] : currNode.innerText = e.key;
      nextNode.classList.add("underline");
      if (this.state.indexInQuote >= 0){
        currNode.classList.remove("underline");
      }
      counter++;
    } 
    this.setState({indexInQuote: counter})
    if (this.state.startedTyping === false){
      this.ticker();
    }
    this.setState({startedTyping: true});

    //console.log(this.state.indexInQuote);
  }

  apiCall(node){
    randomQuote().then(x => {
      this.setState({quote: x})
      for (let i = 0; i<x.length; i++){
        let newSpan = document.createElement("span");
        (i === x.length) ? newSpan.innerText = " " : newSpan.innerText = x[i];
        node.insertAdjacentElement('beforeend', newSpan);
      }
      let currNode = node.childNodes[0];
      currNode.classList.add("underline");
    });
  }

  refresh(){
    this.setState({quote: ''})
    let quoteSpan = document.getElementById('quote');
    quoteSpan.innerHTML= '';
    this.apiCall(quoteSpan);
    this.setState({indexInQuote: 0})
  }

  //when component mounts, make the div in focus
  componentDidMount(){
    console.log("ComponentDidMount called")
    this.div.focus();
    let quoteSpan = document.getElementById('quote');
    document.addEventListener('keydown', this.onKeyPressed);
    this.apiCall(quoteSpan);
  }

  //removieng eventlistener
  componentDidUnMount(){
    document.removeEventListener('keydown', this.onKeyPressed);
  }

render(){
  console.log(this.state.quote);
  let upperPara = document.getElementById("time");
  
  if (this.state.time === 0) upperPara.innerText = "WPM: ";

  return (
    <div className="App" onKeyDown={this.onKeyPressed} ref={(c) => {this.div = c;}}>
      <header className="App-header">
      <p id="time">Start typing to start the timer! </p>
        <p id="quote" ref = {(e) => {this.test = e;}}></p>

      </header>
    </div>
  );
}
}

export default App;
