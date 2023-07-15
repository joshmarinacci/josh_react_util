# josh_react_util

A collection of react util classes to make my life easier.


*HBox* and *VBox* are flex boxes.
*Spacer* takes up space within a flex box.
*FillPage* should be an outer element. it will fill the page.

### Popups.

Put a popup context and container at the top of your app like this:

```jsx
import {PopupContainer, PopupContext, PopupContextImpl} from './popup.js'
import {FillPage} from './index.js'

function App() {
    return <PopupContext.Provider value={new PopupContextImpl()}>
        <FillPage>
            your app content here
        </FillPage>
        <PopupContainer/>
    </PopupContext.Provider>
}
```

Then inside a function component somewhere in your app you can open a popup with:

```jsx
import {useContext} from 'react'
import {PopupContext} from './popup.js'
import {PopupDirection} from './popup.js'

function ColorMenu() {
    const pc = useContext(PopupContext)
    const choose = (color) => {
        console.log("chose the color", color)
        pc.hide()
    }
    return <ul>
        <li onClick={() => choose('red')}>red</li>
        <li onClick={() => choose('green')}>green</li>
        <li onClick={() => choose('blue')}>blue</li>
    </ul>

}

function ColorPickerButton() {
    const pc = useContext(PopupContext)
    const showPicker = (e) => {
        pc.show_at(<ColorMenu/>, e.target, PopupDirection.below, new Point(0,0))
    }
    return <button onClick={(e) => showPicker(e)}>pick a color</button>
}
```

The call to `show_at` takes the React element to show and then a dom reference to the element in 
the page that this popup will be show relative to. Typically, this is the element that the user 
clicked on to trigger the popup.  The last two arguments are optional. The first is a direction 
the popup should go relative to target element. The last is a pixel offset relative to where it would
be without an offset.


### dialogs

Dialogs work similar to popups. Put a DialogContext and DialogContainer at the top of your app,
then call the `show`  method with the React element that is your dialog.  For styling create your dialog
element with the class name `dialog`. Inside put a header, section, and footer for the different parts of your dialog. They will be styled automatically. ex:

```jsx
import {DialogContext} from './dialog.js'

function MyDialog() {
    const dm = useContext(DialogContext)
    const dismiss = () => {
        dm.hide()
    }
    return <div className={'dialog'}>
        <header>All About Cake</header>
        <section>
            <p>Cake the is best. It's really awesome. I think you'll agree</p>
            <p>If you don't agree then I can't persuade you</p>
        </section>
        <footer>
            <button onClick={() => dismiss()}>dismiss</button>
        </footer>
    </div>
}
```



