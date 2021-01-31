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
      totalMistakes: 0 //total amount of mistakes the user made despite correcting
    }
    this.refresh = this.refresh.bind(this);
    this.onKeyPressed = this.onKeyPressed.bind(this);
  }
  
  onKeyPressed(e){
    //let baseString = this.test.innerText;
    let counter = this.state.indexInQuote;
    let quoteSpan = document.getElementById('quote');
    let currNode = quoteSpan.childNodes[counter];
    let prevNode = quoteSpan.childNodes[counter-1];
    let nextNode = quoteSpan.childNodes[counter+1];
    
    if (this.state.indexInQuote + 1 === this.state.quote.length){
      this.refresh();
      return;
    }
          //checks for backspace
    if (e.key==="Backspace"){
      //need to remove the correct or wrong class on each span
      if (this.state.indexInQuote !== 0){
        //stringy = stringy.slice(0,-1);
        prevNode.innerText = this.state.quote[counter-1];
        //instead of removing child, we will delete the right/wrong class attribute
        counter--;

        currNode.classList.remove("underline", "correct", "wrong");
        prevNode.classList.remove("correct", "wrong");
        prevNode.classList.add("underline");

      }
    } 
    else if (e.key.length===1) {
      //append to growing string to update state
      //stringy += e.key;
      //extract last letter to create separate span
      currNode.innerText === e.key ? currNode.classList.add("correct") : currNode.classList.add("wrong");
      currNode.innerText = e.key;
      nextNode.classList.add("underline");
      if (this.state.indexInQuote >= 0){
        currNode.classList.remove("underline");
      }
      counter++;
    } 
    this.setState({indexInQuote: counter})

    console.log(this.state.indexInQuote);

  
  }

  refresh(){
    this.setState({quote: ''})
    let quoteSpan = document.getElementById('quote');
    quoteSpan.innerHTML= '';
    randomQuote().then(x => {
      this.setState({quote: x})
      for (let i = 0; i<x.length; i++){
        let newSpan = document.createElement("span");
        (i === x.length) ? newSpan.innerText = " " : newSpan.innerText = x[i];
        quoteSpan.insertAdjacentElement('beforeend', newSpan);
      }
      
      let currNode = quoteSpan.childNodes[0];
      currNode.classList.add("underline");

    });
    this.setState({indexInQuote: 0})

  }

  //when component mounts, make the div in focus
  componentDidMount(){
    this.div.focus();
    let quoteSpan = document.getElementById('quote');

    document.addEventListener('keydown', this.onKeyPressed);
    randomQuote().then(x => {
      this.setState({quote: x})
      for (let i = 0; i<x.length+1; i++){
        let newSpan = document.createElement("span");
        (i === x.length) ? newSpan.innerText = " " : newSpan.innerText = x[i];
        quoteSpan.insertAdjacentElement('beforeend', newSpan);
      }
      
      let currNode = quoteSpan.childNodes[0];
      currNode.classList.add("underline");

    });

  }
  //removieng eventlistener
  componentDidUnMount(){
    document.removeEventListener('keydown', this.onKeyPressed);
  }

render(){
  console.log(this.state.quote);

  return (
    <div className="App" onKeyDown={this.onKeyPressed} ref={(c) => {this.div = c;}}>
      <header className="App-header">
        <p id="quote" ref = {(e) => {this.test = e;}}></p>

      </header>
    </div>
  );
}
}

export default App;
