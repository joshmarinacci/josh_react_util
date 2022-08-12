import React, {ReactNode, useContext, useState} from 'react';
import './App.css';
import {
    HBox, Spacer,
    DialogContext, DialogContainer,
    sampleDialogContext, toClass, VBox, FillPage, TabbedPanel
} from "josh_react_util";


function Content():JSX.Element {
    let dm = useContext(DialogContext)
    return <FillPage>
        <TabbedPanel titles={["First","Second"]}>
            <VBox>
                <button>hi</button>
                <Spacer></Spacer>
                <button onClick={()=>{
                    dm.show(<button onClick={()=>dm.hide()}>I'm a dialog</button>)
                }}>there</button>
            </VBox>
            <button>second page</button>
        </TabbedPanel>
    </FillPage>
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
