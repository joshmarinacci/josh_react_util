import React, {useContext} from 'react';
import './App.css';
import {HBox, Spacer,
    DialogContext, DialogContainer,
    sampleDialogContext
} from "josh_react_util";

function Content():JSX.Element {
    let dm = useContext(DialogContext)
    console.log("dm is",dm)
    return <div>
    <HBox>
        <button>hi</button>
        <Spacer></Spacer>
        <button onClick={()=>{
            dm.show(<button>I'm a dialog</button>)
        }}>there</button>
    </HBox>
    </div>
}
function App():JSX.Element {
  return (
      <DialogContext.Provider value={sampleDialogContext}>
          <Content/>
          <DialogContainer/>
      </DialogContext.Provider>
  );
}

export default App;
