import './App.css';
import { Component } from 'react';
import randomQuote from "./quote";

//num of words = numspaces + 1

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
      time: -1,
      start: 0, 
      words: 0,
    }
    this.refresh = this.refresh.bind(this);
    this.onKeyPressed = this.onKeyPressed.bind(this);
    this.ticker = this.ticker.bind(this);

  }

  ticker(){
    this.setState({
      start: Date.now(),
      time: this.state.time
    })
    let timePara = document.getElementById("time");
    let interval = setInterval( () => {
      if (this.state.time === 1){
        clearInterval(interval);
      }
      let realtime = Date.now() - this.state.start;
      realtime /= 1000;
      realtime = 5 - Math.floor(realtime);
      timePara.innerHTML = realtime <10? `0:0${realtime}` :`0:${realtime}`;
      this.setState({time: realtime});
      console.log(this.state.time);
    }, 1000);
  }
  
  onKeyPressed(e){
    if (this.state.time === 0) return;
    let counter = this.state.indexInQuote;
    let charCount = this.state.totalChars;
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
      
      if (e.key !== this.state.quote[counter]){
        this.setState({totalMistakes: this.state.totalMistakes + 1 })
      }
      if (this.state.indexInQuote > 0){
        currNode.classList.remove("underline");
      }
      if(e.key === " " && currNode.innerText === " "){
        this.setState({words: this.state.words + 1})
      }
      counter++;
      charCount++;
    } 
    this.setState({indexInQuote: counter})
    this.setState({totalChars: charCount})
    
    if (this.state.startedTyping === false){
      this.ticker();
    }
    this.setState({startedTyping: true});
    console.log(this.state.totalMistakes, this.state.totalChars);
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
    });
  }

  stats(){
    let upperPara = document.getElementById("time");
    let accuracy = (1 - this.state.totalMistakes/this.state.totalChars) * 100;
    accuracy = accuracy.toFixed(2);
    upperPara.innerText = `WPM: ${this.state.words} Accuracy: ${accuracy}%` 
    let button = document.createElement("button");
    let header = document.getElementById("yup");
    button.innerText = "Try Again";
    button.onclick = this.reload;
    header.insertAdjacentElement('beforeend', button);
  }

  reload(){
    window.location.reload();
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
  //console.log(this.state.quote);
  
  if (this.state.time === 0){
    this.stats();
  }

  return (
    <div className="App" onKeyDown={this.onKeyPressed} ref={(c) => {this.div = c;}}>
      <header id="yup" className="App-header" >
      <p id="time">Start typing to start the timer! </p>
      <p id="quote" ref = {(e) => {this.test = e;}}></p>
      </header>
    </div>
  );
}
}

export default App;
