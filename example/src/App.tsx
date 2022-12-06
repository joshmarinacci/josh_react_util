import React, {ReactNode, useContext, useState} from 'react';
import './App.css';
import {
    HBox, Spacer,
    DialogContext, DialogContainer,
    sampleDialogContext, toClass, VBox, FillPage, TabbedPanel,
    PopupContext, PopupContextImpl, PopupContainer,
} from "josh_react_util";


function ExampleDialog() {
    let dm = useContext(DialogContext)
    return <div className={'dialog'}>
        <header>header</header>
        <section>
            this is the contents of a dialog
        </section>
        <footer>
            <label>footer</label>
            <Spacer/>
            <button className={'primary'} onClick={()=>dm.hide()}>dismiss</button>
        </footer>
    </div>
}

function ExamplePopup() {
    let pm = useContext(PopupContext)
    return <VBox>
        <button onClick={()=>pm.hide()}>item 1</button>
        <button onClick={()=>pm.hide()}>item 2</button>
        <button onClick={()=>pm.hide()}>item 3</button>
        <button onClick={()=>pm.hide()}>item 4</button>
    </VBox>
}
function Content():JSX.Element {
    let dm = useContext(DialogContext)
    let pm = useContext(PopupContext) as PopupContextImpl
    return <FillPage>
        <TabbedPanel titles={["First","Second"]}>
            <VBox>
                <button>button</button>
                <Spacer></Spacer>
                <button onClick={()=>{
                    dm.show(<ExampleDialog/>)
                }}>show dialog</button>
            </VBox>
            <HBox>
                <button onClick={(e)=>{
                    pm.show_at(<ExamplePopup/>,e.target,'right')
                }}>popup</button>
            </HBox>
        </TabbedPanel>
    </FillPage>
}
function App():JSX.Element {
  return (
      <DialogContext.Provider value={sampleDialogContext}>
          <PopupContext.Provider value={new PopupContextImpl()}>
              <Content/>
              <DialogContainer/>
              <PopupContainer/>
          </PopupContext.Provider>
      </DialogContext.Provider>
  );
}

export default App;
