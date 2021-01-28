import './App.css';
import { Component } from 'react';
import randomQuote from "./quote";

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      mystring: '',
      lettercount: 0, //keeps track of index to know which child node to alter class
      quote: '' 
    }
    this.onKeyPressed = this.onKeyPressed.bind(this)
  }
  
  onKeyPressed(e){
    let baseString = this.test.innerText;
    let counter = this.state.lettercount;
    let stringy = this.state.mystring
    let quoteSpan = document.getElementById('quote');
    let currNode = quoteSpan.childNodes[counter];

    //let newSpan = document.createElement("span");
    //let para = document.getElementById('para')

    //checks for backspace
    if (e.key==="Backspace"){
      //need to remove the correct or wrong class on each span
      if (stringy !== ''){
        stringy = stringy.slice(0,-1);
        //instead of removing child, we will delete the right/wrong class attribute
        //para.removeChild(para.lastElementChild);
        counter--;
        this.setState({lettercount: counter})
      }
    } else if (e.key.length>1){
      stringy += '';
    } else if (e.key.length===1) {
      //append to growing string to update state
      stringy += e.key;
      //extract last letter to create separate span
      let lastLetter = stringy[stringy.length-1];
      //newSpan.innerText = lastLetter
      
      //need to check this current letter against the last letter 
      //para.insertAdjacentElement('beforeend', newSpan);

      currNode.innerText === lastLetter ? currNode.classList.add("correct") : currNode.classList.add("wrong");
      counter++;
      this.setState({lettercount: counter})
    } 
    this.setState({mystring: stringy});

    //this.bitch.innerText = this.state.mystring;
    console.log(this.state.mystring);
    //console.log(textNode);
  }

  //when component mounts, make the div in focus
  componentDidMount(){
    this.div.focus();
    let quoteSpan = document.getElementById('quote');
    //console.log(this.state.mystring);
    document.addEventListener('keydown', this.onKeyPressed);
    randomQuote().then(x => {
      //this.test.innerText = x;
      for (let i = 0; i<x.length; i++){
        let newSpan = document.createElement("span");
        newSpan.innerText = x[i];
        quoteSpan.insertAdjacentElement('beforeend', newSpan);
      }
    });
  }
  //removieng eventlistener
  componentDidUnMount(){
    document.removeEventListener('keydown', this.onKeyPressed);
  }

render(){

  return (
    <div className="App" onKeyDown={this.onKeyPressed} ref={(c) => {this.div = c;}}>
      <header className="App-header">
        <p id="para" ref = {(d) => {this.bitch = d;}}></p>
        <p id="quote" ref = {(e) => {this.test = e;}}></p>
      </header>
    </div>
  );
}
}

export default App;
