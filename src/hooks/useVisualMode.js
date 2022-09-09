import { React, useState } from 'react';

function useVisualMode(init) {
  const [mode, setMode] = useState(init);
  const [history, setHistory] = useState([init]);

  function transition(newmode, replace = false) {
    setHistory(prev => {
      if (replace){
        prev.pop()
      }
      prev.push(newmode);
      return prev;
    })
    setMode(newmode);
  }

  function back() {
    setHistory(prev => {
      if (prev.length > 1) {
        prev.pop();
        setMode(prev[prev.length - 1])
      }
      return prev;
    })
  }

  return { mode, transition, back }
}



export default useVisualMode;
